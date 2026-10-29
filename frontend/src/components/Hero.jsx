export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-light dark:bg-hero-dark pt-28 pb-24 sm:pt-36 sm:pb-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 opacity-40 dark:opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '18px 18px',
          color: 'rgba(120, 113, 108, 0.4)',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 40%, black 100%)',
        }}
      />

      <div className="container-page relative">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-stone-600 dark:text-stone-300 mb-6">
            The Compliance-Gap Tracker
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold leading-[1.05] text-stone-900 dark:text-stone-50">
            Prevention is proven.
            <br />
            <span className="italic text-stone-800 dark:text-stone-200">
              Make it practiced.
            </span>
          </h1>
          <p className="mt-7 text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-2xl mx-auto">
            A simple tool for soccer coaches to log, track and visualize FIFA 11+
            and Nordic hamstring warm-ups — turning evidence into everyday habit
            for adolescent athletes.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#get-started" className="btn-primary">
              Get started
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                <path d="M11.78 4.22a.75.75 0 010 1.06L7.56 9.5h8.19a.75.75 0 010 1.5H7.56l4.22 4.22a.75.75 0 11-1.06 1.06l-5.5-5.5a.75.75 0 010-1.06l5.5-5.5a.75.75 0 011.06 0z" transform="rotate(180 10 10)" />
              </svg>
            </a>
            <a href="#talk" className="btn-ghost">
              Talk to a coach
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                <path d="M11.78 4.22a.75.75 0 010 1.06L7.56 9.5h8.19a.75.75 0 010 1.5H7.56l4.22 4.22a.75.75 0 11-1.06 1.06l-5.5-5.5a.75.75 0 010-1.06l5.5-5.5a.75.75 0 011.06 0z" transform="rotate(180 10 10)" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-24">
          <p className="text-center text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-8">
            Built on evidence from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-stone-500 dark:text-stone-400 text-sm font-medium">
            <span>FIFA 11+</span>
            <span className="opacity-30">•</span>
            <span>Nordic Hamstring Protocol</span>
            <span className="opacity-30">•</span>
            <span>BJSM</span>
            <span className="opacity-30">•</span>
            <span>AJSM</span>
            <span className="opacity-30">•</span>
            <span>Injury Prevention</span>
          </div>
        </div>
      </div>
    </section>
  );
}
