<?php

namespace App\Http\Controllers\Patient;

use App\Enums\LabResultStatus;
use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class PatientTrackingController extends Controller
{
    public function index(): JsonResponse
    {
        $patient = request()->user()->patient;

        if (! $patient) {
            return $this->errorResponse('Patient profile not found', [], 404);
        }

        $orders = Order::with(['tests:id,name', 'labResult'])
            ->where('patient_id', $patient->id)
            ->whereNot('status', OrderStatus::Cancelled)
            ->orderByDesc('created_at')
            ->get();

        $mappedOrders = $orders->map(function (Order $order) {
            $labResultStatus = $order->labResult?->status;
            $labResultStatusValue = $labResultStatus instanceof LabResultStatus
                ? $labResultStatus->value
                : $labResultStatus;

            $currentStep = $this->resolveCurrentStep(
                $order->status,
                $labResultStatus,
                $order->sent_to_technician_at !== null
            );

            return [
                'orderId' => $order->id,
                'orderNumber' => $order->order_number,
                'orderStatus' => $order->status->value,
                'labResultStatus' => $labResultStatusValue,
                'tests' => $order->tests->pluck('name')->values(),
                'createdAt' => $order->created_at?->format('Y-m-d H:i:s'),
                'currentStep' => $currentStep,
            ];
        })->values();

        $currentOrder = $mappedOrders->first(fn (array $order) => $order['currentStep'] < 6)
            ?? $mappedOrders->first();

        return $this->successResponse([
            'currentOrder' => $currentOrder,
            'orders' => $mappedOrders,
        ]);
    }

    private function resolveCurrentStep(
        OrderStatus $orderStatus,
        ?LabResultStatus $labResultStatus,
        bool $sentToTechnician = false
    ): int
    {
        return match ($orderStatus) {
            OrderStatus::Pending => 0,
            OrderStatus::SampleCollected => $sentToTechnician ? 2 : 1,
            OrderStatus::Processing => $this->processingStep($labResultStatus),
            OrderStatus::Completed => 6,
            OrderStatus::Cancelled => 0,
        };
    }

    private function processingStep(?LabResultStatus $labResultStatus): int
    {
        return match ($labResultStatus) {
            null => 3,
            LabResultStatus::Draft, LabResultStatus::Rejected => 4,
            LabResultStatus::PendingReview => 5,
            LabResultStatus::Approved => 6,
        };
    }
}
