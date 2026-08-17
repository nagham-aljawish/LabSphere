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
            
            $table->string('test_code', 100)->index();
            $table->string('test_name', 150)->nullable();
            
            $table->json('code_aliases')->nullable();
            
            $table->decimal('absolute_delta', 12, 4)->nullable();
            
            $table->decimal('percent_delta', 8, 2)->nullable();
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
