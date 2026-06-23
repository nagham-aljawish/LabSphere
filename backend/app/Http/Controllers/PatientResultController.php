<?php

namespace App\Http\Controllers;

use App\Enums\LabResultStatus;
use App\Models\LabResult;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PatientResultController extends Controller
{
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
            ->map(fn (LabResult $result) => [
                'id' => $result->id,
                'reportName' => $result->report_name,
                'orderNumber' => $result->order->order_number,
                'patientId' => $patient->patient_code,
                'date' => ($result->approved_at ?? $result->created_at)->format('Y-m-d'),
                'status' => $result->status->value,
                'summaryStatus' => $result->summary_status,
            ]);

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

        return $this->successResponse([
            'id' => $result->id,
            'reportName' => $result->report_name,
            'patientName' => $result->order->patient->user->name,
            'patientId' => $patient->patient_code,
            'orderNumber' => $result->order->order_number,
            'date' => ($result->approved_at ?? $result->created_at)->format('Y-m-d'),
            'status' => $result->status->value,
            'tests' => $result->items->map(fn ($item) => [
                'name' => $item->test_name,
                'code' => $item->test_code,
                'result' => $item->result_value,
                'unit' => $item->unit,
                'range' => $item->normal_range,
                'status' => $item->status->value,
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
