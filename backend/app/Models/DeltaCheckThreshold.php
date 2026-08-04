<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeltaCheckThreshold extends Model
{
    protected $fillable = [
        'test_code',
        'test_name',
        'code_aliases',
        'absolute_delta',
        'percent_delta',
        'alert_on_flag_change',
        'is_active',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'code_aliases' => 'array',
            'absolute_delta' => 'float',
            'percent_delta' => 'float',
            'alert_on_flag_change' => 'boolean',
            'is_active' => 'boolean',
        ];
    }
}
