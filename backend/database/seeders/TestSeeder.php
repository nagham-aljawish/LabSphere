<?php

namespace Database\Seeders;

use App\Models\Test;
use App\Support\TestPreparation;
use Illuminate\Database\Seeder;

class TestSeeder extends Seeder
{
    public function run(): void
    {
        $tests = [
            ['name' => 'Glucose', 'code' => 'LOINC:2339-0', 'category' => 'Chemistry', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Uric Acid', 'code' => 'LOINC:3084-1', 'category' => 'Chemistry', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Calcium', 'code' => 'LOINC:17861-6', 'category' => 'Chemistry', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Phosphorus', 'code' => 'LOINC:2777-1', 'category' => 'Chemistry', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Magnesium', 'code' => 'LOINC:2601-3', 'category' => 'Chemistry', 'sample_type' => 'Blood', 'price' => 18.00],

            ['name' => 'Hemoglobin', 'code' => 'LOINC:718-7', 'category' => 'Hematology', 'sample_type' => 'Blood', 'price' => 10.00],
            ['name' => 'Complete Blood Count', 'code' => 'LOINC:58410-2', 'category' => 'Hematology', 'sample_type' => 'Blood', 'price' => 25.00],
            ['name' => 'Erythrocyte Sedimentation Rate', 'code' => 'LOINC:30341-2', 'category' => 'Hematology', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Bleeding Time', 'code' => 'LOINC:11067-0', 'category' => 'Hematology', 'sample_type' => 'Blood', 'price' => 10.00],
            ['name' => 'Clotting Time', 'code' => 'LOINC:3184-9', 'category' => 'Hematology', 'sample_type' => 'Blood', 'price' => 10.00],
            ['name' => 'Blood Group and Rh', 'code' => 'LOINC:882-1', 'category' => 'Hematology', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Reticulocyte Count', 'code' => 'LOINC:14196-0', 'category' => 'Hematology', 'sample_type' => 'Blood', 'price' => 20.00],

            ['name' => 'Prothrombin Time', 'code' => 'LOINC:5902-2', 'category' => 'Coagulation', 'sample_type' => 'Blood', 'price' => 20.00],
            ['name' => 'Partial Thromboplastin Time', 'code' => 'LOINC:3173-2', 'category' => 'Coagulation', 'sample_type' => 'Blood', 'price' => 20.00],
            ['name' => 'International Normalized Ratio', 'code' => 'LOINC:6301-6', 'category' => 'Coagulation', 'sample_type' => 'Blood', 'price' => 20.00],

            ['name' => 'Fasting Blood Sugar', 'code' => 'LOINC:1558-6', 'category' => 'Diabetes', 'sample_type' => 'Blood', 'price' => 12.00],
            ['name' => 'Random Blood Sugar', 'code' => 'LOINC:2345-7', 'category' => 'Diabetes', 'sample_type' => 'Blood', 'price' => 12.00],
            ['name' => 'Hemoglobin A1c', 'code' => 'LOINC:4548-4', 'category' => 'Diabetes', 'sample_type' => 'Blood', 'price' => 30.00],

            ['name' => 'Urea', 'code' => 'LOINC:3094-0', 'category' => 'Kidney Function', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Blood Urea Nitrogen', 'code' => 'LOINC:6299-2', 'category' => 'Kidney Function', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Creatinine', 'code' => 'LOINC:2160-0', 'category' => 'Kidney Function', 'sample_type' => 'Blood', 'price' => 15.00],

            ['name' => 'Sodium', 'code' => 'LOINC:2951-2', 'category' => 'Electrolytes', 'sample_type' => 'Blood', 'price' => 12.00],
            ['name' => 'Potassium', 'code' => 'LOINC:2823-3', 'category' => 'Electrolytes', 'sample_type' => 'Blood', 'price' => 12.00],
            ['name' => 'Chloride', 'code' => 'LOINC:2075-0', 'category' => 'Electrolytes', 'sample_type' => 'Blood', 'price' => 12.00],

            ['name' => 'Liver Function Test', 'code' => 'LOINC:24325-3', 'category' => 'Liver Function', 'sample_type' => 'Blood', 'price' => 40.00],
            ['name' => 'Alanine Aminotransferase', 'code' => 'LOINC:1742-6', 'category' => 'Liver Function', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Aspartate Aminotransferase', 'code' => 'LOINC:1920-8', 'category' => 'Liver Function', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Alkaline Phosphatase', 'code' => 'LOINC:6768-6', 'category' => 'Liver Function', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Gamma Glutamyl Transferase', 'code' => 'LOINC:2324-2', 'category' => 'Liver Function', 'sample_type' => 'Blood', 'price' => 20.00],
            ['name' => 'Total Bilirubin', 'code' => 'LOINC:1975-2', 'category' => 'Liver Function', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Direct Bilirubin', 'code' => 'LOINC:1968-7', 'category' => 'Liver Function', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Albumin', 'code' => 'LOINC:1751-7', 'category' => 'Liver Function', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Total Protein', 'code' => 'LOINC:2885-2', 'category' => 'Liver Function', 'sample_type' => 'Blood', 'price' => 15.00],

            ['name' => 'Lipid Profile', 'code' => 'LOINC:24331-1', 'category' => 'Lipid Profile', 'sample_type' => 'Blood', 'price' => 35.00],
            ['name' => 'Total Cholesterol', 'code' => 'LOINC:2093-3', 'category' => 'Lipid Profile', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Triglycerides', 'code' => 'LOINC:2571-8', 'category' => 'Lipid Profile', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'High Density Lipoprotein', 'code' => 'LOINC:2085-9', 'category' => 'Lipid Profile', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Low Density Lipoprotein', 'code' => 'LOINC:13457-7', 'category' => 'Lipid Profile', 'sample_type' => 'Blood', 'price' => 15.00],

            ['name' => 'Thyroid Stimulating Hormone', 'code' => 'LOINC:3016-3', 'category' => 'Thyroid', 'sample_type' => 'Blood', 'price' => 25.00],
            ['name' => 'Free Triiodothyronine', 'code' => 'LOINC:3051-0', 'category' => 'Thyroid', 'sample_type' => 'Blood', 'price' => 25.00],
            ['name' => 'Free Thyroxine', 'code' => 'LOINC:3024-7', 'category' => 'Thyroid', 'sample_type' => 'Blood', 'price' => 25.00],
            ['name' => 'Total T3', 'code' => 'LOINC:3053-6', 'category' => 'Thyroid', 'sample_type' => 'Blood', 'price' => 22.00],
            ['name' => 'Total T4', 'code' => 'LOINC:3026-2', 'category' => 'Thyroid', 'sample_type' => 'Blood', 'price' => 22.00],

            ['name' => 'C-Reactive Protein', 'code' => 'LOINC:1988-5', 'category' => 'Inflammation', 'sample_type' => 'Blood', 'price' => 20.00],

            ['name' => 'Rheumatoid Factor', 'code' => 'LOINC:11572-5', 'category' => 'Immunology', 'sample_type' => 'Blood', 'price' => 20.00],
            ['name' => 'Anti-Streptolysin O', 'code' => 'LOINC:4625-0', 'category' => 'Immunology', 'sample_type' => 'Blood', 'price' => 20.00],

            ['name' => 'Ferritin', 'code' => 'LOINC:2276-4', 'category' => 'Iron Studies', 'sample_type' => 'Blood', 'price' => 30.00],
            ['name' => 'Serum Iron', 'code' => 'LOINC:2498-4', 'category' => 'Iron Studies', 'sample_type' => 'Blood', 'price' => 20.00],
            ['name' => 'Total Iron Binding Capacity', 'code' => 'LOINC:2500-7', 'category' => 'Iron Studies', 'sample_type' => 'Blood', 'price' => 20.00],

            ['name' => 'Vitamin D', 'code' => 'LOINC:1989-3', 'category' => 'Vitamins', 'sample_type' => 'Blood', 'price' => 45.00],
            ['name' => 'Vitamin B12', 'code' => 'LOINC:2132-9', 'category' => 'Vitamins', 'sample_type' => 'Blood', 'price' => 35.00],
            ['name' => 'Folate', 'code' => 'LOINC:2284-8', 'category' => 'Vitamins', 'sample_type' => 'Blood', 'price' => 35.00],

            ['name' => 'Urinalysis', 'code' => 'LOINC:24357-6', 'category' => 'Urine / Stool', 'sample_type' => 'Urine', 'price' => 15.00],
            ['name' => 'Stool Analysis', 'code' => 'LOINC:50175-9', 'category' => 'Urine / Stool', 'sample_type' => 'Stool', 'price' => 15.00],
            ['name' => 'Stool Occult Blood', 'code' => 'LOINC:2335-8', 'category' => 'Urine / Stool', 'sample_type' => 'Stool', 'price' => 20.00],

            ['name' => 'Urine Pregnancy Test', 'code' => 'LOINC:2106-3', 'category' => 'Hormones', 'sample_type' => 'Urine', 'price' => 15.00],
            ['name' => 'Beta HCG', 'code' => 'LOINC:2118-8', 'category' => 'Hormones', 'sample_type' => 'Blood', 'price' => 30.00],
            ['name' => 'Prolactin', 'code' => 'LOINC:2842-3', 'category' => 'Hormones', 'sample_type' => 'Blood', 'price' => 30.00],

            ['name' => 'Hepatitis B Surface Antigen', 'code' => 'LOINC:5195-3', 'category' => 'Serology', 'sample_type' => 'Blood', 'price' => 25.00],
            ['name' => 'Hepatitis B Surface Antibody', 'code' => 'LOINC:16935-9', 'category' => 'Serology', 'sample_type' => 'Blood', 'price' => 25.00],
            ['name' => 'Hepatitis C Antibody', 'code' => 'LOINC:16128-1', 'category' => 'Serology', 'sample_type' => 'Blood', 'price' => 25.00],
            ['name' => 'HIV Screening Test', 'code' => 'LOINC:7918-6', 'category' => 'Serology', 'sample_type' => 'Blood', 'price' => 30.00],
            ['name' => 'Widal Test', 'code' => 'LOINC:43896-9', 'category' => 'Serology', 'sample_type' => 'Blood', 'price' => 20.00],
            ['name' => 'Wright Test', 'code' => 'LOINC:5196-1', 'category' => 'Serology', 'sample_type' => 'Blood', 'price' => 20.00],
            ['name' => 'VDRL', 'code' => 'LOINC:5292-8', 'category' => 'Serology', 'sample_type' => 'Blood', 'price' => 20.00],

            ['name' => 'COVID-19 PCR', 'code' => 'LOINC:94500-6', 'category' => 'Microbiology', 'sample_type' => 'Nasopharyngeal Swab', 'price' => 50.00],
            ['name' => 'COVID-19 Antigen', 'code' => 'LOINC:96119-3', 'category' => 'Microbiology', 'sample_type' => 'Nasopharyngeal Swab', 'price' => 25.00],
            ['name' => 'Blood Culture', 'code' => 'LOINC:600-7', 'category' => 'Microbiology', 'sample_type' => 'Blood', 'price' => 55.00],
            ['name' => 'Urine Culture', 'code' => 'LOINC:630-4', 'category' => 'Microbiology', 'sample_type' => 'Urine', 'price' => 40.00],
            ['name' => 'Throat Culture', 'code' => 'LOINC:626-2', 'category' => 'Microbiology', 'sample_type' => 'Throat Swab', 'price' => 35.00],
            ['name' => 'Sputum Culture', 'code' => 'LOINC:6460-0', 'category' => 'Microbiology', 'sample_type' => 'Sputum', 'price' => 40.00],

            ['name' => 'Prostate Specific Antigen', 'code' => 'LOINC:2857-1', 'category' => 'Tumor Markers', 'sample_type' => 'Blood', 'price' => 35.00],
        ];

        $created = 0;
        $updated = 0;

        foreach ($tests as $testData) {
            $test = Test::query()->where('name', $testData['name'])->first()
                ?? Test::query()->where('code', $testData['code'])->first()
                ?? new Test;

            $wasExisting = $test->exists;

            $test->fill([
                'name' => $testData['name'],
                'code' => $testData['code'],
                'category' => $testData['category'],
                'sample_type' => $testData['sample_type'],
                'price' => $testData['price'],
                'description' => TestPreparation::description(
                    $testData['name'],
                    $testData['category'],
                ),
                'preparation_instructions' => TestPreparation::instructions(
                    $testData['code'],
                    $testData['category'],
                    $testData['sample_type'],
                ),
                'is_active' => true,
            ]);
            $test->save();

            if ($wasExisting) {
                $updated++;
            } else {
                $created++;
            }
        }

        
        Test::query()
            ->where('code', 'LOINC:23390-0')
            ->where('name', 'Glucose')
            ->whereNotIn('id', Test::query()->where('code', 'LOINC:2339-0')->pluck('id'))
            ->update(['code' => 'LOINC:2339-0']);

        $total = Test::count();

        $this->command->info("Tests seeded: {$created} created, {$updated} updated.");
        $this->command->info("Total tests in database: {$total}");
    }
}
