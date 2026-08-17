<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;


class CdssService
{
    
    public const FEATURES = [
        'diabetes' => [
            'HbA1c_level',
            'blood_glucose_level',
        ],
        'anemia' => [
            'Hemoglobin',
            'MCH',
            'MCHC',
            'MCV',
        ],
        'thalassemia' => [
            'Hb',
            'Hct',
            'MCV',
            'MCH',
            'MCHC',
            'RDW',
            'RBC_count',
        ],
        'liver' => [
            'Total_Bilirubin',
            'Direct_Bilirubin',
            'Alkaline_Phosphotase',
            'Alamine_Aminotransferase',
            'Aspartate_Aminotransferase',
            'Total_Protiens',
            'Albumin',
            'Albumin_and_Globulin_Ratio',
        ],
    ];

    public static function supportedDiseases(): array
    {
        return array_keys(self::FEATURES);
    }

    public static function isSupported(string $disease): bool
    {
        return array_key_exists($disease, self::FEATURES);
    }

    /**
     * Run a prediction for a single disease.
     *
     * @param  string  $disease  one of diabetes|anemia|thalassemia|liver
     * @param  array<string, mixed>  $features  raw clinical values keyed by model feature name
     * @return array{disease:string, outcome:string, prediction:string, recommendation:string, confidence:float}
     *
     * @throws RuntimeException when the disease is unknown or the service is unreachable
     */
    public function predict(string $disease, array $features): array
    {
        if (! self::isSupported($disease)) {
            throw new RuntimeException("Unsupported CDSS disease: {$disease}");
        }

        
        $payload = [];
        foreach (self::FEATURES[$disease] as $feature) {
            if (isset($features[$feature]) && $features[$feature] !== '' && is_numeric($features[$feature])) {
                $payload[$feature] = (float) $features[$feature];
            }
        }

        $baseUrl = rtrim((string) config('services.cdss.url'), '/');
        $timeout = (int) config('services.cdss.timeout', 10);

        try {
            $response = Http::timeout($timeout)
                ->acceptJson()
                ->asJson()
                ->post("{$baseUrl}/predict/{$disease}", $payload);
        } catch (\Throwable $e) {
            Log::error('CDSS request failed', ['disease' => $disease, 'error' => $e->getMessage()]);
            throw new RuntimeException('The CDSS service is unreachable. Please try again later.', 0, $e);
        }

        if ($response->failed()) {
            Log::error('CDSS returned an error', ['disease' => $disease, 'status' => $response->status(), 'body' => $response->body()]);
            throw new RuntimeException('The CDSS service returned an error.');
        }

        $data = $response->json();

        return [
            'disease' => $disease,
            'outcome' => $data['outcome'] ?? null,
            'prediction' => $data['prediction'] ?? null,
            'recommendation' => $data['recommendation'] ?? null,
            'confidence' => isset($data['confidence']) ? (float) $data['confidence'] : null,
        ];
    }
}
