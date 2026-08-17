<?php

namespace App\Http\Requests;

use App\Services\CdssService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreResultRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id' => ['required', 'exists:orders,id'],
            'order_sample_id' => ['nullable', 'exists:order_samples,id'],
            'label_code' => ['nullable', 'string', 'max:100'],
            'report_name' => ['required', 'string', 'max:255'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.test_name' => ['required', 'string', 'max:255'],
            'items.*.test_code' => ['nullable', 'string', 'max:100'],
            'items.*.result_value' => ['required', 'string', 'max:255'],
            'items.*.unit' => ['nullable', 'string', 'max:50'],
            'items.*.normal_range' => ['nullable', 'string', 'max:100'],
            'items.*.status' => ['required', Rule::in(['normal', 'high', 'low', 'critical'])],
            'is_cdss' => ['sometimes', 'boolean'],
            'cdss_disease' => ['required_if:is_cdss,true', 'nullable', Rule::in(CdssService::supportedDiseases())],
            'cdss_features' => ['required_if:is_cdss,true', 'nullable', 'array'],
            'cdss_features.*' => ['nullable', 'numeric'],
        ];
    }
}
