<?php

namespace App\Http\Controllers\Admin;

use App\Enums\LabResultStatus;
use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResultRequest;
use App\Models\LabResult;
use App\Services\CdssService;
use App\Services\DeltaCheckService;
use App\Services\LabResultPdfService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminResultController extends Controller
{
    public function __construct(
        private LabResultPdfService $pdfService,
        private DeltaCheckService $deltaCheck,
    ) {}
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
        $result->order?->update(['status' => OrderStatus::Completed]);

        try {
            $this->pdfService->ensurePdf($result->fresh(['order.patient.user', 'items', 'reviewer']));
        } catch (\Throwable $e) {
            report($e);
        }

        try {
            $this->deltaCheck->evaluateAndNotifyPatient(
                $result->fresh(['items', 'order.patient.user']),
            );
        } catch (\Throwable $e) {
            report($e);
        }

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
            $isCdss = $request->boolean('is_cdss');

            $result->fill([
                'order_id' => $request->order_id,
                'report_name' => $request->report_name,
                'status' => $result->exists ? $result->status : LabResultStatus::Draft,
                'is_cdss' => $isCdss,
            ]);

            if ($isCdss) {
                self::applyCdssPrediction($result, $request);
            }

            $result->save();

            $result->items()->delete();

            foreach ($request->items as $item) {
                $result->items()->create($item);
            }

            // Keep order status in sync so patient tracking can leave
            // "Received in Lab" and enter Result Entry / Analysis.
            $order = $result->order()->first();
            if (
                $order
                && ! in_array($order->status, [OrderStatus::Completed, OrderStatus::Cancelled], true)
            ) {
                $orderUpdates = ['status' => OrderStatus::Processing];
                if ($order->sent_to_technician_at === null) {
                    $orderUpdates['sent_to_technician_at'] = now();
                }
                $order->update($orderUpdates);
            }

            return $result->load(['order.patient.user', 'items']);
        });
    }

    /**
     * Score the entered values with the disease model and store the decision
     * support output on the result so the doctor sees it during review.
     */
    protected static function applyCdssPrediction(LabResult $result, StoreResultRequest $request): void
    {
        $prediction = app(CdssService::class)->predict(
            $request->input('cdss_disease'),
            $request->input('cdss_features', []),
        );

        $result->fill([
            'cdss_disease' => $prediction['disease'],
            'cdss_outcome' => $prediction['outcome'],
            'cdss_prediction' => $prediction['prediction'],
            'cdss_confidence' => $prediction['confidence'],
            'cdss_recommendation' => $prediction['recommendation'],
            'cdss_predicted_at' => now(),
        ]);
    }
}
