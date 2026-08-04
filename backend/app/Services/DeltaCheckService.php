<?php

namespace App\Services;

use App\Enums\LabResultItemStatus;
use App\Enums\LabResultStatus;
use App\Models\DeltaCheckThreshold;
use App\Models\LabResult;
use App\Models\LabResultItem;
use App\Models\Notification;
use Illuminate\Support\Collection;

/**
 * Compares newly approved results against the patient's previous approved
 * values using delta_check_thresholds. Patient-only alerts (never doctor/tech).
 */
class DeltaCheckService
{
    /**
     * Run delta checks and notify the patient when thresholds are breached.
     *
     * @return list<array<string, mixed>> triggered alerts
     */
    public function evaluateAndNotifyPatient(LabResult $current): array
    {
        $current->loadMissing(['items', 'order.patient.user']);

        $patientId = $current->order?->patient_id;
        $userId = $current->order?->patient?->user_id
            ?? $current->order?->patient?->user?->id;

        if (! $patientId || ! $userId) {
            return [];
        }

        $previous = $this->findPreviousApprovedResult($patientId, $current);
        if (! $previous) {
            return [];
        }

        $thresholds = DeltaCheckThreshold::query()
            ->where('is_active', true)
            ->get();

        $alerts = [];
        foreach ($current->items as $item) {
            $prior = $this->matchPreviousItem($item, $previous->items);
            if (! $prior) {
                continue;
            }

            $threshold = $this->resolveThreshold($item, $thresholds);
            $alert = $this->evaluatePair($item, $prior, $threshold);
            if ($alert !== null) {
                $alerts[] = $alert;
            }
        }

        if ($alerts === []) {
            return [];
        }

        $this->notifyPatient($userId, $current, $alerts);

        return $alerts;
    }

    private function findPreviousApprovedResult(int $patientId, LabResult $current): ?LabResult
    {
        return LabResult::query()
            ->with('items')
            ->where('status', LabResultStatus::Approved)
            ->where('id', '!=', $current->id)
            ->whereHas('order', fn ($q) => $q->where('patient_id', $patientId))
            ->where(function ($q) use ($current) {
                if ($current->approved_at) {
                    $q->where('approved_at', '<', $current->approved_at)
                        ->orWhere(function ($inner) use ($current) {
                            $inner->where('approved_at', $current->approved_at)
                                ->where('id', '<', $current->id);
                        });
                } else {
                    $q->where('id', '<', $current->id);
                }
            })
            ->orderByDesc('approved_at')
            ->orderByDesc('id')
            ->first();
    }

    private function matchPreviousItem(LabResultItem $current, Collection $previousItems): ?LabResultItem
    {
        $currentCodes = $this->itemCodes($current);
        $currentName = $this->normalizeName($current->test_name);

        foreach ($previousItems as $prior) {
            $priorCodes = $this->itemCodes($prior);
            if ($currentCodes !== [] && array_intersect($currentCodes, $priorCodes) !== []) {
                return $prior;
            }

            if (
                $currentName !== ''
                && $this->normalizeName($prior->test_name) === $currentName
            ) {
                return $prior;
            }
        }

        return null;
    }

    /**
     * @param  Collection<int, DeltaCheckThreshold>  $thresholds
     */
    private function resolveThreshold(LabResultItem $item, Collection $thresholds): ?DeltaCheckThreshold
    {
        $codes = $this->itemCodes($item);
        $name = $this->normalizeName($item->test_name);

        foreach ($thresholds as $threshold) {
            if ($threshold->test_code === '*') {
                continue;
            }

            $keys = array_merge(
                [$this->normalizeCode($threshold->test_code)],
                array_map(
                    fn ($alias) => $this->normalizeCode((string) $alias),
                    $threshold->code_aliases ?? [],
                ),
            );

            if ($codes !== [] && array_intersect($codes, $keys) !== []) {
                return $threshold;
            }

            if (
                $name !== ''
                && $this->normalizeName((string) $threshold->test_name) === $name
            ) {
                return $threshold;
            }
        }

        return $thresholds->firstWhere('test_code', '*');
    }

