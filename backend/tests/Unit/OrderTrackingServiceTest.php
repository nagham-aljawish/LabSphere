<?php

namespace Tests\Unit;

use App\Enums\LabResultStatus;
use App\Enums\OrderSampleStatus;
use App\Models\LabResult;
use App\Services\OrderTrackingService;
use Tests\TestCase;

class OrderTrackingServiceTest extends TestCase
{
    private OrderTrackingService $tracking;

    protected function setUp(): void
    {
        parent::setUp();
        $this->tracking = app(OrderTrackingService::class);
    }

    public function test_current_step_for_sample_follows_status_progression(): void
    {
        $patient = $this->makePatientUser()->patient;

        $pendingTest = $this->makeLabTest(['name' => 'Step Pending', 'code' => 'LOINC:SP1']);
        $pendingOrder = $this->makeOrder($patient, null, [], [$pendingTest]);
        $pendingWithLabel = $this->makeSample($pendingOrder, $pendingTest, [
            'label_code' => "{$pendingOrder->order_number}-{$pendingTest->id}",
            'status' => OrderSampleStatus::Pending,
        ]);
        $this->assertSame(1, $this->tracking->currentStepForSample($pendingOrder, $pendingWithLabel));

        $receivedTest = $this->makeLabTest(['name' => 'Step Received', 'code' => 'LOINC:SP2']);
        $receivedOrder = $this->makeOrder($patient, null, [], [$receivedTest]);
        $received = $this->makeSample($receivedOrder, $receivedTest, [
            'label_code' => "{$receivedOrder->order_number}-{$receivedTest->id}",
            'status' => OrderSampleStatus::Received,
        ]);
        $this->assertSame(2, $this->tracking->currentStepForSample($receivedOrder, $received));

        $analyzingTest = $this->makeLabTest(['name' => 'Step Analyzing', 'code' => 'LOINC:SP3']);
        $analyzingOrder = $this->makeOrder($patient, null, [], [$analyzingTest]);
        $analyzing = $this->makeSample($analyzingOrder, $analyzingTest, [
            'label_code' => "{$analyzingOrder->order_number}-{$analyzingTest->id}",
            'status' => OrderSampleStatus::Analyzing,
        ]);
        $this->assertSame(3, $this->tracking->currentStepForSample($analyzingOrder, $analyzing));

        $reviewTest = $this->makeLabTest(['name' => 'Step Review', 'code' => 'LOINC:SP4']);
        $reviewOrder = $this->makeOrder($patient, null, [], [$reviewTest]);
        $pendingReview = $this->makeSample($reviewOrder, $reviewTest, [
            'label_code' => "{$reviewOrder->order_number}-{$reviewTest->id}",
            'status' => OrderSampleStatus::PendingReview,
        ]);
        $this->assertSame(5, $this->tracking->currentStepForSample($reviewOrder, $pendingReview));

        $approvedTest = $this->makeLabTest(['name' => 'Step Approved', 'code' => 'LOINC:SP5']);
        $approvedOrder = $this->makeOrder($patient, null, [], [$approvedTest]);
        $approved = $this->makeSample($approvedOrder, $approvedTest, [
            'label_code' => "{$approvedOrder->order_number}-{$approvedTest->id}",
            'status' => OrderSampleStatus::Approved,
        ]);
        $this->assertSame(6, $this->tracking->currentStepForSample($approvedOrder, $approved));
    }

    public function test_summarize_with_label_code_returns_that_samples_test(): void
    {
        $patient = $this->makePatientUser()->patient;
        $testA = $this->makeLabTest(['name' => 'Glucose', 'code' => 'LOINC:2345-7', 'price' => 30.00]);
        $testB = $this->makeLabTest(['name' => 'Creatinine', 'code' => 'LOINC:2160-0', 'price' => 35.00]);
        $order = $this->makeOrder($patient, null, [], [$testA, $testB]);

        $sampleA = $this->makeSample($order, $testA, [
            'label_code' => "{$order->order_number}-{$testA->id}",
        ]);
        $this->makeSample($order, $testB, [
            'label_code' => "{$order->order_number}-{$testB->id}",
        ]);

        $summary = $this->tracking->summarize(
            $order->fresh(),
            $sampleA->label_code
        );

        $this->assertSame(['Glucose'], $summary['tests']);
        $this->assertSame($sampleA->id, $summary['orderSampleId']);
        $this->assertSame($sampleA->label_code, $summary['sampleId']);
    }

    public function test_lab_result_status_can_drive_step_without_sample_status(): void
    {
        $patient = $this->makePatientUser()->patient;
        $order = $this->makeOrder($patient);
        $test = $order->tests->first();
        $sample = $this->makeSample($order, $test, [
            'label_code' => "{$order->order_number}-{$test->id}",
            'status' => OrderSampleStatus::Analyzing,
        ]);

        LabResult::create([
            'order_id' => $order->id,
            'order_sample_id' => $sample->id,
            'report_name' => 'Report',
            'status' => LabResultStatus::PendingReview,
            'is_cdss' => false,
        ]);

        $this->assertSame(
            5,
            $this->tracking->currentStepForSample($order->fresh(), $sample->fresh())
        );
    }
}
