# API Contract — Platformă Evenimente UVT

**Version:** 1.0.0 (aligned with backend as of 2026-05-18)  
**Base URL:** `/api`  
**Content-Type:** `application/json`  
**Machine-readable mirror:** `[api-contract.json](api-contract.json)`

This document is generated from `routes/api.php`, FormRequests, API Resources, and feature tests. Use it as the single source of truth for frontend integration.

---

## Authentication


| Method                          | Detail                                                                                                           |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Bearer token (SPA / mobile)** | `Authorization: Bearer {token}` — token from `POST /api/auth/register` or `POST /api/auth/login` at `data.token` |
| **Sanctum stateful (optional)** | Cookie session when the frontend origin is in `SANCTUM_STATEFUL_DOMAINS`                                         |


All routes under **Authenticated routes** require a valid Sanctum token unless noted.

---

## Response envelopes

### Success (most endpoints)

```json
{
  "data": { },
  "message": "optional human-readable string",
  "meta": { }
}
```


| HTTP  | When                             |
| ----- | -------------------------------- |
| `200` | OK                               |
| `201` | Created (`ApiResponse::created`) |
| `202` | Accepted (report queued)         |


**Pagination** (`GET /api/events` only) adds `meta`:


| Field          | Type    | Value                                      |
| -------------- | ------- | ------------------------------------------ |
| `current_page` | integer | Current page                               |
| `per_page`     | integer | **15** (fixed, not configurable via query) |
| `total`        | integer | Total matching rows                        |
| `last_page`    | integer | Last page number                           |


`data` is an **array of events** (not wrapped in another key).

### Errors

```json
{
  "message": "Human-readable summary",
  "errors": {
    "field_name": ["First validation message", "..."]
  }
}
```


| HTTP  | Meaning                                                     |
| ----- | ----------------------------------------------------------- |
| `401` | Missing/invalid token — `{ "message": "Unauthenticated." }` |
| `403` | Forbidden (role/policy) — `{ "message": "..." }`            |
| `404` | Not found — `{ "message": "Resource not found." }`          |
| `422` | Validation failed — `errors` object present                 |
| `429` | Rate limit — `{ "message": "Too many requests." }`          |


### No content

`204` with **empty body** — used by `POST /api/auth/logout` and `DELETE /api/partners/{id}`.

### Exceptions (no envelope)


| Endpoint          | Body                                |
| ----------------- | ----------------------------------- |
| `GET /api/health` | `{ "status": "ok" }`                |
| `GET /api/user`   | Raw Laravel `User` JSON (see below) |


---

## Rate limits


| Scope                               | Limit                         |
| ----------------------------------- | ----------------------------- |
| `POST /api/auth/login`              | 5 / minute per IP             |
| `GET` and `PUT` (authenticated API) | 60 / minute per user id or IP |
| `POST /api/generate-report`         | 2 / minute per user id or IP  |


---

## Shared enums & types

### Roles (`current_role` / `role_name`)

`super_administrator` | `department_administrator` | `coordinator`

### Event `mode`

`physical` | `hybrid` | `online`

### Event `has_livestream`

`YES` | `NO` (exact uppercase)

### Event `status`

`draft` | `published` | `archived`

### Metric `category`

`album_foto` | `facebook` | `instagram` | `tiktok` | `comunicat_presa` | `aparitii_presa` | `statistici` | `podcast`

### Report `report_type` (202 response)

`partner` | `normal`

### IDs


| Entity                      | Type            |
| --------------------------- | --------------- |
| User                        | **integer**     |
| Event, Partner, EventMetric | **UUID string** |


### Dates


| Context                           | Format                                      |
| --------------------------------- | ------------------------------------------- |
| Event `start_date`, `finish_date` | `Y-m-d` (e.g. `2026-05-18`)                 |
| `created_at`, `updated_at`        | ISO 8601 (e.g. `2026-05-18T10:00:00+00:00`) |


### Password rules

`password` / `new_password` use Laravel `Password::defaults()` (typically **minimum 8 characters**). Registration tests use `Password1!`.

---

