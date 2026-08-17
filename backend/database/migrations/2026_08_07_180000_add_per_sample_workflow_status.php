<?php

use App\Enums\OrderSampleStatus;
use App\Enums\OrderStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_samples', function (Blueprint $table) {
            $table->string('status', 32)->default('pending')->after('label_code');
            $table->timestamp('received_at')->nullable()->after('status');
            $table->timestamp('analyzing_at')->nullable()->after('received_at');
        });

        Schema::table('lab_results', function (Blueprint $table) {
            $table->foreignId('order_sample_id')
                ->nullable()
                ->after('order_id')
                ->constrained('order_samples')
                ->nullOnDelete();
        });

        // Backfill sample workflow from current order status.
        $orders = DB::table('orders')->select('id', 'status', 'sent_to_technician_at')->get();

        foreach ($orders as $order) {
            $sampleStatus = match ($order->status) {
                OrderStatus::Completed->value => OrderSampleStatus::Approved->value,
                OrderStatus::Processing->value => OrderSampleStatus::Analyzing->value,
                OrderStatus::SampleCollected->value => $order->sent_to_technician_at
                    ? OrderSampleStatus::Received->value
                    : OrderSampleStatus::Pending->value,
                default => OrderSampleStatus::Pending->value,
            };

            DB::table('order_samples')
                ->where('order_id', $order->id)
                ->update(['status' => $sampleStatus]);
        }

        // Attach each order's latest lab result to the first sample (legacy single-result orders).
        $latestResults = DB::table('lab_results')
            ->select('id', 'order_id', 'status')
            ->orderByDesc('id')
            ->get()
            ->unique('order_id');

        foreach ($latestResults as $result) {
            $sampleId = DB::table('order_samples')
                ->where('order_id', $result->order_id)
                ->orderBy('id')
                ->value('id');

            if (! $sampleId) {
                continue;
            }

            DB::table('lab_results')
                ->where('id', $result->id)
                ->update(['order_sample_id' => $sampleId]);

            $mapped = match ($result->status) {
                'approved' => OrderSampleStatus::Approved->value,
                'pending_review' => OrderSampleStatus::PendingReview->value,
                'rejected' => OrderSampleStatus::Rejected->value,
                'draft' => OrderSampleStatus::Analyzing->value,
                default => null,
            };

            if ($mapped) {
                DB::table('order_samples')
                    ->where('id', $sampleId)
                    ->update(['status' => $mapped]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('lab_results', function (Blueprint $table) {
            $table->dropConstrainedForeignId('order_sample_id');
        });

        Schema::table('order_samples', function (Blueprint $table) {
            $table->dropColumn(['status', 'received_at', 'analyzing_at']);
        });
    }
};
