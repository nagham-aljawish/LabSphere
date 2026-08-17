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

            $this->hideSampleQrUrls($order);

            return $this->successResponse($order);
        }

        $now = now();
        $todayStart = $now->copy()->startOfDay();
        $filter = strtolower(trim((string) $request->query('filter', 'all')));

        $query = Order::query()
            ->with([
                'patient.user:id,name,email,phone',
                'tests:id,name,code,category,sample_type,price',
                'orderSamples' => fn ($q) => $q->select([
                    'id', 'order_id', 'test_id', 'tube_type', 'quantity', 'label_code', 'status',
                    'received_at', 'analyzing_at',
                ]),
                'orderSamples.test:id,name,code',
            ])
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

        $orders = $query->paginate(
            min(50, max(1, (int) $request->integer('per_page', 20)))
        );

        $orders->getCollection()->each(fn (Order $order) => $this->hideSampleQrUrls($order));

        return $this->successResponse($orders);
    }

    public function show(Order $order): JsonResponse
    {
        return $this->successResponse(
            $order->load(['patient.user', 'tests', 'orderSamples.test', 'labResults.items'])
        );
    }

    public function tracking(Request $request, Order $order): JsonResponse
    {
        $labelCode = trim((string) $request->query('label_code', $request->query('sampleId', '')));

        return $this->successResponse($this->tracking->summarize(
            $order,
            $labelCode !== '' ? $labelCode : null,
        ));
    }

    /**
     * Resolve an active order from a scanned sample / QR label code.
     */
    private function findOrderByLabel(string $labelCode): ?Order
    {
        $normalized = trim($labelCode);
        $relations = [
            'patient.user:id,name,email,phone',
            'tests:id,name,code,category,sample_type,price',
            'orderSamples' => fn ($q) => $q->select([
                'id', 'order_id', 'test_id', 'tube_type', 'quantity', 'label_code', 'status',
                'received_at', 'analyzing_at',
            ]),
            'orderSamples.test:id,name,code',
        ];

        $sample = OrderSample::query()
            ->where('label_code', $normalized)
            ->first();

        if (! $sample) {
            $sample = OrderSample::query()
                ->whereRaw('LOWER(label_code) = ?', [strtolower($normalized)])
                ->first();
        }

        if ($sample) {
            return Order::with($relations)
                ->whereKey($sample->order_id)
                ->whereIn('status', [
                    OrderStatus::Pending,
                    OrderStatus::SampleCollected,
                    OrderStatus::Processing,
                    OrderStatus::Completed,
                ])
                ->first();
        }

        
        if (preg_match('/^smp-(\d+)$/i', $normalized, $matches)) {
            $orderId = (int) ltrim($matches[1], '0');
            if ($orderId > 0) {
                return Order::with($relations)
                    ->whereKey($orderId)
                    ->first();
            }
        }

        
        return Order::with($relations)
            ->where('order_number', $normalized)
            ->orderByDesc('created_at')
            ->first()
            ?? Order::with($relations)
                ->whereRaw('LOWER(order_number) = ?', [strtolower($normalized)])
                ->orderByDesc('created_at')
                ->first();
    }

    private function hideSampleQrUrls(Order $order): void
    {
        if (! $order->relationLoaded('orderSamples')) {
            return;
        }

        $order->orderSamples->each(fn (OrderSample $sample) => $sample->makeHidden(['qr_image_url']));
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

    public function markReceived(Request $request, Order $order): JsonResponse
    {
        if ($order->status === OrderStatus::Cancelled) {
            return $this->errorResponse('Cannot receive a cancelled order.', 422);
        }

        $labelCode = trim((string) $request->input('label_code', $request->query('label_code', '')));
        $sample = $this->tracking->findSample($order, $labelCode !== '' ? $labelCode : null);

        if ($sample) {
            $sample->markReceived();
        }

        
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

    public function markProcessing(Request $request, Order $order): JsonResponse
    {
        if ($order->status === OrderStatus::Cancelled) {
            return $this->errorResponse('Cannot process a cancelled order.', 422);
        }

        $labelCode = trim((string) $request->input('label_code', $request->query('label_code', '')));
        $sample = $this->tracking->findSample($order, $labelCode !== '' ? $labelCode : null);

        if (! $sample) {
            return $this->errorResponse('No sample found for this order.', [], 422);
        }

        if (! $sample->markAnalyzing()) {
            return $this->errorResponse(
                'Laboratory analysis was already started for this sample. Continue to result entry.',
                [],
                422
            );
        }

        $updates = [
            'status' => OrderStatus::Processing,
        ];

        if ($order->sent_to_technician_at === null) {
            $updates['sent_to_technician_at'] = now();
        }

        $order->update($updates);

        return $this->successResponse(
            $order->fresh()->load(['patient.user', 'tests', 'orderSamples.test']),
            'Order moved to laboratory analysis'
        );
    }
}
