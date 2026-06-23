<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lab_result_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lab_result_id')->constrained()->cascadeOnDelete();
            $table->string('test_name');
            $table->string('test_code')->nullable();
            $table->string('result_value');
            $table->string('unit')->nullable();
            $table->string('normal_range')->nullable();
            $table->enum('status', ['normal', 'high', 'low', 'critical'])->default('normal');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lab_result_items');
    }
};
