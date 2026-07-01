<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_samples', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('test_id')->constrained()->cascadeOnDelete();
            $table->string('tube_type');
            $table->unsignedInteger('quantity')->default(1);
            $table->string('label_code')->nullable();
            $table->timestamps();

            $table->unique(['order_id', 'test_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_samples');
    }
};
