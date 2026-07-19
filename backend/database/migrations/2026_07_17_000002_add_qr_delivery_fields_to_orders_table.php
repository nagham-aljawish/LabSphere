<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('qr_image_url')->nullable()->after('support_discount_percentage');
            $table->timestamp('sent_to_technician_at')->nullable()->after('qr_image_url');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['qr_image_url', 'sent_to_technician_at']);
        });
    }
};
