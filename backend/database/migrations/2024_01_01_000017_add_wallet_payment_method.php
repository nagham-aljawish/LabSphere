<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE payments MODIFY method ENUM('cash', 'syriatel_cash', 'bank_transfer', 'other', 'wallet') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE payments MODIFY method ENUM('cash', 'syriatel_cash', 'bank_transfer', 'other') NOT NULL");
    }
};
