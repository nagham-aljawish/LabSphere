<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ContactMessageStatus;
use App\Enums\FinancialAidStatus;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\FinancialAidRequest;
use App\Models\User;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function __construct(private WalletService $walletService) {}

    public function index(): JsonResponse
    {
        $fundSummary = $this->walletService->getDonationFundSummary();
        $fundActivity = $this->walletService->getDonationFundActivity(20);

        $pendingStaffQuery = User::query()
            ->where('status', UserStatus::Pending)
            ->whereIn('role', [
                UserRole::Doctor,
                UserRole::Technician,
                UserRole::Reception,
            ]);

        $pendingStaffCount = (clone $pendingStaffQuery)->count();
        $pendingStaff = (clone $pendingStaffQuery)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get(['id', 'name', 'email', 'phone', 'role', 'status', 'created_at'])
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role->value,
                'status' => $user->status->value,
                'createdAt' => $user->created_at->format('Y-m-d'),
            ]);

        $pendingSupportQuery = FinancialAidRequest::query()
            ->whereIn('status', [
                FinancialAidStatus::Pending,
                FinancialAidStatus::UnderReview,
            ]);

        $pendingSupportCount = (clone $pendingSupportQuery)->count();
        $pendingSupport = (clone $pendingSupportQuery)
            ->with('user:id,name')
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

        $recentContactMessages = ContactMessage::query()
            ->orderByDesc('created_at')
            ->limit(5)
            ->get(['id', 'name', 'email', 'subject', 'status', 'created_at'])
            ->map(fn (ContactMessage $message) => [
                'id' => $message->id,
                'name' => $message->name,
                'email' => $message->email,
                'subject' => $message->subject,
                'status' => $message->status instanceof ContactMessageStatus
                    ? $message->status->value
                    : (string) $message->status,
                'createdAt' => $message->created_at?->format('Y-m-d H:i'),
            ]);

        return $this->successResponse([
            'stats' => [
                'pendingStaff' => $pendingStaffCount,
                'pendingSupport' => $pendingSupportCount,
                'approvedSupport' => FinancialAidRequest::where('status', FinancialAidStatus::Approved)->count(),
                'newContactMessages' => ContactMessage::where('status', ContactMessageStatus::New)->count(),
                'donationFundBalance' => $fundSummary['availableBalance'],
                'totalDonations' => $fundSummary['totalDonations'],
                'distributedFromDonations' => $fundSummary['totalDistributed'],
            ],
            'pendingStaff' => $pendingStaff,
            'pendingSupport' => $pendingSupport,
            'recentContactMessages' => $recentContactMessages,
            'donationFundActivity' => $fundActivity,
        ]);
    }
}
