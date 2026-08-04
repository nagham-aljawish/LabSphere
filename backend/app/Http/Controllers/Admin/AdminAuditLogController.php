<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAuditLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::query()
            ->with(['user:id,name,email,role'])
            ->orderByDesc('created_at')
            ->orderByDesc('id');

        if ($request->filled('action')) {
            $query->where('action', 'like', '%'.$request->string('action').'%');
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', (int) $request->user_id);
        }

        if ($request->filled('user_role')) {
            $query->where('user_role', $request->string('user_role'));
        }

        if ($request->filled('from')) {
            $query->where('created_at', '>=', $request->date('from')->startOfDay());
        }

        if ($request->filled('to')) {
            $query->where('created_at', '<=', $request->date('to')->endOfDay());
        }

        $logs = $query->paginate((int) $request->integer('per_page', 20));

        $logs->getCollection()->transform(function (AuditLog $log) {
            return [
                'id' => $log->id,
                'userId' => $log->user_id,
                'userName' => $log->user?->name,
                'userEmail' => $log->user?->email,
                'userRole' => $log->user_role,
                'action' => $log->action,
                'method' => $log->method,
                'path' => $log->path,
                'ipAddress' => $log->ip_address,
                'statusCode' => $log->status_code,
                'subjectType' => $log->subject_type,
                'subjectId' => $log->subject_id,
                'meta' => $log->meta,
                'createdAt' => $log->created_at?->toIso8601String(),
            ];
        });

        return $this->successResponse($logs);
    }
}
