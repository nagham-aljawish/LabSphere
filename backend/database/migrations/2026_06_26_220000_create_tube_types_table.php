<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tube_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('color_class');
            $table->string('hex_color', 7);
            $table->string('color_label');
            $table->string('additive');
            $table->text('use_for');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tube_types');
    }
};
