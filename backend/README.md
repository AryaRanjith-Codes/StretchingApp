# WarmUp — Backend (FastAPI)

Python/FastAPI backend for the WarmUp coach-facing tracker.

## Setup

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1       # Windows PowerShell
# source .venv/bin/activate         # macOS / Linux
pip install -r requirements.txt
cp .env.example .env                # fill in Supabase keys
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Structure
```
app/
  main.py                 FastAPI app, CORS, router registration
  core/config.py          Pydantic settings loaded from .env
  db/supabase_client.py   Supabase anon + service-role clients
  models/schemas.py       Pydantic request/response schemas
  api/routes/
    health.py             GET /health
    auth.py               signup / login / logout      (Phase 2)
    teams.py              team CRUD                    (Phase 2)
    players.py            roster CRUD                  (Phase 2)
    warmups.py            program catalog              (Phase 1)
    sessions.py           log session + attendance     (Phase 3)
  services/               business logic (compliance calc, etc.)
```

All non-stubbed endpoints currently return `501 Not Implemented` with the phase they belong to. Build them out as you work through the phases in the top-level README.

## Supabase

Backend talks to Supabase using the service-role key for writes (bypasses RLS) and the anon key for reads where the caller's JWT carries user identity. Keep the service-role key out of the frontend — it belongs here only.
