-- =============================================================================
-- Reporting views for compliance analytics (Phase 4).
-- =============================================================================

-- Per-player compliance across all sessions their team has logged.
create or replace view public.v_player_compliance as
select
    p.id                                                              as player_id,
    p.full_name                                                       as player_name,
    p.team_id,
    count(sa.id)                                                      as sessions_eligible,
    count(sa.id) filter (where sa.completed)                          as sessions_completed,
    case
        when count(sa.id) = 0 then 0
        else round(100.0 * count(sa.id) filter (where sa.completed) / count(sa.id), 1)
    end                                                               as compliance_pct
from public.players p
left join public.warmup_sessions ws on ws.team_id = p.team_id
left join public.session_attendance sa
       on sa.session_id = ws.id and sa.player_id = p.id
where p.is_active
group by p.id, p.full_name, p.team_id;

-- Per-team compliance roll-up.
create or replace view public.v_team_compliance as
select
    t.id                                                              as team_id,
    t.name                                                            as team_name,
    count(distinct ws.id)                                             as total_sessions,
    coalesce(round(avg(vpc.compliance_pct), 1), 0)                    as avg_player_compliance_pct
from public.teams t
left join public.warmup_sessions ws on ws.team_id = t.id
left join public.v_player_compliance vpc on vpc.team_id = t.id
group by t.id, t.name;
