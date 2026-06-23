<?php

namespace App\Http\Controllers;

use App\Enums\DonationStatus;
use App\Http\Requests\StoreDonationRequest;
use App\Models\Donation;
use Illuminate\Http\JsonResponse;

class DonationController extends Controller
{
    public function store(StoreDonationRequest $request): JsonResponse
    {
        $donation = Donation::create([
            'donor_name' => $request->donor_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'amount' => $request->amount,
            'method' => $request->method,
            'status' => DonationStatus::Pending,
            'message' => $request->message,
        ]);

        return $this->successResponse($donation, 'Donation submitted successfully', 201);
    }
}
