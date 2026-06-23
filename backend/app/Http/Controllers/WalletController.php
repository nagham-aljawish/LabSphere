<?php

namespace App\Http\Controllers;

use App\Models\WalletTransaction;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;

class WalletController extends Controller
{
    public function __construct(private WalletService $walletService) {}

    public function show(): JsonResponse
    {
        try {
            $patient = $this->walletService->ensurePatientProfile(request()->user());
        } catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), [], 422);
        }

        $wallet = $this->walletService->getOrCreateWallet($patient);

        $transactions = WalletTransaction::with(['order', 'performer'])
            ->where('patient_wallet_id', $wallet->id)
            ->orderByDesc('created_at')
            ->limit(20)
            ->get()
            ->map(fn (WalletTransaction $transaction) => [
                'id' => $transaction->id,
                'type' => $transaction->type->value,
                'amount' => $transaction->amount,
                'balanceAfter' => $transaction->balance_after,
                'description' => $transaction->description,
                'orderNumber' => $transaction->order?->order_number,
                'performedBy' => $transaction->performer?->name,
                'date' => $transaction->created_at->format('Y-m-d H:i'),
            ]);

        return $this->successResponse([
            'balance' => $wallet->balance,
            'patientCode' => $patient->patient_code,
            'transactions' => $transactions,
        ]);
    }
}
