<?php

namespace App\Http\Middleware;

use App\Services\AuditLogger;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Enqueues an audit job for mutating API calls without blocking the response.
 */
class LogApiAudit
{
    private const MUTATING = ['POST', 'PUT', 'PATCH', 'DELETE'];

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($this->shouldAudit($request)) {
            $user = $request->user();

            AuditLogger::queue([
                'user_id' => $user?->id,
                'user_role' => $user?->role instanceof \BackedEnum
                    ? $user->role->value
                    : ($user?->role ?? null),
                'action' => $this->resolveAction($request),
                'method' => $request->method(),
                'path' => '/'.ltrim($request->path(), '/'),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status_code' => $response->getStatusCode(),
                'subject_type' => null,
                'subject_id' => null,
                'meta' => [
                    'route' => optional($request->route())->getName(),
                    'query' => $request->query(),
                ],
            ]);
        }

        return $response;
    }

    private function shouldAudit(Request $request): bool
    {
        if (! config('audit.enabled', true) || ! config('audit.log_http_mutations', true)) {
            return false;
        }

        if (! in_array($request->method(), self::MUTATING, true)) {
            return false;
        }

        $path = ltrim($request->path(), '/');

        foreach (config('audit.ignore_path_prefixes', []) as $prefix) {
            $prefix = ltrim((string) $prefix, '/');
            if ($prefix !== '' && str_starts_with($path, $prefix)) {
                return false;
            }
        }

        return true;
    }

    private function resolveAction(Request $request): string
    {
        $path = trim($request->path(), '/');
        // api/doctor/results/12/approve -> doctor.results.approve
        $parts = array_values(array_filter(explode('/', $path), function ($part) {
            return $part !== '' && $part !== 'api' && ! ctype_digit($part);
        }));

        $action = implode('.', $parts);

        return strtolower($request->method()).'.'.($action !== '' ? $action : 'request');
    }
}
