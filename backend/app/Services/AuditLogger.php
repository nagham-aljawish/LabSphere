<?php

namespace App\Services;

use App\Jobs\WriteAuditLogJob;
use Illuminate\Support\Facades\Auth;

/**
 * Fire-and-forget audit recorder.
 * Always dispatches WriteAuditLogJob to the "audit" queue — never writes
 * synchronously inside the HTTP request.
 */
class AuditLogger
{
    /**
     * @param  array<string, mixed>  $meta
     */
    public static function record(
        string $action,
        array $meta = [],
        ?string $subjectType = null,
        ?int $subjectId = null,
        ?int $statusCode = null,
    ): void {
        if (! config('audit.enabled', true)) {
            return;
        }

        $request = request();
        $user = Auth::user();

        $payload = [
            'user_id' => $user?->id,
            'user_role' => $user?->role instanceof \BackedEnum
                ? $user->role->value
                : ($user?->role ?? null),
            'action' => $action,
            'method' => $request?->method(),
            'path' => $request ? '/'.ltrim($request->path(), '/') : null,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'status_code' => $statusCode,
            'subject_type' => $subjectType,
            'subject_id' => $subjectId,
            'meta' => $meta === [] ? null : self::sanitizeMeta($meta),
            'created_at' => now()->toIso8601String(),
        ];

        WriteAuditLogJob::dispatch($payload);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public static function queue(array $payload): void
    {
        if (! config('audit.enabled', true)) {
            return;
        }

        if (! isset($payload['created_at'])) {
            $payload['created_at'] = now()->toIso8601String();
        }

        if (isset($payload['meta']) && is_array($payload['meta'])) {
            $payload['meta'] = self::sanitizeMeta($payload['meta']);
        }

        WriteAuditLogJob::dispatch($payload);
    }

    /**
     * Strip secrets / oversized bodies before enqueueing.
     *
     * @param  array<string, mixed>  $meta
     * @return array<string, mixed>
     */
    private static function sanitizeMeta(array $meta): array
    {
        $blocked = array_flip(config('audit.sensitive_keys', [
            'password',
            'password_confirmation',
            'token',
            'current_password',
        ]));

        $clean = [];
        foreach ($meta as $key => $value) {
            if (isset($blocked[strtolower((string) $key)])) {
                $clean[$key] = '[redacted]';
                continue;
            }

            if (is_array($value)) {
                $clean[$key] = self::sanitizeMeta($value);
                continue;
            }

            if (is_string($value) && mb_strlen($value) > 500) {
                $clean[$key] = mb_substr($value, 0, 500).'…';
                continue;
            }

            $clean[$key] = $value;
        }

        return $clean;
    }
}
