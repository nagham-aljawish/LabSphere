<?php

namespace Tests\Feature\Authorization;

use App\Enums\LabResultStatus;
use App\Enums\UserRole;
use Tests\TestCase;

class RoleMiddlewareTest extends TestCase
{
    public function test_patient_cannot_post_admin_tests(): void
    {
        $patient = $this->makePatientUser();

        $response = $this->postJson('/api/admin/tests', [
            'name' => 'Forbidden Test',
            'price' => 10,
        ], $this->authHeaders($patient));

        $response->assertForbidden()
            ->assertJsonPath('success', false);
    }

    public function test_reception_cannot_patch_doctor_approve(): void
    {
        $reception = $this->makeUser(UserRole::Reception);
        $patient = $this->makePatientUser()->patient;
        $order = $this->makeOrder($patient);
        $result = $this->makeDraftResult($order);
        $result->update(['status' => LabResultStatus::PendingReview]);

        $response = $this->patchJson(
            "/api/doctor/results/{$result->id}/approve",
            [],
            $this->authHeaders($reception)
        );

        $response->assertForbidden()
            ->assertJsonPath('success', false);
    }

    public function test_technician_cannot_post_reception_orders(): void
    {
        $technician = $this->makeUser(UserRole::Technician);
        $patient = $this->makePatientUser()->patient;
        $test = $this->makeLabTest();

        $response = $this->postJson('/api/reception/orders', [
            'patient_id' => $patient->id,
            'test_ids' => [$test->id],
        ], $this->authHeaders($technician));

        $response->assertForbidden()
            ->assertJsonPath('success', false);
    }

    public function test_doctor_cannot_post_technician_results(): void
    {
        $doctor = $this->makeUser(UserRole::Doctor);
        $patient = $this->makePatientUser()->patient;
        $order = $this->makeOrder($patient);

        $response = $this->postJson('/api/technician/results', [
            'order_id' => $order->id,
            'report_name' => 'Report',
            'items' => [[
                'test_name' => 'Hemoglobin',
                'result_value' => '13.5',
                'status' => 'normal',
            ]],
        ], $this->authHeaders($doctor));

        $response->assertForbidden()
            ->assertJsonPath('success', false);
    }

    public function test_admin_bypasses_doctor_dashboard(): void
    {
        $admin = $this->makeUser(UserRole::Admin);

        $response = $this->getJson('/api/doctor/dashboard', $this->authHeaders($admin));

        $response->assertOk()
            ->assertJsonPath('success', true);
    }

    public function test_admin_bypasses_technician_dashboard(): void
    {
        $admin = $this->makeUser(UserRole::Admin);

        $response = $this->getJson('/api/technician/dashboard', $this->authHeaders($admin));

        $response->assertOk()
            ->assertJsonPath('success', true);
    }

    public function test_protected_route_without_token_returns_401(): void
    {
        $response = $this->getJson('/api/reception/orders');

        $response->assertUnauthorized();
    }
}
