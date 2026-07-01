<?php

namespace App\Http\Controllers\Reception;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReceptionPaymentRequest;
use App\Models\Order;
use App\Models\Patient;
use App\Models\Payment;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class ReceptionPaymentController extends Controller
{
    public function __construct(private WalletService $walletService) {}

    public function unpaidOrders(Patient $patient): JsonResponse
    {
        $wallet = $this->walletService->getOrCreateWallet($patient);

        $orders = Order::with('tests')
            ->where('patient_id', $patient->id)
            ->whereNot('status', OrderStatus::Cancelled)
            ->orderByDesc('created_at')
            ->get()
            ->filter(fn (Order $order) => ! $order->isFullyPaid())
            ->values()
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'orderNumber' => $order->order_number,
                'totalAmount' => $order->total_amount,
                'remainingAmount' => number_format($order->remainingAmount(), 2, '.', ''),
                'status' => $order->status->value,
                'tests' => $order->tests->pluck('name')->values(),
                'createdAt' => $order->created_at->format('Y-m-d'),
            ]);

        return $this->successResponse([
            'walletBalance' => $wallet->balance,
            'orders' => $orders,
        ]);
    }

    public function store(StoreReceptionPaymentRequest $request): JsonResponse
    {
        $patient = Patient::findOrFail($request->patient_id);
        $order = Order::findOrFail($request->order_id);

        $method = $request->method === 'wallet'
            ? PaymentMethod::Wallet
            : PaymentMethod::Cash;

        try {
            $payment = $this->walletService->recordReceptionPayment(
                $patient,
                (float) $request->amount,
                $request->user(),
                $order,
                $method,
                $request->notes,
                $request->transaction_reference,
            );
        } catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), [], 422);
        }

        return $this->successResponse($payment->load('order'), 'Payment recorded successfully', 201);
    }

    public function patientPayments(Patient $patient): JsonResponse
    {
        $payments = Payment::with('order')
            ->where('user_id', $patient->user_id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Payment $payment) => [
                'id' => $payment->id,
                'amount' => $payment->amount,
                'method' => $payment->method->value,
                'status' => $payment->status->value,
                'orderNumber' => $payment->order?->order_number,
                'date' => $payment->created_at->format('Y-m-d'),
            ]);

        return $this->successResponse($payments);
    }
}
