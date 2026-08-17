<?php

namespace App\Models;

use App\Casts\SafeEncrypted;
use App\Enums\LabResultItemStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LabResultItem extends Model
{
    protected $fillable = [
        'lab_result_id',
        'test_name',
        'test_code',
        'result_value',
        'unit',
        'normal_range',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'result_value' => SafeEncrypted::class,
            'status' => LabResultItemStatus::class,
        ];
    }

    public function labResult(): BelongsTo
    {
        return $this->belongsTo(LabResult::class);
    }
}
