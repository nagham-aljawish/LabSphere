<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::with('patient')->orderByDesc('created_at');

        if ($request->role) {
            $query->where('role', $request->role);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return $this->successResponse($query->paginate(20));
    }

    public function updateStatus(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'status' => ['required', Rule::in(['active', 'pending', 'blocked'])],
        ]);

        $user->update(['status' => $request->status]);

        if ($request->status === 'active' && $user->role) {
            $user->syncRoles([$user->role->value]);
        }

        return $this->successResponse(
            $this->formatUser($user->fresh()->load('patient')),
            'User status updated successfully'
        );
    }

    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role?->value,
            'status' => $user->status->value,
            'created_at' => $user->created_at?->toISOString(),
        ];
    }
}
