<?php

namespace App\Http\Controllers\Patient;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderSample;
use App\Services\OrderTrackingService;
use Illuminate\Http\JsonResponse;

class PatientTrackingController extends Controller
{
    public function __construct(private OrderTrackingService $tracking) {}

    public function index(): JsonResponse
    {
        $patient = request()->user()->patient;

        if (! $patient) {
            return $this->errorResponse('Patient profile not found', [], 404);
        }

        $orders = Order::query()
            ->select([
                'id',
                'order_number',
                'patient_id',
                'status',
                'sent_to_technician_at',
                'created_at',
            ])
            ->with([
                'tests:id,name',
                'orderSamples' => fn ($query) => $query->select([
                    'id',
                    'order_id',
                    'test_id',
                    'label_code',
                    'status',
                    'received_at',
                    'analyzing_at',
                ]),
                'orderSamples.test:id,name',
                // Avoid column constraints here: latestOfMany joins make bare
                // order_sample_id ambiguous (SQLSTATE 1052).
                'orderSamples.labResult',
            ])
            ->where('patient_id', $patient->id)
            ->whereNot('status', OrderStatus::Cancelled)
            ->orderByDesc('created_at')
            ->limit(30)
            ->get();

        $mappedOrders = $orders
            ->flatMap(function (Order $order) {
                $samples = $order->orderSamples;

                if ($samples->isEmpty()) {
                    return collect([$this->mapSummary($order, $this->tracking->summarizeForList($order))]);
                }

                return $samples->map(
                    fn (OrderSample $sample) => $this->mapSummary(
                        $order,
                        $this->tracking->summarizeForList($order, $sample),
                    )
                );
            })
            ->values();

        $currentOrder = $mappedOrders->first(fn (array $order) => $order['currentStep'] < 6)
            ?? $mappedOrders->first();

        return $this->successResponse([
            'currentOrder' => $currentOrder,
            'orders' => $mappedOrders,
        ]);
    }

    /**
     * @param  array<string, mixed>  $summary
     * @return array<string, mixed>
     */
    private function mapSummary(Order $order, array $summary): array
    {
        return [
            'orderId' => $summary['orderId'],
            'orderNumber' => $summary['orderNumber'],
            'orderStatus' => $summary['orderStatus'],
            'sampleStatus' => $summary['sampleStatus'] ?? null,
            'labResultStatus' => $summary['labResultStatus'],
            'sampleId' => $summary['sampleId'] ?? null,
            'orderSampleId' => $summary['orderSampleId'] ?? null,
            'tests' => $summary['tests'],
            'createdAt' => $order->created_at?->toIso8601String(),
            'currentStep' => $summary['currentStep'],
            // Patient UI historically used a shorter label for step 2.
            'currentStepLabel' => $summary['currentStep'] === 2
                ? 'Received in Lab'
                : $summary['currentStepLabel'],
        ];
    }
}
