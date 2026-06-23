<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\OrderTestStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\Test;
use App\Services\CodeGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AdminOrderController extends Controller
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
        $order = $this->createOrder($request);

        return $this->successResponse($order, 'Order created successfully', 201);
    }

    public function show(Order $order): JsonResponse
    {
        return $this->successResponse(
            $order->load(['patient.user', 'createdBy', 'tests', 'labResults.items'])
        );
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $request->validate([
            'status' => ['required', Rule::in(['pending', 'sample_collected', 'processing', 'completed', 'cancelled'])],
        ]);

        $order->update(['status' => $request->status]);

        return $this->successResponse($order->load(['patient.user', 'tests']), 'Order status updated');
    }

    public static function createOrder(StoreOrderRequest $request): Order
    {
        return DB::transaction(function () use ($request) {
            $tests = Test::whereIn('id', $request->test_ids)->where('is_active', true)->get();

            if ($tests->isEmpty()) {
                throw ValidationException::withMessages([
                    'test_ids' => ['No valid tests selected.'],
                ]);
            }

            $totalAmount = $tests->sum('price');

            $order = Order::create([
                'order_number' => CodeGenerator::orderNumber(),
                'patient_id' => $request->patient_id,
                'created_by' => $request->user()->id,
                'status' => OrderStatus::Pending,
                'total_amount' => $totalAmount,
                'notes' => $request->notes,
            ]);

            foreach ($tests as $test) {
                $order->orderTests()->create([
                    'test_id' => $test->id,
                    'price' => $test->price,
                    'status' => OrderTestStatus::Pending,
                ]);
            }

            return $order->load(['patient.user', 'tests', 'createdBy']);
        });
    }
}
