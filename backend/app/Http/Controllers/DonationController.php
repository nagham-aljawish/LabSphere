<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDonationRequest;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class DonationController extends Controller
{
    public function __construct(private WalletService $walletService) {}

    public function store(StoreDonationRequest $request): JsonResponse
    {
        $user = $request->user();

        try {
            $patient = $this->walletService->ensurePatientProfile($user);
        } catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), [], 422);
        }

        try {
            $donation = $this->walletService->donateFromWallet(
                $patient,
                (float) $request->amount,
                $user,
                $request->message,
                $request->donor_name,
            );
        } catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), [], 422);
        }

        return $this->successResponse($donation, 'Donation completed from wallet', 201);
    }
}
