<?php

namespace Tests\Feature\Auth;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\Patient;
use App\Models\PatientWallet;
use App\Models\User;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    public function test_login_success_returns_token_and_user(): void
    {
        $user = $this->makeUser(UserRole::Doctor, UserStatus::Active, [
            'email' => 'doctor@test.com',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'doctor@test.com',
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.email', 'doctor@test.com')
            ->assertJsonPath('data.session.idle_timeout_minutes', 15)
            ->assertJsonPath('data.session.lifetime_minutes', 480)
            ->assertJsonStructure(['data' => ['token', 'user', 'session']]);
    }

    public function test_login_with_wrong_password_returns_401(): void
    {
        $this->makeUser(UserRole::Doctor, UserStatus::Active, [
            'email' => 'doctor@test.com',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'doctor@test.com',
            'password' => 'wrong-password',
        ]);

        $response->assertUnauthorized()
            ->assertJsonPath('success', false);
    }

    public function test_login_with_unknown_email_returns_401(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'nobody@test.com',
            'password' => 'password123',
        ]);

        $response->assertUnauthorized()
            ->assertJsonPath('success', false);
    }

    public function test_login_pending_staff_returns_403(): void
    {
        $this->makeUser(UserRole::Technician, UserStatus::Pending, [
            'email' => 'pending-tech@test.com',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'pending-tech@test.com',
            'password' => 'password123',
        ]);

        $response->assertForbidden()
            ->assertJsonPath('success', false);
    }

    public function test_login_blocked_user_returns_403(): void
    {
        $this->makeUser(UserRole::Reception, UserStatus::Blocked, [
            'email' => 'blocked@test.com',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'blocked@test.com',
            'password' => 'password123',
        ]);

        $response->assertForbidden()
            ->assertJsonPath('success', false);
    }

    public function test_me_with_valid_token_returns_user(): void
    {
        $user = $this->makeUser(UserRole::Admin);

        $response = $this->getJson('/api/auth/me', $this->authHeaders($user));

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.email', $user->email);
    }

    public function test_me_without_token_returns_401(): void
    {
        $response = $this->getJson('/api/auth/me');

        $response->assertUnauthorized();
    }

    public function test_me_with_invalid_token_returns_401(): void
    {
        $response = $this->getJson('/api/auth/me', [
            'Authorization' => 'Bearer invalid-token-value',
        ]);

        $response->assertUnauthorized();
    }

    public function test_logout_invalidates_token(): void
    {
        $user = $this->makeUser(UserRole::Doctor);
        $token = $this->tokenFor($user);
        $headers = ['Authorization' => 'Bearer '.$token];

        $this->postJson('/api/auth/logout', [], $headers)->assertOk();
        $this->assertSame(0, $user->fresh()->tokens()->count());

        \Illuminate\Support\Facades\Auth::forgetGuards();

        $this->getJson('/api/auth/me', $headers)->assertUnauthorized();
    }

    public function test_register_patient_creates_patient_and_wallet(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'New Patient',
            'email' => 'newpatient@test.com',
            'phone' => '0912345678',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'date_of_birth' => '1990-05-20',
            'gender' => 'female',
            'address' => 'Damascus',
        ]);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.email', 'newpatient@test.com');

        $user = User::where('email', 'newpatient@test.com')->first();
        $this->assertNotNull($user);
        $this->assertTrue($user->role === UserRole::Patient);

        $patient = Patient::where('user_id', $user->id)->first();
        $this->assertNotNull($patient);
        $this->assertTrue(
            PatientWallet::where('patient_id', $patient->id)->exists()
        );
    }

    public function test_login_while_authenticated_returns_409(): void
    {
        $user = $this->makeUser(UserRole::Doctor, UserStatus::Active, [
            'email' => 'doctor@test.com',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'doctor@test.com',
            'password' => 'password123',
        ], $this->authHeaders($user));

        $response->assertStatus(409)
            ->assertJsonPath('code', 'ALREADY_AUTHENTICATED');
    }
}
