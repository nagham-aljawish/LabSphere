<?php

namespace Database\Seeders;

use App\Models\TubeType;
use Illuminate\Database\Seeder;

class TubeTypeSeeder extends Seeder
{
    public function run(): void
    {
        $tubeTypes = [
            [
                'name' => 'EDTA',
                'color_class' => 'bg-purple-500',
                'hex_color' => '#A855F7',
                'color_label' => 'Purple',
                'additive' => 'K2/K3 EDTA',
                'use_for' => 'Hematology and whole-blood tests (CBC, Hb, blood group, HbA1c)',
                'sort_order' => 1,
            ],
            [
                'name' => 'SST',
                'color_class' => 'bg-yellow-500',
                'hex_color' => '#F4B000',
                'color_label' => 'Gold',
                'additive' => 'Clot activator + gel separator',
                'use_for' => 'Serum chemistry, hormones, serology, immunology, and liver tests',
                'sort_order' => 2,
            ],
            [
                'name' => 'Citrate',
                'color_class' => 'bg-blue-500',
                'hex_color' => '#3B82F6',
                'color_label' => 'Light Blue',
                'additive' => 'Sodium citrate (9NC)',
                'use_for' => 'Coagulation studies (PT, PTT, INR)',
                'sort_order' => 3,
            ],
            [
                'name' => 'Heparin',
                'color_class' => 'bg-green-500',
                'hex_color' => '#22C55E',
                'color_label' => 'Green',
                'additive' => 'Lithium heparin',
                'use_for' => 'Plasma electrolytes and tests requiring heparinized plasma',
                'sort_order' => 4,
            ],
            [
                'name' => 'Fluoride',
                'color_class' => 'bg-gray-400',
                'hex_color' => '#9CA3AF',
                'color_label' => 'Gray',
                'additive' => 'Sodium fluoride + potassium oxalate',
                'use_for' => 'Glucose preservation (fasting/random blood sugar)',
                'sort_order' => 5,
            ],
            [
                'name' => 'Plain',
                'color_class' => 'bg-red-500',
                'hex_color' => '#EF4444',
                'color_label' => 'Red',
                'additive' => 'No additive',
                'use_for' => 'Serum tests when no gel separator is required',
                'sort_order' => 6,
            ],
            [
                'name' => 'Urine',
                'color_class' => 'bg-amber-400',
                'hex_color' => '#FBBF24',
                'color_label' => 'Amber',
                'additive' => 'Sterile urine container',
                'use_for' => 'Urinalysis and urine-based tests',
                'sort_order' => 7,
            ],
            [
                'name' => 'Stool',
                'color_class' => 'bg-orange-700',
                'hex_color' => '#C2410C',
                'color_label' => 'Brown',
                'additive' => 'Stool specimen container',
                'use_for' => 'Stool analysis and occult blood',
                'sort_order' => 8,
            ],
            [
                'name' => 'Culture Swab',
                'color_class' => 'bg-teal-500',
                'hex_color' => '#14B8A6',
                'color_label' => 'Teal',
                'additive' => 'Viral/ bacterial transport medium',
                'use_for' => 'Swab cultures (throat, nasopharyngeal)',
                'sort_order' => 9,
            ],
            [
                'name' => 'Sputum',
                'color_class' => 'bg-slate-500',
                'hex_color' => '#64748B',
                'color_label' => 'Slate',
                'additive' => 'Sterile sputum container',
                'use_for' => 'Sputum culture and microscopy',
                'sort_order' => 10,
            ],
            [
                'name' => 'Blood Culture',
                'color_class' => 'bg-indigo-900',
                'hex_color' => '#312E81',
                'color_label' => 'Dark Purple',
                'additive' => 'Blood culture bottle',
                'use_for' => 'Aerobic/anaerobic blood culture',
                'sort_order' => 11,
            ],
        ];

        $created = 0;
        $updated = 0;

        foreach ($tubeTypes as $tubeTypeData) {
            $tubeType = TubeType::updateOrCreate(
                ['name' => $tubeTypeData['name']],
                [
                    ...$tubeTypeData,
                    'is_active' => true,
                ]
            );

            if ($tubeType->wasRecentlyCreated) {
                $created++;
            } else {
                $updated++;
            }
        }

        $total = TubeType::count();

        $this->command->info("Tube types seeded: {$created} created, {$updated} updated.");
        $this->command->info("Total tube types in database: {$total}");
    }
}
