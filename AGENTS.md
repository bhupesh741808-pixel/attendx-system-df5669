# AGENTS.md

Continue from **PLAN.md** — Milestone 1 (UI surface) is complete; start at Milestone 2.

## Architecture
- Vite + React SPA. `vite.config.js` sets `root: 'frontend'` and builds to `/dist` (published by `netlify.toml`, which also has the SPA `/*` rewrite).
- Backend (planned): Express in `backend/`, mounted by `netlify/server/index.mjs` (Netlify Server) under `/api/*`. Do NOT use a full-stack framework template – it would intercept server traffic. Persistence must use Netlify Database (PostgreSQL).
- Routing in `frontend/src/App.jsx`: each role has a nav array; entries with `el` are real screens, entries with `planned: <milestone>` render `components/Planned.jsx`. When you build a screen, add `el` and drop `planned`.
- `RoleArea` guards each role prefix and redirects mismatched roles to their own home.

## Data
- `frontend/src/data/fixtures.js` is the single stub module: exact synthetic dataset (explicit IDs must not change) plus `schema` / `relationships` metadata that drives the Database Explorer and ER diagram. Keep the schema metadata in sync with the real DB schema.
- `frontend/src/lib/data.js` holds derived joins/aggregates mirroring planned SQL. Replace with API calls.
- `frontend/src/lib/session.js` is preview auth (fixture lookup + sessionStorage). Replace with JWT auth from the API but keep the `useSession()` → `{ user, login, logout }` interface.

## Conventions
- Tailwind v4 with theme tokens in `frontend/src/index.css` (`navy-*` palette, `.card`, `.btn-primary`, `.btn-ghost`, `.input`, `.badge`).
- Shared UI in `components/ui.jsx` (`PageHeader`, `StatCard`, `DataTable` with built-in search, `Badge`, date formatters).
- Attendance % = (PRESENT + LATE) / total records.
- Never add decorative buttons: every control must work or be shown as scheduled.
- Never expose password hashes, raw QR tokens (store SHA-256 only) or secrets to the frontend.
