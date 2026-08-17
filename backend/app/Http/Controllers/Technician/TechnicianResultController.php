<?php

namespace App\Http\Controllers\Technician;

use App\Enums\LabResultStatus;
use App\Enums\OrderSampleStatus;
use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResultRequest;
use App\Models\LabResult;
use App\Models\Notification;
use App\Models\User;
use App\Services\LabResultService;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class TechnicianResultController extends Controller
{
    public function __construct(private LabResultService $labResultService) {}

    public function store(StoreResultRequest $request): JsonResponse
    {
        $orderId = $request->integer('order_id');
        $sample = null;

        try {
            $order = \App\Models\Order::query()->with('orderSamples')->findOrFail($orderId);
            $sample = $this->labResultService->resolveSample($order, $request);
        } catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), [], 422);
        }

        $existingQuery = LabResult::query()
            ->where('order_id', $orderId)
            ->whereIn('status', [LabResultStatus::Draft, LabResultStatus::Rejected]);

        if ($sample) {
            $existingQuery->where('order_sample_id', $sample->id);
        }

        $existing = $existingQuery->latest('id')->first();

        // After a resubmit the result is pending_review — do not allow another
        // editable draft until the doctor rejects again (per sample).
        if (! $existing) {
            $alreadyInReviewQuery = LabResult::query()
                ->where('order_id', $orderId)
                ->whereIn('status', [
                    LabResultStatus::PendingReview,
                    LabResultStatus::Approved,
                ]);

            if ($sample) {
                $alreadyInReviewQuery->where('order_sample_id', $sample->id);
            }

            if ($alreadyInReviewQuery->exists()) {
                return $this->errorResponse(
                    'This result was already submitted for doctor review. You can edit again only if the doctor rejects it.',
                    [],
                    422
                );
            }
        }

        try {
            $result = $this->labResultService->createOrUpdate(
                $existing ?? new LabResult,
                $request,
            );
        } catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), [], 422);
        }

        $message = $existing
            ? 'Result updated as draft'
            : 'Result created as draft';

        return $this->successResponse($result, $message, $existing ? 200 : 201);
    }

    public function update(StoreResultRequest $request, LabResult $result): JsonResponse
    {
        if (! in_array($result->status, [LabResultStatus::Draft, LabResultStatus::Rejected])) {
            return $this->errorResponse('Only draft or rejected results can be updated', [], 422);
        }

        try {
            $result = $this->labResultService->createOrUpdate($result, $request);
        } catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), [], 422);
        }

        return $this->successResponse($result, 'Result updated successfully');
    }

    public function submitReview(LabResult $result): JsonResponse
    {
        if (! in_array($result->status, [LabResultStatus::Draft, LabResultStatus::Rejected])) {
            return $this->errorResponse('Only draft or rejected results can be submitted', [], 422);
        }

        $result->loadMissing(['order.patient.user', 'orderSample']);

        $result->update([
            'status' => LabResultStatus::PendingReview,
            'rejection_reason' => null,
        ]);

        if ($result->orderSample) {
            $result->orderSample->update([
                'status' => OrderSampleStatus::PendingReview,
            ]);
        }

        $order = $result->order;
        if (
            $order
            && ! in_array($order->status, [OrderStatus::Completed, OrderStatus::Cancelled], true)
        ) {
            $order->update(['status' => OrderStatus::Processing]);
        }

        // Close open rejection alerts — tech already used their one correction.
        Notification::query()
            ->where('type', 'technician_result_rejected')
            ->where('reference_type', 'order')
            ->where('reference_id', $result->order_id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $this->notifyDoctorsForReview($result);

        return $this->successResponse($result->fresh()->load('items'), 'Result submitted for review');
    }

    private function notifyDoctorsForReview(LabResult $result): void
    {
        $patientName = $result->order?->patient?->user?->name ?? 'a patient';
        $orderNumber = $result->order?->order_number ?? "#{$result->order_id}";
        $isCdss = (bool) $result->is_cdss;
        $sampleLabel = $result->orderSample?->label_code;
        $sampleSuffix = $sampleLabel ? " • Sample {$sampleLabel}" : '';

        $title = $isCdss
            ? 'New CDSS result awaiting review'
            : 'New lab result awaiting review';

        $message = $isCdss
            ? "CDSS report \"{$result->report_name}\" for {$patientName} (order {$orderNumber}){$sampleSuffix} is ready for your review."
            : "Lab report \"{$result->report_name}\" for {$patientName} (order {$orderNumber}){$sampleSuffix} is ready for your review.";

        $doctors = User::query()
            ->where('role', UserRole::Doctor->value)
            ->where('status', UserStatus::Active->value)
            ->get(['id']);

        foreach ($doctors as $doctor) {
            Notification::create([
                'user_id' => $doctor->id,
                'title' => $title,
                'message' => $message,
                'type' => $isCdss ? 'doctor_cdss_review' : 'doctor_result_review',
                'reference_type' => 'lab_result',
                'reference_id' => $result->id,
                'is_read' => false,
            ]);
        }
    }
}
