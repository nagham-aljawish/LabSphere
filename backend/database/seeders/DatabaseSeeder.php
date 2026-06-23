<?php

namespace Database\Seeders;

use App\Enums\LabResultItemStatus;
use App\Enums\LabResultStatus;
use App\Enums\OrderStatus;
use App\Enums\OrderTestStatus;
use App\Enums\UserRole;
use App\Enums\UserStatus;
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
        $password = Hash::make('password');

        $admin = User::updateOrCreate(
            ['email' => 'admin@labsphere.test'],
            ['name' => 'Admin User', 'password' => $password, 'role' => UserRole::Admin, 'status' => UserStatus::Active]
        );

        $doctor = User::updateOrCreate(
            ['email' => 'doctor@labsphere.test'],
            ['name' => 'Dr. Ahmad Hassan', 'password' => $password, 'role' => UserRole::Doctor, 'status' => UserStatus::Active]
        );

        $technician = User::updateOrCreate(
            ['email' => 'technician@labsphere.test'],
            ['name' => 'Lab Technician', 'password' => $password, 'role' => UserRole::Technician, 'status' => UserStatus::Active]
        );

        $reception = User::updateOrCreate(
            ['email' => 'reception@labsphere.test'],
            ['name' => 'Reception Staff', 'password' => $password, 'role' => UserRole::Reception, 'status' => UserStatus::Active]
        );

        $patientUser = User::updateOrCreate(
            ['email' => 'patient@labsphere.test'],
            ['name' => 'Demo Patient', 'password' => $password, 'role' => UserRole::Patient, 'status' => UserStatus::Active]
        );

        $patient = Patient::updateOrCreate(
            ['patient_code' => 'PAT-32045'],
            [
                'user_id' => $patientUser->id,
                'date_of_birth' => '1990-05-15',
                'gender' => 'male',
                'address' => 'Damascus, Syria',
            ]
        );

        $testDefinitions = [
            ['name' => 'Complete Blood Count', 'code' => 'CBC', 'category' => 'Hematology', 'price' => 25.00],
            ['name' => 'Glucose', 'code' => 'LOINC:23390-0', 'category' => 'Chemistry', 'price' => 15.00],
            ['name' => 'Hemoglobin', 'code' => 'HGB', 'category' => 'Hematology', 'price' => 10.00],
            ['name' => 'Potassium', 'code' => 'K', 'category' => 'Chemistry', 'price' => 12.00],
            ['name' => 'Liver Panel', 'code' => 'LFT', 'category' => 'Chemistry', 'price' => 35.00],
            ['name' => 'COVID-19 PCR', 'code' => 'COVID-PCR', 'category' => 'Microbiology', 'price' => 50.00],
        ];

        $createdTests = collect();
        foreach ($testDefinitions as $testData) {
            $createdTests->push(Test::updateOrCreate(
                ['code' => $testData['code']],
                [...$testData, 'sample_type' => 'Blood', 'is_active' => true]
            ));
        }

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
            $test = $createdTests->firstWhere('name', $testName);
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
                'total_amount' => 60.00,
                'notes' => 'Unpaid liver panel and CBC order',
            ]
        );

        $unpaidOrder->orderTests()->delete();

        foreach (['Liver Panel', 'Complete Blood Count'] as $testName) {
            $test = $createdTests->firstWhere('name', $testName);
            $unpaidOrder->orderTests()->create([
                'test_id' => $test->id,
                'price' => $test->price,
                'status' => OrderTestStatus::Pending,
            ]);
        }

        Payment::whereIn('order_id', [$order->id, $unpaidOrder->id])->delete();

        $wallet = app(WalletService::class)->getOrCreateWallet($patient);
        WalletTransaction::where('patient_wallet_id', $wallet->id)->delete();
        $wallet->update(['balance' => 0]);
        app(WalletService::class)->topUp($patient, 100.00, $admin, 'Demo wallet balance');

        $labResult->items()->createMany([
            [
                'test_name' => 'Glucose',
                'test_code' => 'LOINC:23390-0',
                'result_value' => '135',
                'unit' => 'mg/dL',
                'normal_range' => '70-100 mg/dL',
                'status' => LabResultItemStatus::High,
            ],
            [
                'test_name' => 'Hemoglobin',
                'test_code' => 'HGB',
                'result_value' => '10.2',
                'unit' => 'g/dL',
                'normal_range' => '12-16 g/dL',
                'status' => LabResultItemStatus::Low,
            ],
            [
                'test_name' => 'Potassium',
                'test_code' => 'K',
                'result_value' => '7.1',
                'unit' => 'mmol/L',
                'normal_range' => '3.5-5.1 mmol/L',
                'status' => LabResultItemStatus::Critical,
            ],
        ]);
    }
}
