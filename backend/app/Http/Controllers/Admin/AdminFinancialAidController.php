<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FinancialAidRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
        ]);

        $financialAid->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes ?? $financialAid->admin_notes,
        ]);

        return $this->successResponse(
            $financialAid->load(['user', 'files']),
            'Financial aid request status updated'
        );
    }
}
