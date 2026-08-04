<?php

namespace App\Services;

use App\Enums\LabResultStatus;
use App\Enums\OrderStatus;
use App\Models\Order;

class OrderTrackingService
{
    public const STEP_LABELS = [
        0 => 'Prepared',
        1 => 'Collected',
        2 => 'Received in Laboratory',
        3 => 'Laboratory Analysis',
        4 => 'Result Entry',
        5 => 'Doctor Review',
        6 => 'Completed',
    ];

    public function currentStepForOrder(Order $order): int
    {
        $order->loadMissing('labResult');

        $labResultStatus = $order->labResult?->status;

        return $this->resolveCurrentStep(
            $order->status,
            $labResultStatus instanceof LabResultStatus ? $labResultStatus : null,
            $order->sent_to_technician_at !== null,
        );
    }

    public function labelForStep(int $step): string
    {
        return self::STEP_LABELS[$step] ?? self::STEP_LABELS[0];
    }

    /**
     * Map order + lab-result state onto the 7 shared tracking steps.
     * Lab result status wins when present so tracking never stalls.
     */
    public function resolveCurrentStep(
        OrderStatus $orderStatus,
        ?LabResultStatus $labResultStatus,
        bool $sentToTechnician = false
    ): int {
        if ($orderStatus === OrderStatus::Cancelled) {
            return 0;
        }

        if (
            $orderStatus === OrderStatus::Completed
            || $labResultStatus === LabResultStatus::Approved
        ) {
            return 6;
        }

        if ($labResultStatus === LabResultStatus::PendingReview) {
            return 5;
        }

        if (in_array($labResultStatus, [LabResultStatus::Draft, LabResultStatus::Rejected], true)) {
            return 4;
        }

        return match ($orderStatus) {
            OrderStatus::Pending => 0,
            OrderStatus::SampleCollected => $sentToTechnician ? 2 : 1,
            OrderStatus::Processing => 3,
            OrderStatus::Completed => 6,
            OrderStatus::Cancelled => 0,
        };
    }

    /**
     * @return array<string, mixed>
     */
    public function summarize(Order $order): array
    {
        $order->loadMissing(['patient.user', 'tests', 'orderSamples', 'labResult']);

        $step = $this->currentStepForOrder($order);
        $labResultStatus = $order->labResult?->status;
        $sampleId = $order->orderSamples
            ->firstWhere('label_code', '!=', null)
            ?->label_code ?: 'SMP-'.str_pad((string) $order->id, 4, '0', STR_PAD_LEFT);

        return [
            'orderId' => $order->id,
            'orderNumber' => $order->order_number,
            'orderStatus' => $order->status->value,
            'labResultStatus' => $labResultStatus instanceof LabResultStatus
                ? $labResultStatus->value
                : $labResultStatus,
            'patientName' => $order->patient?->user?->name ?? 'Unknown patient',
            'patientCode' => $order->patient?->patient_code,
            'sampleId' => $sampleId,
            'tests' => $order->tests
                ->pluck('name')
                ->filter()
                ->values()
                ->all(),
            'currentStep' => $step,
            'currentStepLabel' => $this->labelForStep($step),
            'stages' => collect(self::STEP_LABELS)
                ->map(function (string $label, int $index) use ($step) {
                    $lastStep = array_key_last(self::STEP_LABELS);

                    if ($index < $step || ($index === $step && $step === $lastStep)) {
                        $status = 'completed';
                    } elseif ($index === $step) {
                        $status = 'current';
                    } else {
                        $status = 'pending';
                    }

                    return [
                        'id' => $index + 1,
                        'title' => $label,
                        'status' => $status,
                    ];
                })
                ->values(),
        ];
    }
}
