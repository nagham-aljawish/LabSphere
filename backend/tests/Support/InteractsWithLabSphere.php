<?php

namespace Tests\Support;

use App\Enums\Gender;
use App\Enums\LabResultStatus;
use App\Enums\OrderSampleStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\LabResult;
use App\Models\LabResultItem;
use App\Models\Order;
use App\Models\OrderSample;
use App\Models\Patient;
use App\Models\PatientWallet;
use App\Models\Payment;
use App\Models\Test;
use App\Models\TubeType;
use App\Models\User;
use App\Services\CodeGenerator;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Support\Facades\Hash;

trait InteractsWithLabSphere
{
    protected function seedRolesAndTubeTypes(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);

        TubeType::query()->firstOrCreate(
            ['name' => 'EDTA'],
            [
                'color_class' => 'bg-purple-500',
                'hex_color' => '#A855F7',
                'color_label' => 'Purple',
                'additive' => 'EDTA',
                'use_for' => 'Hematology',
                'sort_order' => 1,
                'is_active' => true,
            ]
        );

        TubeType::query()->firstOrCreate(
            ['name' => 'SST'],
            [
                'color_class' => 'bg-yellow-500',
                'hex_color' => '#F4B000',
                'color_label' => 'Gold',
                'additive' => 'Clot activator',
                'use_for' => 'Chemistry',
                'sort_order' => 2,
                'is_active' => true,
            ]
        );
    }

    protected function makeUser(UserRole $role, UserStatus $status = UserStatus::Active, array $overrides = []): User
    {
        $user = User::factory()->create(array_merge([
            'role' => $role,
            'status' => $status,
            'password' => Hash::make('password123'),
        ], $overrides));

        $user->assignRole($role->value);
        $user->syncSpatieRoleFromColumn();

        return $user->fresh();
    }

    protected function makePatientUser(array $userOverrides = [], array $patientOverrides = []): User
    {
        $user = $this->makeUser(UserRole::Patient, UserStatus::Active, $userOverrides);

        $patient = Patient::create(array_merge([
            'user_id' => $user->id,
            'patient_code' => CodeGenerator::patientCode(),
            'date_of_birth' => '1995-01-15',
            'gender' => Gender::Female,
            'address' => 'Damascus',
        ], $patientOverrides));

        PatientWallet::create([
            'patient_id' => $patient->id,
            'balance' => 0,
        ]);

        return $user->fresh()->load('patient.wallet');
    }

    protected function tokenFor(User $user): string
    {
        return $user->createToken('test-token')->plainTextToken;
    }

    protected function authHeaders(User $user): array
    {
        return ['Authorization' => 'Bearer '.$this->tokenFor($user)];
    }

    protected function makeLabTest(array $overrides = []): Test
    {
        return Test::create(array_merge([
            'name' => 'Hemoglobin',
            'code' => 'LOINC:718-7',
            'category' => 'Hematology',
            'sample_type' => 'Blood',
            'price' => 25.00,
            'is_active' => true,
        ], $overrides));
    }

    protected function makeOrder(
        Patient $patient,
        ?User $createdBy = null,
        array $overrides = [],
        array $tests = []
    ): Order {
        $order = Order::create(array_merge([
            'order_number' => CodeGenerator::orderNumber(),
            'patient_id' => $patient->id,
            'created_by' => $createdBy?->id,
            'status' => OrderStatus::Pending,
            'total_amount' => 25.00,
        ], $overrides));

        $tests = $tests !== [] ? $tests : [$this->makeLabTest()];

        $total = 0;
        foreach ($tests as $test) {
            $order->orderTests()->create([
                'test_id' => $test->id,
                'price' => $test->price,
                'status' => 'pending',
            ]);
            $total += (float) $test->price;
        }

        $order->update(['total_amount' => $total]);

        return $order->fresh(['tests', 'orderSamples', 'payments']);
    }

    protected function makeSample(
        Order $order,
        Test $test,
        array $overrides = []
    ): OrderSample {
        return OrderSample::create(array_merge([
            'order_id' => $order->id,
            'test_id' => $test->id,
            'tube_type' => 'EDTA',
            'quantity' => 1,
            'label_code' => "{$order->order_number}-{$test->id}",
            'status' => OrderSampleStatus::Pending,
        ], $overrides));
    }

    protected function payTowardOrder(Order $order, User $payer, float $amount): Payment
    {
        return Payment::create([
            'order_id' => $order->id,
            'user_id' => $payer->id,
            'amount' => $amount,
            'method' => PaymentMethod::Cash,
            'status' => PaymentStatus::Paid,
            'notes' => 'test payment',
        ]);
    }

    protected function makeDraftResult(Order $order, ?OrderSample $sample = null): LabResult
    {
        $result = LabResult::create([
            'order_id' => $order->id,
            'order_sample_id' => $sample?->id,
            'report_name' => 'Laboratory Report',
            'status' => LabResultStatus::Draft,
            'is_cdss' => false,
        ]);

        LabResultItem::create([
            'lab_result_id' => $result->id,
            'test_name' => 'Hemoglobin',
            'test_code' => 'LOINC:718-7',
            'result_value' => '13.5',
            'unit' => 'g/dL',
            'normal_range' => '12 - 16',
            'status' => 'normal',
        ]);

        return $result->fresh('items');
    }
}