## Shared response shapes

### `User` (auth responses)


| Field          | Type    | Notes                  |
| -------------- | ------- | ---------------------- |
| `id`           | integer |                        |
| `name`         | string  |                        |
| `email`        | string  |                        |
| `department`   | string  |                        |
| `current_role` | string  | One of the roles above |


### `UserAdmin` (user management)

Same as `User` but **no `department`**.

### `Partner`


| Field        | Type     | Nullable |
| ------------ | -------- | -------- |
| `id`         | uuid     | no       |
| `name`       | string   | no       |
| `logo_path`  | string   | yes      |
| `created_at` | ISO 8601 | no       |
| `updated_at` | ISO 8601 | no       |


### `EventMetric`


| Field        | Type         |
| ------------ | ------------ |
| `id`         | uuid         |
| `category`   | enum string  |
| `link`       | string (URL) |
| `reach`      | integer ≥ 0  |
| `engagement` | integer ≥ 0  |


### `Event`


| Field                    | Type          | Nullable | Notes                     |
| ------------------------ | ------------- | -------- | ------------------------- |
| `id`                     | uuid          | no       |                           |
| `department`             | string        | no       |                           |
| `name`                   | string        | no       |                           |
| `banner_url`             | string        | no       |                           |
| `start_date`             | date          | no       |                           |
| `finish_date`            | date          | no       |                           |
| `edition`                | integer       | no       | ≥ 1                       |
| `organizer`              | string        | no       |                           |
| `description`            | string        | no       |                           |
| `location`               | string        | no       |                           |
| `guests`                 | string[]      | no       | Defaults to `[]`          |
| `mode`                   | enum          | no       |                           |
| `estimated_participants` | integer       | no       | ≥ 1                       |
| `target_group`           | string        | no       |                           |
| `has_livestream`         | enum          | no       |                           |
| `coordinator_name`       | string        | no       |                           |
| `coordinator_email`      | string        | no       |                           |
| `coordinator_phone`      | string        | no       |                           |
| `additional_info`        | string        | yes      |                           |
| `status`                 | enum          | no       |                           |
| `partners`               | Partner[]     | —        | Present when eager-loaded |
| `metrics`                | EventMetric[] | —        | Present when eager-loaded |
| `created_at`             | ISO 8601      | no       |                           |
| `updated_at`             | ISO 8601      | no       |                           |


### `StatisticsDashboard` (`data` root object)


| Field                         | Type                 | Notes                                                                             |
| ----------------------------- | -------------------- | --------------------------------------------------------------------------------- |
| `best_partner`                | Partner | null       | Top partner last 30 days                                                          |
| `last_month_press_aparitions` | integer              | Count of `aparitii_presa` metrics, events in last year                            |
| `next_5_events`               | array | `""`         | Up to 5 `{ id, name }`; **empty string** if none                                  |
| `best_organizator`            | string | null        |                                                                                   |
| `most_participants`           | integer              | Max `estimated_participants` in last year; `0` if none                            |
| `number_of_events_per_month`  | `{ month, count }[]` | Current year Jan→current month; `month` is Romanian short label (`Ian`, `Feb`, …) |


---

## Endpoints

### `GET /api/health`

**Auth:** none

**Response `200`:** `{ "status": "ok" }` (no envelope)

---

### `GET /api/user`

**Auth:** required

**Response `200`:** Raw user model (no envelope, no `current_role`):

```json
{
  "id": 1,
  "name": "...",
  "email": "...",
  "department": "...",
  "email_verified_at": null,
  "created_at": "...",
  "updated_at": "..."
}
```

Prefer `POST /api/auth/login` user shape for the app shell.

---

## Auth (`/api/auth`)

### `POST /api/auth/register`

**Auth:** none

**Body (JSON):**


| Field        | Required | Type   | Rules                                                     |
| ------------ | -------- | ------ | --------------------------------------------------------- |
| `name`       | yes      | string | max 255                                                   |
| `email`      | yes      | string | email, unique, must match `*@e-uvt.ro` (case-insensitive) |
| `password`   | yes      | string | password defaults                                         |
| `department` | yes      | string | max 255                                                   |


