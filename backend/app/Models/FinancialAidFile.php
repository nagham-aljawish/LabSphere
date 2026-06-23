<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FinancialAidFile extends Model
{
    protected $fillable = [
        'request_id',
        'file_path',
        'original_name',
    ];

    public function request(): BelongsTo
    {
        return $this->belongsTo(FinancialAidRequest::class, 'request_id');
    }
}
