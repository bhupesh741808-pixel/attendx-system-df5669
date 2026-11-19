# AttendX – Product Roadmap

AttendX is a university attendance platform with three roles, a QR attendance workflow and a fully relational PostgreSQL core. It is delivered in self-contained milestones so each one can be demonstrated on its own.

## Milestone 1 — Product surface ✅
- Branded login page (validation, show/hide password, loading + error states, demo credentials).
- Role-based routing: ADMIN → `/admin`, TEACHER → `/teacher`, STUDENT → `/student`; other roles are redirected away.
- Admin: Overview analytics (stat cards + Recharts), Attendance Records (search + course/student/date filters), Audit Logs, **Database Explorer** (8 tables, columns, types, PK/FK, constraints, records, interactive ER diagram).
- Teacher: Overview (assigned courses, sessions with P/L/A per student, enrolled roster).
- Student: Overview (P/L/A counts, subject-wise %, own history only).
- All data comes from `frontend/src/data/fixtures.js`, which mirrors the exact synthetic dataset (explicit IDs 1001–1006, 1–4, 9001–9002, 5001–5005, audit 7001–7004).
- Screens that write data show an honest "scheduled" card naming their milestone.

## Milestone 2 — PostgreSQL schema, migrations & seed
- Provision Netlify Database (managed PostgreSQL).
- Define the 8 tables from the Explorer metadata: PKs, FKs (with ON DELETE rules), UNIQUE (email, roll_no, employee_no, course_code, `(student_id, course_id)`, `(session_id, student_id)`), NOT NULL, CHECK (semester 1–8, expires_at > starts_at, enum-like statuses), 3NF.
- ORM decision: the brief asks for Prisma; Netlify Database ships first-class migrations through Drizzle. Prefer Drizzle for platform-applied migrations, or Prisma with its migrate workflow — decide before starting this milestone.
- Seed script inserting the exact dataset with explicit IDs, then resetting identity sequences; bcrypt-hash `AttendX@123`; store only SHA-256 QR hashes.
- `database/` folder: ER diagram (Mermaid + PNG export), reference `schema.sql`, normalisation notes.

## Milestone 3 — Express API, authentication & admin CRUD
- Express app in `backend/`, served on Netlify via `netlify/server/index.mjs` under `/api/*`.
- `POST /api/auth/login` (bcrypt compare, JWT in an httpOnly cookie), `POST /api/auth/logout`, `GET /api/auth/me`.
- `requireAuth` + `requireRole` middleware; never return `password_hash`.
- Admin CRUD for students, teachers, courses, enrollments (user + profile rows in one transaction), with input validation and audit logging.
- Profile update endpoints for all roles. Replace `lib/session.js` and fixtures with Axios calls.

## Milestone 4 — Teacher QR attendance
- Start session: pick course + expiry → server creates OPEN session, generates a `crypto.randomBytes` token, stores its SHA-256 hash, returns the raw token once for the QR.
- QR rendering, countdown, close session, live attendance count (polling), present/absent/late lists.
- Correct a record with a mandatory reason (transaction + audit log).

## Milestone 5 — Student scanning
- Camera QR scanner with manual token entry fallback.
- `POST /api/attendance/scan`: resolve student from JWT (never from the body), hash token, check session OPEN + not expired, enrollment, duplicate (DB UNIQUE as the final guard), mark PRESENT/LATE, audit.
- Student profile, courses, full history and percentage screens.

## Milestone 6 — Reports, SQL Playground & export
- SQL-driven report endpoints (totals, P/A/L counts, overall, course-wise, student-wise).
- SQL Playground: admin-only, predefined read-only SELECT demos (WHERE, ORDER BY, INNER/LEFT JOIN, GROUP BY, COUNT, AVG, attendance %) run in a read-only transaction.
- CSV export for admin and teacher reports; Settings screen.

## Milestone 7 — Testing & hardening
- End-to-end test of all six demo accounts, role redirects, CRUD, session creation, QR scan, duplicate rejection, reports, logout.
- API documentation (`backend/API.md`), rate limiting on login, final README polish.
