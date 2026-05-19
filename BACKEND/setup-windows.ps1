# UVT Events Platform — first-time local setup (Windows PowerShell)
#
# Prerequisites (install before running):
#   - Git for Windows: https://git-scm.com/download/win
#   - Docker Desktop: https://www.docker.com/products/docker-desktop/
#     Enable WSL 2 backend when prompted (recommended).
#
# Usage (from the repository root in PowerShell):
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   .\setup-windows.ps1
#
#Requires -Version 5.1
$ErrorActionPreference = 'Stop'

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $RootDir

function Write-Step([string]$Message) {
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Green
}

function Write-WarnMsg([string]$Message) {
    Write-Host "Warning: $Message" -ForegroundColor Yellow
}

function Write-Err([string]$Message) {
    Write-Host "Error: $Message" -ForegroundColor Red
    exit 1
}

function Invoke-Compose {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)

    $composeV2 = $false
    try {
        docker compose version 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) { $composeV2 = $true }
    } catch { }

    if ($composeV2) {
        & docker compose @Args
    } elseif (Get-Command docker-compose -ErrorAction SilentlyContinue) {
        & docker-compose @Args
    } else {
        Write-Err "Docker Compose is not available. Install Docker Desktop (includes Compose)."
    }

    if ($LASTEXITCODE -ne 0) {
        throw "Docker Compose command failed (exit $LASTEXITCODE): docker compose $($Args -join ' ')"
    }
}

function Wait-ContainerHealthy {
    param(
        [string]$ContainerName,
        [string]$Label,
        [int]$TimeoutSeconds = 120
    )

    Write-Step "Waiting for $Label to become healthy (up to ${TimeoutSeconds}s)..."
    $elapsed = 0
    while ($elapsed -lt $TimeoutSeconds) {
        $status = "missing"
        try {
            $status = docker inspect -f "{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}" $ContainerName 2>$null
        } catch { }

        if ($status -eq "healthy") {
            Write-Host "$Label is ready."
            return
        }

        Start-Sleep -Seconds 2
        $elapsed += 2
    }

    Write-Err "$Label did not become ready. Check: docker compose logs $($ContainerName -replace '^uvt_events_', '')"
}

function Test-CommandExists([string]$Name) {
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

Write-Step "Checking prerequisites..."
if (-not (Test-CommandExists "git")) {
    Write-Err "Git is not installed. Download: https://git-scm.com/download/win"
}
if (-not (Test-CommandExists "docker")) {
    Write-Err "Docker is not installed. Download Docker Desktop: https://www.docker.com/products/docker-desktop/"
}

try {
    docker info 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "not running" }
} catch {
    Write-Err "Docker is not running. Start Docker Desktop and run this script again."
}

Write-Step "Preparing environment file..."
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env from .env.example"
} else {
    Write-Host ".env already exists — leaving it unchanged"
}

$needAppKey = $false
$envContent = Get-Content ".env" -Raw -ErrorAction SilentlyContinue
if ($envContent -match '(?m)^APP_KEY=\s*$' -or $envContent -match '(?m)^APP_KEY=""\s*$') {
    $needAppKey = $true
}

try {
    $port3306 = Get-NetTCPConnection -LocalPort 3306 -State Listen -ErrorAction SilentlyContinue
    if ($port3306) {
        Write-WarnMsg "Port 3306 is already in use on this machine."
        Write-WarnMsg "If MariaDB fails to start, set FORWARD_DB_PORT=3307 in .env and run this script again."
    }

    $port8000 = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
    if ($port8000) {
        Write-WarnMsg "Port 8000 is already in use. Set APP_PORT=8001 in .env if the API container cannot bind."
    }
} catch {
    # Port checks are optional; setup can continue without them.
}

Write-Step "Building Docker images (first run may take several minutes)..."
Invoke-Compose build

Write-Step "Starting MariaDB and Redis..."
Invoke-Compose @("up", "-d", "mariadb", "redis")

Wait-ContainerHealthy -ContainerName "uvt_events_db" -Label "MariaDB" -TimeoutSeconds 120
Wait-ContainerHealthy -ContainerName "uvt_events_redis" -Label "Redis" -TimeoutSeconds 60

Write-Step "Installing PHP dependencies (vendor/ is not committed to Git)..."
Invoke-Compose @("run", "--rm", "--no-deps", "app", "composer", "install", "--no-interaction", "--prefer-dist")

if ($needAppKey) {
    Write-Step "Generating application key (APP_KEY)..."
    Invoke-Compose @("run", "--rm", "--no-deps", "app", "php", "artisan", "key:generate", "--force", "--no-interaction")
}

Write-Step "Ensuring storage and cache directories exist..."
$dirs = @(
    "storage\framework\cache",
    "storage\framework\sessions",
    "storage\framework\views",
    "storage\logs",
    "bootstrap\cache"
)
foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

Write-Step "Starting all application services (API, queue worker, scheduler)..."
Invoke-Compose @("up", "-d")

Write-Step "Running database migrations and seeders..."
Invoke-Compose @("exec", "-T", "app", "php", "artisan", "migrate", "--seed", "--no-interaction")

Write-Step "Verifying API health..."
Start-Sleep -Seconds 2
$appPort = "8000"
$envContentForPort = Get-Content ".env" -Raw -ErrorAction SilentlyContinue
if ($envContentForPort -match '(?m)^APP_PORT=(\d+)') {
    $appPort = $Matches[1]
}
$healthUrl = "http://127.0.0.1:$appPort/api/health"

try {
    $response = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "Health check OK: $healthUrl"
    }
} catch {
    Write-WarnMsg "Health endpoint did not respond yet. Wait a few seconds, then open:"
    Write-WarnMsg "  $healthUrl"
}

Write-Host ""
Write-Host "Setup complete." -ForegroundColor Green
Write-Host ""
Write-Host "API base URL:     http://127.0.0.1:$appPort"
Write-Host "Health check:     http://127.0.0.1:$appPort/api/health"
Write-Host ""
Write-Host "Demo accounts (after seed):"
Write-Host "  Super admin:    admin.user@e-uvt.ro  /  password"
Write-Host "  Coordinator:    test.user@e-uvt.ro  /  password"
Write-Host ""
Write-Host "Useful commands:"
Write-Host "  docker compose ps"
Write-Host "  docker compose logs -f app"
Write-Host "  docker compose exec app php artisan test"
Write-Host "  docker compose down"
Write-Host ""
Write-Host "Login: POST http://127.0.0.1:$appPort/api/auth/login  (JSON: email, password)"
Write-Host "Use the returned token as:  Authorization: Bearer <token>"
