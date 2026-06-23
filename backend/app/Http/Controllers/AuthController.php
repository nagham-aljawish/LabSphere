<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
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

        $patient = $user->patient()->create([
            'patient_code' => CodeGenerator::patientCode(),
            'date_of_birth' => $request->date_of_birth,
            'gender' => $request->gender,
            'address' => $request->address,
        ]);

        $this->walletService->getOrCreateWallet($patient);

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->successResponse([
            'user' => $this->formatUser($user->load('patient')),
            'token' => $token,
        ], 'Registration successful', 201);
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

        $user->tokens()->delete();

        if ($user->role === UserRole::Patient) {
            $this->walletService->ensurePatientProfile($user);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->successResponse([
            'user' => $this->formatUser($user->load('patient')),
            'token' => $token,
        ], 'Login successful');
    }

    public function logout(): JsonResponse
    {
        request()->user()->currentAccessToken()->delete();

        return $this->successResponse(null, 'Logged out successfully');
    }

    public function me(): JsonResponse
    {
        $user = request()->user();

        if ($user->role === UserRole::Patient) {
            $this->walletService->ensurePatientProfile($user);
        }

        $user->load('patient');

        return $this->successResponse($this->formatUser($user));
    }

    private function formatUser(User $user): array
    {
        $data = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role->value,
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
}
