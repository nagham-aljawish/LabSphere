<?php

return [
    
    'enabled' => env('AUDIT_LOG_ENABLED', true),

    'queue' => env('AUDIT_LOG_QUEUE', 'audit'),

    
    'log_http_mutations' => env('AUDIT_LOG_HTTP', true),

    'sensitive_keys' => [
        'password',
        'password_confirmation',
        'token',
        'current_password',
        'authorization',
    ],

    
    'ignore_path_prefixes' => [
        'api/admin/audit-logs',
        'up',
    ],
];
