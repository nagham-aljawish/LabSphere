<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lab_result_items', function (Blueprint $table) {
            $table->text('result_value')->change();
        });

        Schema::table('lab_results', function (Blueprint $table) {
            $table->text('cdss_prediction')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('lab_result_items', function (Blueprint $table) {
            $table->string('result_value')->change();
        });

        Schema::table('lab_results', function (Blueprint $table) {
            $table->string('cdss_prediction')->nullable()->change();
        });
    }
};
