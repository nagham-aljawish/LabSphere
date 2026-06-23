<?php

namespace App\Models;

use App\Enums\LabResultItemStatus;
use App\Enums\LabResultStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LabResult extends Model
{
    protected $fillable = [
        'order_id',
        'report_name',
        'status',
        'reviewed_by',
        'approved_at',
        'pdf_path',
    ];

    protected function casts(): array
    {
        return [
            'status' => LabResultStatus::class,
            'approved_at' => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(LabResultItem::class);
    }

    public function getSummaryStatusAttribute(): string
    {
        $priorities = [
            LabResultItemStatus::Critical->value => 4,
            LabResultItemStatus::High->value => 3,
            LabResultItemStatus::Low->value => 2,
            LabResultItemStatus::Normal->value => 1,
        ];

        $maxPriority = 0;
        $summary = 'normal';

        foreach ($this->items as $item) {
            $status = $item->status instanceof LabResultItemStatus
                ? $item->status->value
                : $item->status;
            $priority = $priorities[$status] ?? 0;
            if ($priority > $maxPriority) {
                $maxPriority = $priority;
                $summary = $status;
            }
        }

        return $summary;
    }
}
