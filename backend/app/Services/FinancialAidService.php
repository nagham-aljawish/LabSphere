<?php

namespace App\Services;

use App\Enums\FinancialAidStatus;
use App\Models\FinancialAidRequest;
use App\Models\Order;
use App\Models\Patient;
use Illuminate\Support\Facades\DB;

class FinancialAidService
{
    public function getActiveDiscountForUser(int $userId): float
    {
        $discount = FinancialAidRequest::query()
            ->where('user_id', $userId)
            ->where('status', FinancialAidStatus::Approved)
            ->whereNotNull('discount_percentage')
            ->whereNull('applied_order_id')
            ->orderByDesc('updated_at')
            ->value('discount_percentage');

        return $discount ? (float) $discount : 0.0;
    }

    public function getActiveDiscountForPatient(Patient $patient): float
    {
        return $this->getActiveDiscountForUser($patient->user_id);
    }

    public function orderIsFullyPaid(Order $order): bool
    {
        return $order->isFullyPaid($this->peekDiscountForOrder($order));
    }

    public function orderRemainingAmount(Order $order): float
    {
        return $order->remainingAmount($this->peekDiscountForOrder($order));
    }

    public function mapUnpaidOrder(Order $order): array
    {
        $discountPercentage = $this->peekDiscountForOrder($order);

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
    }

    
    public function peekDiscountForOrder(Order $order): float
    {
        if ($order->support_discount_percentage !== null) {
            return (float) $order->support_discount_percentage;
        }

        $order->loadMissing('patient');
        if (! $order->patient) {
            return 0.0;
        }

        return $this->getActiveDiscountForUser($order->patient->user_id);
    }

    /**
     * Batch discount peek to avoid N+1 financial_aid queries on list endpoints.
     *
     * @param  iterable<Order>  $orders
     * @return array<int, float> keyed by order id
     */
    public function peekDiscountsForOrders(iterable $orders): array
    {
        $map = [];
        $userOrderIds = [];

        foreach ($orders as $order) {
            if ($order->support_discount_percentage !== null) {
                $map[$order->id] = (float) $order->support_discount_percentage;

                continue;
            }

            $order->loadMissing('patient');
            if (! $order->patient) {
                $map[$order->id] = 0.0;

                continue;
            }

            $userOrderIds[$order->patient->user_id][] = $order->id;
        }

        if ($userOrderIds === []) {
            return $map;
        }

        $aids = FinancialAidRequest::query()
            ->whereIn('user_id', array_keys($userOrderIds))
            ->where('status', FinancialAidStatus::Approved)
            ->whereNotNull('discount_percentage')
            ->whereNull('applied_order_id')
            ->orderByDesc('updated_at')
            ->get(['user_id', 'discount_percentage'])
            ->unique('user_id')
            ->keyBy('user_id');

        foreach ($userOrderIds as $userId => $orderIds) {
            $discount = isset($aids[$userId])
                ? (float) $aids[$userId]->discount_percentage
                : 0.0;

            foreach ($orderIds as $orderId) {
                $map[$orderId] = $discount;
            }
        }

        return $map;
    }

    /**
     * Apply an approved unused aid request to the order (payment / checkout path).
     */
    public function getDiscountForOrder(Order $order): float
    {
        if ($order->support_discount_percentage !== null) {
            return (float) $order->support_discount_percentage;
        }

        if ($order->remainingAmount() <= 0) {
            return 0.0;
        }

        $order->loadMissing('patient');
        if (! $order->patient) {
            return 0.0;
        }

        return DB::transaction(function () use ($order) {
            $request = FinancialAidRequest::query()
                ->where('user_id', $order->patient->user_id)
                ->where('status', FinancialAidStatus::Approved)
                ->whereNotNull('discount_percentage')
                ->whereNull('applied_order_id')
                ->orderByDesc('updated_at')
                ->lockForUpdate()
                ->first();

            if (! $request) {
                return 0.0;
            }

            $order->update([
                'financial_aid_request_id' => $request->id,
                'support_discount_percentage' => $request->discount_percentage,
            ]);

            $request->update([
                'applied_order_id' => $order->id,
            ]);

            return (float) $request->discount_percentage;
        });
    }
}
