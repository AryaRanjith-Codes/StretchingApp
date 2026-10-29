from functools import lru_cache
from supabase import create_client, Client

from app.core.config import get_settings


@lru_cache
def get_supabase() -> Client:
    """Anon-key client — subject to Row Level Security policies."""
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_anon_key)


@lru_cache
def get_supabase_admin() -> Client:
    """Service-role client — bypasses RLS. Server-side only."""
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_service_role_key)
