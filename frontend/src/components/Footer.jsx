export default function Footer() {
  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 py-12">
      <div className="container-page flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
            WarmUp
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Built as a real-world test of the implementation-science argument in
            Paper 1 of the ACL &amp; Hamstring Research Series.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm text-stone-600 dark:text-stone-300">
          <a href="#research" className="hover:text-stone-900 dark:hover:text-white">Research</a>
          <a href="#privacy" className="hover:text-stone-900 dark:hover:text-white">Privacy</a>
          <a href="#contact" className="hover:text-stone-900 dark:hover:text-white">Contact</a>
          <span className="text-stone-400 dark:text-stone-500">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