    /**
     * @return array<string, mixed>|null
     */
    private function evaluatePair(
        LabResultItem $current,
        LabResultItem $previous,
        ?DeltaCheckThreshold $threshold,
    ): ?array {
        $reasons = [];

        $currentStatus = $this->statusValue($current->status);
        $previousStatus = $this->statusValue($previous->status);
        $alertOnFlag = $threshold?->alert_on_flag_change ?? true;

        if (
            $alertOnFlag
            && $currentStatus !== $previousStatus
            && ($currentStatus !== 'normal' || $previousStatus !== 'normal')
        ) {
            $reasons[] = sprintf(
                'flag changed from %s to %s',
                $previousStatus,
                $currentStatus,
            );
        }

        $currentValue = $this->toFloat($current->result_value);
        $previousValue = $this->toFloat($previous->result_value);

        if ($currentValue !== null && $previousValue !== null) {
            $absDelta = abs($currentValue - $previousValue);
            $percent = $previousValue == 0.0
                ? null
                : abs(($currentValue - $previousValue) / $previousValue) * 100;

            if (
                $threshold?->absolute_delta !== null
                && $absDelta >= (float) $threshold->absolute_delta
            ) {
                $reasons[] = sprintf(
                    'absolute change %.2f (threshold %.2f)',
                    $absDelta,
                    (float) $threshold->absolute_delta,
                );
            }

            if (
                $threshold?->percent_delta !== null
                && $percent !== null
                && $percent >= (float) $threshold->percent_delta
            ) {
                $reasons[] = sprintf(
                    'percent change %.1f%% (threshold %.1f%%)',
                    $percent,
                    (float) $threshold->percent_delta,
                );
            }
        }

        if ($reasons === []) {
            return null;
        }

        return [
            'test_name' => $current->test_name,
            'test_code' => $current->test_code,
            'previous_value' => $previous->result_value,
            'current_value' => $current->result_value,
            'unit' => $current->unit ?: $previous->unit,
            'previous_status' => $previousStatus,
            'current_status' => $currentStatus,
            'reasons' => $reasons,
        ];
    }

    /**
     * @param  list<array<string, mixed>>  $alerts
     */
    private function notifyPatient(int $userId, LabResult $result, array $alerts): void
    {
        $lines = array_map(function (array $alert) {
            $unit = $alert['unit'] ? ' '.$alert['unit'] : '';

            return sprintf(
                '%s: %s%s (%s) → %s%s (%s)',
                $alert['test_name'],
                $alert['previous_value'],
                $unit,
                $alert['previous_status'],
                $alert['current_value'],
                $unit,
                $alert['current_status'],
            );
        }, $alerts);

        $count = count($alerts);
        $title = $count === 1
            ? 'Result change alert: '.$alerts[0]['test_name']
            : "Result change alert ({$count} tests)";

        Notification::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => 'Compared with your previous approved results: '
                .implode('; ', $lines)
                .'. Please review and consult your doctor if needed.',
            'type' => 'delta_check',
            'reference_type' => 'lab_result',
            'reference_id' => $result->id,
            'is_read' => false,
        ]);
    }

    /**
     * @return list<string>
     */
    private function itemCodes(LabResultItem $item): array
    {
        $codes = [];
        if ($item->test_code) {
            $codes[] = $this->normalizeCode($item->test_code);
        }

        return array_values(array_filter(array_unique($codes)));
    }

    private function normalizeCode(?string $code): string
    {
        $code = strtoupper(trim((string) $code));
        $code = preg_replace('/^LOINC:/i', '', $code) ?? $code;

        return $code;
    }

    private function normalizeName(?string $name): string
    {
        return strtolower(trim(preg_replace('/\s+/', ' ', (string) $name) ?? ''));
    }

    private function statusValue(mixed $status): string
    {
        if ($status instanceof LabResultItemStatus) {
            return $status->value;
        }

        return strtolower((string) $status);
    }

    private function toFloat(mixed $value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return (float) $value;
        }

        if (is_string($value) && preg_match('/-?\d+(?:\.\d+)?/', $value, $m)) {
            return (float) $m[0];
        }

        return null;
    }
}
