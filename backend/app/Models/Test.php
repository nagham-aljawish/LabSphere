<?php

namespace App\Models;

use App\Support\TestPreparation;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Test extends Model
{
    protected $fillable = [
        'name',
        'code',
        'category',
        'description',
        'preparation_instructions',
        'sample_type',
        'price',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Always expose a real preparation recommendation, even when the DB
     * column was never seeded.
     */
    protected function preparationInstructions(): Attribute
    {
        return Attribute::make(
            get: function (?string $value): string {
                if (is_string($value) && trim($value) !== '') {
                    return $value;
                }

                return TestPreparation::instructions(
                    (string) ($this->attributes['code'] ?? ''),
                    (string) ($this->attributes['category'] ?? ''),
                    (string) ($this->attributes['sample_type'] ?? ''),
                );
            },
        );
    }

    public function orders(): BelongsToMany
    {
        return $this->belongsToMany(Order::class, 'order_tests')
            ->withPivot(['price', 'status'])
            ->withTimestamps();
    }
}
