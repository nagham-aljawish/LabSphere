<?php

namespace App\Providers;

use Illuminate\Support\Carbon;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\PersonalAccessToken;
use Laravel\Sanctum\Sanctum;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Sanctum::authenticateAccessTokensUsing(function ($accessToken, bool $isValid) {
            if (! $isValid) {
                return false;
            }

            if (! $accessToken instanceof PersonalAccessToken) {
                return true;
            }

            $idleMinutes = (int) config('sanctum.idle_timeout', 0);

            if ($idleMinutes <= 0) {
                return true;
            }

            $lastActive = $accessToken->last_used_at ?? $accessToken->created_at;

            if ($lastActive && Carbon::parse($lastActive)->lt(now()->subMinutes($idleMinutes))) {
                $accessToken->delete();

                return false;
            }

            return true;
        });
    }
}
