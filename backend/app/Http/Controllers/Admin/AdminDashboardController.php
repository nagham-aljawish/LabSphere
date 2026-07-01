<?php

namespace App\Http\Controllers\Admin;

use App\Enums\FinancialAidStatus;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\FinancialAidRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $pendingStaff = User::where('status', UserStatus::Pending)
            ->whereIn('role', [
                UserRole::Doctor,
                UserRole::Technician,
                UserRole::Reception,
            ])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role->value,
                'status' => $user->status->value,
                'createdAt' => $user->created_at->format('Y-m-d'),
            ]);

        $pendingSupport = FinancialAidRequest::with('user')
            ->whereIn('status', [
                FinancialAidStatus::Pending,
                FinancialAidStatus::UnderReview,
            ])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn (FinancialAidRequest $request) => [
                'id' => $request->id,
                'fullName' => $request->full_name,
                'phone' => $request->phone,
                'reason' => $request->reason,
                'status' => $request->status->value,
                'createdAt' => $request->created_at->format('Y-m-d'),
            ]);

        return $this->successResponse([
            'stats' => [
                'pendingStaff' => User::where('status', UserStatus::Pending)
                    ->whereIn('role', [UserRole::Doctor, UserRole::Technician, UserRole::Reception])
                    ->count(),
                'pendingSupport' => FinancialAidRequest::whereIn('status', [
                    FinancialAidStatus::Pending,
                    FinancialAidStatus::UnderReview,
                ])->count(),
                'approvedSupport' => FinancialAidRequest::where('status', FinancialAidStatus::Approved)->count(),
            ],
            'pendingStaff' => $pendingStaff,
            'pendingSupport' => $pendingSupport,
        ]);
    }
}
