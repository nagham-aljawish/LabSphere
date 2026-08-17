<?php

namespace Tests\Feature\Security;

use App\Enums\LabResultStatus;
use App\Enums\OrderSampleStatus;
use App\Enums\UserRole;
use Tests\TestCase;

class SecurityApiTest extends TestCase
{
    public function test_unauthenticated_reception_orders_returns_401(): void
    {
        $this->getJson('/api/reception/orders')->assertUnauthorized();
    }

    public function test_invalid_token_returns_401(): void
    {
        $this->getJson('/api/reception/orders', [
            'Authorization' => 'Bearer not-a-real-token',
        ])->assertUnauthorized();
    }

    public function test_patient_cannot_view_other_patients_approved_result(): void
    {
        $patientA = $this->makePatientUser(['email' => 'patient-a@test.com']);
        $patientB = $this->makePatientUser(['email' => 'patient-b@test.com']);

        $order = $this->makeOrder($patientB->patient);
        $sample = $this->makeSample($order, $order->tests->first());
        $result = $this->makeDraftResult($order, $sample);
        $result->update([
            'status' => LabResultStatus::Approved,
            'approved_at' => now(),
        ]);
        $sample->update(['status' => OrderSampleStatus::Approved]);

        $this->getJson(
            "/api/patient/results/{$result->id}",
            $this->authHeaders($patientA)
        )->assertNotFound()
            ->assertJsonPath('success', false);
    }

    public function test_wrong_role_returns_403(): void
    {
        $patient = $this->makePatientUser();

        $this->getJson('/api/admin/dashboard', $this->authHeaders($patient))
            ->assertForbidden()
            ->assertJsonPath('success', false);
    }

    public function test_me_response_does_not_expose_password(): void
    {
        $user = $this->makeUser(UserRole::Doctor);

        $response = $this->getJson('/api/auth/me', $this->authHeaders($user));

        $response->assertOk();
        $payload = json_encode($response->json());
        $this->assertIsString($payload);
        $this->assertStringNotContainsString('password123', $payload);
        $this->assertArrayNotHasKey('password', $response->json('data'));
    }

    public function test_expired_token_returns_401(): void
    {
        $user = $this->makeUser(UserRole::Doctor);
        $newToken = $user->createToken('test-token', ['*'], now()->subMinute());
        $newToken->accessToken->forceFill([
            'created_at' => now()->subHours(9),
            'last_used_at' => now()->subHours(9),
            'expires_at' => now()->subMinute(),
        ])->save();

        $this->getJson('/api/auth/me', [
            'Authorization' => 'Bearer '.$newToken->plainTextToken,
        ])->assertUnauthorized();
    }

    public function test_idle_token_is_revoked_and_returns_401(): void
    {
        config([
            'sanctum.idle_timeout' => 15,
            'sanctum.expiration' => 480,
        ]);

        $user = $this->makeUser(UserRole::Doctor);
        $newToken = $user->createToken('test-token', ['*'], now()->addHours(8));
        $newToken->accessToken->forceFill([
            'created_at' => now()->subMinutes(20),
            'last_used_at' => now()->subMinutes(16),
        ])->save();

        $this->getJson('/api/auth/me', [
            'Authorization' => 'Bearer '.$newToken->plainTextToken,
        ])->assertUnauthorized();

        $this->assertSame(0, $user->fresh()->tokens()->count());
    }

    public function test_active_session_within_idle_window_returns_200(): void
    {
        config([
            'sanctum.idle_timeout' => 15,
            'sanctum.expiration' => 480,
        ]);

        $user = $this->makeUser(UserRole::Doctor);
        $newToken = $user->createToken('test-token', ['*'], now()->addHours(8));
        $newToken->accessToken->forceFill([
            'created_at' => now()->subMinutes(10),
            'last_used_at' => now()->subMinutes(5),
        ])->save();

        $this->getJson('/api/auth/me', [
            'Authorization' => 'Bearer '.$newToken->plainTextToken,
        ])->assertOk()
            ->assertJsonPath('success', true);
    }
}
