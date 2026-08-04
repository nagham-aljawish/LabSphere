<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Audit logging
    |--------------------------------------------------------------------------
    |
    | Writes are always queued on the dedicated "audit" connection/queue so
    | HTTP workers stay fast. Run: php artisan queue:work --queue=audit,default
    |
    */
    'enabled' => env('AUDIT_LOG_ENABLED', true),

    'queue' => env('AUDIT_LOG_QUEUE', 'audit'),

    /*
    | Log mutating HTTP methods via middleware (POST/PUT/PATCH/DELETE).
    */
    'log_http_mutations' => env('AUDIT_LOG_HTTP', true),

    'sensitive_keys' => [
        'password',
        'password_confirmation',
        'token',
        'current_password',
        'authorization',
    ],

    /*
    | Paths that should never produce an audit entry (prefix match).
    */
    'ignore_path_prefixes' => [
        'api/admin/audit-logs',
        'up',
    ],
];
