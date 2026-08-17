<?php

namespace App\Services;

use App\Enums\LabResultStatus;
use App\Enums\OrderSampleStatus;
use App\Enums\OrderStatus;
use App\Http\Requests\StoreResultRequest;
use App\Models\LabResult;
use App\Models\Order;
use App\Models\OrderSample;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class LabResultService
{
    /**
     * Create or update a draft/rejected lab result and sync order/sample status.
     * Used by the technician result-entry flow.
     */
    public function createOrUpdate(LabResult $result, StoreResultRequest $request): LabResult
    {
        return DB::transaction(function () use ($result, $request) {
            $isCdss = $request->boolean('is_cdss');
            $order = Order::query()->findOrFail($request->integer('order_id'));
            $sample = $this->resolveSample($order, $request);

            $result->fill([
                'order_id' => $order->id,
                'order_sample_id' => $sample?->id,
                'report_name' => $request->report_name,
                'status' => $result->exists ? $result->status : LabResultStatus::Draft,
                'is_cdss' => $isCdss,
            ]);

            if ($isCdss) {
                $this->applyCdssPrediction($result, $request);
            }

            $result->save();

            $result->items()->delete();

            foreach ($request->items as $item) {
                $result->items()->create($item);
            }

            if ($sample && $sample->status !== OrderSampleStatus::Approved) {
                $sample->update([
                    'status' => OrderSampleStatus::Analyzing,
                    'analyzing_at' => $sample->analyzing_at ?? now(),
                    'received_at' => $sample->received_at ?? now(),
                ]);
            }

            // Keep order status in sync so patient tracking can leave
            // "Received in Lab" and enter Result Entry / Analysis.
            if (
                $order
                && ! in_array($order->status, [OrderStatus::Completed, OrderStatus::Cancelled], true)
            ) {
                $orderUpdates = ['status' => OrderStatus::Processing];
                if ($order->sent_to_technician_at === null) {
                    $orderUpdates['sent_to_technician_at'] = now();
                }
                $order->update($orderUpdates);
            }

            return $result->load(['order.patient.user', 'orderSample', 'items']);
        });
    }

    public function resolveSample(Order $order, StoreResultRequest $request): ?OrderSample
    {
        $order->loadMissing('orderSamples');

        $sampleId = $request->integer('order_sample_id');
        if ($sampleId > 0) {
            $sample = $order->orderSamples->firstWhere('id', $sampleId);
            if (! $sample) {
                throw new RuntimeException('Sample does not belong to this order.');
            }

            return $sample;
        }

        $labelCode = trim((string) $request->input('label_code', ''));
        if ($labelCode !== '') {
            $sample = $order->orderSamples->first(
                fn (OrderSample $item) => strcasecmp((string) $item->label_code, $labelCode) === 0
            );
            if (! $sample) {
                throw new RuntimeException('No sample found for this QR label.');
            }

            return $sample;
        }

        return $order->orderSamples->count() === 1
            ? $order->orderSamples->first()
            : null;
    }

    /**
     * Score the entered values with the disease model and store decision support
     * output on the result so the doctor sees it during review.
     */
    private function applyCdssPrediction(LabResult $result, StoreResultRequest $request): void
    {
        $prediction = app(CdssService::class)->predict(
            $request->input('cdss_disease'),
            $request->input('cdss_features', []),
        );

        $result->fill([
            'cdss_disease' => $prediction['disease'],
            'cdss_outcome' => $prediction['outcome'],
            'cdss_prediction' => $prediction['prediction'],
            'cdss_confidence' => $prediction['confidence'],
            'cdss_recommendation' => $prediction['recommendation'],
            'cdss_predicted_at' => now(),
        ]);
    }
}
