<?php

namespace App\Http\Controllers\Technician;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTechnicianOrderSamplesRequest;
use App\Models\Order;
use App\Models\OrderSample;
use App\Services\OrderTrackingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TechnicianOrderController extends Controller
{
    public function __construct(private OrderTrackingService $tracking) {}
    public function index(Request $request): JsonResponse
    {
        $labelCode = trim((string) $request->query('label_code', ''));
        if ($labelCode !== '') {
            $order = $this->findOrderByLabel($labelCode);

            if (! $order) {
                return $this->errorResponse('No order found for this sample QR code.', [], 404);
            }

            return $this->successResponse($order);
        }

        $now = now();
        $todayStart = $now->copy()->startOfDay();
        $filter = strtolower(trim((string) $request->query('filter', 'all')));

        $query = Order::with(['patient.user', 'tests', 'orderSamples.test'])
            ->orderByDesc('created_at');

        match ($filter) {
            'assigned_today' => $query
                ->whereIn('status', [
                    OrderStatus::Pending,
                    OrderStatus::SampleCollected,
                    OrderStatus::Processing,
                ])
                ->where('created_at', '>=', $todayStart),
            'pending' => $query->whereIn('status', [
                OrderStatus::Pending,
                OrderStatus::SampleCollected,
            ]),
            'completed' => $query
                ->where('status', OrderStatus::Completed)
                ->where('updated_at', '>=', $todayStart),
            'critical' => $query
                ->whereIn('status', [
                    OrderStatus::Pending,
                    OrderStatus::SampleCollected,
                ])
                ->where('created_at', '<=', $now->copy()->subHours(4)),
            default => $query->whereIn('status', [
                OrderStatus::Pending,
                OrderStatus::SampleCollected,
                OrderStatus::Processing,
            ]),
        };

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return $this->successResponse($query->paginate(50));
    }

    public function show(Order $order): JsonResponse
    {
        return $this->successResponse(
            $order->load(['patient.user', 'tests', 'orderSamples.test', 'labResults'])
        );
    }

    public function tracking(Order $order): JsonResponse
    {
        return $this->successResponse($this->tracking->summarize($order));
    }

    /**
     * Resolve an active order from a scanned sample / QR label code.
     */
    private function findOrderByLabel(string $labelCode): ?Order
    {
        $normalized = trim($labelCode);

        $order = Order::with(['patient.user', 'tests', 'orderSamples.test'])
            ->whereIn('status', [
                OrderStatus::Pending,
                OrderStatus::SampleCollected,
                OrderStatus::Processing,
                OrderStatus::Completed,
            ])
            ->whereHas('orderSamples', function ($query) use ($normalized) {
                $query->whereRaw('LOWER(label_code) = ?', [strtolower($normalized)]);
            })
            ->orderByDesc('created_at')
            ->first();

        if ($order) {
            return $order;
        }

        // Fallback codes used when label_code was missing: SMP-0001
        if (preg_match('/^smp-(\d+)$/i', $normalized, $matches)) {
            $orderId = (int) ltrim($matches[1], '0');
            if ($orderId > 0) {
                return Order::with(['patient.user', 'tests', 'orderSamples.test'])
                    ->whereKey($orderId)
                    ->first();
            }
        }

        // Also accept raw order_number as a scan payload.
        return Order::with(['patient.user', 'tests', 'orderSamples.test'])
            ->whereRaw('LOWER(order_number) = ?', [strtolower($normalized)])
            ->orderByDesc('created_at')
            ->first();
    }

    public function storeSamples(
        StoreTechnicianOrderSamplesRequest $request,
        Order $order
    ): JsonResponse {
        if (in_array($order->status, [OrderStatus::Completed, OrderStatus::Cancelled], true)) {
            return $this->errorResponse('Cannot update samples for a closed order.', 422);
        }

        $samples = DB::transaction(function () use ($request, $order) {
            $created = [];

            foreach ($request->samples as $sample) {
                $created[] = OrderSample::updateOrCreate(
                    [
                        'order_id' => $order->id,
                        'test_id' => $sample['test_id'],
                    ],
                    [
                        'tube_type' => $sample['tube_type'],
                        'quantity' => $sample['quantity'],
                        'label_code' => "{$order->order_number}-{$sample['test_id']}",
                    ]
                );
            }

            $order->update(['status' => OrderStatus::Processing]);

            return $created;
        });

        return $this->successResponse([
            'order' => $order->fresh()->load(['patient.user', 'tests', 'orderSamples.test']),
            'samples' => $samples,
        ], 'Sample tubes assigned successfully');
    }

    public function markReceived(Order $order): JsonResponse
    {
        if ($order->status === OrderStatus::Cancelled) {
            return $this->errorResponse('Cannot receive a cancelled order.', 422);
        }

        // Accept Sample = patient step "Received in Lab":
        // sample_collected + sent_to_technician_at.
        $updates = [];

        if (in_array($order->status, [OrderStatus::Pending, OrderStatus::SampleCollected], true)) {
            $updates['status'] = OrderStatus::SampleCollected;
        }

        if ($order->sent_to_technician_at === null) {
            $updates['sent_to_technician_at'] = now();
        }

        if ($updates !== []) {
            $order->update($updates);
        }

        return $this->successResponse(
            $order->fresh()->load(['patient.user', 'tests', 'orderSamples.test']),
            'Sample marked as received'
        );
    }

    public function markProcessing(Order $order): JsonResponse
    {
        if ($order->status === OrderStatus::Cancelled) {
            return $this->errorResponse('Cannot process a cancelled order.', 422);
        }

        $updates = [];

        if ($order->status !== OrderStatus::Completed) {
            $updates['status'] = OrderStatus::Processing;
        }

        if ($order->sent_to_technician_at === null) {
            $updates['sent_to_technician_at'] = now();
        }

        if ($updates !== []) {
            $order->update($updates);
        }

        return $this->successResponse(
            $order->fresh()->load(['patient.user', 'tests', 'orderSamples.test']),
            'Order moved to laboratory analysis'
        );
    }
}
