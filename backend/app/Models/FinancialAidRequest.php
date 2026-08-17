<?php

namespace App\Models;

use App\Casts\SafeEncrypted;
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
        'discount_percentage',
        'applied_order_id',
    ];

    protected function casts(): array
    {
        return [
            'status' => FinancialAidStatus::class,
            'reason' => SafeEncrypted::class,
            'admin_notes' => SafeEncrypted::class,
            'discount_percentage' => 'decimal:2',
            'applied_order_id' => 'integer',
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

    public function appliedOrder(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'applied_order_id');
    }
}
