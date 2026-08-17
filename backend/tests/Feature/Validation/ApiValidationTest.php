<?php

namespace Tests\Feature\Validation;

use App\Enums\UserRole;
use Tests\TestCase;

class ApiValidationTest extends TestCase
{
    public function test_login_missing_email_returns_422(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'password' => 'password123',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_register_invalid_email_returns_422(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Bad Email User',
            'email' => 'not-an-email',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_reception_order_missing_test_ids_returns_422(): void
    {
        $reception = $this->makeUser(UserRole::Reception);
        $patient = $this->makePatientUser()->patient;

        $response = $this->postJson('/api/reception/orders', [
            'patient_id' => $patient->id,
        ], $this->authHeaders($reception));

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['test_ids']);
    }

    public function test_store_result_missing_items_returns_422(): void
    {
        $technician = $this->makeUser(UserRole::Technician);
        $patient = $this->makePatientUser()->patient;
        $order = $this->makeOrder($patient);

        $response = $this->postJson('/api/technician/results', [
            'order_id' => $order->id,
            'report_name' => 'Incomplete Report',
        ], $this->authHeaders($technician));

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['items']);
    }

    public function test_contact_missing_message_returns_422(): void
    {
        $response = $this->postJson('/api/contact', [
            'name' => 'Visitor',
            'email' => 'visitor@test.com',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['message']);
    }
}
