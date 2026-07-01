<?php

namespace App\Http\Middleware;

use App\Enums\UserStatus;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckActiveUser
{
    public function handle(Request $request, Closure $next): Response
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

        if ($user->status === UserStatus::Blocked) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been blocked. Please contact support.',
                'data' => null,
                'errors' => [],
            ], 403);
        }

        if ($user->status === UserStatus::Pending) {
            return response()->json([
                'success' => false,
                'message' => 'Your account is pending approval.',
                'data' => null,
                'errors' => [],
            ], 403);
        }

        return $next($request);
    }
}
