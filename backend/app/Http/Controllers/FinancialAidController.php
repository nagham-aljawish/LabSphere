<?php

namespace App\Http\Controllers;

use App\Enums\FinancialAidStatus;
use App\Http\Requests\StoreFinancialAidRequest;
use App\Models\FinancialAidRequest;
use Illuminate\Http\JsonResponse;

class FinancialAidController extends Controller
{
    public function store(StoreFinancialAidRequest $request): JsonResponse
    {
        $aidRequest = FinancialAidRequest::create([
            'user_id' => $request->user()->id,
            'full_name' => $request->full_name,
            'phone' => $request->phone,
            'reason' => $request->reason,
            'status' => FinancialAidStatus::Pending,
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('financial-aid', 'public');
                $aidRequest->files()->create([
                    'file_path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                ]);
            }
        }

        return $this->successResponse(
            $aidRequest->load('files'),
            'Financial aid request submitted successfully',
            201
        );
    }

    public function myRequests(): JsonResponse
    {
        $requests = FinancialAidRequest::with('files')
            ->where('user_id', request()->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return $this->successResponse($requests);
    }
}
