import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';

/**
 * AuthContext wraps Supabase auth + the user's row in public.profiles.
 *
 *  - On mount: hydrates the existing session (if any) and subscribes to
 *    onAuthStateChange so sign-in / sign-out in another tab is reflected here.
 *  - `signUp` passes role + full_name through auth.signUp's `options.data`.
 *    These land in auth.users.raw_user_meta_data, which the DB trigger
 *    `handle_new_user()` reads to create the matching profiles row.
 *  - `signIn` / `signOut` are thin wrappers; after a successful signIn we
 *    fetch the profile so UI can route on role.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) {
      console.error('[auth] failed to load profile', error);
      setProfile(null);
      return;
    }
    setProfile(data);
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await loadProfile(data.session?.user?.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      await loadProfile(nextSession?.user?.id);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signUp = useCallback(async ({ email, password, fullName, role, extras = {} }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role, // 'student_player' | 'coach'
          ...extras, // optional team_code / grade_level / organization / certifications
        },
      },
    });
    return { data, error };
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      await loadProfile(data.session?.user?.id);
    }
    return { data, error };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    setProfile(null);
    return { error };
  }, []);

  const value = useMemo(
    () => ({ session, user: session?.user ?? null, profile, loading, signUp, signIn, signOut }),
    [session, profile, loading, signUp, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
