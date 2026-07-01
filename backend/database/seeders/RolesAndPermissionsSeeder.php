<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $guard = 'web';

        $permissions = [
            'patients.view',
            'patients.manage',

            'orders.view',
            'orders.manage',

            'results.view',
            'results.manage',

            'payments.view',
            'payments.manage',

            'wallet.view',

            'financial_aid.manage',

            'admin.access',
            'doctor.access',
            'technician.access',
            'reception.access',
            'patient.access',
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['name' => $permission, 'guard_name' => $guard],
                ['name' => $permission, 'guard_name' => $guard]
            );
        }

        $roles = [
            'admin',
            'doctor',
            'technician',
            'reception',
            'patient',
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['name' => $role, 'guard_name' => $guard],
                ['name' => $role, 'guard_name' => $guard]
            );
        }

        Role::findByName('admin', $guard)->syncPermissions($permissions);

        Role::findByName('doctor', $guard)->syncPermissions([
            'doctor.access',
            'results.view',
            'results.manage',
        ]);

        Role::findByName('technician', $guard)->syncPermissions([
            'technician.access',
            'orders.view',
            'results.view',
            'results.manage',
        ]);

        Role::findByName('reception', $guard)->syncPermissions([
            'reception.access',
            'patients.view',
            'patients.manage',
            'orders.view',
            'orders.manage',
            'payments.view',
            'payments.manage',
            'wallet.view',
            'financial_aid.manage',
        ]);

        Role::findByName('patient', $guard)->syncPermissions([
            'patient.access',
            'results.view',
            'payments.view',
            'wallet.view',
        ]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
