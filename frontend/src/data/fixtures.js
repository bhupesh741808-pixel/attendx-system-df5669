/**
 * AttendX preview fixtures.
 *
 * This is the ONLY place stub data lives. It mirrors the exact synthetic dataset
 * from the RDBMS project (explicit IDs, same foreign keys). When the PostgreSQL
 * backend lands (see PLAN.md), screens swap these imports for API calls via
 * src/lib/api.js — the shapes below match the planned API responses.
 */

export const DEMO_PASSWORD = 'AttendX@123'

export const users = [
  { user_id: 1001, full_name: 'Bhupesh Kumar', email: 'bhupesh.demo@attendx.test', role: 'STUDENT', is_active: true, created_at: '2026-07-01T09:00:00Z' },
  { user_id: 1002, full_name: 'Alisha Khunte', email: 'alisha.demo@attendx.test', role: 'STUDENT', is_active: true, created_at: '2026-07-01T09:00:00Z' },
  { user_id: 1003, full_name: 'Rohit Sharma', email: 'rohit.demo@attendx.test', role: 'STUDENT', is_active: true, created_at: '2026-07-01T09:00:00Z' },
  { user_id: 1004, full_name: 'Dr. Meera Singh', email: 'meera.teacher@attendx.test', role: 'TEACHER', is_active: true, created_at: '2026-07-01T09:00:00Z' },
  { user_id: 1005, full_name: 'Mr. Arjun Verma', email: 'arjun.teacher@attendx.test', role: 'TEACHER', is_active: true, created_at: '2026-07-01T09:00:00Z' },
  { user_id: 1006, full_name: 'System Admin', email: 'admin@attendx.test', role: 'ADMIN', is_active: true, created_at: '2026-07-01T09:00:00Z' },
]

export const students = [
  { student_id: 1, user_id: 1001, roll_no: 'CSE26-001', department: 'CSE', semester: 3 },
  { student_id: 2, user_id: 1002, roll_no: 'CSE26-002', department: 'CSE', semester: 3 },
  { student_id: 3, user_id: 1003, roll_no: 'CSE26-003', department: 'CSE', semester: 3 },
]

export const teachers = [
  { teacher_id: 1, user_id: 1004, employee_no: 'EMP001', department: 'CSE' },
  { teacher_id: 2, user_id: 1005, employee_no: 'EMP002', department: 'CSE' },
]

// teacher_id = assigned course teacher (one teacher → many courses)
export const courses = [
  { course_id: 1, course_code: 'RDBMS', title: 'Relational DBMS', teacher_id: 1, credits: 4 },
  { course_id: 2, course_code: 'JAVA', title: 'Java Programming', teacher_id: 2, credits: 4 },
  { course_id: 3, course_code: 'OS', title: 'Operating Systems', teacher_id: 1, credits: 3 },
  { course_id: 4, course_code: 'MATH', title: 'Discrete Mathematics', teacher_id: 2, credits: 3 },
]

export const enrollments = [
  { enrollment_id: 1, student_id: 1, course_id: 1, enrolled_at: '2026-07-15T10:00:00Z' },
  { enrollment_id: 2, student_id: 1, course_id: 2, enrolled_at: '2026-07-15T10:00:00Z' },
  { enrollment_id: 3, student_id: 2, course_id: 1, enrolled_at: '2026-07-15T10:00:00Z' },
  { enrollment_id: 4, student_id: 2, course_id: 3, enrolled_at: '2026-07-15T10:00:00Z' },
  { enrollment_id: 5, student_id: 3, course_id: 1, enrolled_at: '2026-07-15T10:00:00Z' },
  { enrollment_id: 6, student_id: 3, course_id: 4, enrolled_at: '2026-07-15T10:00:00Z' },
]

export const attendance_sessions = [
  { session_id: 9001, course_id: 1, teacher_id: 1, starts_at: '2026-08-04T10:00:00+05:30', expires_at: '2026-08-04T10:15:00+05:30', status: 'CLOSED', qr_token_hash: '3f9a1c…e07b (sha256)' },
  { session_id: 9002, course_id: 1, teacher_id: 1, starts_at: '2026-08-11T10:00:00+05:30', expires_at: '2026-08-11T10:15:00+05:30', status: 'CLOSED', qr_token_hash: 'b42d77…91fa (sha256)' },
]

