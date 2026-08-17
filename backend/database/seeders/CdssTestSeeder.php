<?php

namespace Database\Seeders;

use App\Models\Test;
use App\Support\TestPreparation;
use Illuminate\Database\Seeder;

class CdssTestSeeder extends Seeder
{
    /**
     * Four orderable screening tests, each mapping 1:1 to a CDSS disease model.
     * Reception orders one of these; the technician result-entry screen then
     * shows that disease's panel automatically and runs the CDSS on submit.
     * The `code` values are matched on the frontend (CDSS_TEST_CODE_TO_DISEASE).
     */
    public function run(): void
    {
        $tests = [
            [
                'name' => 'Diabetes Screening (CDSS)',
                'code' => 'CDSS-DIABETES',
                'category' => 'CDSS Screening',
                'description' => 'AI-assisted diabetes risk screening (HbA1c, blood glucose).',
                'sample_type' => 'Blood',
                'price' => 40.00,
            ],
            [
                'name' => 'Anemia Screening (CDSS)',
                'code' => 'CDSS-ANEMIA',
                'category' => 'CDSS Screening',
                'description' => 'AI-assisted anemia screening (Hemoglobin, MCH, MCHC, MCV).',
                'sample_type' => 'Blood',
                'price' => 40.00,
            ],
            [
                'name' => 'Thalassemia Screening (CDSS)',
                'code' => 'CDSS-THALASSEMIA',
                'category' => 'CDSS Screening',
                'description' => 'AI-assisted thalassemia screening (Hb, Hct, MCV, MCH, MCHC, RDW, RBC).',
                'sample_type' => 'Blood',
                'price' => 45.00,
            ],
            [
                'name' => 'Liver Disease Screening (CDSS)',
                'code' => 'CDSS-LIVER',
                'category' => 'CDSS Screening',
                'description' => 'AI-assisted liver disease screening (bilirubin, enzymes, proteins).',
                'sample_type' => 'Blood',
                'price' => 50.00,
            ],
        ];

        foreach ($tests as $test) {
            Test::updateOrCreate(
                ['code' => $test['code']],
                array_merge($test, [
                    'is_active' => true,
                    'preparation_instructions' => TestPreparation::instructions(
                        $test['code'],
                        $test['category'],
                        $test['sample_type'],
                    ),
                ]),
            );
        }
    }
}
