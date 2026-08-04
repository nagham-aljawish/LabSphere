<?php

namespace App\Http\Controllers\Patient;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
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

        $orders = Order::with(['tests', 'labResult'])
            ->where('patient_id', $patient->id)
            ->whereNot('status', OrderStatus::Cancelled)
            ->orderByDesc('created_at')
            ->get();

        $mappedOrders = $orders->map(function (Order $order) {
            $summary = $this->tracking->summarize($order);

            return [
                'orderId' => $summary['orderId'],
                'orderNumber' => $summary['orderNumber'],
                'orderStatus' => $summary['orderStatus'],
                'labResultStatus' => $summary['labResultStatus'],
                'tests' => $summary['tests'],
                'createdAt' => $order->created_at?->format('Y-m-d H:i:s'),
                'currentStep' => $summary['currentStep'],
                // Patient UI historically used a shorter label for step 2.
                'currentStepLabel' => $summary['currentStep'] === 2
                    ? 'Received in Lab'
                    : $summary['currentStepLabel'],
            ];
        })->values();

        $currentOrder = $mappedOrders->first(fn (array $order) => $order['currentStep'] < 6)
            ?? $mappedOrders->first();

        return $this->successResponse([
            'currentOrder' => $currentOrder,
            'orders' => $mappedOrders,
        ]);
    }
}
