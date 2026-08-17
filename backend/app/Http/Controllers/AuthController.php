<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\RegisterStaffRequest;
use App\Models\User;
use App\Services\CodeGenerator;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(private WalletService $walletService) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => $request->password,
            'role' => UserRole::Patient,
            'status' => UserStatus::Active,
        ]);

        $user->assignRole(UserRole::Patient->value);
        $user->syncSpatieRoleFromColumn();

        $patient = $user->patient()->create([
            'patient_code' => CodeGenerator::patientCode(),
            'date_of_birth' => $request->date_of_birth,
            'gender' => $request->gender,
            'address' => $request->address,
        ]);

        $this->walletService->getOrCreateWallet($patient);

        return $this->successResponse([
            'user' => $this->formatUser($user->load('patient')),
            ...$this->issueAuthSession($user),
        ], 'Registration successful', 201);
    }

    public function registerStaff(RegisterStaffRequest $request): JsonResponse
    {
        $role = UserRole::from($request->role);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => $request->password,
            'role' => $role,
            'status' => UserStatus::Pending,
        ]);

        $user->assignRole($role->value);

        return $this->successResponse([
            'user' => $this->formatUser($user),
        ], 'Registration request submitted for admin approval', 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return $this->errorResponse('Invalid credentials', [], 401);
        }

        if ($user->status === UserStatus::Blocked) {
            return $this->errorResponse('Your account has been blocked. Please contact support.', [], 403);
        }

        if ($user->status === UserStatus::Pending) {
            return $this->errorResponse('Your account is pending approval.', [], 403);
        }

        $expectedRole = $request->input('expected_role') ?? $request->input('role');

        if ($expectedRole && ! $this->userHasRole($user, $expectedRole)) {
            return $this->errorResponse('Selected role does not match your account.', [], 403);
        }

        $user->syncSpatieRoleFromColumn();

        $user->tokens()->delete();

        if ($user->role === UserRole::Patient) {
            $this->walletService->ensurePatientProfile($user);
        }

        return $this->successResponse([
            'user' => $this->formatUser($user->load('patient')),
            ...$this->issueAuthSession($user),
        ], 'Login successful');
    }

    public function logout(): JsonResponse
    {
        request()->user()->currentAccessToken()->delete();

        return $this->successResponse(null, 'تم تسجيل الخروج بنجاح');
    }

    public function me(): JsonResponse
    {
        $user = request()->user();
        $user->syncSpatieRoleFromColumn();

        if ($user->role === UserRole::Patient) {
            $this->walletService->ensurePatientProfile($user);
        }

        $user->load('patient');

        return $this->successResponse($this->formatUser($user));
    }

    /**
     * @return array{token: string, session: array{idle_timeout_minutes: int, lifetime_minutes: int, expires_at: string|null}}
     */
    private function issueAuthSession(User $user): array
    {
        $lifetimeMinutes = (int) config('sanctum.expiration', 480);
        $idleMinutes = (int) config('sanctum.idle_timeout', 15);
        $expiresAt = $lifetimeMinutes > 0 ? now()->addMinutes($lifetimeMinutes) : null;

        $token = $user->createToken('auth-token', ['*'], $expiresAt)->plainTextToken;

        return [
            'token' => $token,
            'session' => [
                'idle_timeout_minutes' => $idleMinutes,
                'lifetime_minutes' => $lifetimeMinutes,
                'expires_at' => $expiresAt?->toIso8601String(),
            ],
        ];
    }

    private function formatUser(User $user): array
    {
        $roles = $user->getRoleNames()->values()->all();

        if ($roles === [] && $user->role) {
            $roles = [$user->role->value];
        }

        $primaryRole = $roles[0] ?? $user->role?->value;

        $data = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $primaryRole,
            'roles' => $roles,
            'status' => $user->status->value,
        ];

        if ($user->relationLoaded('patient') && $user->patient) {
            $data['patient'] = [
                'id' => $user->patient->id,
                'patient_code' => $user->patient->patient_code,
                'date_of_birth' => $user->patient->date_of_birth?->format('Y-m-d'),
                'gender' => $user->patient->gender?->value,
                'address' => $user->patient->address,
            ];
        }

        return $data;
    }

    private function userHasRole(User $user, string $role): bool
    {
        return $user->hasAnyRoleName($role);
    }
}
