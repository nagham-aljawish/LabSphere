<?php

namespace App\Http\Controllers\Reception;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReceptionPatientRequest;
use App\Models\Patient;
use App\Services\PatientRegistrationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReceptionPatientController extends Controller
{
    public function __construct(private PatientRegistrationService $registrationService) {}

    public function index(Request $request): JsonResponse
    {
        $query = Patient::with('user')->orderByDesc('updated_at');

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('patient_code', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
            });
        }

        $patients = $query->paginate(20);
        $patients->setCollection(
            $patients->getCollection()->map(fn (Patient $patient) => $this->formatPatient($patient))
        );

        return $this->successResponse($patients);
    }

    public function store(StoreReceptionPatientRequest $request): JsonResponse
    {
        $patient = $this->registrationService->register($request->validated());

        return $this->successResponse(
            $this->formatPatient($patient),
            'Patient registered successfully',
            201
        );
    }

    public function show(Patient $patient): JsonResponse
    {
        $patient->load('user');

        return $this->successResponse($this->formatPatient($patient));
    }

    private function formatPatient(Patient $patient): array
    {
        return [
            'id' => $patient->id,
            'user_id' => $patient->user_id,
            'patient_code' => $patient->patient_code,
            'date_of_birth' => $patient->date_of_birth?->format('Y-m-d'),
            'gender' => $patient->gender?->value ?? $patient->gender,
            'address' => $patient->address,
            'created_at' => $patient->created_at?->toISOString(),
            'updated_at' => $patient->updated_at?->toISOString(),
            'user' => $patient->user ? [
                'id' => $patient->user->id,
                'name' => $patient->user->name,
                'email' => $patient->user->email,
                'phone' => $patient->user->phone,
            ] : null,
        ];
    }
}
