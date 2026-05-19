# Local setup (Docker)

One-time bootstrap: build images, start MariaDB + Redis, install Composer deps, migrate + seed, start API/worker/scheduler.

**Prerequisites:** [Git](https://git-scm.com/), [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows) or Docker Engine + Compose (Linux/macOS).  
**You still need:** a `.env` file (copy from `.env.example` or receive from a teammate — see [TEAM_HANDOFF_FILES.md](TEAM_HANDOFF_FILES.md)).

## Windows

In PowerShell from the repo root:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\setup-windows.ps1
```

Or double-click **`setup.cmd`** (runs the same script).

## Linux / macOS / WSL

```bash
chmod +x setup-linux.sh
./setup-linux.sh
```

## What the setup scripts do

1. Check Git + Docker are installed and Docker is running  
2. Create `.env` from `.env.example` if missing  
3. `docker compose build`  
4. Start **MariaDB** and **Redis**, wait until healthy  
5. `composer install` inside the `app` container  
6. `php artisan key:generate` if `APP_KEY` is empty  
7. Create `storage/` and `bootstrap/cache` directories  
8. `docker compose up -d` (API, queue worker, scheduler)  
9. `php artisan migrate --seed`  
10. Hit `GET /api/health`

## After setup

| | |
|--|--|
| API | http://127.0.0.1:8000 (or `APP_PORT` in `.env`) |
| Health | http://127.0.0.1:8000/api/health |
| Super admin | `admin.user@e-uvt.ro` / `password` |
| Coordinator | `test.user@e-uvt.ro` / `password` |

```bash
docker compose ps
docker compose logs -f app
docker compose exec app php artisan test
docker compose down
```

## Port conflicts

If MariaDB or the API cannot bind:

- Set `FORWARD_DB_PORT=3307` in `.env` (host port for MariaDB)  
- Set `APP_PORT=8001` in `.env` (host port for the API)

Then run the setup script again.
