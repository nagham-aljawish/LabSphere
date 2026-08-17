<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
                'data' => null,
                'errors' => [],
            ], 401);
        }

        // Role checks use users.role (and Spatie if already synced on login).
        // Do not sync Spatie on every request — that adds DB writes/lookups to all API calls.

        if ($user->isRoleAdmin()) {
            return $next($request);
        }

        if ($user->hasAnyRoleName(...$roles)) {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'message' => 'Forbidden. Insufficient permissions.',
            'data' => null,
            'errors' => [],
        ], 403);
    }
}
