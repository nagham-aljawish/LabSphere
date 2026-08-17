<?php

namespace App\Models;

use App\Casts\SafeEncrypted;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Builder;
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
        'financial_aid_request_id',
        'support_discount_percentage',
        'qr_image_url',
        'sent_to_technician_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'total_amount' => 'decimal:2',
            'notes' => SafeEncrypted::class,
            'support_discount_percentage' => 'decimal:2',
            'sent_to_technician_at' => 'datetime',
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

    public function financialAidRequest(): BelongsTo
    {
        return $this->belongsTo(FinancialAidRequest::class, 'financial_aid_request_id');
    }

    public function paidAmount(): float
    {
        if ($this->relationLoaded('payments')) {
            return round(
                (float) $this->payments
                    ->where('status', PaymentStatus::Paid)
                    ->sum(fn ($payment) => (float) $payment->amount),
                2
            );
        }

        return (float) $this->payments()
            ->where('status', PaymentStatus::Paid)
            ->sum('amount');
    }

    public function discountAmount(float $discountPercentage = 0): float
    {
        $discountPercentage = $discountPercentage > 0
            ? $discountPercentage
            : (float) ($this->support_discount_percentage ?? 0);

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

    /**
     * True when the order is free after discount, or the patient has paid
     * at least a partial amount toward it.
     */
    public function hasPaymentTowardOrder(float $discountPercentage = 0): bool
    {
        if ($this->payableAmount($discountPercentage) <= 0) {
            return true;
        }

        return $this->paidAmount() > 0;
    }

    public function outstandingAmount(): float
    {
        return max(0, round((float) $this->total_amount - $this->paidAmount(), 2));
    }

    /**
     * SQL-side unpaid filter using order-stored discount (or 0 when null).
     * Prefers indexable joins over PHP post-filtering after pagination.
     */
    public function scopeWhereLikelyUnpaid(Builder $query): Builder
    {
        $paid = PaymentStatus::Paid->value;

        return $query
            ->whereNot('status', OrderStatus::Cancelled)
            ->whereRaw(
                '(orders.total_amount * (100 - COALESCE(orders.support_discount_percentage, 0)) / 100)
                    > COALESCE((
                        SELECT SUM(payments.amount)
                        FROM payments
                        WHERE payments.order_id = orders.id
                          AND payments.status = ?
                    ), 0)',
                [$paid]
            );
    }
}
