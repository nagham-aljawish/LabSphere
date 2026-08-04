<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delta_check_thresholds', function (Blueprint $table) {
            $table->id();
            // Exact / primary lab code (HGB, ALT, 718-7, …). Use "*" for default rule.
            $table->string('test_code', 100)->index();
            $table->string('test_name', 150)->nullable();
            // Extra codes that should use this threshold (JSON string array).
            $table->json('code_aliases')->nullable();
            // Alert when |current - previous| >= absolute_delta
            $table->decimal('absolute_delta', 12, 4)->nullable();
            // Alert when percent change >= percent_delta (e.g. 20 = 20%)
            $table->decimal('percent_delta', 8, 2)->nullable();
            // Alert when flag moves between normal/high/low/critical
            $table->boolean('alert_on_flag_change')->default(true);
            $table->boolean('is_active')->default(true);
            $table->string('notes', 255)->nullable();
            $table->timestamps();

            $table->unique(['test_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delta_check_thresholds');
    }
};
