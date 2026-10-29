import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className="relative inline-flex h-7 w-12 items-center rounded-full border border-stone-300 dark:border-stone-700 bg-stone-200 dark:bg-stone-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent"
    >
      <span
        className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white dark:bg-stone-100 shadow transition-transform duration-300 ${
          isDark ? 'translate-x-6' : 'translate-x-1'
        }`}
      >
        {isDark ? (
          <svg viewBox="0 0 24 24" className="h-3 w-3 text-stone-800" fill="currentColor">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-3 w-3 text-amber-500" fill="currentColor">
            <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM1 10.5h3v2H1v-2zm10-9.5h2v3h-2V1zm7.45 3.09l1.41 1.41-1.79 1.79-1.42-1.41 1.8-1.79zM17 10.5h3v2h-3v-2zm-5 7a5 5 0 110-10 5 5 0 010 10zm-1 4.5h2v-3h-2v3zm-7.45-3.09l-1.41-1.41 1.79-1.79 1.42 1.41-1.8 1.79z" />
          </svg>
        )}
      </span>
    </button>
  );
}
