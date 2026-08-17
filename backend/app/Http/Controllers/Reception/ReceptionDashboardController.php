<?php

namespace App\Http\Controllers\Reception;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Services\FinancialAidService;
use App\Services\ReceptionNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class ReceptionDashboardController extends Controller
{
    public function __construct(
        private FinancialAidService $financialAidService,
        private ReceptionNotificationService $receptionNotifications,
    ) {}

    public function index(): JsonResponse
    {
        $today = Carbon::today();

        $recentOrders = Order::with(['patient.user:id,name', 'tests:id,name'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $pendingPaymentOrders = Order::with(['patient.user:id,name', 'tests:id,name', 'payments', 'patient'])
            ->where('status', OrderStatus::Pending)
            ->whereLikelyUnpaid()
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();

        $discounts = $this->financialAidService->peekDiscountsForOrders($pendingPaymentOrders);
        $pendingPaymentOrders = $pendingPaymentOrders
            ->filter(fn (Order $order) => ! $order->isFullyPaid($discounts[$order->id] ?? 0.0))
            ->values();

        $pendingPayments = $pendingPaymentOrders->take(5)->values();

        $recentPayments = Payment::with(['order:id,order_number', 'user:id,name'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $activities = collect()
            ->merge($recentOrders->map(fn (Order $order) => [
                'id' => "order-{$order->id}",
                'patient' => $order->patient?->user?->name ?? 'Unknown',
                'action' => 'Lab request created',
                'time' => $order->created_at->diffForHumans(),
                'created_at' => $order->created_at,
            ]))
            ->merge($recentPayments->map(fn (Payment $payment) => [
                'id' => "payment-{$payment->id}",
                'patient' => $payment->user?->name ?? 'Unknown',
                'action' => 'Payment received',
                'time' => $payment->created_at->diffForHumans(),
                'created_at' => $payment->created_at,
            ]))
            ->sortByDesc('created_at')
            ->take(5)
            ->values()
            ->map(fn (array $item) => [
                'id' => $item['id'],
                'patient' => $item['patient'],
                'action' => $item['action'],
                'time' => $item['time'],
            ]);

        $notifications = $this->receptionNotifications->listForUser(request()->user());

        return $this->successResponse([
            'stats' => [
                'recentRequests' => Order::whereDate('created_at', $today)->count(),
                'pendingPayments' => $pendingPaymentOrders->count(),
                'recentActivities' => $activities->count(),
            ],
            'recentRequests' => $recentOrders->map(fn (Order $order) => [
                'id' => $order->id,
                'patient' => $order->patient?->user?->name ?? 'Unknown',
                'requestId' => $order->order_number,
                'tests' => $order->tests->count(),
                'status' => $this->formatStatus($order->status->value),
            ]),
            'pendingPayments' => $pendingPayments->map(fn (Order $order) => [
                'id' => $order->id,
                'patient' => $order->patient?->user?->name ?? 'Unknown',
                'mrn' => $order->patient?->patient_code ?? '',
                'tests' => $order->tests->count(),
                'amount' => $order->remainingAmount($discounts[$order->id] ?? 0.0),
            ]),
            'recentActivities' => $activities,
            'notifications' => $notifications,
        ]);
    }

    private function formatStatus(string $status): string
    {
        return match ($status) {
            'pending' => 'Pending',
            'sample_collected' => 'Collected',
            'processing' => 'In Analysis',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            default => $status,
        };
    }
}
