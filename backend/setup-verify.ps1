$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "=== LabSphere API Setup ===" -ForegroundColor Cyan

if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "Created .env from .env.example"
}

if (-not (Select-String -Path .env -Pattern "^APP_KEY=base64:" -Quiet) {
    & php artisan key:generate
}

Write-Host "`nCreating MySQL database if needed..."
& mysql -u root -e "CREATE DATABASE IF NOT EXISTS labsphere CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "MySQL CLI not available or failed. Ensure labsphere database exists." -ForegroundColor Yellow
}

Write-Host "`nRunning migrations and seeders..."
& php artisan migrate --seed --force

Write-Host "`nCreating storage link..."
& php artisan storage:link 2>$null

Write-Host "`nRoute list:"
& php artisan route:list

Write-Host "`n=== Setup complete ===" -ForegroundColor Green
Write-Host "API: http://localhost:8000/api"
Write-Host "Run: php artisan serve"
