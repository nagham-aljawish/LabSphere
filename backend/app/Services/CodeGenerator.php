<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Patient;

class CodeGenerator
{
    public static function patientCode(): string
    {
        do {
            $code = 'PAT-'.random_int(10000, 99999);
        } while (Patient::where('patient_code', $code)->exists());

        return $code;
    }

    public static function orderNumber(): string
    {
        do {
            $number = 'ORD-'.random_int(10000, 99999);
        } while (Order::where('order_number', $number)->exists());

        return $number;
    }
}
