<?php

namespace App\Models;

use App\Enums\FinancialAidStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FinancialAidRequest extends Model
{
    protected $fillable = [
        'user_id',
        'full_name',
        'phone',
        'reason',
        'status',
        'admin_notes',
    ];

    protected function casts(): array
    {
        return [
            'status' => FinancialAidStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(FinancialAidFile::class, 'request_id');
    }
}
