<?php

namespace App\Http\Controllers\Doctor;

use App\Enums\LabResultItemStatus;
use App\Enums\LabResultStatus;
use App\Enums\OrderSampleStatus;
use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\LabResult;
use App\Models\Notification;
use App\Services\DeltaCheckService;
use App\Services\LabResultPdfService;
use App\Services\LabResultRejectionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorResultController extends Controller
{
    public function __construct(
        private LabResultPdfService $pdfService,
        private DeltaCheckService $deltaCheck,
        private LabResultRejectionService $rejectionService,
    ) {}
    public function index(Request $request): JsonResponse
    {
        return $this->listByFilter((string) $request->query('filter', 'pending'));
    }

    public function pending(): JsonResponse
    {
        return $this->listByFilter('pending');
    }

    private function listByFilter(string $filter): JsonResponse
    {
        $query = LabResult::with(['order.patient.user', 'orderSample', 'items']);
        $todayStart = now()->copy()->startOfDay();

        match ($filter) {
            'approved' => $query
                ->where('status', LabResultStatus::Approved)
                ->where('approved_at', '>=', $todayStart)
                ->orderByDesc('approved_at'),
            'rejected' => $query
                ->where('status', LabResultStatus::Rejected)
                ->where('updated_at', '>=', $todayStart)
                ->orderByDesc('updated_at'),
            'critical' => $query
                ->where('status', LabResultStatus::PendingReview)
                ->whereHas('items', function ($items) {
                    $items->whereIn('status', [
                        LabResultItemStatus::Critical->value,
                        LabResultItemStatus::High->value,
                    ]);
                })
                ->orderByDesc('created_at'),
            default => $query
                ->where('status', LabResultStatus::PendingReview)
                ->orderByDesc('created_at'),
        };

        $results = $query->paginate(20);
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
            'rejectionReason' => $result->rejection_reason,
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
            'sampleId' => $result->orderSample?->label_code,
            'orderSampleId' => $result->order_sample_id,
        ];
    }

    public function approve(LabResult $result): JsonResponse
    {
        if ($result->status !== LabResultStatus::PendingReview) {
            return $this->errorResponse('Only pending review results can be approved', [], 422);
        }

        $result->loadMissing(['order.patient.user', 'orderSample']);

        $result->update([
            'status' => LabResultStatus::Approved,
            'reviewed_by' => request()->user()->id,
            'approved_at' => now(),
        ]);

        if ($result->orderSample) {
            $result->orderSample->update([
                'status' => OrderSampleStatus::Approved,
            ]);
        }

        $order = $result->order;
        if ($order) {
            $remaining = $order->orderSamples()
                ->where('status', '!=', OrderSampleStatus::Approved->value)
                ->count();

            if ($remaining === 0) {
                $order->update(['status' => OrderStatus::Completed]);
            } elseif ($order->status !== OrderStatus::Completed) {
                $order->update(['status' => OrderStatus::Processing]);
            }
        }

        // Generate PDF so the patient can download immediately after approval.
        try {
            $this->pdfService->ensurePdf($result->fresh(['order.patient.user', 'items', 'reviewer']), true);
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

    public function reject(Request $request, LabResult $result): JsonResponse
    {
        $validated = $request->validate([
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            $rejected = $this->rejectionService->reject(
                $result,
                $validated['reason'] ?? null,
            );
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), [], 422);
        }

        return $this->successResponse(
            $rejected,
            'Result rejected and returned to the technician for correction'
        );
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
