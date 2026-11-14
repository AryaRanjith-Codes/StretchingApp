/**
 * Pill-style segmented control for choosing Student/Player vs Coach.
 * A sliding "thumb" animates between the two options using an absolutely
 * positioned div whose transform flips on role change.
 */
const ROLES = [
  { value: 'student', label: 'Student / Player' },
  { value: 'coach', label: 'Coach' },
];

export default function RoleSelector({ role, setRole, accent = 'indigo' }) {
  const activeIdx = ROLES.findIndex((r) => r.value === role);

  // Accent gradient for the sliding thumb — switches with the role so the
  // whole form's color theme subtly shifts.
  const thumbGradient =
    accent === 'coach'
      ? 'from-fuchsia-500 via-purple-500 to-orange-400'
      : 'from-indigo-500 via-sky-400 to-teal-400';

  return (
    <div
      role="tablist"
      aria-label="Account type"
      className="relative inline-flex w-full items-center rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm"
    >
      {/* Animated thumb — slides to cover the active option. */}
      <div
        aria-hidden="true"
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r ${thumbGradient} shadow-lg shadow-indigo-500/30 transition-all duration-500 ease-out`}
        style={{
          left: activeIdx === 0 ? '4px' : 'calc(50% + 0px)',
        }}
      />

      {ROLES.map((r) => (
        <button
          key={r.value}
          type="button"
          role="tab"
          aria-selected={role === r.value}
          onClick={() => setRole(r.value)}
          className={`relative z-10 flex-1 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-colors duration-300 ${
            role === r.value ? 'text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
