<?php

namespace App\Console\Commands;

use App\Enums\OrderStatus;
use App\Enums\OrderTestStatus;
use App\Enums\UserRole;
use App\Models\Order;
use App\Models\Test;
use App\Models\User;
use App\Services\CodeGenerator;
use App\Services\WalletService;
use Illuminate\Console\Command;

class ProvisionPatientAccounts extends Command
{
    protected $signature = 'patients:provision {--user= : Specific user ID to provision}';

    protected $description = 'Create missing patient profiles, wallets, and sample unpaid orders';

    public function handle(WalletService $walletService): int
    {
        $query = User::query()->where('role', UserRole::Patient);

        if ($userId = $this->option('user')) {
            $query->where('id', $userId);
        }

        $users = $query->get();

        if ($users->isEmpty()) {
            $this->warn('No patient users found.');

            return self::FAILURE;
        }

        $reception = User::where('role', UserRole::Reception)->first();
        $sampleTest = Test::where('is_active', true)->first();

        foreach ($users as $user) {
            $patient = $walletService->ensurePatientProfile($user);
            $wallet = $walletService->getOrCreateWallet($patient);

            $this->info("User #{$user->id} ({$user->email}) → {$patient->patient_code}, balance: {$wallet->balance}");

            $hasUnpaidOrder = Order::where('patient_id', $patient->id)
                ->whereDoesntHave('payments', fn ($q) => $q->where('status', 'paid'))
                ->exists();

            if (! $hasUnpaidOrder && $reception && $sampleTest) {
                $order = Order::create([
                    'order_number' => CodeGenerator::orderNumber(),
                    'patient_id' => $patient->id,
                    'created_by' => $reception->id,
                    'status' => OrderStatus::Processing,
                    'total_amount' => $sampleTest->price,
                    'notes' => 'Auto-created unpaid order for payment testing',
                ]);

                $order->orderTests()->create([
                    'test_id' => $sampleTest->id,
                    'price' => $sampleTest->price,
                    'status' => OrderTestStatus::Pending,
                ]);

                $this->line("  Created unpaid order {$order->order_number} (\${$sampleTest->price})");
            }
        }

        $this->info('Done.');

        return self::SUCCESS;
    }
}
