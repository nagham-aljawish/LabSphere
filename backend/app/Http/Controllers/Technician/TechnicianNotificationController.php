<?php

namespace App\Http\Controllers\Technician;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TechnicianNotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = Notification::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        $orderIds = $notifications
            ->where('reference_type', 'order')
            ->pluck('reference_id')
            ->filter()
            ->unique()
            ->values();

        $ordersById = Order::query()
            ->with(['patient.user', 'orderSamples'])
            ->whereIn('id', $orderIds)
            ->get()
            ->keyBy('id');

        $payload = $notifications->map(function (Notification $notification) use ($ordersById) {
            $order = null;
            if ($notification->reference_type === 'order' && $notification->reference_id) {
                $order = $ordersById->get((int) $notification->reference_id);
            }

            $sampleId = $order?->orderSamples
                ?->firstWhere('label_code', '!=', null)
                ?->label_code;

            return [
                'id' => $notification->id,
                'title' => $notification->title,
                'message' => $notification->message,
                'type' => $notification->type,
                'is_read' => (bool) $notification->is_read,
                'created_at' => $notification->created_at?->toISOString(),
                'orderId' => $order?->id,
                'sampleId' => $sampleId ?: ($order ? "SMP-".str_pad((string) $order->id, 4, '0', STR_PAD_LEFT) : null),
                'qrImage' => $order?->qr_image_url,
            ];
        })->values();

        return $this->successResponse($payload);
    }

    public function markRead(Request $request, Notification $notification): JsonResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            return $this->errorResponse('Unauthorized', [], 403);
        }

        $notification->update(['is_read' => true]);

        return $this->successResponse($notification, 'Notification marked as read');
    }

    public function markAllRead(Request $request): JsonResponse
    {
        Notification::query()
            ->where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return $this->successResponse(null, 'All notifications marked as read');
    }
}
