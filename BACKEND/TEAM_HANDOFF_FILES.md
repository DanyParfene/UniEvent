# Team handoff — files not in Git / not copied by `copy-to-unievent.sh`

Use this when onboarding someone to **UniEvent BACKEND** (or any clone from the copied tree).  
Everything in the “Git + copy script” column is already in the repo or synced by `./copy-to-unievent.sh`.  
Share items below **outside Git** (password manager, encrypted archive, in-person USB, etc.).

---

## 1. Must share manually (secrets & environment)

These are **excluded from the copy script** and **not committed to Git**. Teammates need them (or equivalent values) before the API behaves like your machine.

| Item | Path | Why it is not copied | How teammates usually get it |
|------|------|----------------------|------------------------------|
| **Environment file** | `.env` | Contains secrets; in `.gitignore` | You send a team `.env` (see template below) **or** they copy `.env.example` → `.env` and you only send the secret values |
| **Env backups** (if used) | `.env.backup`, `.env.production` | Same as `.env` | Only if you maintain separate env files per environment |

### Minimum secret / config values to agree as a team

These live in `.env` (see `.env.example` for names). Defaults in `.env.example` work for **solo local Docker**; share real values when the team shares DB, mail, or front-end URLs.

| Variable | Share when… |
|----------|-------------|
| `APP_KEY` | Optional. Each dev can run `php artisan key:generate`. Share only if everyone must decrypt the same encrypted data. |
| `DB_PASSWORD` | Shared MariaDB instance or non-default password |
| `DB_DATABASE`, `DB_USERNAME`, `DB_HOST`, `DB_PORT` | Not using Docker service names / shared DB |
| `REDIS_PASSWORD` | Redis is password-protected |
| `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENCRYPTION` | Real email (reports, reminders) — default `log` does not send mail |
| `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME` | Branded / allowed sender for SMTP |
| `SANCTUM_STATEFUL_DOMAINS` | Front-end runs on a host/port not listed in `.env.example` (e.g. `localhost:5173`, team LAN IP) |
| `APP_URL` | Cookies / Sanctum / links must match how they open the API |
| `BACKUP_ARCHIVE_PASSWORD` | Anyone restoring Spatie backup zips you created |
| `BACKUP_NOTIFICATION_EMAIL` | Backup failure alerts to a real inbox |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET`, … | Remote backup or S3 storage (not required for local Docker) |

**Suggested handoff:** a redacted `.env.team` (no real passwords in Git) plus secrets in 1Password / Bitwarden / similar.

---

## 2. Optional manual share (data, not code)

Only hand these off if the goal is **continuing your data**, not a fresh dev environment.

| Item | Path | Why it is not copied | When to share |
|------|------|----------------------|---------------|
| **Database dump** | e.g. `backup.sql` / `.sql.gz` | DB lives in Docker volume `mariadb_data`, not in repo | Shared staging data, real partners/events beyond seeders |
| **Redis snapshot** | Docker volume `redis_data` | Ephemeral cache/queue; excluded | Almost never — flush and rebuild |
| **Generated PDF reports** | `storage/app/private/reports/*.pdf` | Runtime output | Debugging a specific report generation |
| **Spatie DB backups** | `storage/app/backups/*.zip` | Runtime output | Disaster recovery / matching your backup password |
| **Application logs** | `storage/logs/laravel.log` | Runtime; excluded | Debugging only |
| **PHPUnit cache** | `.phpunit.result.cache` | Local test cache | Never needed to run the app |

Fresh setup normally uses **`php artisan migrate --seed`** (demo users in `DatabaseSeeder`) — no dump required.

---

## 3. Excluded from copy but teammates can create themselves (do not hand off)

Do **not** zip/send these; install or generate on each machine.

| Item | Path | Recreate with |
|------|------|----------------|
| PHP dependencies | `vendor/` | `composer install` (or `./copy-to-unievent.sh --install` / `--with-vendor` from source machine) |
| NPM packages | `node_modules/` | `npm install` (only if you use Vite/front-end assets in this repo) |
| Front-end build | `public/build/` | `npm run build` |
| Laravel bootstrap cache | `bootstrap/cache/*.php` | `composer install` / `php artisan package:discover` |
| Storage/cache/logs | `storage/framework/*`, `storage/logs/*` | `mkdir -p` + run app; `setup-linux.sh` does this but is **not** copied — run manually or use Docker |
| Public storage link | `public/storage` | `php artisan storage:link` (if you use `public` disk) |
| Docker DB/Redis data | volumes `mariadb_data`, `redis_data` | `docker compose up` + `migrate --seed` |
| Application key (if not shared) | `APP_KEY` in `.env` | `php artisan key:generate` |

### One-time local bootstrap

Use the setup scripts in the repo (included in Git / `copy-to-unievent.sh`):

| OS | Command |
|----|---------|
| **Windows** | `.\setup-windows.ps1` or double-click `setup.cmd` |
| **Linux / macOS / WSL** | `chmod +x setup-linux.sh && ./setup-linux.sh` |

See [SETUP.md](SETUP.md) for prerequisites and what each step does.

Before running: place `.env` (from `.env.example` or from a teammate). The script creates `.env` from `.env.example` only if `.env` is missing.

---

## 4. Not needed to run the API (excluded on purpose)

| Item | Notes |
|------|--------|
| `AGENTS.md`, `ARCHITECTURE.md`, `step-*.md`, `.cursor/` | Agent/planning docs |
| `.tools/`, `composer.phar`, `composer-setup.php` | Local Composer bootstrap |
| `copy-to-unievent.sh` | Source-repo mirror script only (not needed after Git clone) |
| `.git/` | Teammates clone/pull BACKEND from Git separately |

---

## 5. Prerequisites (not files)

Each teammate installs on their machine (not copied):

- **Git** (clone/pull the BACKEND repo)
- **Docker Engine + Compose** (MariaDB 11, Redis, app, worker, scheduler per `docker-compose.yml`)
- **Composer** on the host *or* only via `docker compose run … composer` (no need to share `vendor/` if they run `composer install` in the container)

---

## 6. Quick checklist for the person sending the handoff

- [ ] Send `.env` or a secret sheet (DB, `APP_KEY` if shared, `MAIL_*`, `SANCTUM_STATEFUL_DOMAINS`, `BACKUP_ARCHIVE_PASSWORD` if relevant)
- [ ] Confirm they use **Git** for code; copy script is only for mirroring to UniEvent folder
- [ ] Optional: SQL dump + backup zip only if they need your data, not a clean seed
- [ ] Point them to demo logins after seed: `admin.user@e-uvt.ro` / `test.user@e-uvt.ro` — password `password` (from `DatabaseSeeder`)

---

## 7. What *is* already in Git / after `copy-to-unievent.sh`

No manual copy needed for: `app/`, `config/`, `database/` (migrations + seeders), `routes/`, `resources/`, `docker/`, `Dockerfile`, `docker-compose.yml`, `.env.example`, `composer.json`, `composer.lock`, `api-contract.json`, `tests/`, `setup-linux.sh`, `setup-windows.ps1`, `setup.cmd`, `SETUP.md`, etc.
