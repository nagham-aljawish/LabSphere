<?php

namespace Tests\Unit;

use App\Enums\UserRole;
use Tests\TestCase;

class OrderPaymentLogicTest extends TestCase
{
    public function test_discount_payable_remaining_without_discount_or_payments(): void
    {
        $patient = $this->makePatientUser()->patient;
        $test = $this->makeLabTest(['price' => 100.00]);
        $order = $this->makeOrder($patient, null, [], [$test]);

        $this->assertSame(0.0, $order->discountAmount());
        $this->assertSame(100.0, $order->payableAmount());
        $this->assertSame(100.0, $order->remainingAmount());
        $this->assertFalse($order->hasPaymentTowardOrder());
    }

    public function test_discount_reduces_payable_and_remaining(): void
    {
        $patient = $this->makePatientUser()->patient;
        $test = $this->makeLabTest(['price' => 200.00]);
        $order = $this->makeOrder($patient, null, [
            'support_discount_percentage' => 25,
        ], [$test]);

        $this->assertSame(50.0, $order->discountAmount());
        $this->assertSame(150.0, $order->payableAmount());
        $this->assertSame(150.0, $order->remainingAmount());
    }

    public function test_partial_payment_reduces_remaining_and_allows_send_gate(): void
    {
        $payer = $this->makeUser(UserRole::Reception);
        $patient = $this->makePatientUser()->patient;
        $test = $this->makeLabTest(['price' => 100.00]);
        $order = $this->makeOrder($patient, $payer, [], [$test]);

        $this->payTowardOrder($order, $payer, 40.00);
        $order->refresh()->load('payments');

        $this->assertSame(40.0, $order->paidAmount());
        $this->assertSame(60.0, $order->remainingAmount());
        $this->assertFalse($order->isFullyPaid());
        $this->assertTrue($order->hasPaymentTowardOrder());
    }

    public function test_full_payment_zeros_remaining(): void
    {
        $payer = $this->makeUser(UserRole::Reception);
        $patient = $this->makePatientUser()->patient;
        $test = $this->makeLabTest(['price' => 75.50]);
        $order = $this->makeOrder($patient, $payer, [], [$test]);

        $this->payTowardOrder($order, $payer, 75.50);
        $order->refresh()->load('payments');

        $this->assertSame(75.5, $order->paidAmount());
        $this->assertSame(0.0, $order->remainingAmount());
        $this->assertTrue($order->isFullyPaid());
        $this->assertTrue($order->hasPaymentTowardOrder());
    }

    public function test_zero_payment_does_not_satisfy_has_payment_toward_order(): void
    {
        $patient = $this->makePatientUser()->patient;
        $test = $this->makeLabTest(['price' => 50.00]);
        $order = $this->makeOrder($patient, null, [], [$test]);

        $this->assertSame(0.0, $order->paidAmount());
        $this->assertFalse($order->hasPaymentTowardOrder());
    }

    public function test_free_after_full_discount_does_not_require_payment(): void
    {
        $patient = $this->makePatientUser()->patient;
        $test = $this->makeLabTest(['price' => 120.00]);
        $order = $this->makeOrder($patient, null, [
            'support_discount_percentage' => 100,
        ], [$test]);

        $this->assertSame(120.0, $order->discountAmount());
        $this->assertSame(0.0, $order->payableAmount());
        $this->assertSame(0.0, $order->remainingAmount());
        $this->assertTrue($order->hasPaymentTowardOrder());
        $this->assertTrue($order->isFullyPaid());
    }

    public function test_partial_payment_with_discount(): void
    {
        $payer = $this->makeUser(UserRole::Reception);
        $patient = $this->makePatientUser()->patient;
        $test = $this->makeLabTest(['price' => 100.00]);
        $order = $this->makeOrder($patient, $payer, [
            'support_discount_percentage' => 20,
        ], [$test]);

        $this->payTowardOrder($order, $payer, 30.00);
        $order->refresh()->load('payments');

        $this->assertSame(20.0, $order->discountAmount());
        $this->assertSame(80.0, $order->payableAmount());
        $this->assertSame(50.0, $order->remainingAmount());
        $this->assertTrue($order->hasPaymentTowardOrder());
    }
}
