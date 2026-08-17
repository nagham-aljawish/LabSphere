<?php

namespace App\Console\Commands;

use App\Casts\SafeEncrypted;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class EncryptExistingPhiCommand extends Command
{
    protected $signature = 'phi:encrypt-existing {--dry-run : Count rows that still need encryption without writing}';

    protected $description = 'Encrypt existing plaintext PHI in the approved columns only';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        if ($dryRun) {
            $this->warn('Dry run: no rows will be updated.');
        }

        $targets = [
            ['lab_result_items', 'result_value'],
            ['lab_results', 'cdss_recommendation'],
            ['lab_results', 'cdss_prediction'],
            ['lab_results', 'rejection_reason'],
            ['orders', 'notes'],
            ['financial_aid_requests', 'reason'],
            ['financial_aid_requests', 'admin_notes'],
        ];

        foreach ($targets as [$table, $column]) {
            $count = $this->encryptColumn($table, $column, $dryRun);
            $verb = $dryRun ? 'would encrypt' : 'encrypted';
            $this->info("{$table}.{$column}: {$verb} {$count} row(s).");
        }

        return self::SUCCESS;
    }

    private function encryptColumn(string $table, string $column, bool $dryRun): int
    {
        $updated = 0;

        DB::table($table)->orderBy('id')->chunkById(100, function ($rows) use ($table, $column, $dryRun, &$updated): void {
            foreach ($rows as $row) {
                $raw = $row->{$column};

                if (! is_string($raw) || $raw === '' || SafeEncrypted::isEncryptedPayload($raw)) {
                    continue;
                }

                $updated++;

                if ($dryRun) {
                    continue;
                }

                DB::table($table)->where('id', $row->id)->update([
                    $column => Crypt::encryptString($raw),
                ]);
            }
        });

        return $updated;
    }
}
