<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TubeType extends Model
{
    protected $fillable = [
        'name',
        'color_class',
        'hex_color',
        'color_label',
        'additive',
        'use_for',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}
