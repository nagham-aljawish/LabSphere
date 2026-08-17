<?php

namespace Tests;

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Foundation\Application;

trait CreatesApplication
{
    public function createApplication(): Application
    {
        // Project migrations use MySQL-specific ALTER syntax; prefer MySQL over phpunit sqlite defaults.
        putenv('DB_CONNECTION=mysql');
        $_ENV['DB_CONNECTION'] = 'mysql';
        $_SERVER['DB_CONNECTION'] = 'mysql';

        if (! getenv('DB_DATABASE') || getenv('DB_DATABASE') === ':memory:') {
            putenv('DB_DATABASE=labsphere_test');
            $_ENV['DB_DATABASE'] = 'labsphere_test';
            $_SERVER['DB_DATABASE'] = 'labsphere_test';
        }

        $env = $this->readEnvFileValues([
            'DB_HOST' => '127.0.0.1',
            'DB_PORT' => '3306',
            'DB_USERNAME' => 'root',
            'DB_PASSWORD' => '',
        ]);

        foreach (['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD'] as $key) {
            if (! getenv($key)) {
                putenv("{$key}={$env[$key]}");
                $_ENV[$key] = $env[$key];
                $_SERVER[$key] = $env[$key];
            }
        }

        $this->ensureTestDatabaseExists();

        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make(Kernel::class)->bootstrap();

        return $app;
    }

    private function ensureTestDatabaseExists(): void
    {
        if (getenv('DB_CONNECTION') !== 'mysql') {
            return;
        }

        $env = $this->readEnvFileValues([
            'DB_HOST' => '127.0.0.1',
            'DB_PORT' => '3306',
            'DB_DATABASE' => 'labsphere_test',
            'DB_USERNAME' => 'root',
            'DB_PASSWORD' => '',
        ]);

        $database = getenv('DB_DATABASE') ?: $env['DB_DATABASE'];

        try {
            $pdo = new \PDO(
                "mysql:host={$env['DB_HOST']};port={$env['DB_PORT']}",
                $env['DB_USERNAME'],
                $env['DB_PASSWORD'],
                [\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION]
            );
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$database}`");
        } catch (\PDOException) {
            // If MySQL is unavailable, Laravel will surface the connection error during tests.
        }
    }

    /**
     * @param  array<string, string>  $defaults
     * @return array<string, string>
     */
    private function readEnvFileValues(array $defaults): array
    {
        $values = $defaults;
        $envPath = dirname(__DIR__).'/.env';

        if (! is_readable($envPath)) {
            return $values;
        }

        foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#') || ! str_contains($line, '=')) {
                continue;
            }

            [$key, $value] = array_map('trim', explode('=', $line, 2));
            $value = trim($value, "\"'");

            if (array_key_exists($key, $values)) {
                $values[$key] = $value;
            }
        }

        return $values;
    }
}
