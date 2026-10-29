-- =============================================================================
-- Seed the warmup_programs catalog.
-- Idempotent: ON CONFLICT (code) DO NOTHING.
-- =============================================================================

insert into public.warmup_programs (code, name, description, duration_minutes, frequency_per_week)
values
    (
        'fifa_11_plus',
        'FIFA 11+',
        'A complete 20-minute warm-up (running, strength/plyo/balance, running) designed by FIFA F-MARC. Replaces a normal warm-up — not an add-on. Shown to reduce soccer injury rates by up to 46%.',
        20,
        2
    ),
    (
        'nordic_hamstring',
        'Nordic Hamstring Exercise',
        'Eccentric hamstring strengthening performed kneeling with ankles anchored. Targets the exact contraction type involved in hamstring strain. Low-volume, high-leverage.',
        5,
        2
    )
on conflict (code) do nothing;
