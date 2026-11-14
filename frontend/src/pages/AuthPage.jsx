import { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import SignInForm from '../components/auth/SignInForm.jsx';
import SignUpForm from '../components/auth/SignUpForm.jsx';
import OverlayPanel from '../components/auth/OverlayPanel.jsx';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Dual-panel auth page.
 *
 * Layout strategy:
 *  - Desktop (md+): both forms are rendered side-by-side inside a single card.
 *    A colored overlay sits over ONE half at a time. Switching modes animates
 *    the overlay's `left` coordinate between 0 and 50%, revealing the form
 *    underneath. This is the classic "sliding panel" auth pattern.
 *  - Mobile: the card becomes a single column. The overlay is hidden; a
 *    simple pill toggle at the top swaps between forms. Keeps touch targets
 *    large and avoids horizontal transforms on narrow viewports.
 *
 * Initial mode is driven by the `?mode=signup` query param so the navbar's
 * "Get started" button can deep-link straight to the sign-up form.
 */
export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const { session, loading } = useAuth();

  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState('student'); // 'student' | 'coach'

  // Reflect route changes (e.g., clicking Get started while already on /auth).
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Already signed in → send them to the dashboard.
  if (!loading && session) {
    return <Navigate to="/dashboard" replace />;
  }

  const toggleMode = () =>
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-white">
      {/* Ambient background — layered radial gradients give the deep midnight feel. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(60% 50% at 20% 10%, rgba(99,102,241,0.25), transparent 70%),' +
            'radial-gradient(45% 45% at 85% 85%, rgba(236,72,153,0.22), transparent 70%),' +
            'radial-gradient(50% 50% at 50% 50%, rgba(20,184,166,0.15), transparent 75%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(2,6,23,0.6))]" />

      {/* Minimal top bar — back-to-landing link. Deliberately not the full navbar. */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
            <path d="M12.78 15.03a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 010-1.06l4.5-4.5a.75.75 0 111.06 1.06L8.81 10l3.97 3.97a.75.75 0 010 1.06z" />
          </svg>
          Back to WarmUp
        </Link>
        <span className="text-xs text-slate-500">
          {mode === 'signin' ? 'Sign in' : 'Create an account'}
        </span>
      </header>

      {/* Card wrapper — perfectly centered in the remaining vertical space. */}
      <main className="relative z-10 flex items-center justify-center px-4 pb-16 pt-6 sm:pt-10">
        {/* ============================================================ */}
        {/* DESKTOP: dual-panel sliding card                              */}
        {/* ============================================================ */}
        <div className="relative hidden md:block w-full max-w-5xl">
          <div className="relative h-[620px] w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/50 backdrop-blur-xl">
            {/* Both forms live permanently in their halves. The overlay covers one. */}
            <div className="absolute inset-y-0 left-0 flex w-1/2 items-center justify-center p-10">
              <SignInForm role={role} setRole={setRole} />
            </div>
            <div className="absolute inset-y-0 right-0 flex w-1/2 items-center justify-center p-10">
              <SignUpForm role={role} setRole={setRole} />
            </div>

            {/* Sliding overlay — top:0 left:(0 or 50%) with a smooth transition. */}
            <div
              className="absolute top-0 h-full w-1/2 transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)]"
              style={{ left: mode === 'signin' ? '50%' : '0%' }}
            >
              <OverlayPanel
                mode={mode}
                onSwitch={toggleMode}
                role={role}
                side={mode === 'signin' ? 'right' : 'left'}
              />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* MOBILE: single-column stack with pill mode-switch at top      */}
        {/* ============================================================ */}
        <div className="md:hidden w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl">
            {/* Mode switch pill */}
            <div className="relative mb-6 inline-flex w-full rounded-full border border-white/10 bg-white/5 p-1">
              <div
                aria-hidden="true"
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-indigo-500 to-teal-400 shadow-lg transition-all duration-500"
                style={{ left: mode === 'signin' ? '4px' : 'calc(50% + 0px)' }}
              />
              {[
                { value: 'signin', label: 'Sign in' },
                { value: 'signup', label: 'Sign up' },
              ].map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMode(m.value)}
                  className={`relative z-10 flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
                    mode === m.value ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Only the active form renders on mobile — no slide needed. */}
            {mode === 'signin' ? (
              <SignInForm role={role} setRole={setRole} />
            ) : (
              <SignUpForm role={role} setRole={setRole} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
