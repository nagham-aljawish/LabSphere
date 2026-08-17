<?php

use Laravel\Sanctum\Sanctum;

return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
        Sanctum::currentApplicationUrlWithPort(),
    ))),

    'guard' => ['web'],

    /*
    | Absolute token lifetime in minutes (from creation). 0 disables the cap.
    | After this, the user must log in again even if they were still active.
    */
    'expiration' => (int) env('SANCTUM_EXPIRATION', 480),

    /*
    | Idle timeout in minutes. A token unused for this long is revoked.
    | Activity (API requests) refreshes last_used_at and extends the session.
    */
    'idle_timeout' => (int) env('SANCTUM_IDLE_TIMEOUT', 15),

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
        'validate_csrf_token' => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    ],
];
