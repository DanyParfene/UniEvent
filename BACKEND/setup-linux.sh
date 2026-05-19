#!/usr/bin/env bash
#
# UVT Events Platform — first-time local setup (Linux / macOS / WSL)
#
# Prerequisites (install before running):
#   - Git: https://git-scm.com/
#   - Docker Engine + Compose plugin: https://docs.docker.com/engine/install/
#     (Docker Desktop on Mac includes both.)
#
# Usage (from the repository root):
#   chmod +x setup-linux.sh
#   ./setup-linux.sh
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { printf '%s\n' "$*"; }
step()  { printf '\n%s==>%s %s\n' "$GREEN" "$NC" "$*"; }
warn()  { printf '%sWarning:%s %s\n' "$YELLOW" "$NC" "$*"; }
fail()  { printf '%sError:%s %s\n' "$RED" "$NC" "$*" >&2; exit 1; }

compose() {
  if docker compose version >/dev/null 2>&1; then
    docker compose "$@"
  elif command -v docker-compose >/dev/null 2>&1; then
    docker-compose "$@"
  else
    fail "Docker Compose is not available. Install the Compose plugin or docker-compose."
  fi
}

wait_for_container_health() {
  local container_name="$1"
  local label="$2"
  local timeout_seconds="${3:-120}"
  local elapsed=0

  step "Waiting for ${label} to become healthy (up to ${timeout_seconds}s)..."
  while [ "$elapsed" -lt "$timeout_seconds" ]; do
    local status
    status="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container_name" 2>/dev/null || echo "missing")"
    if [ "$status" = "healthy" ]; then
      info "${label} is ready."
      return 0
    fi
    sleep 2
    elapsed=$((elapsed + 2))
  done
  fail "${label} did not become ready. Check: docker compose logs ${container_name#uvt_events_}"
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    fail "Required command not found: $1 — $2"
  fi
}

step "Checking prerequisites..."
require_command git "https://git-scm.com/"
require_command docker "https://docs.docker.com/engine/install/"

if ! docker info >/dev/null 2>&1; then
  fail "Docker daemon is not running. Start Docker and run this script again."
fi

compose version >/dev/null 2>&1 || compose --version >/dev/null 2>&1 || fail "Could not run Docker Compose."

step "Preparing environment file..."
if [ ! -f .env ]; then
  cp .env.example .env
  info "Created .env from .env.example"
else
  info ".env already exists — leaving it unchanged"
fi

if grep -q '^APP_KEY=$' .env 2>/dev/null || grep -q '^APP_KEY=""' .env 2>/dev/null; then
  NEED_APP_KEY=1
else
  NEED_APP_KEY=0
fi

if command -v ss >/dev/null 2>&1; then
  if ss -tln 2>/dev/null | grep -q ':3306 '; then
    warn "Port 3306 is already in use on this machine."
    warn "If MariaDB fails to start, set FORWARD_DB_PORT=3307 in .env and run this script again."
  fi
  if ss -tln 2>/dev/null | grep -q ':8000 '; then
    warn "Port 8000 is already in use. Set APP_PORT=8001 in .env if the API container cannot bind."
  fi
fi

step "Building Docker images (first run may take several minutes)..."
compose build

step "Starting MariaDB and Redis..."
compose up -d mariadb redis

wait_for_container_health "uvt_events_db" "MariaDB" 120
wait_for_container_health "uvt_events_redis" "Redis" 60

step "Installing PHP dependencies (vendor/ is not committed to Git)..."
compose run --rm --no-deps app composer install --no-interaction --prefer-dist

if [ "$NEED_APP_KEY" -eq 1 ]; then
  step "Generating application key (APP_KEY)..."
  compose run --rm --no-deps app php artisan key:generate --force --no-interaction
fi

step "Ensuring storage and cache directories are writable..."
mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache 2>/dev/null || true

step "Starting all application services (API, queue worker, scheduler)..."
compose up -d

step "Running database migrations and seeders..."
compose exec -T app php artisan migrate --seed --no-interaction

APP_PORT=8000
if [ -f .env ]; then
  # shellcheck disable=SC2155
  local_port="$(grep -E '^APP_PORT=' .env | tail -n1 | cut -d= -f2- | tr -d "\"' " || true)"
  if [ -n "$local_port" ]; then
    APP_PORT="$local_port"
  fi
fi

step "Verifying API health..."
sleep 2
if command -v curl >/dev/null 2>&1; then
  if curl -fsS "http://127.0.0.1:${APP_PORT}/api/health" >/dev/null 2>&1; then
    info "Health check OK: http://127.0.0.1:${APP_PORT}/api/health"
  else
    warn "Health endpoint did not respond yet. Wait a few seconds, then open:"
    warn "  http://127.0.0.1:${APP_PORT}/api/health"
  fi
else
  warn "curl not installed — open http://127.0.0.1:${APP_PORT}/api/health in a browser."
fi

printf '\n%sSetup complete.%s\n\n' "$GREEN" "$NC"
info "API base URL:     http://127.0.0.1:${APP_PORT}"
info "Health check:     http://127.0.0.1:${APP_PORT}/api/health"
info ""
info "Demo accounts (after seed):"
info "  Super admin:    admin.user@e-uvt.ro  /  password"
info "  Coordinator:    test.user@e-uvt.ro  /  password"
info ""
info "Useful commands:"
info "  docker compose ps"
info "  docker compose logs -f app"
info "  docker compose exec app php artisan test"
info "  docker compose down"
info ""
info "Login: POST http://127.0.0.1:${APP_PORT}/api/auth/login  (JSON: email, password)"
info "Use the returned token as:  Authorization: Bearer <token>"
