<?php

namespace App\Services;

use App\Enums\LabResultStatus;
use App\Enums\OrderSampleStatus;
use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderSample;

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
        $order->loadMissing(['orderSamples.labResult', 'labResult']);

        $samples = $order->orderSamples;
        if ($samples->isEmpty()) {
            return $this->resolveCurrentStep(
                $order->status,
                $order->labResult?->status instanceof LabResultStatus
                    ? $order->labResult->status
                    : null,
                $order->sent_to_technician_at !== null,
            );
        }

        $steps = $samples->map(fn (OrderSample $sample) => $this->currentStepForSample($order, $sample));
        $incomplete = $steps->filter(fn (int $step) => $step < 6);

        return $incomplete->isEmpty()
            ? 6
            : (int) $incomplete->min();
    }

    public function currentStepForSample(Order $order, OrderSample $sample): int
    {
        $sample->loadMissing('labResult');

        $labResultStatus = $sample->labResult?->status;
        if (! $labResultStatus instanceof LabResultStatus) {
            $labResultStatus = null;
        }

        if ($labResultStatus === LabResultStatus::Approved
            || $sample->status === OrderSampleStatus::Approved) {
            return 6;
        }

        if ($labResultStatus === LabResultStatus::PendingReview
            || $sample->status === OrderSampleStatus::PendingReview) {
            return 5;
        }

        if (in_array($labResultStatus, [LabResultStatus::Draft, LabResultStatus::Rejected], true)
            || $sample->status === OrderSampleStatus::Rejected) {
            return 4;
        }

        if ($sample->status === OrderSampleStatus::Analyzing) {
            return 3;
        }

        if ($sample->status === OrderSampleStatus::Received) {
            return 2;
        }

        // Pending sample: collected once QR/labels exist or order was sent.
        if ($sample->label_code || $order->sent_to_technician_at) {
            return 1;
        }

        return match ($order->status) {
            OrderStatus::Pending => 0,
            OrderStatus::SampleCollected => $order->sent_to_technician_at ? 2 : 1,
            OrderStatus::Processing => 3,
            OrderStatus::Completed => 6,
            OrderStatus::Cancelled => 0,
        };
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

    public function findSample(Order $order, ?string $labelCode): ?OrderSample
    {
        $order->loadMissing(['orderSamples.test', 'orderSamples.labResult']);

        $normalized = trim((string) $labelCode);
        if ($normalized === '') {
            return $order->orderSamples->first();
        }

        return $order->orderSamples->first(
            fn (OrderSample $sample) => strcasecmp((string) $sample->label_code, $normalized) === 0
        ) ?? $order->orderSamples->first();
    }

    /**
     * Lightweight summary for list endpoints (no stages / no extra relation reloads).
     *
     * @return array<string, mixed>
     */
    public function summarizeForList(Order $order, ?OrderSample $sample = null): array
    {
        $step = $sample
            ? $this->currentStepForSample($order, $sample)
            : $this->currentStepForOrder($order);

        $labResult = $sample?->labResult ?? $order->labResult;
        $labResultStatus = $labResult?->status;
        $sampleId = $sample?->label_code
            ?: ($order->orderSamples
                ->firstWhere('label_code', '!=', null)
                ?->label_code ?: 'SMP-'.str_pad((string) $order->id, 4, '0', STR_PAD_LEFT));

        $tests = $sample?->test
            ? [$sample->test->name]
            : $order->tests->pluck('name')->filter()->values()->all();

        return [
            'orderId' => $order->id,
            'orderNumber' => $order->order_number,
            'orderStatus' => $order->status->value,
            'sampleStatus' => $sample?->status instanceof OrderSampleStatus
                ? $sample->status->value
                : ($sample?->status),
            'labResultStatus' => $labResultStatus instanceof LabResultStatus
                ? $labResultStatus->value
                : $labResultStatus,
            'sampleId' => $sampleId,
            'orderSampleId' => $sample?->id,
            'tests' => $tests,
            'currentStep' => $step,
            'currentStepLabel' => $this->labelForStep($step),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function summarize(Order $order, ?string $labelCode = null): array
    {
        $order->loadMissing(['patient.user', 'tests', 'orderSamples.test', 'orderSamples.labResult', 'labResult']);

        $sample = $this->findSample($order, $labelCode);
        $summary = $this->summarizeForList($order, $sample);
        $step = (int) $summary['currentStep'];

        return [
            ...$summary,
            'patientName' => $order->patient?->user?->name ?? 'Unknown patient',
            'patientCode' => $order->patient?->patient_code,
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