**Response `201`:**

```json
{
  "data": {
    "user": { "id", "name", "email", "department", "current_role": "coordinator" },
    "token": "plain-text-token",
    "token_type": "Bearer"
  },
  "message": "Registration successful."
}
```

---

### `POST /api/auth/login`

**Auth:** none · **Throttle:** 5/min per IP

**Body:**


| Field      | Required | Type          |
| ---------- | -------- | ------------- |
| `email`    | yes      | string, email |
| `password` | yes      | string        |


**Response `200`:** Same `data` shape as register (message: `"Login successful."`)

**Response `401`:** `{ "message": "<translated auth.failed>" }`

---

### `POST /api/auth/logout`

**Auth:** required

**Response `204`:** empty body

---

### `POST /api/auth/forgot-password`

**Auth:** none

**Body:**


| Field   | Required | Type          |
| ------- | -------- | ------------- |
| `email` | yes      | string, email |


**Response `200`:** `{ "data": null, "message": "If an account exists for this email, password reset instructions have been sent." }`

**Response `429`:** reset throttled

---

### `POST /api/auth/reset-password`

**Auth:** none

**Body:**


| Field          | Required | Type          |
| -------------- | -------- | ------------- |
| `email`        | yes      | string, email |
| `email_token`  | yes      | string        |
| `new_password` | yes      | string        |


**Response `200`:** `{ "data": null, "message": "<status>" }`

**Response `422`:** invalid token or password validation

---

### `POST /api/auth/change-password`

**Auth:** required

**Body:**


| Field          | Required | Type   |
| -------------- | -------- | ------ |
| `old_password` | yes      | string |
| `new_password` | yes      | string |


**Response `200`:** `{ "data": null, "message": "Password updated successfully." }`

**Response `422`:** `errors.old_password` if current password wrong

---

## Partners (`/api/partners`)

### `GET /api/partners`

**Auth:** any authenticated user

**Response `200`:** `{ "data": [ Partner, ... ] }` — active partners only, sorted by `name`

---

### `POST /api/partners`

**Roles:** `super_administrator`, `department_administrator`

**Body:**


| Field       | Required | Type             |
| ----------- | -------- | ---------------- |
| `name`      | yes      | string, max 255  |
| `logo_path` | no       | string, max 2048 |


**Response `201`:** `{ "data": Partner, "message": "Partner created successfully." }`

---

### `PUT /api/partners/{partner}`

**Roles:** same as POST · **Path:** `partner` = UUID

**Body:** same as POST (both fields allowed; `name` required)

**Response `200`:** `{ "data": Partner, "message": "Partner updated successfully." }`

---

### `DELETE /api/partners/{partner}`

**Roles:** same as POST · **Path:** `partner` = UUID

Soft-deletes partner (hidden from list; still on historical event detail).

**Response `204`:** empty

---

## Events

### RBAC visibility (list, show, update, statistics, reports)


| Role                       | Scope                                               |
| -------------------------- | --------------------------------------------------- |
| `super_administrator`      | All events; optional `department` query/body filter |
| `department_administrator` | `events.department` = user's `department`           |
| `coordinator`              | `LOWER(coordinator_email)` = user's email           |


---

### `POST /api/event`

**Auth:** any event role

**Body — all required except where noted:**


