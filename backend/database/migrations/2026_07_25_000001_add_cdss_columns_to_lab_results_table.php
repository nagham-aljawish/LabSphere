<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lab_results', function (Blueprint $table) {
            // Marks a result as one produced through the Clinical Decision
            // Support System (CDSS) rather than a plain manual entry.
            $table->boolean('is_cdss')->default(false)->after('report_name');
            $table->string('cdss_disease')->nullable()->after('is_cdss');
            $table->enum('cdss_outcome', ['positive', 'negative'])->nullable()->after('cdss_disease');
            $table->string('cdss_prediction')->nullable()->after('cdss_outcome');
            $table->decimal('cdss_confidence', 5, 2)->nullable()->after('cdss_prediction');
            $table->text('cdss_recommendation')->nullable()->after('cdss_confidence');
            $table->timestamp('cdss_predicted_at')->nullable()->after('cdss_recommendation');
        });
    }

    public function down(): void
    {
        Schema::table('lab_results', function (Blueprint $table) {
            $table->dropColumn([
                'is_cdss',
                'cdss_disease',
                'cdss_outcome',
                'cdss_prediction',
                'cdss_confidence',
                'cdss_recommendation',
                'cdss_predicted_at',
            ]);
        });
    }
};
