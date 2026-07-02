<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'patient_id',
        'created_by',
        'status',
        'total_amount',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'total_amount' => 'decimal:2',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function tests(): BelongsToMany
    {
        return $this->belongsToMany(Test::class, 'order_tests')
            ->withPivot(['id', 'price', 'status'])
            ->withTimestamps();
    }

    public function orderTests(): HasMany
    {
        return $this->hasMany(OrderTest::class);
    }

    public function labResults(): HasMany
    {
        return $this->hasMany(LabResult::class);
    }

    public function labResult(): HasOne
    {
        return $this->hasOne(LabResult::class)->latestOfMany();
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function orderSamples(): HasMany
    {
        return $this->hasMany(OrderSample::class);
    }

    public function paidAmount(): float
    {
        return (float) $this->payments()
            ->where('status', PaymentStatus::Paid)
            ->sum('amount');
    }

    public function discountAmount(float $discountPercentage = 0): float
    {
        if ($discountPercentage <= 0) {
            return 0.0;
        }

        return round((float) $this->total_amount * ($discountPercentage / 100), 2);
    }

    public function payableAmount(float $discountPercentage = 0): float
    {
        return max(0, round((float) $this->total_amount - $this->discountAmount($discountPercentage), 2));
    }

    public function remainingAmount(float $discountPercentage = 0): float
    {
        return max(0, round($this->payableAmount($discountPercentage) - $this->paidAmount(), 2));
    }

    public function isFullyPaid(float $discountPercentage = 0): bool
    {
        return $this->remainingAmount($discountPercentage) <= 0;
    }
}
