<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('financial_aid_requests', function (Blueprint $table) {
            $table->foreignId('applied_order_id')
                ->nullable()
                ->after('discount_percentage')
                ->constrained('orders')
                ->nullOnDelete();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('financial_aid_request_id')
                ->nullable()
                ->after('notes')
                ->constrained('financial_aid_requests')
                ->nullOnDelete();

            $table->decimal('support_discount_percentage', 5, 2)
                ->nullable()
                ->after('financial_aid_request_id');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('financial_aid_request_id');
            $table->dropColumn('support_discount_percentage');
        });

        Schema::table('financial_aid_requests', function (Blueprint $table) {
            $table->dropConstrainedForeignId('applied_order_id');
        });
    }
};
