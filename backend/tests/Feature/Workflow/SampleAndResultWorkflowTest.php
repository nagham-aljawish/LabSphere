<?php

namespace Tests\Feature\Workflow;

use App\Enums\LabResultStatus;
use App\Enums\OrderSampleStatus;
use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\LabResult;
use App\Models\Order;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SampleAndResultWorkflowTest extends TestCase
{
    public function test_full_sample_and_result_workflow_with_payment_gates_and_two_sample_completion(): void
    {
        $reception = $this->makeUser(UserRole::Reception);
        $technician = $this->makeUser(UserRole::Technician);
        $doctor = $this->makeUser(UserRole::Doctor);
        $patientUser = $this->makePatientUser();
        $patient = $patientUser->patient;

        $testA = $this->makeLabTest(['name' => 'Glucose', 'code' => 'LOINC:2345-7', 'price' => 50.00]);
        $testB = $this->makeLabTest(['name' => 'Creatinine', 'code' => 'LOINC:2160-0', 'price' => 50.00]);
        $order = $this->makeOrder($patient, $reception, [], [$testA, $testB]);

        $sampleA = $this->makeSample($order, $testA, [
            'label_code' => "{$order->order_number}-{$testA->id}",
        ]);
        $sampleB = $this->makeSample($order, $testB, [
            'label_code' => "{$order->order_number}-{$testB->id}",
        ]);

        $this->actingAsRole($reception);

        $this->postJson(
            "/api/reception/orders/{$order->id}/send-to-technician",
            []
        )->assertUnprocessable()
            ->assertJsonPath('success', false);

        $this->payTowardOrder($order, $reception, 25.00);

        $this->postJson(
            "/api/reception/orders/{$order->id}/send-to-technician",
            []
        )->assertOk()
            ->assertJsonPath('success', true);

        $this->actingAsRole($technician);

        $this->patchJson(
            "/api/technician/orders/{$order->id}/mark-received",
            ['label_code' => $sampleA->label_code]
        )->assertOk();

        $sampleA->refresh();
        $this->assertSame(OrderSampleStatus::Received, $sampleA->status);

        $this->patchJson(
            "/api/technician/orders/{$order->id}/mark-processing",
            ['label_code' => $sampleA->label_code]
        )->assertOk();

        $this->patchJson(
            "/api/technician/orders/{$order->id}/mark-processing",
            ['label_code' => $sampleA->label_code]
        )->assertUnprocessable()
            ->assertJsonPath('success', false);

        $draftPayload = $this->resultPayload($order, $sampleA);

        $draftResponse = $this->postJson('/api/technician/results', $draftPayload)
            ->assertCreated();

        $resultAId = $draftResponse->json('data.id');

        $this->patchJson("/api/technician/results/{$resultAId}/submit-review", [])
            ->assertOk();

        $resultA = LabResult::findOrFail($resultAId);
        $this->assertSame(LabResultStatus::PendingReview, $resultA->status);
        $sampleA->refresh();
        $this->assertSame(OrderSampleStatus::PendingReview, $sampleA->status);

        $this->actingAsRole($doctor);

        $this->patchJson(
            "/api/doctor/results/{$resultAId}/reject",
            ['reason' => 'Value out of range — please verify']
        )->assertOk();

        $resultA->refresh();
        $sampleA->refresh();
        $this->assertSame(LabResultStatus::Rejected, $resultA->status);
        $this->assertSame(OrderSampleStatus::Rejected, $sampleA->status);

        $this->actingAsRole($technician);

        $resubmitResponse = $this->postJson(
            '/api/technician/results',
            array_merge($draftPayload, [
                'items' => [[
                    'test_name' => 'Glucose',
                    'test_code' => 'LOINC:2345-7',
                    'result_value' => '95',
                    'unit' => 'mg/dL',
                    'normal_range' => '70 - 100',
                    'status' => 'normal',
                ]],
            ])
        )->assertOk();

        $resultAId = $resubmitResponse->json('data.id');

        $this->patchJson("/api/technician/results/{$resultAId}/submit-review", [])
            ->assertOk();

        $this->patchJson(
            "/api/technician/orders/{$order->id}/mark-received",
            ['label_code' => $sampleB->label_code]
        )->assertOk();

        $this->patchJson(
            "/api/technician/orders/{$order->id}/mark-processing",
            ['label_code' => $sampleB->label_code]
        )->assertOk();

        $resultBResponse = $this->postJson(
            '/api/technician/results',
            $this->resultPayload($order, $sampleB, 'Creatinine', 'LOINC:2160-0', '1.0')
        )->assertCreated();

        $resultBId = $resultBResponse->json('data.id');

        $this->patchJson("/api/technician/results/{$resultBId}/submit-review", [])
            ->assertOk();

        $this->actingAsRole($doctor);

        $this->patchJson("/api/doctor/results/{$resultAId}/approve", [])
            ->assertOk();

        $order->refresh();
        $this->assertSame(OrderStatus::Processing, $order->status);

        $this->patchJson("/api/doctor/results/{$resultBId}/approve", [])
            ->assertOk();

        $order->refresh();
        $this->assertSame(OrderStatus::Completed, $order->status);
        $sampleA->refresh();
        $sampleB->refresh();
        $this->assertSame(OrderSampleStatus::Approved, $sampleA->status);
        $this->assertSame(OrderSampleStatus::Approved, $sampleB->status);
    }

    private function actingAsRole(User $user): void
    {
        Sanctum::actingAs($user, ['*']);
    }

    /**
     * @return array<string, mixed>
     */
    private function resultPayload(
        Order $order,
        \App\Models\OrderSample $sample,
        string $testName = 'Glucose',
        string $testCode = 'LOINC:2345-7',
        string $value = '105'
    ): array {
        return [
            'order_id' => $order->id,
            'order_sample_id' => $sample->id,
            'label_code' => $sample->label_code,
            'report_name' => "{$testName} Report",
            'items' => [[
                'test_name' => $testName,
                'test_code' => $testCode,
                'result_value' => $value,
                'unit' => 'mg/dL',
                'normal_range' => '70 - 100',
                'status' => 'normal',
            ]],
        ];
    }
}
