<?php

namespace App\Http\Controllers\Reception;

use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReceptionOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['patient.user', 'createdBy', 'tests'])
            ->orderByDesc('created_at');

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return $this->successResponse($query->paginate(20));
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = AdminOrderController::createOrder($request);

        return $this->successResponse($order, 'Order created successfully', 201);
    }
}