export const attendance_records = [
  { attendance_id: 5001, session_id: 9001, student_id: 1, status: 'PRESENT', verification_method: 'QR', marked_at: '2026-08-04T10:02:11+05:30' },
  { attendance_id: 5002, session_id: 9001, student_id: 2, status: 'PRESENT', verification_method: 'QR', marked_at: '2026-08-04T10:03:40+05:30' },
  { attendance_id: 5003, session_id: 9001, student_id: 3, status: 'LATE', verification_method: 'QR', marked_at: '2026-08-04T10:13:05+05:30' },
  { attendance_id: 5004, session_id: 9002, student_id: 1, status: 'PRESENT', verification_method: 'QR', marked_at: '2026-08-11T10:01:52+05:30' },
  { attendance_id: 5005, session_id: 9002, student_id: 2, status: 'ABSENT', verification_method: 'TEACHER', marked_at: '2026-08-11T10:20:00+05:30' },
]

export const audit_logs = [
  { log_id: 7001, user_id: 1006, action: 'CREATE_COURSE', entity: 'courses', entity_id: 1, details: 'Created course RDBMS – Relational DBMS', created_at: '2026-07-10T09:30:00+05:30' },
  { log_id: 7002, user_id: 1004, action: 'CREATE_SESSION', entity: 'attendance_sessions', entity_id: 9001, details: 'Started QR attendance session for RDBMS', created_at: '2026-08-04T10:00:00+05:30' },
  { log_id: 7003, user_id: 1001, action: 'MARK_ATTENDANCE', entity: 'attendance_records', entity_id: 5001, details: 'Marked PRESENT via QR in session 9001', created_at: '2026-08-04T10:02:11+05:30' },
  { log_id: 7004, user_id: 1004, action: 'CORRECT_ATTENDANCE', entity: 'attendance_records', entity_id: 5005, details: 'Marked ABSENT after roll call – student not in class', created_at: '2026-08-11T10:20:00+05:30' },
]

export const tables = { users, students, teachers, courses, enrollments, attendance_sessions, attendance_records, audit_logs }

