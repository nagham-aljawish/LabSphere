<?php

namespace App\Http\Controllers\Technician;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TechnicianOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['patient.user', 'tests', 'labResults'])
            ->whereIn('status', ['sample_collected', 'processing'])
            ->orderByDesc('created_at');

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return $this->successResponse($query->paginate(20));
    }
}
