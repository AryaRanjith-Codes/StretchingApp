# WarmUp — Database (Supabase / PostgreSQL)

Schema and seed scripts for the WarmUp coach-facing tracker.

## Setup — one time

1. Create a project at [supabase.com](https://supabase.com).
2. Project Settings → API → copy `URL`, `anon` key, `service_role` key, and `JWT secret` into:
   - `backend/.env`
   - `frontend/.env` (only `URL` and `anon` key — never put `service_role` in the frontend)
3. SQL Editor → run the scripts below **in order**:

```
database/schemas/001_initial_schema.sql
database/schemas/002_seed_programs.sql
database/schemas/003_views.sql
```

4. Enable email auth under Authentication → Providers.

## Schema overview

| Table | Purpose |
| --- | --- |
| `coaches` | Mirror of `auth.users` with coach-specific fields. |
| `teams` | A squad owned by one coach. |
| `players` | Roster entries belonging to one team. |
| `warmup_programs` | Catalog: FIFA 11+ and Nordic HE (seeded). |
| `warmup_sessions` | One row per team practice/match where a program ran. |
| `session_attendance` | Per-player completion row for each session — the raw compliance data. |

## Views (Phase 4 analytics)
- `v_player_compliance` — per-player `sessions_eligible`, `sessions_completed`, `compliance_pct`.
- `v_team_compliance` — per-team `total_sessions`, `avg_player_compliance_pct`.

## Row Level Security

RLS is on for every table. A coach can read/write only rows that trace back to `auth.uid()` (their own coach row → their teams → their players/sessions/attendance). The `warmup_programs` catalog is readable by any authenticated user.

Future migrations go in `database/migrations/` as `YYYYMMDD_description.sql`.
