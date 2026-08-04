<?php

namespace App\Http\Controllers\Doctor;

use App\Enums\LabResultItemStatus;
use App\Enums\LabResultStatus;
use App\Http\Controllers\Controller;
use App\Models\LabResult;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class DoctorDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $now = now();
        $todayStart = $now->copy()->startOfDay();

        $pendingReviews = LabResult::query()
            ->where('status', LabResultStatus::PendingReview)
            ->count();

        $approvedToday = LabResult::query()
            ->where('status', LabResultStatus::Approved)
            ->where('approved_at', '>=', $todayStart)
            ->count();

        $rejectedToday = LabResult::query()
            ->where('status', LabResultStatus::Rejected)
            ->where('updated_at', '>=', $todayStart)
            ->count();

        $criticalPending = LabResult::query()
            ->where('status', LabResultStatus::PendingReview)
            ->whereHas('items', function ($query) {
                $query->whereIn('status', [
                    LabResultItemStatus::Critical->value,
                    LabResultItemStatus::High->value,
                ]);
            })
            ->count();

        $pendingQueue = LabResult::query()
            ->with(['order.patient.user', 'items'])
            ->where('status', LabResultStatus::PendingReview)
            ->orderByDesc('created_at')
            ->limit(8)
            ->get()
            ->map(function (LabResult $result) {
                return [
                    'id' => $result->id,
                    'orderId' => $result->order_id,
                    'reportName' => $result->report_name,
                    'patient' => $result->order?->patient?->user?->name ?? 'Unknown patient',
                    'patientCode' => $result->order?->patient?->patient_code,
                    'orderNumber' => $result->order?->order_number,
                    'summaryStatus' => $result->summary_status,
                    'isCdss' => (bool) $result->is_cdss,
                    'time' => $result->created_at?->format('h:i A') ?? '-',
                ];
            })
            ->values();

        $recentActivities = LabResult::query()
            ->with(['order.patient.user'])
            ->whereIn('status', [
                LabResultStatus::PendingReview,
                LabResultStatus::Approved,
                LabResultStatus::Rejected,
            ])
            ->orderByDesc('updated_at')
            ->limit(8)
            ->get()
            ->map(function (LabResult $result) use ($now) {
                $patientName = $result->order?->patient?->user?->name ?? 'Unknown patient';
                $report = $result->report_name;
                $statusValue = $result->status instanceof LabResultStatus
                    ? $result->status->value
                    : (string) $result->status;

                return [
                    'id' => $result->id,
                    'resultId' => $result->id,
                    'orderId' => $result->order_id,
                    'type' => $statusValue,
                    'text' => $this->activityText($statusValue, $report, $patientName),
                    'time' => $result->updated_at
                        ? Carbon::parse($result->updated_at)->diffForHumans($now, short: true)
                        : 'just now',
                ];
            })
            ->values();

        return $this->successResponse([
            'stats' => [
                'pendingReviews' => $pendingReviews,
                'approvedToday' => $approvedToday,
                'rejectedToday' => $rejectedToday,
                'criticalPending' => $criticalPending,
            ],
            'pendingQueue' => $pendingQueue,
            'recentActivities' => $recentActivities,
        ]);
    }

    private function activityText(string $status, string $report, string $patientName): string
    {
        return match ($status) {
            LabResultStatus::PendingReview->value => "Awaiting review: {$report} for {$patientName}",
            LabResultStatus::Approved->value => "Approved {$report} for {$patientName}",
            LabResultStatus::Rejected->value => "Rejected {$report} for {$patientName}",
            default => "Updated {$report} for {$patientName}",
        };
    }
}
