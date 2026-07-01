<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class SyncUserRolesCommand extends Command
{
    protected $signature = 'users:sync-roles';

    protected $description = 'Sync Spatie roles from the legacy users.role column for all users';

    public function handle(): int
    {
        $synced = 0;

        User::query()->each(function (User $user) use (&$synced): void {
            if (! $user->role) {
                return;
            }

            $before = $user->getRoleNames()->sort()->values()->all();
            $user->syncSpatieRoleFromColumn();
            $user->refresh();
            $after = $user->getRoleNames()->sort()->values()->all();

            if ($before !== $after) {
                $synced++;
                $this->line("Synced {$user->email} -> {$user->role->value}");
            }
        });

        $this->info("Done. Updated {$synced} user(s).");

        return self::SUCCESS;
    }
}
