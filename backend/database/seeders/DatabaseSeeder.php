<?php

namespace Database\Seeders;

use App\Enums\DonationStatus;
use App\Enums\LabResultItemStatus;
use App\Enums\LabResultStatus;
use App\Enums\OrderStatus;
use App\Enums\OrderTestStatus;
use App\Enums\PaymentMethod;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\Donation;
use App\Models\LabResult;
use App\Models\Order;
use App\Models\Patient;
use App\Models\Payment;
use App\Models\Test;
use App\Models\User;
use App\Models\WalletTransaction;
use App\Services\WalletService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            TubeTypeSeeder::class,
            TestSeeder::class,
            CdssTestSeeder::class,
            DeltaCheckThresholdSeeder::class,
        ]);

        $password = Hash::make('password');

        $admin = User::updateOrCreate(
            ['email' => 'admin@labsphere.test'],
            ['name' => 'Admin User', 'password' => $password, 'role' => UserRole::Admin, 'status' => UserStatus::Active]
        );
        $admin->syncRoles(['admin']);

        $doctor = User::updateOrCreate(
            ['email' => 'doctor@labsphere.test'],
            ['name' => 'Dr. Ahmad Hassan', 'password' => $password, 'role' => UserRole::Doctor, 'status' => UserStatus::Active]
        );
        $doctor->syncRoles(['doctor']);

        $technician = User::updateOrCreate(
            ['email' => 'technician@labsphere.test'],
            ['name' => 'Lab Technician', 'password' => $password, 'role' => UserRole::Technician, 'status' => UserStatus::Active]
        );
        $technician->syncRoles(['technician']);

        $reception = User::updateOrCreate(
            ['email' => 'reception@labsphere.test'],
            ['name' => 'Reception Staff', 'password' => $password, 'role' => UserRole::Reception, 'status' => UserStatus::Active]
        );
        $reception->syncRoles(['reception']);

        $patientUser = User::updateOrCreate(
            ['email' => 'patient@labsphere.test'],
            ['name' => 'Demo Patient', 'password' => $password, 'role' => UserRole::Patient, 'status' => UserStatus::Active]
        );
        $patientUser->syncRoles(['patient']);

        $patient = Patient::updateOrCreate(
            ['patient_code' => 'PAT-32045'],
            [
                'user_id' => $patientUser->id,
                'date_of_birth' => '1990-05-15',
                'gender' => 'male',
                'address' => 'Damascus, Syria',
            ]
        );

        $order = Order::updateOrCreate(
            ['order_number' => 'ORD-10453'],
            [
                'patient_id' => $patient->id,
                'created_by' => $reception->id,
                'status' => OrderStatus::Completed,
                'total_amount' => 37.00,
                'notes' => 'Demo order for blood tests',
            ]
        );

        $order->orderTests()->delete();

        foreach (['Glucose', 'Hemoglobin', 'Potassium'] as $testName) {
            $test = Test::where('name', $testName)->firstOrFail();
            $order->orderTests()->create([
                'test_id' => $test->id,
                'price' => $test->price,
                'status' => OrderTestStatus::Completed,
            ]);
        }

        $labResult = LabResult::updateOrCreate(
            ['order_id' => $order->id, 'report_name' => 'Blood Test Report'],
            [
                'status' => LabResultStatus::Approved,
                'reviewed_by' => $doctor->id,
                'approved_at' => '2026-04-20 10:00:00',
            ]
        );

        $labResult->items()->delete();

        $unpaidOrder = Order::updateOrCreate(
            ['order_number' => 'ORD-10457'],
            [
                'patient_id' => $patient->id,
                'created_by' => $reception->id,
                'status' => OrderStatus::Processing,
                'total_amount' => 65.00,
                'notes' => 'Unpaid liver function test and CBC order',
            ]
        );

        $unpaidOrder->orderTests()->delete();

        foreach (['Liver Function Test', 'Complete Blood Count'] as $testName) {
            $test = Test::where('name', $testName)->firstOrFail();
            $unpaidOrder->orderTests()->create([
                'test_id' => $test->id,
                'price' => $test->price,
                'status' => OrderTestStatus::Pending,
            ]);
        }

        Payment::whereIn('order_id', [$order->id, $unpaidOrder->id])->delete();

        $walletService = app(WalletService::class);

        $fundSummary = $walletService->getDonationFundSummary();
        $demoTopUpAmount = 100.00;
        $available = (float) $fundSummary['availableBalance'];
        if ($available < $demoTopUpAmount) {
            Donation::create([
                'donor_name' => 'LabSphere Seed Donor',
                'email' => 'donor@labsphere.test',
                'phone' => null,
                'amount' => round(($demoTopUpAmount - $available) + 50, 2),
                'method' => PaymentMethod::Cash,
                'status' => DonationStatus::Confirmed,
                'message' => 'Seed donation fund so demo patient wallet top-up can run.',
            ]);
        }

        $wallet = $walletService->getOrCreateWallet($patient);
        WalletTransaction::where('patient_wallet_id', $wallet->id)->delete();
        $wallet->update(['balance' => 0]);
        $walletService->topUp($patient, $demoTopUpAmount, $admin, 'Demo wallet balance');

        $labResult->items()->createMany([
            [
                'test_name' => 'Glucose',
                'test_code' => 'LOINC:2339-0',
                'result_value' => '135',
                'unit' => 'mg/dL',
                'normal_range' => '70-100 mg/dL',
                'status' => LabResultItemStatus::High,
            ],
            [
                'test_name' => 'Hemoglobin',
                'test_code' => 'LOINC:718-7',
                'result_value' => '10.2',
                'unit' => 'g/dL',
                'normal_range' => '12-16 g/dL',
                'status' => LabResultItemStatus::Low,
            ],
            [
                'test_name' => 'Potassium',
                'test_code' => 'LOINC:2823-3',
                'result_value' => '7.1',
                'unit' => 'mmol/L',
                'normal_range' => '3.5-5.1 mmol/L',
                'status' => LabResultItemStatus::Critical,
            ],
        ]);
    }
}
