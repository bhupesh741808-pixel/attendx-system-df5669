# AttendX – Smart Attendance Management System

**Attendance, Verified.** A university attendance platform for B.Tech CSE with Admin, Teacher and Student dashboards, a secure QR attendance workflow and a relational PostgreSQL design normalised to 3NF.

## What's here today
- Login page with validation, show/hide password and a demo-credentials panel.
- Role-based dashboards with protected routes:
  - **Admin** – overview analytics, attendance records with filters, audit logs, Database Explorer with an interactive ER diagram.
  - **Teacher** – assigned courses, past sessions with per-student status, enrolled students.
  - **Student** – own attendance counts, subject-wise percentages and history.
- Data currently comes from `frontend/src/data/fixtures.js`, the exact synthetic project dataset. The PostgreSQL backend replaces it in upcoming milestones (see [PLAN.md](./PLAN.md)).

## Demo accounts
Password for all: `AttendX@123`

| Role | Email |
|---|---|
| Student | bhupesh.demo@attendx.test |
| Student | alisha.demo@attendx.test |
| Student | rohit.demo@attendx.test |
| Teacher | meera.teacher@attendx.test |
| Teacher | arjun.teacher@attendx.test |
| Admin | admin@attendx.test |

## Tech stack
React 18 · Vite · Tailwind CSS v4 · React Router · Recharts · lucide-react. Planned: Express on Netlify Server, Netlify Database (PostgreSQL), bcrypt, JWT.

## Run locally
```bash
npm install
npm run dev            # Vite dev server
# or, with Netlify emulation (needed once the API exists):
netlify dev
```

## Project structure
```
frontend/            React app (Vite root)
  src/data/          fixtures.js – synthetic dataset + schema metadata
  src/lib/           session (preview auth) and derived data helpers
  src/components/    layout, sidebar, tables, cards
  src/pages/         login, admin/, teacher/, student/
netlify.toml         build + SPA routing
PLAN.md              roadmap
```
Upcoming: `backend/` (Express API), `database/` (schema, ER diagram, seed), `netlify/server/index.mjs`.

## Roadmap
2. PostgreSQL schema, migrations and exact seed data · 3. Express API, JWT/bcrypt auth, admin CRUD · 4. Teacher QR sessions · 5. Student QR scanning · 6. Reports, SQL Playground, CSV export · 7. End-to-end testing. Details in [PLAN.md](./PLAN.md).
