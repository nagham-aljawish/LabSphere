<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FinancialAidRequest;
use App\Models\Notification;
use App\Services\ReceptionNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AdminFinancialAidController extends Controller
{
    public function __construct(private ReceptionNotificationService $receptionNotifications) {}

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
                'title' => 'Support Request Approved',
                'message' => "Your financial support request has been approved with a {$request->discount_percentage}% discount.",
                'type' => 'financial_aid',
                'reference_type' => 'financial_aid_request',
                'reference_id' => $financialAid->id,
                'is_read' => false,
            ]);

            $this->receptionNotifications->notifyDiscountApproved($financialAid->fresh(['user']));
        }

        if ($request->status === 'rejected' && $previousStatus !== 'rejected') {
            $notes = trim((string) ($request->admin_notes ?? ''));
            $message = 'Your financial support request was rejected.';
            if ($notes !== '') {
                $message .= " Reason: {$notes}";
            } else {
                $message .= ' Please contact the lab if you need more information.';
            }

            Notification::create([
                'user_id' => $financialAid->user_id,
                'title' => 'Support Request Rejected',
                'message' => $message,
                'type' => 'financial_aid_rejected',
                'reference_type' => 'financial_aid_request',
                'reference_id' => $financialAid->id,
                'is_read' => false,
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
