<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\FinancialAidRequest;
use App\Models\Notification;
use App\Models\Order;
use App\Models\User;

class ReceptionNotificationService
{
    public const TYPE_INVOICE_DISCOUNT = 'invoice_discount';

    public const TYPE_DISCOUNT_AVAILABLE = 'invoice_discount_available';

    /**
     * @return list<string>
     */
    public static function types(): array
    {
        return [
            self::TYPE_INVOICE_DISCOUNT,
            self::TYPE_DISCOUNT_AVAILABLE,
        ];
    }

    public function notifyDiscountApproved(FinancialAidRequest $aid): void
    {
        $percent = (float) $aid->discount_percentage;
        if ($percent <= 0) {
            return;
        }

        $aid->loadMissing('user');
        $patientName = $aid->user?->name ?: $aid->full_name;
        $percentLabel = $this->formatPercent($percent);

        $this->notifyReceptionists(
            title: 'Patient invoice discount',
            message: "{$patientName} has a {$percentLabel}% support discount to apply on their lab invoice.",
            type: self::TYPE_DISCOUNT_AVAILABLE,
            referenceType: 'financial_aid_request',
            referenceId: $aid->id,
        );
    }

    public function notifyInvoiceDiscount(Order $order, float $percent): void
    {
        if ($percent <= 0) {
            return;
        }

        $order->loadMissing('patient.user');
        $patientName = $order->patient?->user?->name ?? "Patient #{$order->patient_id}";
        $percentLabel = $this->formatPercent($percent);
        $discountAmount = number_format($order->discountAmount($percent), 2, '.', '');

        $this->notifyReceptionists(
            title: 'Invoice discount',
            message: "{$percentLabel}% discount on invoice {$order->order_number} for {$patientName} (−\${$discountAmount}).",
            type: self::TYPE_INVOICE_DISCOUNT,
            referenceType: 'order',
            referenceId: $order->id,
        );
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function listForUser(User $user, int $limit = 30): array
    {
        return Notification::query()
            ->where('user_id', $user->id)
            ->whereIn('type', self::types())
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(fn (Notification $notification) => [
                'id' => $notification->id,
                'title' => $notification->title,
                'message' => $notification->message,
                'time' => $notification->created_at?->diffForHumans() ?? '',
                'type' => 'discount',
                'isRead' => (bool) $notification->is_read,
            ])
            ->values()
            ->all();
    }

    private function notifyReceptionists(
        string $title,
        string $message,
        string $type,
        string $referenceType,
        int $referenceId,
    ): void {
        $receptionIds = User::query()
            ->where('role', UserRole::Reception->value)
            ->where('status', UserStatus::Active->value)
            ->pluck('id');

        foreach ($receptionIds as $userId) {
            $alreadySent = Notification::query()
                ->where('user_id', $userId)
                ->where('type', $type)
                ->where('reference_type', $referenceType)
                ->where('reference_id', $referenceId)
                ->exists();

            if ($alreadySent) {
                continue;
            }

            Notification::create([
                'user_id' => $userId,
                'title' => $title,
                'message' => $message,
                'type' => $type,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'is_read' => false,
            ]);
        }
    }

    private function formatPercent(float $percent): string
    {
        return fmod($percent, 1.0) === 0.0
            ? (string) (int) $percent
            : number_format($percent, 2, '.', '');
    }
}
