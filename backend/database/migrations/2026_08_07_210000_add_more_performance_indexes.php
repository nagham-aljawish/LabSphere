<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_samples', function (Blueprint $table) {
            $table->index(['order_id', 'status'], 'order_samples_order_id_status_index');
            $table->index('status', 'order_samples_status_index');
        });

        Schema::table('lab_results', function (Blueprint $table) {
            $table->index(['order_sample_id', 'status'], 'lab_results_order_sample_id_status_index');
        });

        if (Schema::hasTable('lab_result_items')) {
            Schema::table('lab_result_items', function (Blueprint $table) {
                $table->index(['lab_result_id', 'status'], 'lab_result_items_lab_result_id_status_index');
            });
        }

        Schema::table('users', function (Blueprint $table) {
            $table->index(['status', 'role'], 'users_status_role_index');
        });

        if (Schema::hasTable('donations')) {
            Schema::table('donations', function (Blueprint $table) {
                $table->index(['status', 'created_at'], 'donations_status_created_at_index');
            });
        }

        if (Schema::hasTable('wallet_transactions')) {
            Schema::table('wallet_transactions', function (Blueprint $table) {
                $table->index(['type', 'created_at'], 'wallet_transactions_type_created_at_index');
            });
        }

        if (Schema::hasTable('contact_messages')) {
            Schema::table('contact_messages', function (Blueprint $table) {
                $table->index('status', 'contact_messages_status_index');
            });
        }
    }

    public function down(): void
    {
        Schema::table('order_samples', function (Blueprint $table) {
            $table->dropIndex('order_samples_order_id_status_index');
            $table->dropIndex('order_samples_status_index');
        });

        Schema::table('lab_results', function (Blueprint $table) {
            $table->dropIndex('lab_results_order_sample_id_status_index');
        });

        if (Schema::hasTable('lab_result_items')) {
            Schema::table('lab_result_items', function (Blueprint $table) {
                $table->dropIndex('lab_result_items_lab_result_id_status_index');
            });
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('users_status_role_index');
        });

        if (Schema::hasTable('donations')) {
            Schema::table('donations', function (Blueprint $table) {
                $table->dropIndex('donations_status_created_at_index');
            });
        }

        if (Schema::hasTable('wallet_transactions')) {
            Schema::table('wallet_transactions', function (Blueprint $table) {
                $table->dropIndex('wallet_transactions_type_created_at_index');
            });
        }

        if (Schema::hasTable('contact_messages')) {
            Schema::table('contact_messages', function (Blueprint $table) {
                $table->dropIndex('contact_messages_status_index');
            });
        }
    }
};
