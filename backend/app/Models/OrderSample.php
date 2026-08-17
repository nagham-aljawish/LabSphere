<?php

namespace App\Models;

use App\Enums\OrderSampleStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OrderSample extends Model
{
    protected $fillable = [
        'order_id',
        'test_id',
        'tube_type',
        'quantity',
        'label_code',
        'status',
        'received_at',
        'analyzing_at',
    ];

    protected $appends = [
        'qr_image_url',
    ];

    protected function casts(): array
    {
        return [
            'status' => OrderSampleStatus::class,
            'received_at' => 'datetime',
            'analyzing_at' => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function test(): BelongsTo
    {
        return $this->belongsTo(Test::class);
    }

    public function labResults(): HasMany
    {
        return $this->hasMany(LabResult::class);
    }

    public function labResult(): HasOne
    {
        return $this->hasOne(LabResult::class)->latestOfMany();
    }

    public function getQrImageUrlAttribute(): ?string
    {
        if (! $this->label_code) {
            return null;
        }

        return self::qrImageUrlForLabel($this->label_code);
    }

    public static function qrImageUrlForLabel(string $labelCode): string
    {
        return 'https://api.qrserver.com/v1/create-qr-code/?size=320x320&data='
            .urlencode($labelCode);
    }

    public function markReceived(): void
    {
        if ($this->status === OrderSampleStatus::Pending) {
            $this->update([
                'status' => OrderSampleStatus::Received,
                'received_at' => $this->received_at ?? now(),
            ]);
        }
    }

    public function markAnalyzing(): bool
    {
        if (in_array($this->status, [
            OrderSampleStatus::Analyzing,
            OrderSampleStatus::PendingReview,
            OrderSampleStatus::Approved,
        ], true)) {
            return false;
        }

        $this->update([
            'status' => OrderSampleStatus::Analyzing,
            'analyzing_at' => $this->analyzing_at ?? now(),
            'received_at' => $this->received_at ?? now(),
        ]);

        return true;
    }
}
