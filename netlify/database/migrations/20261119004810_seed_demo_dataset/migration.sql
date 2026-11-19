-- AttendX synthetic demo dataset (identical IDs to frontend fixtures / RDBMS project).
-- Password for every demo account: AttendX@123 (stored only as a bcrypt hash).
INSERT INTO users (user_id, full_name, email, password_hash, role, is_active, created_at) VALUES
  (1001, 'Bhupesh Kumar',   'bhupesh.demo@attendx.test',  '$2a$10$bHNn0NCzv7MH2U.ni/E.teEo/xpGOwn35RT4yjXCgMgqNifHi3ezW', 'STUDENT', true, '2026-07-01T09:00:00Z'),
  (1002, 'Alisha Khunte',   'alisha.demo@attendx.test',   '$2a$10$bHNn0NCzv7MH2U.ni/E.teEo/xpGOwn35RT4yjXCgMgqNifHi3ezW', 'STUDENT', true, '2026-07-01T09:00:00Z'),
  (1003, 'Rohit Sharma',    'rohit.demo@attendx.test',    '$2a$10$bHNn0NCzv7MH2U.ni/E.teEo/xpGOwn35RT4yjXCgMgqNifHi3ezW', 'STUDENT', true, '2026-07-01T09:00:00Z'),
  (1004, 'Dr. Meera Singh', 'meera.teacher@attendx.test', '$2a$10$bHNn0NCzv7MH2U.ni/E.teEo/xpGOwn35RT4yjXCgMgqNifHi3ezW', 'TEACHER', true, '2026-07-01T09:00:00Z'),
  (1005, 'Mr. Arjun Verma', 'arjun.teacher@attendx.test', '$2a$10$bHNn0NCzv7MH2U.ni/E.teEo/xpGOwn35RT4yjXCgMgqNifHi3ezW', 'TEACHER', true, '2026-07-01T09:00:00Z'),
  (1006, 'System Admin',    'admin@attendx.test',         '$2a$10$bHNn0NCzv7MH2U.ni/E.teEo/xpGOwn35RT4yjXCgMgqNifHi3ezW', 'ADMIN',   true, '2026-07-01T09:00:00Z');
--> statement-breakpoint
INSERT INTO students (student_id, user_id, roll_no, department, semester) VALUES
  (1, 1001, 'CSE26-001', 'CSE', 3),
  (2, 1002, 'CSE26-002', 'CSE', 3),
  (3, 1003, 'CSE26-003', 'CSE', 3);
--> statement-breakpoint
INSERT INTO teachers (teacher_id, user_id, employee_no, department) VALUES
  (1, 1004, 'EMP001', 'CSE'),
  (2, 1005, 'EMP002', 'CSE');
--> statement-breakpoint
INSERT INTO courses (course_id, course_code, title, teacher_id, credits) VALUES
  (1, 'RDBMS', 'Relational DBMS',      1, 4),
  (2, 'JAVA',  'Java Programming',     2, 4),
  (3, 'OS',    'Operating Systems',    1, 3),
  (4, 'MATH',  'Discrete Mathematics', 2, 3);
--> statement-breakpoint
INSERT INTO enrollments (enrollment_id, student_id, course_id, enrolled_at) VALUES
  (1, 1, 1, '2026-07-15T10:00:00Z'),
  (2, 1, 2, '2026-07-15T10:00:00Z'),
  (3, 2, 1, '2026-07-15T10:00:00Z'),
  (4, 2, 3, '2026-07-15T10:00:00Z'),
  (5, 3, 1, '2026-07-15T10:00:00Z'),
  (6, 3, 4, '2026-07-15T10:00:00Z');
--> statement-breakpoint
-- qr_token_hash values are SHA-256 digests of random tokens that were discarded (historical sessions).
INSERT INTO attendance_sessions (session_id, course_id, teacher_id, starts_at, expires_at, status, qr_token_hash) VALUES
  (9001, 1, 1, '2026-08-04T10:00:00+05:30', '2026-08-04T10:15:00+05:30', 'CLOSED', '6ed9aae94a5f724e55f46e05ae835769630a4e38d9c6286f833c96c2d90ea410'),
  (9002, 1, 1, '2026-08-11T10:00:00+05:30', '2026-08-11T10:15:00+05:30', 'CLOSED', '0315e3e59f946239ac86176365001ed3b612819e5c290d23a4c2d40cc23fc0c9');
--> statement-breakpoint
INSERT INTO attendance_records (attendance_id, session_id, student_id, status, verification_method, marked_at) VALUES
  (5001, 9001, 1, 'PRESENT', 'QR',      '2026-08-04T10:02:11+05:30'),
  (5002, 9001, 2, 'PRESENT', 'QR',      '2026-08-04T10:03:40+05:30'),
  (5003, 9001, 3, 'LATE',    'QR',      '2026-08-04T10:13:05+05:30'),
  (5004, 9002, 1, 'PRESENT', 'QR',      '2026-08-11T10:01:52+05:30'),
  (5005, 9002, 2, 'ABSENT',  'TEACHER', '2026-08-11T10:20:00+05:30');
--> statement-breakpoint
INSERT INTO audit_logs (log_id, user_id, action, entity, entity_id, details, created_at) VALUES
  (7001, 1006, 'CREATE_COURSE',      'courses',             1,    'Created course RDBMS – Relational DBMS',            '2026-07-10T09:30:00+05:30'),
  (7002, 1004, 'CREATE_SESSION',     'attendance_sessions', 9001, 'Started QR attendance session for RDBMS',           '2026-08-04T10:00:00+05:30'),
  (7003, 1001, 'MARK_ATTENDANCE',    'attendance_records',  5001, 'Marked PRESENT via QR in session 9001',             '2026-08-04T10:02:11+05:30'),
  (7004, 1004, 'CORRECT_ATTENDANCE', 'attendance_records',  5005, 'Marked ABSENT after roll call – student not in class', '2026-08-11T10:20:00+05:30');
--> statement-breakpoint
-- Explicit IDs were inserted, so move each identity sequence past the highest ID.
SELECT setval(pg_get_serial_sequence('users', 'user_id'), (SELECT MAX(user_id) FROM users));
--> statement-breakpoint
SELECT setval(pg_get_serial_sequence('students', 'student_id'), (SELECT MAX(student_id) FROM students));
--> statement-breakpoint
SELECT setval(pg_get_serial_sequence('teachers', 'teacher_id'), (SELECT MAX(teacher_id) FROM teachers));
--> statement-breakpoint
SELECT setval(pg_get_serial_sequence('courses', 'course_id'), (SELECT MAX(course_id) FROM courses));
--> statement-breakpoint
SELECT setval(pg_get_serial_sequence('enrollments', 'enrollment_id'), (SELECT MAX(enrollment_id) FROM enrollments));
--> statement-breakpoint
SELECT setval(pg_get_serial_sequence('attendance_sessions', 'session_id'), (SELECT MAX(session_id) FROM attendance_sessions));
--> statement-breakpoint
SELECT setval(pg_get_serial_sequence('attendance_records', 'attendance_id'), (SELECT MAX(attendance_id) FROM attendance_records));
--> statement-breakpoint
SELECT setval(pg_get_serial_sequence('audit_logs', 'log_id'), (SELECT MAX(log_id) FROM audit_logs));
