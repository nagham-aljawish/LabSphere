<?php

namespace App\Services;

use App\Enums\FinancialAidStatus;
use App\Models\FinancialAidRequest;
use App\Models\Order;
use App\Models\Patient;

class FinancialAidService
{
    public function getActiveDiscountForUser(int $userId): float
    {
        $discount = FinancialAidRequest::query()
            ->where('user_id', $userId)
            ->where('status', FinancialAidStatus::Approved)
            ->whereNotNull('discount_percentage')
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
        $order->loadMissing('patient');

        if (! $order->patient) {
            return $order->isFullyPaid();
        }

        return $order->isFullyPaid($this->getActiveDiscountForPatient($order->patient));
    }

    public function orderRemainingAmount(Order $order): float
    {
        $order->loadMissing('patient');

        if (! $order->patient) {
            return $order->remainingAmount();
        }

        return $order->remainingAmount($this->getActiveDiscountForPatient($order->patient));
    }

    public function mapUnpaidOrder(Order $order, float $discountPercentage): array
    {
        return [
            'id' => $order->id,
            'orderNumber' => $order->order_number,
            'totalAmount' => number_format((float) $order->total_amount, 2, '.', ''),
            'discountPercentage' => $discountPercentage,
            'discountAmount' => number_format($order->discountAmount($discountPercentage), 2, '.', ''),
            'payableAmount' => number_format($order->payableAmount($discountPercentage), 2, '.', ''),
            'remainingAmount' => number_format($order->remainingAmount($discountPercentage), 2, '.', ''),
            'status' => $order->status->value,
            'tests' => $order->tests->pluck('name')->values(),
            'createdAt' => $order->created_at->format('Y-m-d'),
        ];
    }
}
