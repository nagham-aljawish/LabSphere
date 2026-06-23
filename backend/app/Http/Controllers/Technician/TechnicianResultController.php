<?php

namespace App\Http\Controllers\Technician;

use App\Enums\LabResultStatus;
use App\Http\Controllers\Admin\AdminResultController;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResultRequest;
use App\Models\LabResult;
use Illuminate\Http\JsonResponse;

class TechnicianResultController extends Controller
{
    public function store(StoreResultRequest $request): JsonResponse
    {
        $result = AdminResultController::createOrUpdateResult(new LabResult, $request);

        return $this->successResponse($result, 'Result created as draft', 201);
    }

    public function update(StoreResultRequest $request, LabResult $result): JsonResponse
    {
        if (! in_array($result->status, [LabResultStatus::Draft, LabResultStatus::Rejected])) {
            return $this->errorResponse('Only draft or rejected results can be updated', [], 422);
        }

        $result = AdminResultController::createOrUpdateResult($result, $request);

        return $this->successResponse($result, 'Result updated successfully');
    }

    public function submitReview(LabResult $result): JsonResponse
    {
        if (! in_array($result->status, [LabResultStatus::Draft, LabResultStatus::Rejected])) {
            return $this->errorResponse('Only draft or rejected results can be submitted', [], 422);
        }

        $result->update(['status' => LabResultStatus::PendingReview]);

        return $this->successResponse($result->load('items'), 'Result submitted for review');
    }
}
