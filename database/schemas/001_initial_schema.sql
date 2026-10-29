-- =============================================================================
-- WarmUp Coach — Initial Schema (Phase 1)
-- Supabase / PostgreSQL
-- =============================================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =============================================================================
-- coaches
-- Mirrors / extends Supabase auth.users. We don't duplicate auth; we join to it.
-- =============================================================================
create table if not exists public.coaches (
    id              uuid primary key references auth.users(id) on delete cascade,
    email           text unique not null,
    full_name       text not null,
    organization    text,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

-- =============================================================================
-- teams
-- =============================================================================
create table if not exists public.teams (
    id              uuid primary key default uuid_generate_v4(),
    coach_id        uuid not null references public.coaches(id) on delete cascade,
    name            text not null,
    age_group       text,                -- e.g. "U14", "U16", "Varsity"
    season          text,                -- e.g. "2026 Spring"
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);
create index if not exists idx_teams_coach_id on public.teams(coach_id);

-- =============================================================================
-- players
-- =============================================================================
create table if not exists public.players (
    id              uuid primary key default uuid_generate_v4(),
    team_id         uuid not null references public.teams(id) on delete cascade,
    full_name       text not null,
    jersey_number   int,
    birth_year      int,
    is_active       boolean not null default true,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);
create index if not exists idx_players_team_id on public.players(team_id);

-- =============================================================================
-- warmup_programs
-- Reference / catalog table. Seeded with FIFA 11+ and Nordic HE.
-- =============================================================================
create table if not exists public.warmup_programs (
    id                      uuid primary key default uuid_generate_v4(),
    code                    text unique not null,     -- "fifa_11_plus" | "nordic_hamstring"
    name                    text not null,
    description             text,
    duration_minutes        int,
    frequency_per_week      int,                      -- recommended cadence
    created_at              timestamptz not null default now()
);

-- =============================================================================
-- warmup_sessions
-- One row per team practice/match where a program was run.
-- =============================================================================
create table if not exists public.warmup_sessions (
    id                  uuid primary key default uuid_generate_v4(),
    team_id             uuid not null references public.teams(id) on delete cascade,
    program_id          uuid not null references public.warmup_programs(id),
    coach_id            uuid not null references public.coaches(id),
    session_date        date not null,
    duration_minutes    int,
    notes               text,
    created_at          timestamptz not null default now()
);
create index if not exists idx_sessions_team_date on public.warmup_sessions(team_id, session_date);

-- =============================================================================
-- session_attendance
-- Per-player row for every session — the raw data behind compliance %.
-- =============================================================================
create table if not exists public.session_attendance (
    id              uuid primary key default uuid_generate_v4(),
    session_id      uuid not null references public.warmup_sessions(id) on delete cascade,
    player_id       uuid not null references public.players(id) on delete cascade,
    completed       boolean not null default false,
    partial_notes   text,
    created_at      timestamptz not null default now(),
    unique (session_id, player_id)
);
create index if not exists idx_attendance_player on public.session_attendance(player_id);

-- =============================================================================
-- Row Level Security
-- A coach can see / write ONLY their own data.
-- =============================================================================
alter table public.coaches             enable row level security;
alter table public.teams               enable row level security;
alter table public.players             enable row level security;
alter table public.warmup_sessions     enable row level security;
alter table public.session_attendance  enable row level security;
alter table public.warmup_programs     enable row level security;

-- coaches: a coach row is readable/writable only by that user
create policy "coach self access"
    on public.coaches for all
    using (id = auth.uid())
    with check (id = auth.uid());

-- teams: owned by coach_id
create policy "team coach access"
    on public.teams for all
    using (coach_id = auth.uid())
    with check (coach_id = auth.uid());

-- players: access via owning team
create policy "player via team"
    on public.players for all
    using (team_id in (select id from public.teams where coach_id = auth.uid()))
    with check (team_id in (select id from public.teams where coach_id = auth.uid()));

-- sessions: access via owning team
create policy "session via team"
    on public.warmup_sessions for all
    using (team_id in (select id from public.teams where coach_id = auth.uid()))
    with check (team_id in (select id from public.teams where coach_id = auth.uid()));

-- attendance: access via owning session
create policy "attendance via session"
    on public.session_attendance for all
    using (
        session_id in (
            select s.id from public.warmup_sessions s
            join public.teams t on t.id = s.team_id
            where t.coach_id = auth.uid()
        )
    )
    with check (
        session_id in (
            select s.id from public.warmup_sessions s
            join public.teams t on t.id = s.team_id
            where t.coach_id = auth.uid()
        )
    );

-- warmup_programs: catalog is readable by any authenticated coach
create policy "programs readable"
    on public.warmup_programs for select
    using (auth.role() = 'authenticated');
