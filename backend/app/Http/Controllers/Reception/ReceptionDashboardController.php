<?php

namespace App\Http\Controllers\Reception;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Services\FinancialAidService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class ReceptionDashboardController extends Controller
{
    public function __construct(private FinancialAidService $financialAidService) {}
    public function index(): JsonResponse
    {
        $today = Carbon::today();

        $recentOrders = Order::with(['patient.user', 'tests'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $pendingPayments = Order::with(['patient.user', 'tests'])
            ->where('status', OrderStatus::Pending)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->filter(fn (Order $order) => ! $order->isFullyPaid())
            ->filter(fn (Order $order) => ! $this->financialAidService->orderIsFullyPaid($order))
            ->values();

        $recentPayments = Payment::with(['order', 'user'])
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

        $notifications = collect()
            ->merge($recentOrders->take(3)->map(fn (Order $order) => [
                'id' => 1000 + $order->id,
                'title' => 'New Lab Request Created',
                'message' => "Lab request {$order->order_number} created for {$order->patient?->user?->name}",
                'time' => $order->created_at->diffForHumans(),
                'type' => 'request',
                'isRead' => $order->created_at->lt($today),
            ]))
            ->merge($recentPayments->take(3)->map(fn (Payment $payment) => [
                'id' => 2000 + $payment->id,
                'title' => 'Payment Received',
                'message' => "Payment of \${$payment->amount} received".($payment->order ? " for {$payment->order->order_number}" : ''),
                'time' => $payment->created_at->diffForHumans(),
                'type' => 'payment',
                'isRead' => $payment->created_at->lt($today),
            ]))
            ->sortByDesc(fn ($item) => $item['time'])
            ->take(10)
            ->values();

        return $this->successResponse([
            'stats' => [
                'recentRequests' => Order::whereDate('created_at', $today)->count(),
                'pendingPayments' => Order::where('status', OrderStatus::Pending)
                    ->get()
                    ->filter(fn (Order $order) => ! $order->isFullyPaid())
                    ->filter(fn (Order $order) => ! $this->financialAidService->orderIsFullyPaid($order))
                    ->count(),
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
                'amount' => (float) $order->remainingAmount(),
                'amount' => $this->financialAidService->orderRemainingAmount($order),
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