| Field                    | Required             | Type         | Notes                                                   |
| ------------------------ | -------------------- | ------------ | ------------------------------------------------------- |
| `name`                   | yes                  | string       | max 255                                                 |
| `banner_url`             | yes                  | string       | max 2048                                                |
| `start_date`             | yes                  | date `Y-m-d` |                                                         |
| `finish_date`            | yes                  | date         | must be **after** `start_date`                          |
| `edition`                | yes                  | integer      | min 1                                                   |
| `organizer`              | yes                  | string       | max 255                                                 |
| `description`            | yes                  | string       |                                                         |
| `location`               | yes                  | string       | max 255                                                 |
| `guests`                 | no                   | string[]     | each max 255                                            |
| `mode`                   | yes                  | enum         |                                                         |
| `estimated_participants` | yes                  | integer      | min 1                                                   |
| `target_group`           | yes                  | string       | max 255                                                 |
| `has_livestream`         | yes                  | enum         |                                                         |
| `coordinator_name`       | yes                  | string       | max 255                                                 |
| `coordinator_email`      | yes                  | email        | Coordinators: **must equal own email**                  |
| `coordinator_phone`      | yes                  | string       | max 50                                                  |
| `additional_info`        | no                   | string       |                                                         |
| `status`                 | yes                  | enum         |                                                         |
| `partner_ids`            | no                   | uuid[]       | active partners only                                    |
| `department`             | **super_admin only** | string       | Required for super admin; omitted for others (auto-set) |


**Response `201`:** `{ "data": Event (with partners, metrics), "message": "Event created successfully." }`

---

### `GET /api/event/{event}`

**Path:** `event` = UUID · **Policy:** must be in scope

**Response `200`:** `{ "data": Event }` with `partners` and `metrics` loaded

---

### `PUT /api/event/{event}`

**Path:** `event` = UUID

Send **exactly one** of the three modes below. Combining modes (e.g. `metrics` + `name`) returns **422** on `payload`:

> Send exactly one update mode: core fields, metrics, or archive.

#### Mode A — Core (partial update)

Include **any** core field key; only sent fields are validated/updated.

Same fields as create, but each present field uses `sometimes` rules. `finish_date` must be after `start_date` (from body or existing event).

Extra rules:

- **Coordinator:** if `coordinator_email` sent → must match own email  
- **Dept admin:** if `department` sent → must match own department  
- **Super admin:** `department` optional

#### Mode B — Metrics

```json
{
  "metrics": [
    {
      "category": "facebook",
      "link": "https://...",
      "reach": 100,
      "engagement": 10
    }
  ]
}
```


| Field                  | Required | Type              |
| ---------------------- | -------- | ----------------- |
| `metrics`              | yes      | array, min 1 item |
| `metrics[].category`   | yes      | metric enum       |
| `metrics[].link`       | yes      | url, max 2048     |
| `metrics[].reach`      | yes      | integer ≥ 0       |
| `metrics[].engagement` | yes      | integer ≥ 0       |


Upserts by `(event_id, category)` — one row per category.

#### Mode C — Archive

```json
{ "archive": true }
```


| Field     | Required | Type    |
| --------- | -------- | ------- |
| `archive` | yes      | boolean |


Sets `status` to `archived`.

**Response `200` (all modes):** `{ "data": Event, "message": "Event updated successfully." }`

---

### `GET /api/events`

**Query parameters (all optional):**


| Param            | Type            | Notes                                                      |
| ---------------- | --------------- | ---------------------------------------------------------- |
| `name`           | string          | Partial match on event name                                |
| `start_date`     | date            | Filter `start_date >=`                                     |
| `end_date`       | date            | Filter `start_date <=`; must be ≥ `start_date` if both set |
| `partners[]`     | uuid            | Repeat key: `partners[]=id&partners[]=id` — OR filter      |
| `sort_by`        | `date` | `name` | Default: `date` → sorts by `start_date`                    |
| `sort_direction` | `asc` | `desc`  | Default: `desc`                                            |
| `page`           | integer         | Default: 1                                                 |
| `archived`       | boolean         | Default: exclude archived; `true`/`1` → **only** archived  |
| `department`     | string          | **Super admin only** — ignored for other roles             |


**Response `200`:**

```json
{
  "data": [ Event, ... ],
  "meta": { "current_page", "per_page", "total", "last_page" }
}
```

Each event includes `partners` and `metrics`.

---

## Statistics

### `GET /api/statistics`

**Query:**


| Param        | Required | Roles                      |
| ------------ | -------- | -------------------------- |
| `department` | no       | `super_administrator` only |


**Response `200`:** `{ "data": StatisticsDashboard }`

Aggregates respect the same RBAC scope as events; archived events are excluded.

---

## Reports

### `POST /api/generate-report`

