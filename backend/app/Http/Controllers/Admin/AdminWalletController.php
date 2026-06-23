<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TopUpWalletRequest;
use App\Models\Patient;
use App\Models\PatientWallet;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class AdminWalletController extends Controller
{
    public function __construct(private WalletService $walletService) {}

    public function index(): JsonResponse
    {
        $wallets = PatientWallet::with(['patient.user'])
            ->orderByDesc('updated_at')
            ->paginate(20)
            ->through(fn (PatientWallet $wallet) => [
                'patientId' => $wallet->patient_id,
                'patientCode' => $wallet->patient->patient_code,
                'patientName' => $wallet->patient->user->name,
                'email' => $wallet->patient->user->email,
                'balance' => $wallet->balance,
                'updatedAt' => $wallet->updated_at->format('Y-m-d H:i'),
            ]);

        return $this->successResponse($wallets);
    }

    public function show(Patient $patient): JsonResponse
    {
        $wallet = $this->walletService->getOrCreateWallet($patient);
        $wallet->load(['patient.user', 'transactions.order', 'transactions.performer']);

        return $this->successResponse([
            'patientId' => $patient->id,
            'patientCode' => $patient->patient_code,
            'patientName' => $patient->user->name,
            'balance' => $wallet->balance,
            'transactions' => $wallet->transactions()
                ->with(['order', 'performer'])
                ->orderByDesc('created_at')
                ->limit(50)
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

    public function topUp(TopUpWalletRequest $request, Patient $patient): JsonResponse
    {
        try {
            $wallet = $this->walletService->topUp(
                $patient,
                (float) $request->amount,
                $request->user(),
                $request->notes
            );
        } catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), [], 422);
        }

        return $this->successResponse([
            'patientId' => $patient->id,
            'patientCode' => $patient->patient_code,
            'patientName' => $wallet->patient->user->name,
            'balance' => $wallet->balance,
        ], 'Wallet topped up successfully', 201);
    }
}
