<?php

namespace Database\Seeders;

use App\Models\Test;
use Illuminate\Database\Seeder;

class TestSeeder extends Seeder
{
    public function run(): void
    {
        $tests = [
            ['name' => 'Glucose', 'code' => 'LOINC:23390-0', 'category' => 'Chemistry', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Uric Acid', 'code' => 'UA', 'category' => 'Chemistry', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Calcium', 'code' => 'CA', 'category' => 'Chemistry', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Phosphorus', 'code' => 'PHOS', 'category' => 'Chemistry', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Magnesium', 'code' => 'MG', 'category' => 'Chemistry', 'sample_type' => 'Blood', 'price' => 18.00],

            ['name' => 'Hemoglobin', 'code' => 'HGB', 'category' => 'Hematology', 'sample_type' => 'Blood', 'price' => 10.00],
            ['name' => 'Complete Blood Count', 'code' => 'CBC', 'category' => 'Hematology', 'sample_type' => 'Blood', 'price' => 25.00],
            ['name' => 'Erythrocyte Sedimentation Rate', 'code' => 'ESR', 'category' => 'Hematology', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Bleeding Time', 'code' => 'BT', 'category' => 'Hematology', 'sample_type' => 'Blood', 'price' => 10.00],
            ['name' => 'Clotting Time', 'code' => 'CT', 'category' => 'Hematology', 'sample_type' => 'Blood', 'price' => 10.00],
            ['name' => 'Blood Group and Rh', 'code' => 'BLOOD-GROUP', 'category' => 'Hematology', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Reticulocyte Count', 'code' => 'RETIC', 'category' => 'Hematology', 'sample_type' => 'Blood', 'price' => 20.00],

            ['name' => 'Prothrombin Time', 'code' => 'PT', 'category' => 'Coagulation', 'sample_type' => 'Blood', 'price' => 20.00],
            ['name' => 'Partial Thromboplastin Time', 'code' => 'PTT', 'category' => 'Coagulation', 'sample_type' => 'Blood', 'price' => 20.00],
            ['name' => 'International Normalized Ratio', 'code' => 'INR', 'category' => 'Coagulation', 'sample_type' => 'Blood', 'price' => 20.00],

            ['name' => 'Fasting Blood Sugar', 'code' => 'FBS', 'category' => 'Diabetes', 'sample_type' => 'Blood', 'price' => 12.00],
            ['name' => 'Random Blood Sugar', 'code' => 'RBS', 'category' => 'Diabetes', 'sample_type' => 'Blood', 'price' => 12.00],
            ['name' => 'Hemoglobin A1c', 'code' => 'HBA1C', 'category' => 'Diabetes', 'sample_type' => 'Blood', 'price' => 30.00],

            ['name' => 'Urea', 'code' => 'UREA', 'category' => 'Kidney Function', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Blood Urea Nitrogen', 'code' => 'BUN', 'category' => 'Kidney Function', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Creatinine', 'code' => 'CREA', 'category' => 'Kidney Function', 'sample_type' => 'Blood', 'price' => 15.00],

            ['name' => 'Sodium', 'code' => 'NA', 'category' => 'Electrolytes', 'sample_type' => 'Blood', 'price' => 12.00],
            ['name' => 'Potassium', 'code' => 'K', 'category' => 'Electrolytes', 'sample_type' => 'Blood', 'price' => 12.00],
            ['name' => 'Chloride', 'code' => 'CL', 'category' => 'Electrolytes', 'sample_type' => 'Blood', 'price' => 12.00],

            ['name' => 'Liver Function Test', 'code' => 'LFT', 'category' => 'Liver Function', 'sample_type' => 'Blood', 'price' => 40.00],
            ['name' => 'Alanine Aminotransferase', 'code' => 'ALT', 'category' => 'Liver Function', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Aspartate Aminotransferase', 'code' => 'AST', 'category' => 'Liver Function', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Alkaline Phosphatase', 'code' => 'ALP', 'category' => 'Liver Function', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Gamma Glutamyl Transferase', 'code' => 'GGT', 'category' => 'Liver Function', 'sample_type' => 'Blood', 'price' => 20.00],
            ['name' => 'Total Bilirubin', 'code' => 'TBIL', 'category' => 'Liver Function', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Direct Bilirubin', 'code' => 'DBIL', 'category' => 'Liver Function', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Albumin', 'code' => 'ALB', 'category' => 'Liver Function', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Total Protein', 'code' => 'TP', 'category' => 'Liver Function', 'sample_type' => 'Blood', 'price' => 15.00],

            ['name' => 'Lipid Profile', 'code' => 'LIPID', 'category' => 'Lipid Profile', 'sample_type' => 'Blood', 'price' => 35.00],
            ['name' => 'Total Cholesterol', 'code' => 'CHOL', 'category' => 'Lipid Profile', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Triglycerides', 'code' => 'TG', 'category' => 'Lipid Profile', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'High Density Lipoprotein', 'code' => 'HDL', 'category' => 'Lipid Profile', 'sample_type' => 'Blood', 'price' => 15.00],
            ['name' => 'Low Density Lipoprotein', 'code' => 'LDL', 'category' => 'Lipid Profile', 'sample_type' => 'Blood', 'price' => 15.00],

            ['name' => 'Thyroid Stimulating Hormone', 'code' => 'TSH', 'category' => 'Thyroid', 'sample_type' => 'Blood', 'price' => 25.00],
            ['name' => 'Free Triiodothyronine', 'code' => 'FT3', 'category' => 'Thyroid', 'sample_type' => 'Blood', 'price' => 25.00],
            ['name' => 'Free Thyroxine', 'code' => 'FT4', 'category' => 'Thyroid', 'sample_type' => 'Blood', 'price' => 25.00],
            ['name' => 'Total T3', 'code' => 'T3', 'category' => 'Thyroid', 'sample_type' => 'Blood', 'price' => 22.00],
            ['name' => 'Total T4', 'code' => 'T4', 'category' => 'Thyroid', 'sample_type' => 'Blood', 'price' => 22.00],

            ['name' => 'C-Reactive Protein', 'code' => 'CRP', 'category' => 'Inflammation', 'sample_type' => 'Blood', 'price' => 20.00],

            ['name' => 'Rheumatoid Factor', 'code' => 'RF', 'category' => 'Immunology', 'sample_type' => 'Blood', 'price' => 20.00],
            ['name' => 'Anti-Streptolysin O', 'code' => 'ASO', 'category' => 'Immunology', 'sample_type' => 'Blood', 'price' => 20.00],

            ['name' => 'Ferritin', 'code' => 'FERRITIN', 'category' => 'Iron Studies', 'sample_type' => 'Blood', 'price' => 30.00],
            ['name' => 'Serum Iron', 'code' => 'IRON', 'category' => 'Iron Studies', 'sample_type' => 'Blood', 'price' => 20.00],
            ['name' => 'Total Iron Binding Capacity', 'code' => 'TIBC', 'category' => 'Iron Studies', 'sample_type' => 'Blood', 'price' => 20.00],

            ['name' => 'Vitamin D', 'code' => 'VITD', 'category' => 'Vitamins', 'sample_type' => 'Blood', 'price' => 45.00],
            ['name' => 'Vitamin B12', 'code' => 'B12', 'category' => 'Vitamins', 'sample_type' => 'Blood', 'price' => 35.00],
            ['name' => 'Folate', 'code' => 'FOLATE', 'category' => 'Vitamins', 'sample_type' => 'Blood', 'price' => 35.00],

            ['name' => 'Urinalysis', 'code' => 'URINE', 'category' => 'Urine / Stool', 'sample_type' => 'Urine', 'price' => 15.00],
            ['name' => 'Stool Analysis', 'code' => 'STOOL', 'category' => 'Urine / Stool', 'sample_type' => 'Stool', 'price' => 15.00],
            ['name' => 'Stool Occult Blood', 'code' => 'STOOL-OB', 'category' => 'Urine / Stool', 'sample_type' => 'Stool', 'price' => 20.00],

            ['name' => 'Urine Pregnancy Test', 'code' => 'PREG-URINE', 'category' => 'Hormones', 'sample_type' => 'Urine', 'price' => 15.00],
            ['name' => 'Beta HCG', 'code' => 'BHCG', 'category' => 'Hormones', 'sample_type' => 'Blood', 'price' => 30.00],
            ['name' => 'Prolactin', 'code' => 'PROLACTIN', 'category' => 'Hormones', 'sample_type' => 'Blood', 'price' => 30.00],

            ['name' => 'Hepatitis B Surface Antigen', 'code' => 'HBSAG', 'category' => 'Serology', 'sample_type' => 'Blood', 'price' => 25.00],
            ['name' => 'Hepatitis B Surface Antibody', 'code' => 'ANTI-HBS', 'category' => 'Serology', 'sample_type' => 'Blood', 'price' => 25.00],
            ['name' => 'Hepatitis C Antibody', 'code' => 'HCV-AB', 'category' => 'Serology', 'sample_type' => 'Blood', 'price' => 25.00],
            ['name' => 'HIV Screening Test', 'code' => 'HIV', 'category' => 'Serology', 'sample_type' => 'Blood', 'price' => 30.00],
            ['name' => 'Widal Test', 'code' => 'WIDAL', 'category' => 'Serology', 'sample_type' => 'Blood', 'price' => 20.00],
            ['name' => 'Wright Test', 'code' => 'WRIGHT', 'category' => 'Serology', 'sample_type' => 'Blood', 'price' => 20.00],
            ['name' => 'VDRL', 'code' => 'VDRL', 'category' => 'Serology', 'sample_type' => 'Blood', 'price' => 20.00],

            ['name' => 'COVID-19 PCR', 'code' => 'COVID-PCR', 'category' => 'Microbiology', 'sample_type' => 'Nasopharyngeal Swab', 'price' => 50.00],
            ['name' => 'COVID-19 Antigen', 'code' => 'COVID-AG', 'category' => 'Microbiology', 'sample_type' => 'Nasopharyngeal Swab', 'price' => 25.00],
            ['name' => 'Blood Culture', 'code' => 'BLOOD-CULT', 'category' => 'Microbiology', 'sample_type' => 'Blood', 'price' => 55.00],
            ['name' => 'Urine Culture', 'code' => 'URINE-CULT', 'category' => 'Microbiology', 'sample_type' => 'Urine', 'price' => 40.00],
            ['name' => 'Throat Culture', 'code' => 'THROAT-CULT', 'category' => 'Microbiology', 'sample_type' => 'Throat Swab', 'price' => 35.00],
            ['name' => 'Sputum Culture', 'code' => 'SPUTUM-CULT', 'category' => 'Microbiology', 'sample_type' => 'Sputum', 'price' => 40.00],

            ['name' => 'Prostate Specific Antigen', 'code' => 'PSA', 'category' => 'Tumor Markers', 'sample_type' => 'Blood', 'price' => 35.00],
        ];

        $created = 0;
        $updated = 0;

        foreach ($tests as $testData) {
            $test = Test::updateOrCreate(
                ['code' => $testData['code']],
                [
                    'name' => $testData['name'],
                    'category' => $testData['category'],
                    'sample_type' => $testData['sample_type'],
                    'price' => $testData['price'],
                    'description' => $testData['name'].' laboratory test',
                    'is_active' => true,
                ]
            );

            if ($test->wasRecentlyCreated) {
                $created++;
            } else {
                $updated++;
            }
        }

        $total = Test::count();

        $this->command->info("Tests seeded: {$created} created, {$updated} updated.");
        $this->command->info("Total tests in database: {$total}");
    }
}
