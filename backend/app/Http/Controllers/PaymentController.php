<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Http\Requests\StorePaymentRequest;
use App\Models\Order;
use App\Models\Payment;
use App\Services\FinancialAidService;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class PaymentController extends Controller
{
    public function __construct(
        private WalletService $walletService,
        private FinancialAidService $financialAidService,
    ) {}

    public function unpaidOrders(): JsonResponse
    {
        try {
            $patient = $this->walletService->ensurePatientProfile(request()->user());
        } catch (RuntimeException $e) {
            return $this->errorResponse($e->getMessage(), [], 422);
        }

        $wallet = $this->walletService->getOrCreateWallet($patient);

        $orders = Order::with(['tests', 'payments'])
            ->where('patient_id', $patient->id)
            ->whereNot('status', OrderStatus::Cancelled)
            ->orderByDesc('created_at')
            ->limit(40)
            ->get()
            ->filter(fn (Order $order) => ! $this->financialAidService->orderIsFullyPaid($order))
            ->values()
            ->map(fn (Order $order) => $this->financialAidService->mapUnpaidOrder($order));

        $financialAidDiscountPercentage = $orders->isNotEmpty()
            ? ((float) ($orders->first()['discountPercentage'] ?? 0))
            : $this->financialAidService->getActiveDiscountForPatient($patient);

        return $this->successResponse([
            'walletBalance' => $wallet->balance,
            'financialAidDiscountPercentage' => $financialAidDiscountPercentage,
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

            $discountPercentage = $this->financialAidService->getDiscountForOrder($order);

            if ($order->isFullyPaid($discountPercentage)) {
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
        $perPage = min(50, max(1, (int) request()->integer('per_page', 20)));

        $payments = Payment::with('order')
            ->where('user_id', request()->user()->id)
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return $this->successResponse($payments);
    }
}
