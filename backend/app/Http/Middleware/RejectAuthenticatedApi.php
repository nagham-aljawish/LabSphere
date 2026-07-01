<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

class RejectAuthenticatedApi
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if ($token) {
            $accessToken = PersonalAccessToken::findToken($token);

            if ($accessToken && $accessToken->tokenable) {
                return response()->json([
                    'message' => 'أنت مسجل دخول مسبقًا. يرجى تسجيل الخروج أولًا قبل الدخول بحساب آخر.',
                    'code' => 'ALREADY_AUTHENTICATED',
                    'user' => [
                        'id' => $accessToken->tokenable->id,
                        'name' => $accessToken->tokenable->name,
                        'email' => $accessToken->tokenable->email,
                    ],
                ], 409);
            }
        }

        return $next($request);
    }
}
