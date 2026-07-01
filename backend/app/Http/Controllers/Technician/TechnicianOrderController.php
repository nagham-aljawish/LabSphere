<?php

namespace App\Http\Controllers\Technician;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTechnicianOrderSamplesRequest;
use App\Models\Order;
use App\Models\OrderSample;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TechnicianOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['patient.user', 'tests', 'orderSamples.test'])
            ->whereIn('status', [
                OrderStatus::Pending,
                OrderStatus::SampleCollected,
                OrderStatus::Processing,
            ])
            ->orderByDesc('created_at');

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return $this->successResponse($query->paginate(20));
    }

    public function show(Order $order): JsonResponse
    {
        return $this->successResponse(
            $order->load(['patient.user', 'tests', 'orderSamples.test', 'labResults'])
        );
    }

    public function storeSamples(
        StoreTechnicianOrderSamplesRequest $request,
        Order $order
    ): JsonResponse {
        if (in_array($order->status, [OrderStatus::Completed, OrderStatus::Cancelled], true)) {
            return $this->errorResponse('Cannot update samples for a closed order.', 422);
        }

        $samples = DB::transaction(function () use ($request, $order) {
            $created = [];

            foreach ($request->samples as $sample) {
                $created[] = OrderSample::updateOrCreate(
                    [
                        'order_id' => $order->id,
                        'test_id' => $sample['test_id'],
                    ],
                    [
                        'tube_type' => $sample['tube_type'],
                        'quantity' => $sample['quantity'],
                        'label_code' => "{$order->order_number}-{$sample['test_id']}",
                    ]
                );
            }

            $order->update(['status' => OrderStatus::Processing]);

            return $created;
        });

        return $this->successResponse([
            'order' => $order->fresh()->load(['patient.user', 'tests', 'orderSamples.test']),
            'samples' => $samples,
        ], 'Sample tubes assigned successfully');
    }
}
