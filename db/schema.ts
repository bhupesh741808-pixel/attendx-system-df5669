// AttendX PostgreSQL schema (Netlify Database, managed Postgres).
// Mirrors the 8 tables shown in the Database Explorer (frontend/src/data/fixtures.js → `schema`).
// Every change here needs a migration: `npx drizzle-kit generate --name <change>`.
import { sql } from 'drizzle-orm'
import {
  pgTable, pgEnum, integer, smallint, varchar, char, text, boolean, timestamp, unique, check, index,
} from 'drizzle-orm/pg-core'

export const userRole = pgEnum('user_role', ['STUDENT', 'TEACHER', 'ADMIN'])
export const sessionStatus = pgEnum('session_status', ['OPEN', 'CLOSED'])
export const attendanceStatus = pgEnum('attendance_status', ['PRESENT', 'ABSENT', 'LATE'])
export const verificationMethod = pgEnum('verification_method', ['QR', 'TEACHER', 'MANUAL'])

const id = (name: string) => integer(name).primaryKey().generatedByDefaultAsIdentity()
const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow()

export const users = pgTable('users', {
  userId: id('user_id'),
  fullName: varchar('full_name', { length: 120 }).notNull(),
  email: varchar('email', { length: 160 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 100 }).notNull(),
  role: userRole('role').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: createdAt(),
})

export const students = pgTable('students', {
  studentId: id('student_id'),
  userId: integer('user_id').notNull().unique().references(() => users.userId, { onDelete: 'cascade' }),
  rollNo: varchar('roll_no', { length: 20 }).notNull().unique(),
  department: varchar('department', { length: 40 }).notNull(),
  semester: smallint('semester').notNull(),
}, (t) => [check('students_semester_check', sql`${t.semester} BETWEEN 1 AND 8`)])

export const teachers = pgTable('teachers', {
  teacherId: id('teacher_id'),
  userId: integer('user_id').notNull().unique().references(() => users.userId, { onDelete: 'cascade' }),
  employeeNo: varchar('employee_no', { length: 20 }).notNull().unique(),
  department: varchar('department', { length: 40 }).notNull(),
})

export const courses = pgTable('courses', {
  courseId: id('course_id'),
  courseCode: varchar('course_code', { length: 20 }).notNull().unique(),
  title: varchar('title', { length: 120 }).notNull(),
  teacherId: integer('teacher_id').references(() => teachers.teacherId, { onDelete: 'set null' }),
  credits: smallint('credits').notNull(),
}, (t) => [check('courses_credits_check', sql`${t.credits} BETWEEN 1 AND 6`)])

export const enrollments = pgTable('enrollments', {
  enrollmentId: id('enrollment_id'),
  studentId: integer('student_id').notNull().references(() => students.studentId, { onDelete: 'cascade' }),
  courseId: integer('course_id').notNull().references(() => courses.courseId, { onDelete: 'cascade' }),
  enrolledAt: timestamp('enrolled_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [unique('enrollments_student_course_unique').on(t.studentId, t.courseId)])

export const attendanceSessions = pgTable('attendance_sessions', {
  sessionId: id('session_id'),
  courseId: integer('course_id').notNull().references(() => courses.courseId, { onDelete: 'cascade' }),
  teacherId: integer('teacher_id').notNull().references(() => teachers.teacherId, { onDelete: 'restrict' }),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  status: sessionStatus('status').notNull().default('OPEN'),
  // SHA-256 hex of the QR token. The raw token is shown to the teacher once and never stored.
  qrTokenHash: char('qr_token_hash', { length: 64 }).notNull().unique(),
}, (t) => [
  check('attendance_sessions_window_check', sql`${t.expiresAt} > ${t.startsAt}`),
  index('attendance_sessions_course_idx').on(t.courseId),
])

export const attendanceRecords = pgTable('attendance_records', {
  attendanceId: id('attendance_id'),
  sessionId: integer('session_id').notNull().references(() => attendanceSessions.sessionId, { onDelete: 'cascade' }),
  studentId: integer('student_id').notNull().references(() => students.studentId, { onDelete: 'cascade' }),
  status: attendanceStatus('status').notNull(),
  verificationMethod: verificationMethod('verification_method').notNull(),
  markedAt: timestamp('marked_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  // Final guard against duplicate attendance, even under concurrent scans.
  unique('attendance_records_session_student_unique').on(t.sessionId, t.studentId),
  index('attendance_records_student_idx').on(t.studentId),
])

export const auditLogs = pgTable('audit_logs', {
  logId: id('log_id'),
  // SET NULL so a deleted account keeps its history (shown as "Deleted user").
  userId: integer('user_id').references(() => users.userId, { onDelete: 'set null' }),
  action: varchar('action', { length: 40 }).notNull(),
  entity: varchar('entity', { length: 40 }).notNull(),
  entityId: integer('entity_id'),
  details: text('details'),
  createdAt: createdAt(),
}, (t) => [index('audit_logs_created_idx').on(t.createdAt)])

// Internal key/value store for server-only secrets (e.g. the generated JWT signing key
// when JWT_SECRET is not configured). Never exposed by any endpoint or the SQL Playground.
export const appSecrets = pgTable('app_secrets', {
  name: varchar('name', { length: 60 }).primaryKey(),
  value: text('value').notNull(),
  createdAt: createdAt(),
})
