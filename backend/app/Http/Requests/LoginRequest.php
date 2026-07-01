<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'expected_role' => ['sometimes', 'string', Rule::in(['admin', 'doctor', 'technician', 'reception', 'patient'])],
            'role' => ['sometimes', 'string', Rule::in(['admin', 'doctor', 'technician', 'reception', 'patient'])],
        ];
    }
}
