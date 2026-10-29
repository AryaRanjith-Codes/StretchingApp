# WarmUp — Coach Compliance Tracker

A web app for soccer coaches to track player compliance with evidence-based injury-prevention warm-ups (FIFA 11+, Nordic hamstring exercise) in adolescent soccer.

This is the real-world test of the implementation-science argument in **Paper 1 of the ACL & Hamstring Research Series**: the research is settled, the gap is adoption — this tool closes that gap.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Python + FastAPI |
| Database / Auth | Supabase (PostgreSQL + Row Level Security + Auth) |

---

## Repository layout

```
.
├── frontend/     React SPA — landing page scaffolded (Phase 1)
├── backend/      FastAPI service — route stubs for every phase
├── database/     Supabase SQL schema, seed data, analytics views
└── README.md     this file
```

Each folder has its own README with run instructions.

---

## Problem breakdown — modular parts

The product splits cleanly into **six functional modules**. Each phase below delivers one or two of them end-to-end (DB → API → UI).

| # | Module | Core question it answers |
| --- | --- | --- |
| M1 | **Identity** | Who is this coach? |
| M2 | **Roster** | Which teams and players do they own? |
| M3 | **Program catalog** | What warm-ups exist and how are they structured? |
| M4 | **Session logging** | Did this team run program X today, and which players actually did it? |
| M5 | **Compliance analytics** | What % of eligible sessions did each player complete, and how does that trend? |
| M6 | **Nudges & reporting** | Who's drifting, who needs a reminder, and what gets exported for research? |

---

## Phase-by-phase implementation plan

### Phase 1 — Foundation (this scaffold)
**Goal:** working scaffold, landing page, empty API, DB migrated.

- Scaffold Vite + React + Tailwind frontend ✅
- Build landing page: navbar modeled on reference screenshot, hero, features, footer, light/dark toggle ✅
- Scaffold FastAPI backend with CORS, settings, Supabase client, route stubs ✅
- Supabase schema + seed + RLS policies + analytics views ✅
- One-command local dev for each service

**Deliverable:** `npm run dev` serves the landing page; `uvicorn app.main:app --reload` serves `/health`; `001_initial_schema.sql` + `002_seed_programs.sql` + `003_views.sql` run cleanly in Supabase.

---

### Phase 2 — Identity & Roster (M1 + M2)
**Goal:** a coach can sign in, create a team, and add players.

- Supabase email/password auth from the frontend (`@supabase/supabase-js`).
- `/signup`, `/login`, `/logout` wired in frontend; coach row auto-created in `public.coaches` on first login (trigger or on-login upsert).
- Backend: implement `teams.py` and `players.py` CRUD using the service-role Supabase client with the coach's JWT verified via `SUPABASE_JWT_SECRET`.
- Frontend pages: `/dashboard`, `/teams/new`, `/teams/:id` with roster table.
- Protected route wrapper (`<RequireAuth>`).

**Exit criteria:** sign up, create a team, add 10 players, see them persisted after refresh.

---

### Phase 3 — Program catalog + Session logging (M3 + M4)
**Goal:** coach logs that the team ran a program and marks who did it.

- Frontend: `/log` page — pick team → pick program (FIFA 11+ / Nordic HE) → date → check-off list of players → submit.
- Backend: `POST /api/sessions` (creates `warmup_sessions` row) + `POST /api/sessions/attendance` (bulk inserts `session_attendance`).
- Mobile-first UI: this is the sideline moment — big touch targets, no scroll, under-60-second completion.
- Offline-tolerant: queue submission in localStorage if offline, flush on reconnect.

**Exit criteria:** a coach can log a session in under 60 seconds on their phone.

---

### Phase 4 — Compliance analytics (M5)
**Goal:** the actual answer to the research question — are we hitting dose-response?

- Backend: `GET /api/sessions/compliance/{team_id}` reads from the `v_player_compliance` view.
- Frontend: `/teams/:id/compliance` page with:
  - Per-player compliance bars (green ≥80%, amber 60–79%, red <60%).
  - Team-level 4-week trend line.
  - Dose-response scatter (if injury logging is added) — compliance % vs. injury incidence.
- Export: CSV of raw attendance rows for the coach's own records / for research use.

**Exit criteria:** coach opens the dashboard and sees exactly which three players need a conversation this week.

---

### Phase 5 — Nudges & reporting (M6)
**Goal:** fix the "we meant to do it" barrier Lutz 2024 and Donaldson 2018 name.

- Weekly compliance email digest to coach (Supabase Edge Function on cron, or a FastAPI scheduled task).
- Red-flag alert when a player's rolling 4-week compliance crosses below 60%.
- Printable team report (PDF export) for season-end review or athletic trainer handoff.
- Optional: SMS reminder to coach on scheduled practice days ("Did you run 11+ today?").

**Exit criteria:** no coach ever misses a session because they forgot to log it.

---

### Phase 6 — Polish & deploy
- Error boundaries, loading skeletons, empty states, 404 page.
- Pytest for backend, Vitest + React Testing Library for frontend.
- CI: GitHub Actions runs lint + tests on every push.
- Deploy frontend → Vercel; backend → Render or Fly.io; DB stays on Supabase.
- Observability: Sentry on both frontend and backend.

**Exit criteria:** a real coach from a real high school program can self-serve from `warmup.app` on day one of a real season.

---

## How this ties back to the research paper

Paper 1 argues the youth-soccer injury-prevention problem is **implementation**, not evidence. This app is the leverage point: it removes the two biggest barriers Donaldson 2018 and Lutz 2024 identify — time cost of logging, and the enforcement gap — by making compliance visible, measurable, and shareable per-player, per-session. If it works, the dataset it collects is itself a Paper-2 contribution.

---

## Quick start

```bash
# Frontend
cd frontend && npm install && npm run dev          # http://localhost:5173

# Backend
cd backend && python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000          # http://localhost:8000/docs

# Database
# Run the three SQL files in database/schemas/ in order in the Supabase SQL editor.
```
