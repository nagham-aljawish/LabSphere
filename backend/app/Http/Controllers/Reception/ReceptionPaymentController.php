<?php

namespace App\Http\Controllers\Reception;

use App\Enums\PaymentMethod;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReceptionPaymentRequest;
use App\Models\Order;
use App\Models\Patient;
use App\Models\Payment;
use App\Services\FinancialAidService;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class ReceptionPaymentController extends Controller
{
    public function __construct(
        private WalletService $walletService,
        private FinancialAidService $financialAidService,
    ) {}

    public function unpaidOrders(Patient $patient): JsonResponse
    {
        $wallet = $this->walletService->getOrCreateWallet($patient);

        $orders = Order::with(['tests', 'payments', 'patient'])
            ->where('patient_id', $patient->id)
            ->whereLikelyUnpaid()
            ->orderByDesc('created_at')
            ->limit(40)
            ->get();

        $discounts = $this->financialAidService->peekDiscountsForOrders($orders);

        $mapped = $orders
            ->filter(fn (Order $order) => ! $order->isFullyPaid($discounts[$order->id] ?? 0.0))
            ->values()
            ->map(function (Order $order) use ($discounts) {
                $discountPercentage = $discounts[$order->id] ?? 0.0;

                return [
                    'id' => $order->id,
                    'orderNumber' => $order->order_number,
                    'totalAmount' => number_format($order->outstandingAmount(), 2, '.', ''),
                    'discountPercentage' => $discountPercentage,
                    'discountAmount' => number_format($order->discountAmount($discountPercentage), 2, '.', ''),
                    'payableAmount' => number_format($order->payableAmount($discountPercentage), 2, '.', ''),
                    'remainingAmount' => number_format($order->remainingAmount($discountPercentage), 2, '.', ''),
                    'status' => $order->status->value,
                    'tests' => $order->tests->pluck('name')->values(),
                    'createdAt' => $order->created_at->format('Y-m-d'),
                ];
            });

        $financialAidDiscountPercentage = $mapped->isNotEmpty()
            ? ((float) ($mapped->first()['discountPercentage'] ?? 0))
            : $this->financialAidService->getActiveDiscountForPatient($patient);

        return $this->successResponse([
            'walletBalance' => $wallet->balance,
            'financialAidDiscountPercentage' => $financialAidDiscountPercentage,
            'orders' => $mapped,
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

        return $this->successResponse(
            $payment->load('order'),
            'Payment recorded successfully',
            201
        );
    }

    public function patientPayments(Patient $patient): JsonResponse
    {
        $perPage = min(50, max(1, (int) request()->integer('per_page', 20)));

        $payments = Payment::with('order')
            ->where(function ($query) use ($patient) {
                $query
                    ->where('user_id', $patient->user_id)
                    ->orWhereHas('order', fn ($orderQuery) => $orderQuery->where('patient_id', $patient->id));
            })
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->through(fn (Payment $payment) => [
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