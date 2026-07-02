<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;

class ValidTubeType implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || $value === '') {
            return;
        }

        $exists = DB::table('tube_types')
            ->where('name', $value)
            ->where('is_active', true)
            ->exists();

        if (! $exists) {
            $fail('The selected tube type is invalid.');
        }
    }
}
