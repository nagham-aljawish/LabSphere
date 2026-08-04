<?php

namespace App\Http\Controllers\Doctor;

use App\Enums\LabResultStatus;
use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\LabResult;
use App\Models\Notification;
use App\Services\DeltaCheckService;
use App\Services\LabResultPdfService;
use Illuminate\Http\JsonResponse;

class DoctorResultController extends Controller
{
    public function __construct(
        private LabResultPdfService $pdfService,
        private DeltaCheckService $deltaCheck,
    ) {}
    public function pending(): JsonResponse
    {
        $results = LabResult::with(['order.patient.user', 'items'])
            ->where('status', LabResultStatus::PendingReview)
            ->orderByDesc('created_at')
            ->paginate(20);

        $results->getCollection()->transform(fn (LabResult $result) => $this->transformForReview($result));

        return $this->successResponse($results);
    }

    private function transformForReview(LabResult $result): array
    {
        return [
            'id' => $result->id,
            'reportName' => $result->report_name,
            'orderId' => $result->order_id,
            'orderNumber' => $result->order?->order_number,
            'patientName' => $result->order?->patient?->user?->name ?? 'Unknown patient',
            'patientCode' => $result->order?->patient?->patient_code,
            'status' => $result->status->value,
            'summaryStatus' => $result->summary_status,
            'createdAt' => $result->created_at->toIso8601String(),
            'isCdss' => (bool) $result->is_cdss,
            'cdss' => $result->is_cdss ? [
                'disease' => $result->cdss_disease,
                'outcome' => $result->cdss_outcome,
                'prediction' => $result->cdss_prediction,
                'confidence' => $result->cdss_confidence !== null ? (float) $result->cdss_confidence : null,
                'recommendation' => $result->cdss_recommendation,
            ] : null,
            'items' => $result->items->map(fn ($item) => [
                'testName' => $item->test_name,
                'testCode' => $item->test_code,
                'resultValue' => $item->result_value,
                'unit' => $item->unit,
                'normalRange' => $item->normal_range,
                'status' => $item->status instanceof \App\Enums\LabResultItemStatus
                    ? $item->status->value
                    : $item->status,
            ]),
        ];
    }

    public function approve(LabResult $result): JsonResponse
    {
        if ($result->status !== LabResultStatus::PendingReview) {
            return $this->errorResponse('Only pending review results can be approved', [], 422);
        }

        $result->loadMissing(['order.patient.user']);

        $result->update([
            'status' => LabResultStatus::Approved,
            'reviewed_by' => request()->user()->id,
            'approved_at' => now(),
        ]);
        $result->order?->update(['status' => OrderStatus::Completed]);

        // Generate PDF so the patient can download immediately after approval.
        try {
            $this->pdfService->ensurePdf($result->fresh(['order.patient.user', 'items', 'reviewer']));
        } catch (\Throwable $e) {
            report($e);
        }

        $this->notifyPatientResultReady($result);

        try {
            $this->deltaCheck->evaluateAndNotifyPatient(
                $result->fresh(['items', 'order.patient.user']),
            );
        } catch (\Throwable $e) {
            report($e);
        }

        \App\Services\AuditLogger::record(
            'doctor.result.approved',
            [
                'report_name' => $result->report_name,
                'order_id' => $result->order_id,
                'patient_notified' => true,
            ],
            subjectType: LabResult::class,
            subjectId: $result->id,
            statusCode: 200,
        );

        return $this->successResponse(
            $result->load('items'),
            'Result approved and sent to the patient'
        );
    }

    public function reject(LabResult $result): JsonResponse
    {
        if ($result->status !== LabResultStatus::PendingReview) {
            return $this->errorResponse('Only pending review results can be rejected', [], 422);
        }

        $result->update([
            'status' => LabResultStatus::Rejected,
            'reviewed_by' => request()->user()->id,
            'approved_at' => null,
        ]);

        return $this->successResponse($result->load('items'), 'Result rejected');
    }

    private function notifyPatientResultReady(LabResult $result): void
    {
        $userId = $result->order?->patient?->user_id
            ?? $result->order?->patient?->user?->id;

        if (! $userId) {
            return;
        }

        $orderNumber = $result->order?->order_number ?? "#{$result->order_id}";
        $reportName = $result->report_name;

        Notification::create([
            'user_id' => $userId,
            'title' => 'Your lab results are ready',
            'message' => "Your report \"{$reportName}\" for order {$orderNumber} has been approved and is now available.",
            'type' => 'lab_result',
            'reference_type' => 'lab_result',
            'reference_id' => $result->id,
            'is_read' => false,
        ]);
    }
}
