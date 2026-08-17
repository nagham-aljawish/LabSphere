<?php

namespace App\Services;

use App\Enums\LabResultStatus;
use App\Enums\OrderSampleStatus;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\LabResult;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class LabResultRejectionService
{
    
    public function reject(LabResult $result, ?string $reason = null): LabResult
    {
        if ($result->status !== LabResultStatus::PendingReview) {
            throw new \InvalidArgumentException('Only pending review results can be rejected');
        }

        $result->loadMissing(['order.patient.user']);

        $cleanedReason = $reason !== null ? trim($reason) : null;
        if ($cleanedReason === '') {
            $cleanedReason = null;
        }

        $result->update([
            'status' => LabResultStatus::Rejected,
            'reviewed_by' => Auth::id(),
            'approved_at' => null,
            'rejection_reason' => $cleanedReason,
        ]);

        $result->loadMissing('orderSample');
        if ($result->orderSample) {
            $result->orderSample->update([
                'status' => OrderSampleStatus::Rejected,
            ]);
        }

        $this->notifyTechnicians($result->fresh(['order.patient.user', 'orderSample']));

        AuditLogger::record(
            'result.rejected',
            [
                'report_name' => $result->report_name,
                'order_id' => $result->order_id,
                'reason' => $cleanedReason,
            ],
            subjectType: LabResult::class,
            subjectId: $result->id,
            statusCode: 200,
        );

        return $result->fresh()->load('items');
    }

    private function notifyTechnicians(LabResult $result): void
    {
        $patientName = $result->order?->patient?->user?->name ?? 'a patient';
        $orderNumber = $result->order?->order_number ?? "#{$result->order_id}";
        $reason = $result->rejection_reason;

        $message = "Report \"{$result->report_name}\" for {$patientName} (order {$orderNumber}) was rejected and needs correction.";
        if ($reason) {
            $message .= " Reason: {$reason}";
        }

        $technicians = User::query()
            ->where('role', UserRole::Technician->value)
            ->where('status', UserStatus::Active->value)
            ->get(['id']);

        foreach ($technicians as $technician) {
            Notification::create([
                'user_id' => $technician->id,
                'title' => 'Result rejected — rework required',
                'message' => $message,
                'type' => 'technician_result_rejected',
                'reference_type' => 'order',
                'reference_id' => $result->order_id,
                'is_read' => false,
            ]);
        }
    }
}
