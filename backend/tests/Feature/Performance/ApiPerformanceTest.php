<?php

namespace Tests\Feature\Performance;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('performance')]
class ApiPerformanceTest extends TestCase
{
    /** @var array<string, array<string, float|int>> */
    public static array $lastResults = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->makeLabTest(['name' => 'Perf Test', 'price' => 20.00]);
    }

    public function test_api_endpoints_average_response_time_under_threshold(): void
    {
        $reception = $this->makeUser(UserRole::Reception, overrides: [
            'email' => 'perf-reception@test.com',
        ]);
        $technician = $this->makeUser(UserRole::Technician, overrides: [
            'email' => 'perf-technician@test.com',
        ]);
        $patient = $this->makePatientUser(['email' => 'perf-patient@test.com']);
        $admin = $this->makeUser(UserRole::Admin, overrides: [
            'email' => 'perf-admin@test.com',
        ]);

        $this->makeOrder($patient->patient, $reception);

        $scenarios = [
            'POST /api/auth/login' => function () {
                return $this->postJson('/api/auth/login', [
                    'email' => 'perf-reception@test.com',
                    'password' => 'password123',
                ]);
            },
            'GET /api/tests' => fn () => $this->getJson('/api/tests'),
            'GET /api/technician/orders' => function () use ($technician) {
                $this->authenticateAs($technician);

                return $this->getJson('/api/technician/orders');
            },
            'GET /api/patient/tracking' => function () use ($patient) {
                $this->authenticateAs($patient);

                return $this->getJson('/api/patient/tracking');
            },
            'GET /api/admin/dashboard' => function () use ($admin) {
                $this->authenticateAs($admin);

                return $this->getJson('/api/admin/dashboard');
            },
        ];

        $iterations = 10;
        $thresholdMs = 5000.0;
        $results = [];

        foreach ($scenarios as $label => $callback) {
            $durations = [];

            for ($i = 0; $i < $iterations; $i++) {
                \Illuminate\Support\Facades\Auth::forgetGuards();

                $start = microtime(true);
                $response = $callback();
                $elapsedMs = (microtime(true) - $start) * 1000;
                $durations[] = $elapsedMs;

                $response->assertSuccessful();
            }

            $average = array_sum($durations) / count($durations);

            $results[$label] = [
                'iterations' => $iterations,
                'average_ms' => round($average, 2),
                'min_ms' => round(min($durations), 2),
                'max_ms' => round(max($durations), 2),
            ];

            $this->assertLessThan(
                $thresholdMs,
                $average,
                "{$label} average response time exceeded {$thresholdMs}ms"
            );
        }

        self::$lastResults = $results;

        Storage::disk('local')->put(
            'logs/perf_results.json',
            json_encode([
                'recorded_at' => now()->toIso8601String(),
                'threshold_ms' => $thresholdMs,
                'results' => $results,
            ], JSON_PRETTY_PRINT)
        );

        $this->assertTrue(Storage::disk('local')->exists('logs/perf_results.json'));
    }

    private function authenticateAs(User $user): void
    {
        Sanctum::actingAs($user, ['*']);
    }
}
