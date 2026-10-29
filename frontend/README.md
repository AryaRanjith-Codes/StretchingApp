# WarmUp — Frontend (React + Vite + Tailwind)

Coach-facing web app for tracking FIFA 11+ and Nordic hamstring warm-up compliance in adolescent soccer.

## Stack
- React 18 + Vite
- Tailwind CSS (dark mode via `class`)
- React Router

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # fill in Supabase + API URL later
npm run dev
```

Open http://localhost:5173

## Scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview the production build

## Structure
```
src/
  components/     Navbar, Hero, Features, Footer, ThemeToggle
  context/        ThemeContext (light/dark toggle, persisted in localStorage)
  pages/          LandingPage
  App.jsx         router
  main.jsx        entrypoint
  index.css       Tailwind layers + utility classes
```

Theme toggle lives in the navbar; preference is read from the system first, then persisted in `localStorage`.
