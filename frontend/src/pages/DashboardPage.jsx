import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Field({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wider text-slate-500">{label}</span>
      <span className="text-sm text-slate-100">{value || <span className="text-slate-500">—</span>}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const isCoach = profile?.role === 'coach';
  const accent = isCoach ? 'from-fuchsia-500 to-orange-400' : 'from-indigo-500 to-teal-400';
  const initials = (profile?.full_name || user?.email || '?')
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(60% 50% at 20% 10%, rgba(99,102,241,0.25), transparent 70%),' +
            'radial-gradient(45% 45% at 85% 85%, rgba(236,72,153,0.22), transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl font-semibold">Dashboard</h1>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200 hover:bg-white/10 transition-colors"
          >
            Sign out
          </button>
        </div>

        <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${accent} text-lg font-semibold shadow-lg`}
            >
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{profile?.full_name || 'Your profile'}</h2>
              <p className="text-xs text-slate-400">
                {isCoach ? 'Coach' : 'Student / Player'} · {user?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
            <Field label="Role" value={profile?.role === 'coach' ? 'Coach' : 'Student / Player'} />
            <Field label="Full name" value={profile?.full_name} />
            <Field label="Email" value={profile?.email || user?.email} />
            {isCoach ? (
              <>
                <Field label="Organization" value={profile?.organization} />
                <Field
                  label="Certifications"
                  value={profile?.certifications?.length ? profile.certifications.join(', ') : null}
                />
              </>
            ) : (
              <>
                <Field label="Team code" value={profile?.team_code} />
                <Field label="Grade / age" value={profile?.grade_level} />
              </>
            )}
            <Field
              label="Joined"
              value={
                profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : null
              }
            />
          </div>
        </section>

        <p className="mt-6 text-xs text-slate-500">
          This is a Phase 2 placeholder dashboard. Team management, warm-up sessions, and compliance
          charts land in the next phases.
        </p>
      </div>
    </div>
  );
}
