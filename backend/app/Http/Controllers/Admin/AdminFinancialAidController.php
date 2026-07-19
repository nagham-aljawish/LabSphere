<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FinancialAidRequest;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AdminFinancialAidController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = FinancialAidRequest::with(['user', 'files'])
            ->orderByDesc('created_at');

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return $this->successResponse($query->paginate(20));
    }

    public function updateStatus(Request $request, FinancialAidRequest $financialAid): JsonResponse
    {
        $request->validate([
            'status' => ['required', Rule::in(['pending', 'under_review', 'approved', 'rejected'])],
            'admin_notes' => ['nullable', 'string'],
            'discount_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);

        if ($request->status === 'approved' && $request->discount_percentage === null) {
            return $this->errorResponse('Discount percentage is required when approving a support request.', [], 422);
        }

        $previousStatus = $financialAid->status->value;

        $financialAid->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes ?? $financialAid->admin_notes,
            'discount_percentage' => $request->status === 'approved'
                ? $request->discount_percentage
                : $financialAid->discount_percentage,
            'applied_order_id' => $request->status === 'approved' && $previousStatus !== 'approved'
                ? null
                : $financialAid->applied_order_id,
        ]);

        if ($request->status === 'approved' && $previousStatus !== 'approved') {
            Notification::create([
                'user_id' => $financialAid->user_id,
                'title' => 'Financial Aid Approved',
                'message' => "Your support request has been approved with a {$request->discount_percentage}% discount.",
                'type' => 'financial_aid',
                'reference_type' => 'financial_aid_request',
                'reference_id' => $financialAid->id,
            ]);
        }

        if ($request->status === 'rejected' && $previousStatus !== 'rejected') {
            Notification::create([
                'user_id' => $financialAid->user_id,
                'title' => 'Financial Aid Rejected',
                'message' => 'Your support request was reviewed and could not be approved at this time.',
                'type' => 'financial_aid',
                'reference_type' => 'financial_aid_request',
                'reference_id' => $financialAid->id,
            ]);
        }

        return $this->successResponse(
            $financialAid->load(['user', 'files']),
            'Financial aid request status updated'
        );
    }

    public function downloadFile(FinancialAidRequest $financialAid, int $fileId): JsonResponse|\Symfony\Component\HttpFoundation\StreamedResponse
    {
        $file = $financialAid->files()->findOrFail($fileId);

        if (! Storage::disk('public')->exists($file->file_path)) {
            return $this->errorResponse('File not found.', [], 404);
        }

        return Storage::disk('public')->download(
            $file->file_path,
            $file->original_name
        );
    }
}
