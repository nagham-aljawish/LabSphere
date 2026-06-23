<?php

namespace App\Http\Controllers\Doctor;

use App\Enums\LabResultStatus;
use App\Http\Controllers\Controller;
use App\Models\LabResult;
use Illuminate\Http\JsonResponse;

class DoctorResultController extends Controller
{
    public function pending(): JsonResponse
    {
        $results = LabResult::with(['order.patient.user', 'items'])
            ->where('status', LabResultStatus::PendingReview)
            ->orderByDesc('created_at')
            ->paginate(20);

        return $this->successResponse($results);
    }

    public function approve(LabResult $result): JsonResponse
    {
        if ($result->status !== LabResultStatus::PendingReview) {
            return $this->errorResponse('Only pending review results can be approved', [], 422);
        }

        $result->update([
            'status' => LabResultStatus::Approved,
            'reviewed_by' => request()->user()->id,
            'approved_at' => now(),
        ]);

        return $this->successResponse($result->load('items'), 'Result approved successfully');
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
}