**Throttle:** 2/min per user

**Body — at least one selection required:**


| Field           | Required | Type   | Notes                                                          |
| --------------- | -------- | ------ | -------------------------------------------------------------- |
| `partner_ids`   | no*      | uuid[] | If **non-empty** → **partner** report; `event_ids` **ignored** |
| `event_ids`     | no*      | uuid[] | Normal report; order preserved; must be in scope               |
| `filter_params` | no*      | object | See below                                                      |
| `report_title`  | no       | string | max 255                                                        |


At least one of: non-empty `partner_ids`, non-empty `event_ids`, or `filter_params` with at least one non-empty value.

`**filter_params` object (all keys optional):**


| Key              | Type            | Notes                      |
| ---------------- | --------------- | -------------------------- |
| `name`           | string          |                            |
| `start_date`     | date            |                            |
| `end_date`       | date            | ≥ `start_date` if both set |
| `sort_by`        | `date` | `name` |                            |
| `sort_direction` | `asc` | `desc`  |                            |
| `department`     | string          | Super admin only           |


**Response `202`:**

```json
{
  "data": { "queued": true, "report_type": "normal" },
  "message": "Report generation has been queued. You will receive the PDF by email shortly."
}
```

**Response `422`:** no events in scope — error on `partner_ids`, `event_ids`, or `filter_params` depending on request

Delivery: PDF **email attachment** (async queue). No job-status or download-link API.

---

## User administration

### `GET /api/users`

**Roles:** `super_administrator` only

**Response `200`:**

```json
{
  "data": {
    "users": [ UserAdmin, ... ]
  }
}
```

No pagination.

---

### `PUT /api/users/{user}/role`

**Roles:** `super_administrator` only · **Path:** `user` = integer user id

**Body:**


| Field       | Required | Type                                                               |
| ----------- | -------- | ------------------------------------------------------------------ |
| `role_name` | yes      | `super_administrator` | `department_administrator` | `coordinator` |


**Response `200`:** `{ "data": UserAdmin, "message": "User role updated successfully." }`

**Response `422`:** sole `super_administrator` cannot demote themselves (`errors.role_name`)

---

## Quick reference table


| Method | Path                    | Auth  | Roles                   |
| ------ | ----------------------- | ----- | ----------------------- |
| GET    | `/health`               | —     | —                       |
| GET    | `/user`                 | token | any                     |
| POST   | `/auth/register`        | —     | —                       |
| POST   | `/auth/login`           | —     | —                       |
| POST   | `/auth/logout`          | token | any                     |
| POST   | `/auth/forgot-password` | —     | —                       |
| POST   | `/auth/reset-password`  | —     | —                       |
| POST   | `/auth/change-password` | token | any                     |
| GET    | `/partners`             | token | any                     |
| POST   | `/partners`             | token | super_admin, dept_admin |
| PUT    | `/partners/{uuid}`      | token | super_admin, dept_admin |
| DELETE | `/partners/{uuid}`      | token | super_admin, dept_admin |
| POST   | `/event`                | token | event roles             |
| GET    | `/event/{uuid}`         | token | scoped                  |
| PUT    | `/event/{uuid}`         | token | scoped                  |
| GET    | `/events`               | token | scoped                  |
| GET    | `/statistics`           | token | scoped                  |
| POST   | `/generate-report`      | token | scoped                  |
| GET    | `/users`                | token | super_admin             |
| PUT    | `/users/{id}/role`      | token | super_admin             |


---

## Frontend checklist

1. Store `data.token` after login/register; send `Authorization: Bearer {token}` on protected routes.
2. Parse success as `response.data` (and `response.meta` for event lists).
3. On `422`, read `errors[field][0]` (Laravel validation shape).
4. Use **UUID** strings for events/partners; **integer** for user ids in admin routes.
5. Event updates: never mix `metrics`, core fields, and `archive` in one request.
6. `next_5_events`: handle both **array** and **empty string** `""`.
7. `GET /api/user` is legacy — use login `user` object for `current_role`.
8. Partner `logo_path` is a string reference only until a future upload step exists.

