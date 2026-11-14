-- =============================================================================
-- WarmUp Coach — Profiles & Auth (Phase 2)
-- Supabase / PostgreSQL
--
-- Extends Supabase's built-in auth.users with a public profile row that carries
-- role-specific data (Student/Player vs Coach). A trigger on auth.users auto-
-- creates the matching public.profiles row at signup, reading the chosen role
-- from raw_user_meta_data. RLS keeps users scoped to their own profile, with a
-- controlled read window for coaches.
--
-- Safe to re-run: all statements are idempotent / guarded with IF (NOT) EXISTS
-- or DROP ... IF EXISTS before CREATE.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Role enum
--    Using a Postgres ENUM gives us a tight check at the storage layer and
--    makes RLS predicates below trivially type-safe. Values chosen to match
--    the signup form's role selector.
-- -----------------------------------------------------------------------------
do $$
begin
    if not exists (select 1 from pg_type where typname = 'user_role') then
        create type public.user_role as enum ('student_player', 'coach');
    end if;
end
$$;


-- -----------------------------------------------------------------------------
-- 2. public.profiles
--    One row per authenticated user. `id` is both PK and FK → auth.users(id);
--    ON DELETE CASCADE means removing the auth user drops the profile.
--
--    Role-specific columns are nullable because only the relevant subset is
--    ever filled in. A single table (rather than coaches/students split) keeps
--    joins trivial and lets us evolve role-specific fields without schema
--    migrations touching auth-adjacent tables.
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
    id                      uuid primary key references auth.users(id) on delete cascade,

    -- Mirrored from auth.users for convenience (RLS-readable without joining auth).
    email                   text not null,
    full_name               text not null,
    role                    public.user_role not null,

    -- Student/Player fields
    team_code               text,            -- e.g. "VARSITY-2026" — joins player to a coach's team
    grade_level             text,            -- e.g. "10th", "U14"

    -- Coach fields
    organization            text,            -- school / club name
    certifications          text[],          -- e.g. ARRAY['USSF-C', 'FIFA 11+ Certified']

    created_at              timestamptz not null default now(),
    updated_at              timestamptz not null default now()
);

create index if not exists idx_profiles_role       on public.profiles(role);
create index if not exists idx_profiles_team_code  on public.profiles(team_code)  where team_code is not null;


-- -----------------------------------------------------------------------------
-- 3. updated_at maintenance
--    Generic trigger func bumps updated_at on every UPDATE. Shared across tables.
-- -----------------------------------------------------------------------------
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at := now();
    return new;
end;
$$;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at
    before update on public.profiles
    for each row
    execute function public.tg_set_updated_at();


-- -----------------------------------------------------------------------------
-- 4. Auto-provision profile on signup
--    Runs as SECURITY DEFINER so it can write into public.profiles even though
--    the inserting role (supabase_auth_admin) would otherwise be blocked by RLS.
--    Reads role & name from raw_user_meta_data — these come from the client's
--    signUp({ options: { data: {...} } }) call.
--
--    If role is missing / unknown we default to 'student_player' rather than
--    raising, because failing here would break the entire auth signup flow.
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    meta             jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
    resolved_role    public.user_role;
begin
    begin
        resolved_role := (meta->>'role')::public.user_role;
    exception when invalid_text_representation then
        resolved_role := 'student_player';
    end;

    if resolved_role is null then
        resolved_role := 'student_player';
    end if;

    insert into public.profiles (
        id,
        email,
        full_name,
        role,
        team_code,
        grade_level,
        organization,
        certifications
    )
    values (
        new.id,
        new.email,
        coalesce(meta->>'full_name', ''),
        resolved_role,
        nullif(meta->>'team_code', ''),
        nullif(meta->>'grade_level', ''),
        nullif(meta->>'organization', ''),
        case
            when meta ? 'certifications'
             and jsonb_typeof(meta->'certifications') = 'array'
            then array(select jsonb_array_elements_text(meta->'certifications'))
            else null
        end
    )
    on conflict (id) do nothing;

    return new;
end;
$$;

-- Trigger lives on auth.users (not public.profiles). Supabase allows this.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();


-- -----------------------------------------------------------------------------
-- 5. Row Level Security
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Clean slate so re-running this file doesn't leave stale duplicates.
drop policy if exists "profile self select"        on public.profiles;
drop policy if exists "profile self update"        on public.profiles;
drop policy if exists "profile self insert"        on public.profiles;
drop policy if exists "coach reads team roster"    on public.profiles;

-- a) A user can read their own row.
create policy "profile self select"
    on public.profiles for select
    using (id = auth.uid());

-- b) A user can update their own row. We deliberately do NOT allow them to
--    change their own role via this policy — the WITH CHECK keeps the role
--    pinned to whatever handle_new_user() wrote. Role changes must go through
--    an admin path (service_role key), not the user's own JWT.
create policy "profile self update"
    on public.profiles for update
    using (id = auth.uid())
    with check (
        id = auth.uid()
        and role = (select p.role from public.profiles p where p.id = auth.uid())
    );

-- c) Self-insert is a fallback for the rare case where the auth trigger didn't
--    fire (e.g. an existing user that predates this migration). The trigger is
--    the primary path; this policy just prevents a stuck account.
create policy "profile self insert"
    on public.profiles for insert
    with check (id = auth.uid());

-- d) Coaches can read Student/Player profiles that share their team_code.
--    This is the "roster lookup" use case: a coach views their players without
--    needing a service-role query. Students never see other students' rows.
create policy "coach reads team roster"
    on public.profiles for select
    using (
        role = 'student_player'
        and team_code is not null
        and exists (
            select 1
            from public.profiles coach
            where coach.id        = auth.uid()
              and coach.role      = 'coach'
              and coach.team_code = public.profiles.team_code
        )
    );


-- -----------------------------------------------------------------------------
-- 6. Grants
--    anon/authenticated need usage on the enum and select/update rights on the
--    table itself — RLS then narrows the row set. INSERTs happen via the
--    SECURITY DEFINER trigger, so the table-level INSERT grant to authenticated
--    only matters for the self-insert fallback policy above.
-- -----------------------------------------------------------------------------
grant usage on type public.user_role to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
