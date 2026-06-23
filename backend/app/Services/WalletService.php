<?php

namespace App\Services;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Enums\WalletTransactionType;
use App\Models\Order;
use App\Models\Patient;
use App\Models\PatientWallet;
use App\Models\Payment;
use App\Models\User;
use App\Models\WalletTransaction;
use App\Services\CodeGenerator;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class WalletService
{
    public function ensurePatientProfile(User $user): Patient
    {
        if ($user->role !== UserRole::Patient) {
            throw new RuntimeException('User is not a patient');
        }

        $patient = $user->patient;

        if (! $patient) {
            $patient = $user->patient()->create([
                'patient_code' => CodeGenerator::patientCode(),
            ]);
        }

        $this->getOrCreateWallet($patient);

        return $patient->fresh();
    }

    public function getOrCreateWallet(Patient $patient): PatientWallet
    {
        return PatientWallet::firstOrCreate(
            ['patient_id' => $patient->id],
            ['balance' => 0]
        );
    }

    public function topUp(
        Patient $patient,
        float $amount,
        User $admin,
        ?string $notes = null
    ): PatientWallet {
        return DB::transaction(function () use ($patient, $amount, $admin, $notes) {
            $wallet = PatientWallet::where('patient_id', $patient->id)->lockForUpdate()->first();

            if (! $wallet) {
                $wallet = PatientWallet::create([
                    'patient_id' => $patient->id,
                    'balance' => 0,
                ]);
            }

            $wallet->balance = bcadd((string) $wallet->balance, (string) $amount, 2);
            $wallet->save();

            WalletTransaction::create([
                'patient_wallet_id' => $wallet->id,
                'type' => WalletTransactionType::TopUp,
                'amount' => $amount,
                'balance_after' => $wallet->balance,
                'description' => $notes ?? 'Wallet top-up by admin',
                'performed_by' => $admin->id,
            ]);

            return $wallet->fresh(['patient.user']);
        });
    }

    public function payFromWallet(
        Patient $patient,
        float $amount,
        User $user,
        ?Order $order = null,
        ?string $notes = null
    ): Payment {
        return DB::transaction(function () use ($patient, $amount, $user, $order, $notes) {
            $wallet = PatientWallet::where('patient_id', $patient->id)->lockForUpdate()->first();

            if (! $wallet) {
                throw new RuntimeException('Wallet not found');
            }

            if ($amount <= 0) {
                throw new RuntimeException('Amount must be greater than zero');
            }

            if (bccomp((string) $wallet->balance, (string) $amount, 2) < 0) {
                throw new RuntimeException('Insufficient wallet balance');
            }

            if ($order && bccomp((string) $amount, (string) $order->remainingAmount(), 2) > 0) {
                throw new RuntimeException('Amount exceeds the remaining order balance');
            }

            $wallet->balance = bcsub((string) $wallet->balance, (string) $amount, 2);
            $wallet->save();

            $description = $order
                ? "Payment for order {$order->order_number}"
                : 'Wallet payment';

            $payment = Payment::create([
                'user_id' => $user->id,
                'order_id' => $order?->id,
                'amount' => $amount,
                'method' => PaymentMethod::Wallet,
                'status' => PaymentStatus::Paid,
                'transaction_reference' => 'WALLET-'.now()->format('YmdHis'),
                'notes' => $notes ?? 'Paid from patient wallet',
            ]);

            WalletTransaction::create([
                'patient_wallet_id' => $wallet->id,
                'type' => WalletTransactionType::Payment,
                'amount' => $amount,
                'balance_after' => $wallet->balance,
                'description' => $description,
                'performed_by' => $user->id,
                'order_id' => $order?->id,
                'payment_id' => $payment->id,
            ]);

            return $payment->load('order');
        });
    }
}
