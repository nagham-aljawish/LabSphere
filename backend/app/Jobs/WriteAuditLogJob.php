<?php

namespace App\Jobs;

use App\Models\AuditLog;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Carbon;
use Throwable;

/**
 * Persists audit entries on the dedicated "audit" queue so request
 * threads never wait on the audit_logs write.
 */
class WriteAuditLogJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 5;

    /**
     * @param  array<string, mixed>  $payload
     */
    public function __construct(public array $payload)
    {
        $this->onQueue((string) config('audit.queue', 'audit'));
    }

    public function handle(): void
    {
        $data = $this->payload;
        $data['created_at'] = isset($data['created_at'])
            ? Carbon::parse($data['created_at'])
            : now();

        // Keep user_agent / path bounded even if upstream forgot to trim.
        if (isset($data['user_agent'])) {
            $data['user_agent'] = mb_substr((string) $data['user_agent'], 0, 500);
        }
        if (isset($data['path'])) {
            $data['path'] = mb_substr((string) $data['path'], 0, 500);
        }

        AuditLog::query()->create($data);
    }

    public function failed(?Throwable $exception): void
    {
        // Never break the app if audit persistence fails; log locally only.
        logger()->warning('Audit log job failed', [
            'action' => $this->payload['action'] ?? null,
            'error' => $exception?->getMessage(),
        ]);
    }
}
