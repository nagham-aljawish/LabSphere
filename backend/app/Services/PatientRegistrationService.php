<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\Patient;
use App\Models\User;

class PatientRegistrationService
{
    public function __construct(private WalletService $walletService) {}

    public function register(array $data): Patient
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => $data['password'],
            'role' => UserRole::Patient,
            'status' => UserStatus::Active,
        ]);

        $user->assignRole(UserRole::Patient->value);
        $user->syncSpatieRoleFromColumn();

        $patient = $user->patient()->create([
            'patient_code' => CodeGenerator::patientCode(),
            'date_of_birth' => $data['date_of_birth'] ?? null,
            'gender' => $data['gender'] ?? null,
            'address' => $data['address'] ?? null,
        ]);

        $this->walletService->getOrCreateWallet($patient);

        return $patient->load('user');
    }
}
