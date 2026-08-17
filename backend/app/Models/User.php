<?php

namespace App\Models;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasRoles, Notifiable;

    protected string $guard_name = 'web';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'role' => UserRole::class,
            'status' => UserStatus::class,
        ];
    }

    public function patient(): HasOne
    {
        return $this->hasOne(Patient::class);
    }

    public function createdOrders(): HasMany
    {
        return $this->hasMany(Order::class, 'created_by');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function financialAidRequests(): HasMany
    {
        return $this->hasMany(FinancialAidRequest::class);
    }

    public function appNotifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function reviewedResults(): HasMany
    {
        return $this->hasMany(LabResult::class, 'reviewed_by');
    }

    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin;
    }

    public function isPatient(): bool
    {
        return $this->role === UserRole::Patient;
    }

    public function isActive(): bool
    {
        return $this->status === UserStatus::Active;
    }

    public function syncSpatieRoleFromColumn(): void
    {
        if (! $this->role) {
            return;
        }

        $roleName = $this->role->value;

        if (! $this->hasRole($roleName)) {
            $this->syncRoles([$roleName]);
        }
    }

    public function isRoleAdmin(): bool
    {
        return $this->hasRole(UserRole::Admin->value)
            || $this->role === UserRole::Admin;
    }

    public function hasAnyRoleName(string ...$roles): bool
    {
        if ($roles !== [] && $this->hasAnyRole($roles)) {
            return true;
        }

        return $this->role !== null
            && in_array($this->role->value, $roles, true);
    }
}
