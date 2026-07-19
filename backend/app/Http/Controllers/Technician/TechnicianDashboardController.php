<?php

namespace App\Http\Controllers\Technician;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class TechnicianDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $now = now();
        $todayStart = $now->copy()->startOfDay();

        $activeQuery = Order::query()
            ->whereIn('status', [
                OrderStatus::Pending,
                OrderStatus::SampleCollected,
                OrderStatus::Processing,
            ]);

        $assignedToday = (clone $activeQuery)
            ->where('created_at', '>=', $todayStart)
            ->count();

        $pendingCount = (clone $activeQuery)
            ->whereIn('status', [OrderStatus::Pending, OrderStatus::SampleCollected])
            ->count();

        $completedToday = Order::query()
            ->where('status', OrderStatus::Completed)
            ->where('updated_at', '>=', $todayStart)
            ->count();

        $criticalCount = (clone $activeQuery)
            ->whereIn('status', [OrderStatus::Pending, OrderStatus::SampleCollected])
            ->where('created_at', '<=', $now->copy()->subHours(4))
            ->count();

        $assignedSamples = (clone $activeQuery)
            ->with(['patient.user', 'tests', 'orderSamples'])
            ->orderByDesc('created_at')
            ->limit(8)
            ->get()
            ->map(function (Order $order) use ($now) {
                $sampleCode = $order->orderSamples
                    ->firstWhere('label_code', '!=', null)
                    ?->label_code ?: "SMP-".str_pad((string) $order->id, 4, '0', STR_PAD_LEFT);

                $priority = $order->status === OrderStatus::Pending
                    && $order->created_at?->lte($now->copy()->subHours(6))
                    ? 'STAT'
                    : ($order->status === OrderStatus::Pending ? 'Urgent' : 'Routine');

                $testNames = $order->tests?->pluck('name')->values() ?? collect();
                $testSummary = $testNames->isEmpty()
                    ? 'No tests assigned'
                    : ($testNames->count() > 1
                        ? $testNames->first().' + '.($testNames->count() - 1).' more'
                        : (string) $testNames->first());

                return [
                    'id' => $order->id,
                    'orderId' => $order->id,
                    'patient' => $order->patient?->user?->name ?? "Patient #{$order->patient_id}",
                    'sampleCode' => $sampleCode,
                    'test' => $testSummary,
                    'priority' => $priority,
                    'status' => $this->sampleStatusLabel($order->status),
                    'time' => $order->created_at?->format('h:i A') ?? '-',
                ];
            })
            ->values();

        $recentActivities = Order::query()
            ->with(['patient.user', 'orderSamples'])
            ->orderByDesc('updated_at')
            ->limit(8)
            ->get()
            ->map(function (Order $order) use ($now) {
                $sampleCode = $order->orderSamples
                    ->firstWhere('label_code', '!=', null)
                    ?->label_code ?: "SMP-".str_pad((string) $order->id, 4, '0', STR_PAD_LEFT);

                return [
                    'id' => $order->id,
                    'orderId' => $order->id,
                    'type' => $order->status->value,
                    'text' => $this->activityText($order, $sampleCode),
                    'time' => $order->updated_at
                        ? Carbon::parse($order->updated_at)->diffForHumans($now, short: true)
                        : 'just now',
                ];
            })
            ->values();

        return $this->successResponse([
            'stats' => [
                'assignedToday' => $assignedToday,
                'pending' => $pendingCount,
                'completed' => $completedToday,
                'critical' => $criticalCount,
            ],
            'assignedSamples' => $assignedSamples,
            'recentActivities' => $recentActivities,
        ]);
    }

    private function sampleStatusLabel(OrderStatus $status): string
    {
        return match ($status) {
            OrderStatus::Pending => 'Received',
            OrderStatus::SampleCollected => 'Collected',
            OrderStatus::Processing => 'In Analysis',
            OrderStatus::Completed => 'Completed',
            OrderStatus::Cancelled => 'Cancelled',
        };
    }

    private function activityText(Order $order, string $sampleCode): string
    {
        $patientName = $order->patient?->user?->name ?? "Patient #{$order->patient_id}";

        return match ($order->status) {
            OrderStatus::Pending => "New sample assigned: {$sampleCode} for {$patientName}",
            OrderStatus::SampleCollected => "Sample {$sampleCode} marked as collected",
            OrderStatus::Processing => "Analysis in progress for sample {$sampleCode}",
            OrderStatus::Completed => "Order {$order->order_number} completed",
            OrderStatus::Cancelled => "Order {$order->order_number} was cancelled",
        };
    }
}
