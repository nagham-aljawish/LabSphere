<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTechnicianOrderSamplesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'samples' => ['required', 'array', 'min:1'],
            'samples.*.test_id' => ['required', 'exists:tests,id'],
            'samples.*.tube_type' => ['required', 'string', Rule::in([
                'EDTA',
                'SST',
                'Citrate',
                'Heparin',
                'Plain',
                'Fluoride',
                'Urine',
                'Stool',
                'Culture Swab',
                'Sputum',
                'Blood Culture',
            ])],
            'samples.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
