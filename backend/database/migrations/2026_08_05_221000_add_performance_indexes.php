<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->index(['status', 'created_at'], 'orders_status_created_at_index');
            $table->index(['patient_id', 'status'], 'orders_patient_id_status_index');
            $table->index(['status', 'updated_at'], 'orders_status_updated_at_index');
        });

        Schema::table('lab_results', function (Blueprint $table) {
            $table->index(['status', 'created_at'], 'lab_results_status_created_at_index');
            $table->index(['status', 'approved_at'], 'lab_results_status_approved_at_index');
            $table->index(['order_id', 'status'], 'lab_results_order_id_status_index');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->index(['order_id', 'status'], 'payments_order_id_status_index');
            $table->index(['user_id', 'created_at'], 'payments_user_id_created_at_index');
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->index(['user_id', 'created_at'], 'notifications_user_id_created_at_index');
            $table->index(['user_id', 'is_read'], 'notifications_user_id_is_read_index');
            $table->index(['reference_type', 'reference_id'], 'notifications_reference_index');
        });

        Schema::table('financial_aid_requests', function (Blueprint $table) {
            $table->index(
                ['user_id', 'status', 'applied_order_id'],
                'financial_aid_user_status_applied_index'
            );
        });

        Schema::table('order_samples', function (Blueprint $table) {
            $table->index('label_code', 'order_samples_label_code_index');
        });

        if (Schema::hasTable('tests')) {
            Schema::table('tests', function (Blueprint $table) {
                $table->index(['is_active', 'name'], 'tests_is_active_name_index');
            });
        }
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('orders_status_created_at_index');
            $table->dropIndex('orders_patient_id_status_index');
            $table->dropIndex('orders_status_updated_at_index');
        });

        Schema::table('lab_results', function (Blueprint $table) {
            $table->dropIndex('lab_results_status_created_at_index');
            $table->dropIndex('lab_results_status_approved_at_index');
            $table->dropIndex('lab_results_order_id_status_index');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex('payments_order_id_status_index');
            $table->dropIndex('payments_user_id_created_at_index');
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex('notifications_user_id_created_at_index');
            $table->dropIndex('notifications_user_id_is_read_index');
            $table->dropIndex('notifications_reference_index');
        });

        Schema::table('financial_aid_requests', function (Blueprint $table) {
            $table->dropIndex('financial_aid_user_status_applied_index');
        });

        Schema::table('order_samples', function (Blueprint $table) {
            $table->dropIndex('order_samples_label_code_index');
        });

        if (Schema::hasTable('tests')) {
            Schema::table('tests', function (Blueprint $table) {
                $table->dropIndex('tests_is_active_name_index');
            });
        }
    }
};
