<?php

namespace Tests\Unit;

use App\Enums\OrderSampleStatus;
use Tests\TestCase;

class OrderSampleWorkflowTest extends TestCase
{
    public function test_mark_received_transitions_pending_to_received(): void
    {
        $patient = $this->makePatientUser()->patient;
        $order = $this->makeOrder($patient);
        $test = $order->tests->first();
        $sample = $this->makeSample($order, $test);

        $this->assertSame(OrderSampleStatus::Pending, $sample->status);

        $sample->markReceived();
        $sample->refresh();

        $this->assertSame(OrderSampleStatus::Received, $sample->status);
        $this->assertNotNull($sample->received_at);
    }

    public function test_mark_analyzing_succeeds_once_then_returns_false(): void
    {
        $patient = $this->makePatientUser()->patient;
        $order = $this->makeOrder($patient);
        $test = $order->tests->first();
        $sample = $this->makeSample($order, $test, [
            'status' => OrderSampleStatus::Received,
            'received_at' => now(),
        ]);

        $this->assertTrue($sample->markAnalyzing());
        $sample->refresh();
        $this->assertSame(OrderSampleStatus::Analyzing, $sample->status);
        $this->assertNotNull($sample->analyzing_at);

        $this->assertFalse($sample->markAnalyzing());
        $sample->refresh();
        $this->assertSame(OrderSampleStatus::Analyzing, $sample->status);
    }
}
