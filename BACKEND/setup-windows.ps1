# UVT Events Platform — first-time local setup (Windows PowerShell)
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
    param(
        [Parameter(ValueFromRemainingArguments = $true)]
        [string[]]$CommandArgs
    )

    $isV2 = $false
    try {
        & docker compose version >$null 2>&1
        if ($LASTEXITCODE -eq 0) { $isV2 = $true }
    } catch { }

    if ($isV2) {
        $exe = "docker"
        $allArgs = @("compose") + $CommandArgs
        & $exe $allArgs
    } elseif (Get-Command docker-compose -ErrorAction SilentlyContinue) {
        & docker-compose @CommandArgs
    } else {
        Write-Err "Docker Compose is not available. Install Docker Desktop."
    }

    if ($LASTEXITCODE -ne 0) {
        throw "Docker Compose command failed (exit $LASTEXITCODE)"
    }
}

function Wait-ContainerHealthy {
    param([string]$ContainerName, [string]$Label, [int]$TimeoutSeconds = 120)
    Write-Step "Waiting for $Label to become healthy..."
    $elapsed = 0
    while ($elapsed -lt $TimeoutSeconds) {
        $status = "missing"
        try {
            $status = docker inspect -f "{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}" $ContainerName 2>$null
        } catch { }
        if ($status -eq "healthy") { return }
        Start-Sleep -Seconds 2
        $elapsed += 2
    }
    Write-Err "$Label did not become ready."
}

function Test-CommandExists([string]$Name) {
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

Write-Step "Checking prerequisites..."
if (-not (Test-CommandExists "git")) { Write-Err "Git is not installed." }
if (-not (Test-CommandExists "docker")) { Write-Err "Docker is not installed." }

try {
    docker info >$null 2>&1
    if ($LASTEXITCODE -ne 0) { throw "not running" }
} catch {
    Write-Err "Docker is not running. Start Docker Desktop first."
}

Write-Step "Preparing environment file..."
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
}

$needAppKey = $false
$envContent = Get-Content ".env" -Raw -ErrorAction SilentlyContinue
if ($envContent -match 'APP_KEY=\s*$' -or $envContent -match 'APP_KEY=""') {
    $needAppKey = $true
}

Write-Step "Building Docker images..."
Invoke-Compose build

Write-Step "Starting MariaDB and Redis..."
Invoke-Compose up -d mariadb redis

Wait-ContainerHealthy -ContainerName "uvt_events_db" -Label "MariaDB"
Wait-ContainerHealthy -ContainerName "uvt_events_redis" -Label "Redis"

Write-Step "Installing PHP dependencies..."
Invoke-Compose run --rm --no-deps app composer install --no-interaction --prefer-dist

if ($needAppKey) {
    Write-Step "Generating application key..."
    Invoke-Compose run --rm --no-deps app php artisan key:generate --force
}

Write-Step "Ensuring storage directories exist..."
$dirs = @("storage\framework\cache", "storage\framework\sessions", "storage\framework\views", "storage\logs", "bootstrap\cache")
foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
}

Write-Step "Starting all application services..."
Invoke-Compose up -d

Write-Step "Running database migrations..."
Invoke-Compose exec -T app php artisan migrate --seed --no-interaction

Write-Host ""
Write-Host "Setup complete." -ForegroundColor Green
Write-Host "API base URL: http://127.0.0.1:8000"