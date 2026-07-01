<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('financial_aid_requests', function (Blueprint $table) {
            $table->decimal('discount_percentage', 5, 2)->nullable()->after('admin_notes');
        });
    }

    public function down(): void
    {
        Schema::table('financial_aid_requests', function (Blueprint $table) {
            $table->dropColumn('discount_percentage');
        });
    }
};