/** Planned PostgreSQL schema – drives the Database Explorer and ER diagram. */
export const schema = {
  users: {
    description: 'Login identity for every person. One-to-one with students/teachers.',
    columns: [
      { name: 'user_id', type: 'INTEGER', pk: true, constraints: ['PRIMARY KEY'] },
      { name: 'full_name', type: 'VARCHAR(120)', constraints: ['NOT NULL'] },
      { name: 'email', type: 'VARCHAR(160)', constraints: ['NOT NULL', 'UNIQUE'] },
      { name: 'password_hash', type: 'VARCHAR(100)', constraints: ['NOT NULL', 'bcrypt – never returned by API'], hidden: true },
      { name: 'role', type: 'user_role', constraints: ['NOT NULL', "CHECK role IN ('STUDENT','TEACHER','ADMIN')"] },
      { name: 'is_active', type: 'BOOLEAN', constraints: ['NOT NULL', 'DEFAULT true'] },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: ['NOT NULL', 'DEFAULT now()'] },
    ],
  },
  students: {
    description: 'Academic profile for STUDENT users.',
    columns: [
      { name: 'student_id', type: 'INTEGER', pk: true, constraints: ['PRIMARY KEY'] },
      { name: 'user_id', type: 'INTEGER', fk: 'users.user_id', constraints: ['NOT NULL', 'UNIQUE', 'ON DELETE CASCADE'] },
      { name: 'roll_no', type: 'VARCHAR(20)', constraints: ['NOT NULL', 'UNIQUE'] },
      { name: 'department', type: 'VARCHAR(40)', constraints: ['NOT NULL'] },
      { name: 'semester', type: 'SMALLINT', constraints: ['NOT NULL', 'CHECK semester BETWEEN 1 AND 8'] },
    ],
  },
  teachers: {
    description: 'Employment profile for TEACHER users.',
    columns: [
      { name: 'teacher_id', type: 'INTEGER', pk: true, constraints: ['PRIMARY KEY'] },
      { name: 'user_id', type: 'INTEGER', fk: 'users.user_id', constraints: ['NOT NULL', 'UNIQUE', 'ON DELETE CASCADE'] },
      { name: 'employee_no', type: 'VARCHAR(20)', constraints: ['NOT NULL', 'UNIQUE'] },
      { name: 'department', type: 'VARCHAR(40)', constraints: ['NOT NULL'] },
    ],
  },
  courses: {
    description: 'Subjects offered, each assigned to one teacher.',
    columns: [
      { name: 'course_id', type: 'INTEGER', pk: true, constraints: ['PRIMARY KEY'] },
      { name: 'course_code', type: 'VARCHAR(20)', constraints: ['NOT NULL', 'UNIQUE'] },
      { name: 'title', type: 'VARCHAR(120)', constraints: ['NOT NULL'] },
      { name: 'teacher_id', type: 'INTEGER', fk: 'teachers.teacher_id', constraints: ['ON DELETE SET NULL'] },
      { name: 'credits', type: 'SMALLINT', constraints: ['NOT NULL', 'CHECK credits BETWEEN 1 AND 6'] },
    ],
  },
  enrollments: {
    description: 'Junction table resolving the many-to-many students ↔ courses.',
    columns: [
      { name: 'enrollment_id', type: 'INTEGER', pk: true, constraints: ['PRIMARY KEY'] },
      { name: 'student_id', type: 'INTEGER', fk: 'students.student_id', constraints: ['NOT NULL', 'ON DELETE CASCADE'] },
      { name: 'course_id', type: 'INTEGER', fk: 'courses.course_id', constraints: ['NOT NULL', 'ON DELETE CASCADE'] },
      { name: 'enrolled_at', type: 'TIMESTAMPTZ', constraints: ['NOT NULL', 'DEFAULT now()'] },
    ],
    tableConstraints: ['UNIQUE (student_id, course_id)'],
  },
  attendance_sessions: {
    description: 'A single class meeting where attendance is taken via QR.',
    columns: [
      { name: 'session_id', type: 'INTEGER', pk: true, constraints: ['PRIMARY KEY'] },
      { name: 'course_id', type: 'INTEGER', fk: 'courses.course_id', constraints: ['NOT NULL', 'ON DELETE CASCADE'] },
      { name: 'teacher_id', type: 'INTEGER', fk: 'teachers.teacher_id', constraints: ['NOT NULL', 'ON DELETE RESTRICT'] },
      { name: 'starts_at', type: 'TIMESTAMPTZ', constraints: ['NOT NULL'] },
      { name: 'expires_at', type: 'TIMESTAMPTZ', constraints: ['NOT NULL', 'CHECK expires_at > starts_at'] },
      { name: 'status', type: 'session_status', constraints: ['NOT NULL', "CHECK status IN ('OPEN','CLOSED')"] },
      { name: 'qr_token_hash', type: 'CHAR(64)', constraints: ['NOT NULL', 'UNIQUE', 'SHA-256 – raw token never stored'] },
    ],
  },
  attendance_records: {
    description: 'One row per student per session.',
    columns: [
      { name: 'attendance_id', type: 'INTEGER', pk: true, constraints: ['PRIMARY KEY'] },
      { name: 'session_id', type: 'INTEGER', fk: 'attendance_sessions.session_id', constraints: ['NOT NULL', 'ON DELETE CASCADE'] },
      { name: 'student_id', type: 'INTEGER', fk: 'students.student_id', constraints: ['NOT NULL', 'ON DELETE CASCADE'] },
      { name: 'status', type: 'attendance_status', constraints: ['NOT NULL', "CHECK status IN ('PRESENT','ABSENT','LATE')"] },
      { name: 'verification_method', type: 'verification_method', constraints: ['NOT NULL', "CHECK method IN ('QR','TEACHER','MANUAL')"] },
      { name: 'marked_at', type: 'TIMESTAMPTZ', constraints: ['NOT NULL', 'DEFAULT now()'] },
    ],
    tableConstraints: ['UNIQUE (session_id, student_id) – prevents duplicate attendance'],
  },
  audit_logs: {
    description: 'Immutable trail of every important action.',
    columns: [
      { name: 'log_id', type: 'INTEGER', pk: true, constraints: ['PRIMARY KEY'] },
      { name: 'user_id', type: 'INTEGER', fk: 'users.user_id', constraints: ['NOT NULL', 'ON DELETE RESTRICT'] },
      { name: 'action', type: 'VARCHAR(40)', constraints: ['NOT NULL'] },
      { name: 'entity', type: 'VARCHAR(40)', constraints: ['NOT NULL'] },
      { name: 'entity_id', type: 'INTEGER', constraints: [] },
      { name: 'details', type: 'TEXT', constraints: [] },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: ['NOT NULL', 'DEFAULT now()'] },
    ],
  },
}

/** Relationships shown in the ER diagram. */
export const relationships = [
  { from: 'students', to: 'users', label: 'user_id', kind: '1 : 1' },
  { from: 'teachers', to: 'users', label: 'user_id', kind: '1 : 1' },
  { from: 'courses', to: 'teachers', label: 'teacher_id', kind: 'N : 1' },
  { from: 'enrollments', to: 'students', label: 'student_id', kind: 'N : 1' },
  { from: 'enrollments', to: 'courses', label: 'course_id', kind: 'N : 1' },
  { from: 'attendance_sessions', to: 'courses', label: 'course_id', kind: 'N : 1' },
  { from: 'attendance_sessions', to: 'teachers', label: 'teacher_id', kind: 'N : 1' },
  { from: 'attendance_records', to: 'attendance_sessions', label: 'session_id', kind: 'N : 1' },
  { from: 'attendance_records', to: 'students', label: 'student_id', kind: 'N : 1' },
  { from: 'audit_logs', to: 'users', label: 'user_id', kind: 'N : 1' },
]
