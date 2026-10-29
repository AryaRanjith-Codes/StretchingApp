import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle.jsx';

const NAV_ITEMS = [
  { label: 'Product', hasMenu: true },
  { label: 'Programs', hasMenu: true },
  { label: 'Research', hasMenu: true },
  { label: 'Coaches', hasMenu: false },
  { label: 'Resources', hasMenu: true },
];

function CaretDown() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
      <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
    </svg>
  );
}

function BrandMark() {
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 32 32" className="h-7 w-7 text-stone-900 dark:text-stone-100">
        <path
          d="M8 24 L14 8 L18 20 L22 12 L26 24"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="16" cy="26" r="1.6" fill="currentColor" />
      </svg>
      <span className="font-serif text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
        WarmUp
      </span>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-md bg-stone-50/80 dark:bg-stone-950/70 border-b border-stone-200/60 dark:border-stone-800/60'
          : 'bg-transparent'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <a href="/" className="shrink-0">
          <BrandMark />
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <button key={item.label} type="button" className="nav-link">
              {item.label}
              {item.hasMenu && <CaretDown />}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          <a href="#docs" className="nav-link">
            Docs
          </a>
          <a href="#login" className="nav-link">
            Log in
          </a>
          <ThemeToggle />
          <a href="#get-started" className="btn-accent !py-2 !px-5">
            Get started
          </a>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="p-2 rounded-md text-stone-700 dark:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800/60"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-stone-200/60 dark:border-stone-800/60 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-md">
          <div className="container-page py-4 flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                className="nav-link justify-start py-1"
              >
                {item.label}
              </button>
            ))}
            <div className="h-px bg-stone-200 dark:bg-stone-800 my-2" />
            <a href="#docs" className="nav-link py-1">Docs</a>
            <a href="#login" className="nav-link py-1">Log in</a>
            <a href="#get-started" className="btn-accent w-full justify-center">
              Get started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
