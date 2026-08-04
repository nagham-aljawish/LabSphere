<?php

namespace Database\Seeders;

use App\Models\DeltaCheckThreshold;
use Illuminate\Database\Seeder;

class DeltaCheckThresholdSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            [
                'test_code' => '*',
                'test_name' => 'Default (all tests)',
                'code_aliases' => null,
                'absolute_delta' => null,
                'percent_delta' => 25,
                'alert_on_flag_change' => true,
                'notes' => 'Fallback for any unmatched test including CDSS panels.',
            ],
            [
                'test_code' => 'HGB',
                'test_name' => 'Hemoglobin',
                'code_aliases' => ['718-7', 'HB'],
                'absolute_delta' => 1.5,
                'percent_delta' => 15,
                'alert_on_flag_change' => true,
                'notes' => null,
            ],
            [
                'test_code' => 'ALT',
                'test_name' => 'Alanine Aminotransferase',
                'code_aliases' => ['1742-6'],
                'absolute_delta' => 20,
                'percent_delta' => 30,
                'alert_on_flag_change' => true,
                'notes' => null,
            ],
            [
                'test_code' => 'AST',
                'test_name' => 'Aspartate Aminotransferase',
                'code_aliases' => ['1920-8'],
                'absolute_delta' => 20,
                'percent_delta' => 30,
                'alert_on_flag_change' => true,
                'notes' => null,
            ],
            [
                'test_code' => 'CREA',
                'test_name' => 'Creatinine',
                'code_aliases' => ['2160-0'],
                'absolute_delta' => 0.3,
                'percent_delta' => 20,
                'alert_on_flag_change' => true,
                'notes' => null,
            ],
            [
                'test_code' => 'K',
                'test_name' => 'Potassium',
                'code_aliases' => ['2823-3'],
                'absolute_delta' => 0.5,
                'percent_delta' => 15,
                'alert_on_flag_change' => true,
                'notes' => null,
            ],
            [
                'test_code' => 'LOINC:23390-0',
                'test_name' => 'Glucose',
                'code_aliases' => ['23390-0', 'GLU', 'FBS', 'RBS', '2345-7'],
                'absolute_delta' => 30,
                'percent_delta' => 20,
                'alert_on_flag_change' => true,
                'notes' => null,
            ],
            [
                'test_code' => 'HBA1C',
                'test_name' => 'Hemoglobin A1c',
                'code_aliases' => ['4548-4', 'HBA1C_LEVEL'],
                'absolute_delta' => 0.5,
                'percent_delta' => 10,
                'alert_on_flag_change' => true,
                'notes' => 'Used by diabetes CDSS panels.',
            ],
            [
                'test_code' => 'MCH',
                'test_name' => 'MCH',
                'code_aliases' => ['785-6'],
                'absolute_delta' => 3,
                'percent_delta' => 15,
                'alert_on_flag_change' => true,
                'notes' => 'Anemia / thalassemia CDSS.',
            ],
            [
                'test_code' => 'MCHC',
                'test_name' => 'MCHC',
                'code_aliases' => ['786-4'],
                'absolute_delta' => 2,
                'percent_delta' => 10,
                'alert_on_flag_change' => true,
                'notes' => null,
            ],
            [
                'test_code' => 'MCV',
                'test_name' => 'MCV',
                'code_aliases' => ['787-2'],
                'absolute_delta' => 5,
                'percent_delta' => 10,
                'alert_on_flag_change' => true,
                'notes' => null,
            ],
            [
                'test_code' => 'TSH',
                'test_name' => 'Thyroid Stimulating Hormone',
                'code_aliases' => null,
                'absolute_delta' => 1.0,
                'percent_delta' => 25,
                'alert_on_flag_change' => true,
                'notes' => null,
            ],
            [
                'test_code' => 'CHOL',
                'test_name' => 'Total Cholesterol',
                'code_aliases' => null,
                'absolute_delta' => 30,
                'percent_delta' => 20,
                'alert_on_flag_change' => true,
                'notes' => null,
            ],
        ];

        foreach ($rows as $row) {
            DeltaCheckThreshold::query()->updateOrCreate(
                ['test_code' => $row['test_code']],
                $row,
            );
        }
    }
}
