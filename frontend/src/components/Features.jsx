const FEATURES = [
  {
    title: 'Session logging in under a minute',
    body: 'Mark attendance and completion for FIFA 11+ and Nordic hamstring sessions right from the sideline — mobile-first, offline-tolerant.',
  },
  {
    title: 'Per-player compliance %',
    body: 'See exactly which athletes are hitting the dose-response threshold and which are drifting below — the metric the research actually cares about.',
  },
  {
    title: 'Dose-response insights',
    body: 'Visualize team adherence over time against injury incidence — the same analysis Steffen et al. ran, but on your own roster.',
  },
  {
    title: 'Coach-first UX',
    body: 'Built around real-world objections — time, buy-in, enforcement. Not a clinical tool bolted onto a season.',
  },
];

export default function Features() {
  return (
    <section className="relative py-24 sm:py-32 bg-stone-100 dark:bg-stone-900 transition-colors">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 mb-4">
            What it does
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold text-stone-900 dark:text-stone-50 leading-tight">
            Close the gap between
            <span className="italic text-accent"> proven </span>
            and
            <span className="italic text-accent"> practiced.</span>
          </h2>
          <p className="mt-6 text-stone-600 dark:text-stone-300 max-w-xl">
            The research is settled: FIFA 11+ cuts soccer injuries by up to 46%,
            and the Nordic hamstring exercise is one of the lowest-cost
            interventions in sports medicine. Adoption is where the system
            breaks. This tool fixes the system.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 p-6 hover:border-accent/60 dark:hover:border-accent/60 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-stone-900 to-stone-700 dark:from-stone-100 dark:to-stone-300 text-stone-50 dark:text-stone-900 flex items-center justify-center font-serif font-semibold">
                {i + 1}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-stone-900 dark:text-stone-100">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
