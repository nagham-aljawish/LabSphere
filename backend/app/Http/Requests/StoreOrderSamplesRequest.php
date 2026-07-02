<?php

namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Rules\ValidTubeType;

class StoreOrderSamplesRequest extends FormRequest
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
            'samples.*.tube_type' => ['nullable', 'string', Rule::in([
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
            'samples.*.tube_type' => ['nullable', 'string', new ValidTubeType],
            'samples.*.quantity' => ['required', 'integer', 'min:1'],
            'mark_collected' => ['sometimes', 'boolean'],
        ];
    }
}
