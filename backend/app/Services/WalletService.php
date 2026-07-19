<?php

namespace App\Services;

use App\Enums\DonationStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Enums\WalletTransactionType;
use App\Models\Donation;
use App\Models\Order;
use App\Models\Patient;
use App\Models\PatientWallet;
use App\Models\Payment;
use App\Models\User;
use App\Models\WalletTransaction;
use App\Services\CodeGenerator;
use App\Services\FinancialAidService;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class WalletService
{
    public function __construct(private FinancialAidService $financialAidService) {}

    public function getDonationFundSummary(): array
    {
        return $this->calculateDonationFundSummary();
    }

    public function getDonationFundActivity(int $limit = 20): array
    {
        $donations = Donation::query()
            ->where('status', DonationStatus::Confirmed)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(fn (Donation $donation) => [
                'id' => "donation-{$donation->id}",
                'type' => 'donation_in',
                'amount' => $this->formatMoney((string) $donation->amount),
                'patientName' => null,
                'performedBy' => $donation->donor_name ?: 'Unknown donor',
                'description' => $donation->message ?: 'Donation received',
                'date' => $donation->created_at?->format('Y-m-d H:i'),
                'timestamp' => $donation->created_at?->timestamp ?? 0,
            ]);

        $distributed = WalletTransaction::query()
            ->with(['wallet.patient.user', 'performer'])
            ->where('type', WalletTransactionType::TopUp)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(fn (WalletTransaction $tx) => [
                'id' => "topup-{$tx->id}",
                'type' => 'distribution_out',
                'amount' => $this->formatMoney((string) $tx->amount),
                'patientName' => $tx->wallet?->patient?->user?->name,
                'performedBy' => $tx->performer?->name ?: 'Admin',
                'description' => $tx->description ?: 'Wallet top-up from donation fund',
                'date' => $tx->created_at?->format('Y-m-d H:i'),
                'timestamp' => $tx->created_at?->timestamp ?? 0,
            ]);

        return $donations
            ->concat($distributed)
            ->sortByDesc('timestamp')
            ->take($limit)
            ->map(fn (array $item) => [
                'id' => $item['id'],
                'type' => $item['type'],
                'amount' => $item['amount'],
                'patientName' => $item['patientName'],
                'performedBy' => $item['performedBy'],
                'description' => $item['description'],
                'date' => $item['date'],
            ])
            ->values()
            ->all();
    }

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
            $fundSummary = $this->calculateDonationFundSummary(true);
            if (bccomp($fundSummary['availableBalance'], (string) $amount, 2) < 0) {
                throw new RuntimeException(
                    "Insufficient admin donation balance. Available: {$fundSummary['availableBalance']}"
                );
            }

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
        ?string $notes = null,
        ?User $performedBy = null
    ): Payment {
        return DB::transaction(function () use ($patient, $amount, $user, $order, $notes, $performedBy) {
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

            if ($order) {
                $discountPercentage = $this->financialAidService->getDiscountForOrder($order);

                if (bccomp((string) $amount, (string) $order->remainingAmount($discountPercentage), 2) > 0) {
                    throw new RuntimeException('Amount exceeds the remaining order balance');
                }
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
                'performed_by' => ($performedBy ?? $user)->id,
                'order_id' => $order?->id,
                'payment_id' => $payment->id,
            ]);

            return $payment->load('order');
        });
    }

    public function donateFromWallet(
        Patient $patient,
        float $amount,
        User $user,
        ?string $message = null,
        ?string $donorName = null,
    ): Donation {
        return DB::transaction(function () use ($patient, $amount, $user, $message, $donorName) {
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

            $wallet->balance = bcsub((string) $wallet->balance, (string) $amount, 2);
            $wallet->save();

            $donation = Donation::create([
                'donor_name' => $donorName ?? $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'amount' => $amount,
                'method' => PaymentMethod::Wallet,
                'status' => DonationStatus::Confirmed,
                'message' => $message ?? 'Donation via LabSphere wallet',
            ]);

            WalletTransaction::create([
                'patient_wallet_id' => $wallet->id,
                'type' => WalletTransactionType::Payment,
                'amount' => $amount,
                'balance_after' => $wallet->balance,
                'description' => $message ?? 'Donation via LabSphere wallet',
                'performed_by' => $user->id,
            ]);

            return $donation;
        });
    }

    public function recordReceptionPayment(
    Patient $patient,
    float $amount,
    User $staff,
    Order $order,
    PaymentMethod $method,
    ?string $notes = null,
    ?string $transactionReference = null,
): Payment {
    if ($order->patient_id !== $patient->id) {
        throw new RuntimeException('Order does not belong to this patient');
    }

    $discountPercentage = $this->financialAidService->getDiscountForOrder($order);

    if ($order->isFullyPaid($discountPercentage)) {
        throw new RuntimeException('This order has already been paid');
    }

    if ($amount <= 0) {
        throw new RuntimeException('Amount must be greater than zero');
    }

    if (
        bccomp(
            (string) $amount,
            (string) $order->remainingAmount($discountPercentage),
            2
        ) > 0
    ) {
        throw new RuntimeException('Amount exceeds the remaining order balance');
    }

    if ($method === PaymentMethod::Wallet) {
        if (! $patient->user) {
            throw new RuntimeException('Patient user account not found');
        }

        return $this->payFromWallet(
            $patient,
            $amount,
            $patient->user,
            $order,
            $notes,
            $staff
        );
    }

    return DB::transaction(function () use (
        $patient,
        $amount,
        $order,
        $method,
        $notes,
        $transactionReference
    ) {
        return Payment::create([
            'user_id' => $patient->user_id,
            'order_id' => $order->id,
            'amount' => $amount,
            'method' => $method,
            'status' => PaymentStatus::Paid,
            'transaction_reference' => $transactionReference
                ?? strtoupper($method->value) . '-' . now()->format('YmdHis'),
            'notes' => $notes
                ?? "Payment recorded by reception ({$method->value})",
        ]);
    });
}

    private function calculateDonationFundSummary(bool $lockForUpdate = false): array
    {
        $donationQuery = Donation::query()
            ->where('status', DonationStatus::Confirmed);
        $distributionQuery = WalletTransaction::query()
            ->where('type', WalletTransactionType::TopUp);

        if ($lockForUpdate) {
            $donationQuery->lockForUpdate();
            $distributionQuery->lockForUpdate();
        }

        $totalDonations = $this->formatMoney((string) $donationQuery->sum('amount'));
        $totalDistributed = $this->formatMoney((string) $distributionQuery->sum('amount'));
        $rawAvailableBalance = bcsub($totalDonations, $totalDistributed, 2);
        $availableBalance = $this->formatMoney(
            bccomp($rawAvailableBalance, '0', 2) < 0 ? '0' : $rawAvailableBalance
        );

        return [
            'totalDonations' => $totalDonations,
            'totalDistributed' => $totalDistributed,
            'availableBalance' => $availableBalance,
        ];
    }

    private function formatMoney(string $value): string
    {
        return number_format((float) $value, 2, '.', '');
    }
}