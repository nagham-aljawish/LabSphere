<?php

namespace App\Http\Controllers\Reception;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;

class ReceptionWalletController extends Controller
{
    public function __construct(private WalletService $walletService) {}

    public function show(Patient $patient): JsonResponse
    {
        $wallet = $this->walletService->getOrCreateWallet($patient);

        return $this->successResponse([
            'balance' => $wallet->balance,
            'patientCode' => $patient->patient_code,
            'transactions' => $wallet->transactions()
                ->with(['order', 'performer'])
                ->orderByDesc('created_at')
                ->limit(20)
                ->get()
                ->map(fn ($transaction) => [
                    'id' => $transaction->id,
                    'type' => $transaction->type->value,
                    'amount' => $transaction->amount,
                    'balanceAfter' => $transaction->balance_after,
                    'description' => $transaction->description,
                    'orderNumber' => $transaction->order?->order_number,
                    'performedBy' => $transaction->performer?->name,
                    'date' => $transaction->created_at->format('Y-m-d H:i'),
                ]),
        ]);
    }
}
