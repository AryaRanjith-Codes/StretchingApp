/**
 * The sliding colored overlay. It covers one half of the card at a time
 * and holds the CTA to switch modes. Its CONTENTS swap when `mode` changes
 * (crossfade), while the panel itself slides horizontally via its parent.
 *
 * The "side" prop tells the panel which half it currently sits over so the
 * corner rounding matches the card edge.
 */
export default function OverlayPanel({ mode, onSwitch, role, side = 'right' }) {
  const isSignIn = mode === 'signin';
  const isCoach = role === 'coach';

  // Two gradient palettes — role-aware. Indigo→Teal for students,
  // Fuchsia→Orange for coaches. Both sit on the deep midnight backdrop.
  const gradient = isCoach
    ? 'from-fuchsia-600 via-purple-600 to-orange-500'
    : 'from-indigo-600 via-sky-500 to-teal-400';

  // Match the side of the host card so no corner looks squared off.
  const rounding =
    side === 'right'
      ? 'md:rounded-r-3xl md:rounded-l-none'
      : 'md:rounded-l-3xl md:rounded-r-none';

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${rounding} bg-gradient-to-br ${gradient}`}
    >
      {/* Decorative blurred blobs for that luminous, high-performance feel. */}
      <div className="pointer-events-none absolute -top-16 -left-10 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-black/30 blur-3xl" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '18px 18px',
        }}
      />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-10 text-center text-white">
        {/* Content crossfade. Both texts are mounted; only the active one shows. */}
        <div className="relative w-full">
          <div
            key={mode}
            className="animate-[fadeSlide_500ms_ease-out] flex flex-col items-center"
          >
            <p className="text-xs uppercase tracking-[0.25em] opacity-80 mb-4">
              {isSignIn ? 'New here?' : 'One of us?'}
            </p>
            <h3 className="font-serif text-3xl sm:text-4xl font-semibold leading-tight">
              {isSignIn ? 'Start your season' : 'Welcome back'}
            </h3>
            <p className="mt-4 max-w-xs text-sm opacity-90">
              {isSignIn
                ? isCoach
                  ? 'Create a coach account and roster your team in under a minute.'
                  : 'Create a player account and join your team.'
                : 'Sign in to pick up right where you left off.'}
            </p>

            <button
              type="button"
              onClick={onSwitch}
              className="mt-7 inline-flex items-center gap-2 rounded-full border-2 border-white/80 px-7 py-2.5 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-white hover:text-slate-900 hover:scale-[1.03] active:scale-[0.98]"
            >
              {isSignIn ? 'Sign up' : 'Sign in'}
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                <path d="M7.21 14.77a.75.75 0 01.02-1.06L10.44 10 7.23 6.29a.75.75 0 111.06-1.06l3.75 4.25a.75.75 0 010 1.04l-3.75 4.25a.75.75 0 01-1.08.02z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Keyframe for the content crossfade — defined once per mount. */}
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
