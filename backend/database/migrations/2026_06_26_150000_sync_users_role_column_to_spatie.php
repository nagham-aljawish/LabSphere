<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    
    public function up(): void
    {
        if (! Schema::hasTable('roles') || ! Schema::hasTable('model_has_roles')) {
            return;
        }

        $guard = 'web';
        $roleNames = ['admin', 'doctor', 'technician', 'reception', 'patient'];

        foreach ($roleNames as $roleName) {
            Role::findOrCreate($roleName, $guard);
        }

        User::query()->each(function (User $user) use ($guard): void {
            if (! $user->role) {
                return;
            }

            $roleName = $user->role->value;

            if (! $user->hasRole($roleName)) {
                $user->assignRole($roleName);
            }
        });
    }

    public function down(): void
    {
        // Intentionally left empty to preserve assigned roles.
    }
};
