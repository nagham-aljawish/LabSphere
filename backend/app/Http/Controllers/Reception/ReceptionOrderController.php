<?php

namespace App\Http\Controllers\Reception;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\StoreOrderSamplesRequest;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderSample;
use App\Models\Patient;
use App\Models\User;
use App\Services\FinancialAidService;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ReceptionOrderController extends Controller
{
    public function __construct(
        private FinancialAidService $financialAidService,
        private OrderService $orderService,
    ) {}

   public function index(Request $request): JsonResponse
{
    $query = Order::with(['patient.user', 'createdBy', 'tests', 'payments'])
        ->orderByDesc('created_at');

    if ($request->status) {
        $query->where('status', $request->status);
    }

    if ($request->patient_id) {
        $query->where('patient_id', $request->patient_id);
    }

    if ($request->boolean('unpaid')) {
        $query->whereLikelyUnpaid();
    }

    $perPage = min(50, max(1, (int) $request->integer('per_page', 20)));
    $orders = $query->paginate($perPage);

    if ($request->boolean('unpaid')) {
        $discounts = $this->financialAidService->peekDiscountsForOrders($orders->getCollection());

        $orders->setCollection(
            $orders->getCollection()
                ->filter(fn (Order $order) =>
                    ! $order->isFullyPaid($discounts[$order->id] ?? 0.0)
                )
                ->values()
        );
    }

    return $this->successResponse($orders);
}

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = $this->orderService->create($request);

        return $this->successResponse($order, 'Order created successfully', 201);
    }

    public function show(Order $order): JsonResponse
    {
        $order->load(['patient.user', 'createdBy', 'tests', 'orderSamples.test', 'payments']);
        $discount = $this->financialAidService->getDiscountForOrder($order);

        return $this->successResponse($this->serializeOrder($order, $discount));
    }

    public function openWorkflow(Patient $patient): JsonResponse
    {
        $orders = Order::query()
            ->with(['patient.user', 'createdBy', 'tests', 'orderSamples.test', 'payments'])
            ->where('patient_id', $patient->id)
            ->whereNot('status', OrderStatus::Cancelled)
            ->orderByDesc('created_at')
            ->limit(30)
            ->get();

        $discounts = $this->financialAidService->peekDiscountsForOrders($orders);

        $order = $orders->first(function (Order $candidate) use ($discounts) {
            $discount = $discounts[$candidate->id] ?? 0.0;
            $remaining = $candidate->remainingAmount($discount);
            $unsent = $candidate->sent_to_technician_at === null;

            return $unsent || $remaining > 0.001;
        });

        if (! $order) {
            return $this->successResponse([
                'order' => null,
                'nextStep' => null,
            ]);
        }

        $discount = $discounts[$order->id] ?? $this->financialAidService->peekDiscountForOrder($order);

        return $this->successResponse([
            'order' => $this->serializeOrder($order, $discount),
            'nextStep' => $this->orderService->receptionNextStep($order, $discount),
        ]);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $request->validate([
            'status' => ['required', Rule::in(['pending', 'sample_collected', 'processing', 'completed', 'cancelled'])],
        ]);

        $order->update(['status' => $request->status]);

        return $this->successResponse(
            $order->load(['patient.user', 'tests', 'orderSamples.test']),
            'Order status updated'
        );
    }

    public function storeSamples(StoreOrderSamplesRequest $request, Order $order): JsonResponse
    {
        $samples = DB::transaction(function () use ($request, $order) {
            $order->orderSamples()->delete();

            $created = [];

            foreach ($request->samples as $sample) {
                $created[] = OrderSample::create([
                    'order_id' => $order->id,
                    'test_id' => $sample['test_id'],
                    'tube_type' => ! empty($sample['tube_type']) ? $sample['tube_type'] : null,
                    'quantity' => $sample['quantity'],
                    'label_code' => "{$order->order_number}-{$sample['test_id']}",
                ]);
            }

            if ($request->boolean('mark_collected')) {
                $order->update(['status' => OrderStatus::SampleCollected]);
            }

            return $created;
        });

        return $this->successResponse([
            'order' => $order->fresh()->load(['patient.user', 'tests', 'orderSamples.test']),
            'samples' => $samples,
        ], 'Sample tubes saved successfully', 201);
    }

    public function patientOrders(Patient $patient): JsonResponse
    {
        $perPage = min(50, max(1, (int) request()->integer('per_page', 20)));

        $orders = Order::with(['tests', 'payments'])
            ->where('patient_id', $patient->id)
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return $this->successResponse($orders);
    }

    public function sendToTechnician(Order $order): JsonResponse
    {
        $order->loadMissing(['patient.user', 'orderSamples', 'payments']);
        $discount = $this->financialAidService->getDiscountForOrder($order);

        if (! $order->hasPaymentTowardOrder($discount)) {
            return $this->errorResponse(
                'Payment required before sending the QR to the technician. Collect a partial or full payment first.',
                [
                    'payableAmount' => number_format($order->payableAmount($discount), 2, '.', ''),
                    'paidAmount' => number_format($order->paidAmount(), 2, '.', ''),
                    'remainingAmount' => number_format($order->remainingAmount($discount), 2, '.', ''),
                ],
                422,
            );
        }

        $labeledSamples = $order->orderSamples
            ->filter(fn ($sample) => filled($sample->label_code))
            ->values();

        if ($labeledSamples->isEmpty()) {
            return $this->errorResponse(
                'No sample labels found. Generate QR labels before sending to the technician.',
                [],
                422,
            );
        }

        $samplesPayload = $labeledSamples->map(function (OrderSample $sample) {
            $labelCode = (string) $sample->label_code;

            return [
                'sampleId' => $labelCode,
                'testId' => $sample->test_id,
                'tubeType' => $sample->tube_type,
                'quantity' => $sample->quantity,
                'qrImage' => OrderSample::qrImageUrlForLabel($labelCode),
            ];
        })->values();

        $primarySampleId = $samplesPayload->first()['sampleId'];
        $primaryQrImageUrl = $samplesPayload->first()['qrImage'];

        if ($order->sent_to_technician_at) {
            return $this->successResponse([
                'orderId' => $order->id,
                'sampleId' => $primarySampleId,
                'qrImage' => $primaryQrImageUrl,
                'samples' => $samplesPayload,
                'techniciansNotified' => 0,
                'alreadySent' => true,
            ], 'QR was already sent to the technician');
        }

        $order->update([
            'qr_image_url' => $primaryQrImageUrl,
            'sent_to_technician_at' => now(),
        ]);

        $patientName = $order->patient?->user?->name ?? "Patient #{$order->patient_id}";
        $sampleList = $samplesPayload->pluck('sampleId')->implode(', ');
        $sampleCount = $samplesPayload->count();
        $message = $sampleCount === 1
            ? "Patient: {$patientName} • Sample: {$primarySampleId}"
            : "Patient: {$patientName} • {$sampleCount} samples: {$sampleList}";

        $technicians = User::query()
            ->where('role', UserRole::Technician->value)
            ->where('status', UserStatus::Active->value)
            ->get(['id']);

        foreach ($technicians as $technician) {
            Notification::create([
                'user_id' => $technician->id,
                'title' => $sampleCount === 1 ? 'New Sample Assigned' : 'New Samples Assigned',
                'message' => $message,
                'type' => 'technician_sample',
                'reference_type' => 'order',
                'reference_id' => $order->id,
                'is_read' => false,
            ]);
        }

        \App\Services\AuditLogger::record(
            'reception.order.sent_to_technician',
            [
                'sample_id' => $primarySampleId,
                'sample_ids' => $samplesPayload->pluck('sampleId')->all(),
                'technicians_notified' => $technicians->count(),
                'paid_amount' => $order->paidAmount(),
                'remaining_amount' => $order->remainingAmount($discount),
            ],
            subjectType: Order::class,
            subjectId: $order->id,
            statusCode: 200,
        );

        return $this->successResponse([
            'orderId' => $order->id,
            'sampleId' => $primarySampleId,
            'qrImage' => $primaryQrImageUrl,
            'samples' => $samplesPayload,
            'techniciansNotified' => $technicians->count(),
            'alreadySent' => false,
        ], 'Sample sent to technician successfully');
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeOrder(Order $order, float $discount): array
    {
        return [
            ...$order->toArray(),
            'paidAmount' => number_format($order->paidAmount(), 2, '.', ''),
            'payableAmount' => number_format($order->payableAmount($discount), 2, '.', ''),
            'remainingAmount' => number_format($order->remainingAmount($discount), 2, '.', ''),
            'discountPercentage' => $discount,
            'canSendToTechnician' => $order->hasPaymentTowardOrder($discount),
        ];
    }
}