<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Http\Requests\StorePaymentRequest;
use App\Models\Order;
use App\Models\Payment;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class PaymentController extends Controller
{
    public function __construct(private WalletService $walletService) {}

    public function unpaidOrders(): JsonResponse
    {
        try {
            $patient = $this->walletService->ensurePatientProfile(request()->user());
        } catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), [], 422);
        }

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

    public function store(StorePaymentRequest $request): JsonResponse
    {
        $user = $request->user();

        try {
            $patient = $this->walletService->ensurePatientProfile($user);
        } catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), [], 422);
        }

        if ($request->method !== PaymentMethod::Wallet->value) {
            return $this->errorResponse('Only wallet payments are supported', [], 422);
        }

        $order = null;

        if ($request->order_id) {
            $order = Order::find($request->order_id);

            if (! $order || $order->patient_id !== $patient->id) {
                return $this->errorResponse('Order not found or does not belong to you', [], 404);
            }

            if ($order->isFullyPaid()) {
                return $this->errorResponse('This order has already been paid', [], 422);
            }
        }

        try {
            $payment = $this->walletService->payFromWallet(
                $patient,
                (float) $request->amount,
                $user,
                $order,
                $request->notes
            );
        } catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), [], 422);
        }

        return $this->successResponse($payment, 'Payment completed from wallet', 201);
    }

    public function myPayments(): JsonResponse
    {
        $payments = Payment::with('order')
            ->where('user_id', request()->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return $this->successResponse($payments);
    }
}
