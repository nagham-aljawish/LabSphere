<?php

namespace App\Jobs;

use App\Models\AuditLog;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Carbon;
use Throwable;


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
        
        logger()->warning('Audit log job failed', [
            'action' => $this->payload['action'] ?? null,
            'error' => $exception?->getMessage(),
        ]);
    }
}
