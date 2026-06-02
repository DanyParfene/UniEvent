#!/bin/sh
set -e

cd /var/www/html

# CONTAINER_ROLE drives what this container does on boot: app | worker | scheduler.
# Only the "app" role installs dependencies, clears caches, and migrates/seeds.
# Every other role waits until the app has finished before starting its command.
ROLE="${CONTAINER_ROLE:-app}"

mkdir -p \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

# Wipe every compiled/cached artifact so the latest code is ALWAYS used.
# This removes the package manifest, service cache, compiled config/routes/events,
# and compiled Blade views. Laravel regenerates whatever it needs against the
# freshly installed vendor, so the manifest can never reference a missing package.
purge_caches() {
    rm -f bootstrap/cache/*.php
    rm -f storage/framework/views/*.php
    php artisan optimize:clear >/dev/null 2>&1 || true
}

if [ "$ROLE" = "app" ]; then
    rm -f /tmp/app-ready

    echo "[entrypoint] Installing PHP dependencies (composer install)..."
    composer install --no-interaction --prefer-dist --optimize-autoloader

    echo "[entrypoint] Purging all cached artifacts..."
    purge_caches

    chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
    chmod -R ug+rwx storage bootstrap/cache 2>/dev/null || true

    echo "[entrypoint] Running migrations..."
    php artisan migrate --force --no-interaction

    echo "[entrypoint] Running seeders..."
    php artisan db:seed --force --no-interaction

    # Readiness flag (container-local, never persisted): the healthcheck uses this
    # so worker/scheduler only start once dependencies + caches + DB are ready.
    touch /tmp/app-ready
    echo "[entrypoint] App is ready."
else
    echo "[entrypoint] ($ROLE) waiting for dependencies to be installed by the app container..."
    until [ -f vendor/autoload.php ]; do
        sleep 2
    done
    echo "[entrypoint] ($ROLE) dependencies present, starting."
fi

exec "$@"
