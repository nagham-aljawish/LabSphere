<?php

namespace App\Http\Controllers;

use App\Enums\LabResultStatus;
use App\Models\LabResult;
use App\Models\Test;
use App\Services\FinancialAidService;
use App\Services\LabResultPdfService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PatientResultController extends Controller
{
    public function __construct(
        private FinancialAidService $financialAidService,
        private LabResultPdfService $pdfService,
    ) {}

    public function index(): JsonResponse
    {
        $patient = request()->user()->patient;

        if (! $patient) {
            return $this->errorResponse('Patient profile not found', [], 404);
        }

        $perPage = min(50, max(1, (int) request()->integer('per_page', 15)));

        $paginator = LabResult::with(['order.payments', 'order.patient'])
            ->whereHas('order', fn ($q) => $q->where('patient_id', $patient->id))
            ->where('status', LabResultStatus::Approved)
            ->orderByDesc('approved_at')
            ->paginate($perPage)
            ->through(function (LabResult $result) use ($patient) {
                $discountPercentage = $this->financialAidService->peekDiscountForOrder($result->order);
                $remainingAmount = $result->order->remainingAmount($discountPercentage);

                return [
                    'id' => $result->id,
                    'reportName' => $result->report_name,
                    'orderId' => $result->order->id,
                    'orderNumber' => $result->order->order_number,
                    'patientId' => $patient->patient_code,
                    'date' => ($result->approved_at ?? $result->created_at)->format('Y-m-d'),
                    'status' => $result->status->value,
                    'summaryStatus' => $result->summary_status,
                    'isCdss' => (bool) $result->is_cdss,
                    'paymentRequired' => $remainingAmount > 0,
                    'payment' => [
                        'remainingAmount' => number_format($remainingAmount, 2, '.', ''),
                        'discountPercentage' => $discountPercentage,
                        'discountAmount' => number_format($result->order->discountAmount($discountPercentage), 2, '.', ''),
                        'payableAmount' => number_format($result->order->payableAmount($discountPercentage), 2, '.', ''),
                    ],
                ];
            });

        return $this->successResponse($paginator);
    }

    public function show(int $id): JsonResponse
    {
        $patient = request()->user()->patient;

        if (! $patient) {
            return $this->errorResponse('Patient profile not found', [], 404);
        }

        $result = LabResult::with(['order.patient.user', 'order.payments', 'items'])
            ->whereHas('order', fn ($q) => $q->where('patient_id', $patient->id))
            ->where('status', LabResultStatus::Approved)
            ->find($id);

        if (! $result) {
            return $this->errorResponse('Result not found', [], 404);
        }

        $testCodes = $result->items->pluck('test_code')->filter()->unique()->values();
        $testsByCode = Test::query()
            ->whereIn('code', $testCodes)
            ->get()
            ->keyBy('code');

        $discountPercentage = $this->financialAidService->peekDiscountForOrder($result->order);
        $remainingAmount = $result->order->remainingAmount($discountPercentage);
        $paymentRequired = $remainingAmount > 0;

        return $this->successResponse([
            'id' => $result->id,
            'reportName' => $result->report_name,
            'patientName' => $result->order->patient->user->name,
            'patientId' => $patient->patient_code,
            'orderId' => $result->order->id,
            'orderNumber' => $result->order->order_number,
            'date' => ($result->approved_at ?? $result->created_at)->format('Y-m-d'),
            'status' => $result->status->value,
            'isCdss' => (bool) $result->is_cdss,
            'cdss' => $result->is_cdss && ! $paymentRequired ? [
                'disease' => $result->cdss_disease,
                'outcome' => $result->cdss_outcome,
                'prediction' => $result->cdss_prediction,
                'confidence' => $result->cdss_confidence !== null ? (float) $result->cdss_confidence : null,
                'recommendation' => $result->cdss_recommendation,
            ] : null,
            'paymentRequired' => $paymentRequired,
            'payment' => [
                'remainingAmount' => number_format($remainingAmount, 2, '.', ''),
                'discountPercentage' => $discountPercentage,
                'discountAmount' => number_format($result->order->discountAmount($discountPercentage), 2, '.', ''),
                'payableAmount' => number_format($result->order->payableAmount($discountPercentage), 2, '.', ''),
            ],
            'tests' => $paymentRequired
                ? []
                : $result->items->map(function ($item) use ($testsByCode) {
                    $matched = $item->test_code
                        ? $testsByCode->get($item->test_code)
                        : null;

                    return [
                        'name' => $item->test_name,
                        'code' => $item->test_code,
                        'result' => $item->result_value,
                        'unit' => $item->unit,
                        'range' => $item->normal_range,
                        'status' => $item->status->value,
                        'preparationInstructions' => $matched?->preparation_instructions
                            ?? \App\Support\TestPreparation::instructions(
                                (string) $item->test_code,
                                '',
                                '',
                            ),
                    ];
                }),
        ]);
    }

    public function download(int $id): JsonResponse|BinaryFileResponse|StreamedResponse
    {
        $patient = request()->user()->patient;

        if (! $patient) {
            return $this->errorResponse('Patient profile not found', [], 404);
        }

        $result = LabResult::with(['order.payments', 'order.patient'])
            ->whereHas('order', fn ($q) => $q->where('patient_id', $patient->id))
            ->where('status', LabResultStatus::Approved)
            ->find($id);

        if (! $result) {
            return $this->errorResponse('Result not found', [], 404);
        }

        $discountPercentage = $this->financialAidService->peekDiscountForOrder($result->order);
        $remainingAmount = $result->order->remainingAmount($discountPercentage);
        if ($remainingAmount > 0) {
            return $this->errorResponse(
                'Payment required before downloading this result.',
                [
                    'order_id' => $result->order->id,
                    'order_number' => $result->order->order_number,
                    'remaining_amount' => number_format($remainingAmount, 2, '.', ''),
                ],
                422
            );
        }

        try {
            $relativePath = $this->pdfService->ensurePdf($result);
        } catch (\Throwable $e) {
            report($e);

            return $this->errorResponse('Failed to generate PDF report.', [], 500);
        }

        $path = storage_path('app/public/'.$relativePath);

        if (! file_exists($path)) {
            return $this->errorResponse('PDF file not found', [], 404);
        }

        $fileName = ($result->report_name ?: 'lab-result').'.pdf';

        return response()->download($path, $fileName);
    }
}
