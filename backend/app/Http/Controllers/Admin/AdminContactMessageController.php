<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ContactMessageStatus;
use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminContactMessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ContactMessage::orderByDesc('created_at');

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return $this->successResponse($query->paginate(20));
    }

    public function markAsRead(ContactMessage $contactMessage): JsonResponse
    {
        $contactMessage->update(['status' => ContactMessageStatus::Read]);

        return $this->successResponse($contactMessage, 'Message marked as read');
    }
}
