<?php

namespace Tests\Unit;

use App\Casts\SafeEncrypted;
use App\Models\FinancialAidRequest;
use App\Models\LabResult;
use App\Models\LabResultItem;
use App\Models\Order;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class SafeEncryptedCastTest extends TestCase
{
    public function test_result_value_is_encrypted_at_rest_and_decrypted_on_read(): void
    {
        $patient = $this->makePatientUser()->patient;
        $order = $this->makeOrder($patient);
        $result = $this->makeDraftResult($order);
        $item = $result->items->first();

        $this->assertSame('13.5', $item->result_value);

        $raw = DB::table('lab_result_items')->where('id', $item->id)->value('result_value');

        $this->assertNotSame('13.5', $raw);
        $this->assertTrue(SafeEncrypted::isEncryptedPayload($raw));
        $this->assertSame('13.5', Crypt::decryptString($raw));
    }

    public function test_legacy_plaintext_result_value_still_reads(): void
    {
        $patient = $this->makePatientUser()->patient;
        $order = $this->makeOrder($patient);
        $result = $this->makeDraftResult($order);
        $item = $result->items->first();

        DB::table('lab_result_items')->where('id', $item->id)->update([
            'result_value' => '9.1',
        ]);

        $this->assertSame('9.1', $item->fresh()->result_value);
    }

    public function test_cdss_rejection_order_notes_and_aid_fields_encrypt(): void
    {
        $patientUser = $this->makePatientUser();
        $order = $this->makeOrder($patientUser->patient, null, [
            'notes' => 'fasting required',
        ]);

        $result = LabResult::create([
            'order_id' => $order->id,
            'report_name' => 'Laboratory Report',
            'status' => 'draft',
            'rejection_reason' => 'hemolyzed sample',
            'is_cdss' => true,
            'cdss_prediction' => 'positive',
            'cdss_recommendation' => 'repeat HbA1c in 3 months',
        ]);

        $aid = FinancialAidRequest::create([
            'user_id' => $patientUser->id,
            'full_name' => $patientUser->name,
            'reason' => 'cannot afford full cost',
            'admin_notes' => 'approved after document review',
        ]);

        $this->assertSame('fasting required', $order->fresh()->notes);
        $this->assertSame('hemolyzed sample', $result->fresh()->rejection_reason);
        $this->assertSame('positive', $result->fresh()->cdss_prediction);
        $this->assertSame('repeat HbA1c in 3 months', $result->fresh()->cdss_recommendation);
        $this->assertSame('cannot afford full cost', $aid->fresh()->reason);
        $this->assertSame('approved after document review', $aid->fresh()->admin_notes);

        $this->assertTrue(SafeEncrypted::isEncryptedPayload(
            (string) DB::table('orders')->where('id', $order->id)->value('notes')
        ));
        $this->assertTrue(SafeEncrypted::isEncryptedPayload(
            (string) DB::table('lab_results')->where('id', $result->id)->value('rejection_reason')
        ));
        $this->assertTrue(SafeEncrypted::isEncryptedPayload(
            (string) DB::table('lab_results')->where('id', $result->id)->value('cdss_prediction')
        ));
        $this->assertTrue(SafeEncrypted::isEncryptedPayload(
            (string) DB::table('lab_results')->where('id', $result->id)->value('cdss_recommendation')
        ));
        $this->assertTrue(SafeEncrypted::isEncryptedPayload(
            (string) DB::table('financial_aid_requests')->where('id', $aid->id)->value('reason')
        ));
        $this->assertTrue(SafeEncrypted::isEncryptedPayload(
            (string) DB::table('financial_aid_requests')->where('id', $aid->id)->value('admin_notes')
        ));
    }

    public function test_encrypt_existing_command_converts_plaintext_once(): void
    {
        $patient = $this->makePatientUser()->patient;
        $order = $this->makeOrder($patient);
        $result = $this->makeDraftResult($order);
        $item = $result->items->first();

        DB::table('lab_result_items')->where('id', $item->id)->update([
            'result_value' => '11.2',
        ]);

        $this->artisan('phi:encrypt-existing')
            ->assertSuccessful();

        $raw = DB::table('lab_result_items')->where('id', $item->id)->value('result_value');
        $this->assertTrue(SafeEncrypted::isEncryptedPayload($raw));
        $this->assertSame('11.2', $item->fresh()->result_value);

        $this->artisan('phi:encrypt-existing')
            ->expectsOutputToContain('lab_result_items.result_value: encrypted 0 row(s).')
            ->assertSuccessful();
    }
}
