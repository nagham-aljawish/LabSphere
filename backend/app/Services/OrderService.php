<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\OrderTestStatus;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\Test;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function __construct(
        private FinancialAidService $financialAidService,
        private ReceptionNotificationService $receptionNotifications,
    ) {}

    /**
     * Create a lab order with the selected active tests.
     * Used by reception (and any other authenticated staff flow).
     */
    public function create(StoreOrderRequest $request): Order
    {
        $order = DB::transaction(function () use ($request) {
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

        $discount = $this->financialAidService->peekDiscountForOrder($order);
        if ($discount > 0) {
            $this->receptionNotifications->notifyInvoiceDiscount($order, $discount);
        }

        return $order;
    }

    /**
     * Next reception screen for an unfinished order, or null when the
     * receptionist workflow is already complete.
     */
    public function receptionNextStep(Order $order, float $discountPercentage = 0): ?string
    {
        if ($order->status === OrderStatus::Cancelled) {
            return null;
        }

        $order->loadMissing('orderSamples');
        $hasSamples = $order->orderSamples->isNotEmpty();
        $remaining = $order->remainingAmount($discountPercentage);
        $sent = $order->sent_to_technician_at !== null;

        if ($remaining > 0.001) {
            return $hasSamples || $sent ? 'payment' : 'qr';
        }

        if (! $sent) {
            return 'qr';
        }

        return null;
    }
}
