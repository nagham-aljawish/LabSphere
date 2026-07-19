<?php

namespace App\Http\Controllers;

use App\Enums\LabResultStatus;
use App\Models\LabResult;
use App\Models\Test;
use App\Services\FinancialAidService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PatientResultController extends Controller
{
    public function __construct(private FinancialAidService $financialAidService) {}

    public function index(): JsonResponse
    {
        $patient = request()->user()->patient;

        if (! $patient) {
            return $this->errorResponse('Patient profile not found', [], 404);
        }

        $results = LabResult::with(['order', 'items'])
            ->whereHas('order', fn ($q) => $q->where('patient_id', $patient->id))
            ->where('status', LabResultStatus::Approved)
            ->orderByDesc('approved_at')
            ->get()
            ->map(function (LabResult $result) use ($patient) {
                $discountPercentage = $this->financialAidService->getDiscountForOrder($result->order);
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
                    'paymentRequired' => $remainingAmount > 0,
                    'payment' => [
                        'remainingAmount' => number_format($remainingAmount, 2, '.', ''),
                        'discountPercentage' => $discountPercentage,
                        'discountAmount' => number_format($result->order->discountAmount($discountPercentage), 2, '.', ''),
                        'payableAmount' => number_format($result->order->payableAmount($discountPercentage), 2, '.', ''),
                    ],
                ];
            });

        return $this->successResponse($results);
    }

    public function show(int $id): JsonResponse
    {
        $patient = request()->user()->patient;

        if (! $patient) {
            return $this->errorResponse('Patient profile not found', [], 404);
        }

        $result = LabResult::with(['order.patient.user', 'items'])
            ->whereHas('order', fn ($q) => $q->where('patient_id', $patient->id))
            ->where('status', LabResultStatus::Approved)
            ->find($id);

        if (! $result) {
            return $this->errorResponse('Result not found', [], 404);
        }

        $testCodes = $result->items->pluck('test_code')->filter()->unique()->values();
        $preparationByCode = Test::query()
            ->whereIn('code', $testCodes)
            ->pluck('preparation_instructions', 'code');

        $discountPercentage = $this->financialAidService->getDiscountForOrder($result->order);
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
            'paymentRequired' => $paymentRequired,
            'payment' => [
                'remainingAmount' => number_format($remainingAmount, 2, '.', ''),
                'discountPercentage' => $discountPercentage,
                'discountAmount' => number_format($result->order->discountAmount($discountPercentage), 2, '.', ''),
                'payableAmount' => number_format($result->order->payableAmount($discountPercentage), 2, '.', ''),
            ],
            'tests' => $paymentRequired
                ? []
                : $result->items->map(fn ($item) => [
                    'name' => $item->test_name,
                    'code' => $item->test_code,
                    'result' => $item->result_value,
                    'unit' => $item->unit,
                    'range' => $item->normal_range,
                    'status' => $item->status->value,
                    'preparationInstructions' => $preparationByCode[$item->test_code]
                        ?? 'No special preparation required.',
                ]),
        ]);
    }

    public function download(int $id): JsonResponse|StreamedResponse
    {
        $patient = request()->user()->patient;

        if (! $patient) {
            return $this->errorResponse('Patient profile not found', [], 404);
        }

        $result = LabResult::with('order')
            ->whereHas('order', fn ($q) => $q->where('patient_id', $patient->id))
            ->where('status', LabResultStatus::Approved)
            ->find($id);

        if (! $result) {
            return $this->errorResponse('Result not found', [], 404);
        }

        $discountPercentage = $this->financialAidService->getDiscountForOrder($result->order);
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

        if (! $result->pdf_path) {
            return $this->errorResponse('PDF report is not available yet', [], 404);
        }

        $path = storage_path('app/public/'.$result->pdf_path);

        if (! file_exists($path)) {
            return $this->errorResponse('PDF file not found', [], 404);
        }

        return response()->download($path, $result->report_name.'.pdf');
    }
}
