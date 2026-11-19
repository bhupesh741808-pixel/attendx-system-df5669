-- SQL Playground sandbox: a separate schema of views that exposes every AttendX table
-- WITHOUT secret columns (users.password_hash, attendance_sessions.qr_token_hash) and
-- without the internal app_secrets table. The API runs playground queries in a READ ONLY
-- transaction with search_path = playground, so `SELECT * FROM users` reads these views.
CREATE SCHEMA IF NOT EXISTS playground;
--> statement-breakpoint
CREATE VIEW playground.users AS
  SELECT user_id, full_name, email, role, is_active, created_at FROM public.users;
--> statement-breakpoint
CREATE VIEW playground.students AS
  SELECT student_id, user_id, roll_no, department, semester FROM public.students;
--> statement-breakpoint
CREATE VIEW playground.teachers AS
  SELECT teacher_id, user_id, employee_no, department FROM public.teachers;
--> statement-breakpoint
CREATE VIEW playground.courses AS
  SELECT course_id, course_code, title, teacher_id, credits FROM public.courses;
--> statement-breakpoint
CREATE VIEW playground.enrollments AS
  SELECT enrollment_id, student_id, course_id, enrolled_at FROM public.enrollments;
--> statement-breakpoint
CREATE VIEW playground.attendance_sessions AS
  SELECT session_id, course_id, teacher_id, starts_at, expires_at, status FROM public.attendance_sessions;
--> statement-breakpoint
CREATE VIEW playground.attendance_records AS
  SELECT attendance_id, session_id, student_id, status, verification_method, marked_at FROM public.attendance_records;
--> statement-breakpoint
CREATE VIEW playground.audit_logs AS
  SELECT log_id, user_id, action, entity, entity_id, details, created_at FROM public.audit_logs;
