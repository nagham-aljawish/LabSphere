<?php

namespace App\Http\Controllers\Reception;

use App\Enums\OrderStatus;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\StoreOrderSamplesRequest;
use App\Models\Order;
use App\Models\OrderSample;
use App\Models\Patient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ReceptionOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['patient.user', 'createdBy', 'tests'])
            ->orderByDesc('created_at');

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->patient_id) {
            $query->where('patient_id', $request->patient_id);
        }

        if ($request->boolean('unpaid')) {
            $query->whereNot('status', OrderStatus::Cancelled);
        }

        $orders = $query->paginate(20);

        if ($request->boolean('unpaid')) {
            $orders->setCollection(
                $orders->getCollection()->filter(fn (Order $order) => ! $order->isFullyPaid())->values()
            );
        }

        return $this->successResponse($orders);
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = AdminOrderController::createOrder($request);

        return $this->successResponse($order, 'Order created successfully', 201);
    }

    public function show(Order $order): JsonResponse
    {
        return $this->successResponse(
            $order->load(['patient.user', 'createdBy', 'tests', 'orderSamples.test', 'payments'])
        );
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $request->validate([
            'status' => ['required', Rule::in(['pending', 'sample_collected', 'processing', 'completed', 'cancelled'])],
        ]);

        $order->update(['status' => $request->status]);

        return $this->successResponse(
            $order->load(['patient.user', 'tests', 'orderSamples.test']),
            'Order status updated'
        );
    }

    public function storeSamples(StoreOrderSamplesRequest $request, Order $order): JsonResponse
    {
        $samples = DB::transaction(function () use ($request, $order) {
            $order->orderSamples()->delete();

            $created = [];

            foreach ($request->samples as $sample) {
                $created[] = OrderSample::create([
                    'order_id' => $order->id,
                    'test_id' => $sample['test_id'],
                    'tube_type' => ! empty($sample['tube_type']) ? $sample['tube_type'] : null,
                    'quantity' => $sample['quantity'],
                    'label_code' => "{$order->order_number}-{$sample['test_id']}",
                ]);
            }

            if ($request->boolean('mark_collected')) {
                $order->update(['status' => OrderStatus::SampleCollected]);
            }

            return $created;
        });

        return $this->successResponse([
            'order' => $order->fresh()->load(['patient.user', 'tests', 'orderSamples.test']),
            'samples' => $samples,
        ], 'Sample tubes saved successfully', 201);
    }

    public function patientOrders(Patient $patient): JsonResponse
    {
        $orders = Order::with(['tests', 'payments'])
            ->where('patient_id', $patient->id)
            ->orderByDesc('created_at')
            ->get();

        return $this->successResponse($orders);
    }
}
