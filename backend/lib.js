// Small helpers shared by every route module.
import { sql } from 'drizzle-orm'
import { db } from '../db/index.ts'

/** Run a parameterised SQL query (drizzle `sql` template) and return the rows. */
export async function query(q, executor = db) {
  const res = await executor.execute(q)
  return Array.isArray(res) ? res : res.rows
}
export async function one(q, executor = db) {
  return (await query(q, executor))[0] ?? null
}

export class HttpError extends Error {
  constructor(status, message, fields) {
    super(message)
    this.status = status
    this.fields = fields
  }
}

/** Wrap async route handlers so thrown errors reach the error middleware. */
export const route = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/** Insert an audit log row (inside the caller's transaction when `executor` is given). */
export function audit(executor, userId, action, entity, entityId, details) {
  return executor.execute(sql`
    INSERT INTO audit_logs (user_id, action, entity, entity_id, details)
    VALUES (${userId}, ${action}, ${entity}, ${entityId ?? null}, ${details ?? null})`)
}

/** Attendance % = (PRESENT + LATE) / total records, one decimal place. */
export const pct = (present, late, total) => (total ? Math.round(((present + late) / total) * 1000) / 10 : 0)

export const intParam = (value, name = 'id') => {
  const n = Number(value)
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, `Invalid ${name}.`)
  return n
}

// Friendly messages for PostgreSQL constraint violations.
const UNIQUE_MESSAGES = {
  users_email_key: ['email', 'This email is already registered.'],
  users_email_unique: ['email', 'This email is already registered.'],
  students_roll_no_key: ['roll_no', 'This roll number already exists.'],
  students_roll_no_unique: ['roll_no', 'This roll number already exists.'],
  teachers_employee_no_key: ['employee_no', 'This employee number already exists.'],
  teachers_employee_no_unique: ['employee_no', 'This employee number already exists.'],
  courses_course_code_key: ['course_code', 'This course code already exists.'],
  courses_course_code_unique: ['course_code', 'This course code already exists.'],
  enrollments_student_course_unique: [null, 'This student is already enrolled in this course.'],
  attendance_records_session_student_unique: [null, 'Attendance has already been marked for this session.'],
}

export function errorHandler(err, req, res, _next) {
  if (err?.name === 'ZodError') {
    const fields = {}
    for (const i of err.issues) fields[i.path.join('.') || 'form'] ??= i.message
    return res.status(400).json({ error: 'Please fix the highlighted fields.', fields })
  }
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message, fields: err.fields })
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'Malformed JSON body.' })

  // Drizzle wraps driver errors; the Postgres error is on `cause`.
  const pg = err?.cause?.code ? err.cause : err
  if (pg?.code === '23505') {
    const [field, msg] = UNIQUE_MESSAGES[pg.constraint] || [null, 'A record with this unique value already exists.']
    return res.status(409).json({ error: msg, fields: field ? { [field]: msg } : undefined })
  }
  if (pg?.code === '23503') return res.status(409).json({ error: 'This record is referenced by other data and cannot be changed or removed.' })
  if (pg?.code === '23514') return res.status(400).json({ error: 'A value is outside the allowed range.' })
  if (pg?.code === '25006') return res.status(400).json({ error: 'Only read-only queries are allowed.' })

  console.error('[api]', req.method, req.originalUrl, err)
  res.status(500).json({ error: 'Something went wrong on the server. Please try again.' })
}
