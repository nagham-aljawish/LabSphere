<?php

namespace App\Http\Controllers\Admin;

use App\Enums\LabResultStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResultRequest;
use App\Models\LabResult;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminResultController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = LabResult::with(['order.patient.user', 'reviewer', 'items'])
            ->orderByDesc('created_at');

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return $this->successResponse($query->paginate(20));
    }

    public function store(StoreResultRequest $request): JsonResponse
    {
        $result = $this->createOrUpdateResult(new LabResult, $request);

        return $this->successResponse($result, 'Result created successfully', 201);
    }

    public function show(LabResult $result): JsonResponse
    {
        return $this->successResponse(
            $result->load(['order.patient.user', 'reviewer', 'items'])
        );
    }

    public function update(StoreResultRequest $request, LabResult $result): JsonResponse
    {
        if (in_array($result->status, [LabResultStatus::Approved])) {
            return $this->errorResponse('Cannot update an approved result', [], 422);
        }

        $result = $this->createOrUpdateResult($result, $request);

        return $this->successResponse($result, 'Result updated successfully');
    }

    public function submitReview(LabResult $result): JsonResponse
    {
        if ($result->status !== LabResultStatus::Draft) {
            return $this->errorResponse('Only draft results can be submitted for review', [], 422);
        }

        $result->update(['status' => LabResultStatus::PendingReview]);

        return $this->successResponse($result->load('items'), 'Result submitted for review');
    }

    public function approve(LabResult $result): JsonResponse
    {
        if (! in_array($result->status, [LabResultStatus::PendingReview, LabResultStatus::Rejected])) {
            return $this->errorResponse('Result cannot be approved in its current status', [], 422);
        }

        $result->update([
            'status' => LabResultStatus::Approved,
            'reviewed_by' => request()->user()->id,
            'approved_at' => now(),
        ]);

        return $this->successResponse($result->load('items'), 'Result approved successfully');
    }

    public function reject(Request $request, LabResult $result): JsonResponse
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

    public static function createOrUpdateResult(LabResult $result, StoreResultRequest $request): LabResult
    {
        return DB::transaction(function () use ($result, $request) {
            $result->fill([
                'order_id' => $request->order_id,
                'report_name' => $request->report_name,
                'status' => $result->exists ? $result->status : LabResultStatus::Draft,
            ]);
            $result->save();

            $result->items()->delete();

            foreach ($request->items as $item) {
                $result->items()->create($item);
            }

            return $result->load(['order.patient.user', 'items']);
        });
    }
}
