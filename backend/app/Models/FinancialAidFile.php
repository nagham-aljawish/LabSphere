<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class FinancialAidFile extends Model
{
    protected $fillable = [
        'request_id',
        'file_path',
        'original_name',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->file_path);
    }

    public function request(): BelongsTo
    {
        return $this->belongsTo(FinancialAidRequest::class, 'request_id');
    }
}
