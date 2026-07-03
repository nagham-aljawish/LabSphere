<?php

namespace App\Support;

class TestPreparation
{
    public static function instructions(string $code, string $category, string $sampleType): string
    {
        $code = strtoupper(trim($code));
        $category = strtolower(trim($category));
        $sampleType = strtolower(trim($sampleType));

        $byCode = [
            'FBS' => 'Fast for 8–12 hours before collection. Water is allowed; avoid coffee, tea, and smoking.',
            'LOINC:23390-0' => 'Fast for 8–12 hours before collection. Water is allowed; avoid coffee, tea, and smoking.',
            'RBS' => 'No fasting required. Note the time of your last meal on the request form.',
            'HBA1C' => 'No fasting required. This test reflects average glucose over the past 2–3 months.',
            'LIPID' => 'Fast for 9–12 hours before collection. Water only during fasting.',
            'CHOL' => 'Fast for 9–12 hours before collection unless your doctor advises otherwise.',
            'TG' => 'Fast for 9–12 hours before collection. Avoid alcohol for 24 hours beforehand.',
            'HDL' => 'Fast for 9–12 hours before collection unless your doctor advises otherwise.',
            'LDL' => 'Fast for 9–12 hours before collection unless your doctor advises otherwise.',
            'LFT' => 'Fast for 8–12 hours if combined with lipid testing; otherwise follow clinician advice.',
            'URINE' => 'Collect a clean mid-stream urine sample. Morning first void is preferred.',
            'URINE-CULT' => 'Collect mid-stream urine using a sterile container. Avoid contamination from skin.',
            'PREG-URINE' => 'Use first morning urine for best sensitivity.',
            'STOOL' => 'Collect a fresh stool sample in the provided container. Avoid urine contamination.',
            'STOOL-OB' => 'Avoid red meat, aspirin, and vitamin C for 3 days before testing if possible.',
            'COVID-PCR' => 'No eating or drinking 30 minutes before nasopharyngeal swab collection.',
            'COVID-AG' => 'No eating or drinking 30 minutes before swab collection.',
            'THROAT-CULT' => 'Do not use mouthwash or antibiotics before sampling unless instructed by your doctor.',
            'SPUTUM-CULT' => 'Collect early-morning deep cough sputum in a sterile container.',
            'BLOOD-CULT' => 'Inform staff about recent antibiotic use. Samples are taken before antibiotics when possible.',
            'PT' => 'Inform the lab if you take anticoagulants such as warfarin.',
            'PTT' => 'Inform the lab if you take anticoagulants such as heparin or warfarin.',
            'INR' => 'Inform the lab if you take warfarin. Testing is often done at a consistent time of day.',
            'PSA' => 'Avoid ejaculation and vigorous cycling for 48 hours before the test if possible.',
            'BHCG' => 'No special preparation required. Early morning sample may be preferred.',
        ];

        if (isset($byCode[$code])) {
            return $byCode[$code];
        }

        if (str_contains($sampleType, 'urine')) {
            return 'Collect a clean mid-stream urine sample in a sterile container.';
        }

        if (str_contains($sampleType, 'stool')) {
            return 'Collect a fresh stool sample in the dedicated container provided by the lab.';
        }

        if (str_contains($sampleType, 'swab') || str_contains($sampleType, 'nasopharyngeal')) {
            return 'Avoid eating, drinking, and mouthwash for 30 minutes before swab collection.';
        }

        if (str_contains($sampleType, 'sputum')) {
            return 'Collect an early-morning deep cough sputum sample when possible.';
        }

        return match ($category) {
            'diabetes' => 'Follow fasting instructions given for your specific glucose-related test.',
            'lipid profile' => 'Fast for 9–12 hours before collection. Water only during fasting.',
            'liver function', 'kidney function', 'chemistry' => 'Fast for 8–12 hours if your doctor requested fasting labs; water is allowed.',
            'electrolytes' => 'No special preparation unless your doctor advises fasting.',
            'hematology', 'coagulation' => 'No fasting required unless combined with other fasting tests.',
            'thyroid', 'hormones', 'tumor markers' => 'No special preparation required unless your clinician advises otherwise.',
            'serology', 'immunology', 'inflammation' => 'No special preparation required.',
            'iron studies', 'vitamins' => 'Morning collection is preferred. Follow clinician advice for fasting.',
            'microbiology' => 'Follow sample-specific collection instructions provided by the laboratory.',
            'urine / stool' => 'Use the appropriate sterile container and follow clean collection technique.',
            default => 'No special preparation required unless your doctor gives other instructions.',
        };
    }

    public static function description(string $name, string $category): string
    {
        return match (strtolower(trim($category))) {
            'hematology' => "{$name} — blood test for evaluating blood cells and related markers.",
            'chemistry' => "{$name} — blood chemistry analysis.",
            'diabetes' => "{$name} — test used in diabetes screening and monitoring.",
            'lipid profile' => "{$name} — assesses cholesterol and fat levels in blood.",
            'liver function' => "{$name} — evaluates liver health and enzyme activity.",
            'kidney function' => "{$name} — assesses kidney performance.",
            'thyroid' => "{$name} — evaluates thyroid gland function.",
            'coagulation' => "{$name} — assesses blood clotting function.",
            'serology' => "{$name} — detects antibodies or infectious markers.",
            'microbiology' => "{$name} — identifies microorganisms in the submitted sample.",
            'urine / stool' => "{$name} — analysis of urine or stool specimen.",
            default => "{$name} — laboratory diagnostic test.",
        };
    }
}
