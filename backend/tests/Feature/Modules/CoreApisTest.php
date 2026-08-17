<?php

namespace Tests\Feature\Modules;

use App\Enums\UserRole;
use App\Models\FinancialAidRequest;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CoreApisTest extends TestCase
{
    public function test_public_tests_index_returns_200(): void
    {
        $this->makeLabTest(['name' => 'Public CBC']);

        $response = $this->getJson('/api/tests');

        $response->assertOk()
            ->assertJsonPath('success', true);
    }

    public function test_reception_can_create_patient_and_order(): void
    {
        $reception = $this->makeUser(UserRole::Reception);
        $test = $this->makeLabTest(['name' => 'Core API Test', 'price' => 40.00]);

        $patientResponse = $this->postJson('/api/reception/patients', [
            'name' => 'Reception Patient',
            'email' => 'reception-patient@test.com',
            'phone' => '0911111111',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'date_of_birth' => '1988-03-10',
            'gender' => 'male',
            'address' => 'Aleppo',
        ], $this->authHeaders($reception));

        $patientResponse->assertCreated()
            ->assertJsonPath('success', true);

        $patientId = $patientResponse->json('data.id');

        $orderResponse = $this->postJson('/api/reception/orders', [
            'patient_id' => $patientId,
            'test_ids' => [$test->id],
            'notes' => 'Core API order',
        ], $this->authHeaders($reception));

        $orderResponse->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['id', 'order_number']]);

        $dashboard = $this->getJson('/api/reception/dashboard', $this->authHeaders($reception));
        $dashboard->assertOk();
        $this->assertSame([], $dashboard->json('data.notifications'));
    }

    public function test_reception_is_notified_only_for_invoice_discounts(): void
    {
        $reception = $this->makeUser(UserRole::Reception);
        $admin = $this->makeUser(UserRole::Admin);
        $patient = $this->makePatientUser(['name' => 'Amina Discount']);
        $test = $this->makeLabTest(['name' => 'Discount CBC', 'price' => 80.00]);

        $aid = FinancialAidRequest::create([
            'user_id' => $patient->id,
            'full_name' => 'Amina Discount',
            'phone' => '0999999999',
            'reason' => 'Need support',
            'status' => 'pending',
        ]);

        Sanctum::actingAs($admin, ['*']);
        $this->patchJson("/api/admin/financial-aid/{$aid->id}/status", [
            'status' => 'approved',
            'discount_percentage' => 40,
        ])->assertOk();

        Sanctum::actingAs($reception, ['*']);

        $this->getJson('/api/reception/dashboard')
            ->assertOk()
            ->assertJsonPath('data.notifications.0.type', 'discount')
            ->assertJsonPath('data.notifications.0.title', 'Patient invoice discount')
            ->assertJsonCount(1, 'data.notifications');

        $this->postJson('/api/reception/orders', [
            'patient_id' => $patient->patient->id,
            'test_ids' => [$test->id],
        ])->assertCreated();

        $notifications = $this->getJson('/api/reception/dashboard')
            ->assertOk()
            ->json('data.notifications');

        $this->assertCount(2, $notifications);
        $this->assertTrue(collect($notifications)->every(fn ($item) => $item['type'] === 'discount'));
        $this->assertTrue(
            collect($notifications)->contains(
                fn ($item) => $item['title'] === 'Invoice discount'
            )
        );
    }

    public function test_reception_open_workflow_resumes_payment_or_qr(): void
    {
        $reception = $this->makeUser(UserRole::Reception);
        Sanctum::actingAs($reception, ['*']);
        $patient = $this->makePatientUser();
        $test = $this->makeLabTest(['name' => 'Resume CBC', 'price' => 40.00]);
        $order = $this->makeOrder($patient->patient, $reception, [], [$test]);
        $patientId = $patient->patient->id;

        $this->getJson("/api/reception/patients/{$patientId}/open-workflow")
            ->assertOk()
            ->assertJsonPath('data.nextStep', 'qr')
            ->assertJsonPath('data.order.id', $order->id);

        $this->makeSample($order, $test);

        $this->getJson("/api/reception/patients/{$patientId}/open-workflow")
            ->assertOk()
            ->assertJsonPath('data.nextStep', 'payment')
            ->assertJsonPath('data.order.id', $order->id);

        $this->payTowardOrder($order, $reception, 40.00);

        $this->getJson("/api/reception/patients/{$patientId}/open-workflow")
            ->assertOk()
            ->assertJsonPath('data.nextStep', 'qr');

        $order->update(['sent_to_technician_at' => now()]);

        $this->getJson("/api/reception/patients/{$patientId}/open-workflow")
            ->assertOk()
            ->assertJsonPath('data.nextStep', null)
            ->assertJsonPath('data.order', null);

        $partial = $this->makeOrder($patient->patient, $reception, [], [$test]);
        $this->makeSample($partial, $test);
        $this->payTowardOrder($partial, $reception, 10.00);
        $partial->update(['sent_to_technician_at' => now()]);

        $this->getJson("/api/reception/patients/{$patientId}/open-workflow")
            ->assertOk()
            ->assertJsonPath('data.nextStep', 'payment')
            ->assertJsonPath('data.order.id', $partial->id);
    }

    public function test_patient_tracking_returns_200(): void
    {
        $patient = $this->makePatientUser();
        $order = $this->makeOrder($patient->patient);
        $test = $order->tests->first();
        $sample = $this->makeSample($order, $test, [
            'label_code' => "{$order->order_number}-{$test->id}",
        ]);
        $this->makeDraftResult($order, $sample);

        $response = $this->getJson('/api/patient/tracking', $this->authHeaders($patient));

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['currentOrder', 'orders']]);
    }

    public function test_technician_orders_returns_200(): void
    {
        $technician = $this->makeUser(UserRole::Technician);
        $patient = $this->makePatientUser()->patient;
        $this->makeOrder($patient);

        $response = $this->getJson('/api/technician/orders', $this->authHeaders($technician));

        $response->assertOk()
            ->assertJsonPath('success', true);
    }

    public function test_doctor_pending_results_returns_200(): void
    {
        $doctor = $this->makeUser(UserRole::Doctor);

        $response = $this->getJson('/api/doctor/results/pending', $this->authHeaders($doctor));

        $response->assertOk()
            ->assertJsonPath('success', true);
    }

    public function test_admin_dashboard_returns_200(): void
    {
        $admin = $this->makeUser(UserRole::Admin);

        $response = $this->getJson('/api/admin/dashboard', $this->authHeaders($admin));

        $response->assertOk()
            ->assertJsonPath('success', true);
    }
}
