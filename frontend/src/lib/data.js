// Derived views over the fixtures. These mirror the SQL the backend will run
// (JOIN / GROUP BY / COUNT) so swapping to the API later is a drop-in change.
import { users, students, teachers, courses, enrollments, attendance_sessions, attendance_records, audit_logs } from '../data/fixtures'

export const userById = (id) => users.find((u) => u.user_id === id)
export const studentById = (id) => students.find((s) => s.student_id === id)
export const courseById = (id) => courses.find((c) => c.course_id === id)
export const teacherById = (id) => teachers.find((t) => t.teacher_id === id)
export const sessionById = (id) => attendance_sessions.find((s) => s.session_id === id)

export const studentName = (studentId) => userById(studentById(studentId)?.user_id)?.full_name
export const teacherName = (teacherId) => userById(teacherById(teacherId)?.user_id)?.full_name

export const pct = (present, late, total) => (total ? Math.round(((present + late) / total) * 1000) / 10 : 0)

function tally(records) {
  const t = { PRESENT: 0, ABSENT: 0, LATE: 0 }
  records.forEach((r) => (t[r.status] += 1))
  const total = records.length
  return { present: t.PRESENT, absent: t.ABSENT, late: t.LATE, total, percentage: pct(t.PRESENT, t.LATE, total) }
}

/** Attendance joined with session → course and student → user (INNER JOIN). */
export function attendanceRows() {
  return attendance_records.map((r) => {
    const s = sessionById(r.session_id)
    const c = courseById(s.course_id)
    const st = studentById(r.student_id)
    return { ...r, course_code: c.course_code, course_title: c.title, date: s.starts_at, roll_no: st.roll_no, student_name: studentName(r.student_id) }
  })
}

export function overallStats() {
  return {
    totalStudents: students.length,
    totalTeachers: teachers.length,
    totalCourses: courses.length,
    totalSessions: attendance_sessions.length,
    ...tally(attendance_records),
  }
}

/** Course-wise attendance (LEFT JOIN so courses with no sessions still appear). */
export function courseStats() {
  return courses.map((c) => {
    const sessionIds = attendance_sessions.filter((s) => s.course_id === c.course_id).map((s) => s.session_id)
    const recs = attendance_records.filter((r) => sessionIds.includes(r.session_id))
    return { ...c, enrolled: enrollments.filter((e) => e.course_id === c.course_id).length, sessions: sessionIds.length, ...tally(recs) }
  })
}

export function studentStats() {
  return students.map((s) => ({ ...s, full_name: studentName(s.student_id), ...tally(attendance_records.filter((r) => r.student_id === s.student_id)) }))
}

export function studentCourseStats(studentId) {
  return enrollments
    .filter((e) => e.student_id === studentId)
    .map((e) => {
      const c = courseById(e.course_id)
      const sessionIds = attendance_sessions.filter((s) => s.course_id === c.course_id).map((s) => s.session_id)
      const recs = attendance_records.filter((r) => r.student_id === studentId && sessionIds.includes(r.session_id))
      return { ...c, teacher: teacherName(c.teacher_id), sessions: sessionIds.length, ...tally(recs) }
    })
}

export function teacherCourses(teacherId) {
  return courseStats().filter((c) => c.teacher_id === teacherId)
}

export function auditRows() {
  return [...audit_logs].reverse().map((l) => ({ ...l, actor: userById(l.user_id)?.full_name, role: userById(l.user_id)?.role }))
}

export function profileFor(user) {
  if (user.role === 'STUDENT') return students.find((s) => s.user_id === user.user_id)
  if (user.role === 'TEACHER') return teachers.find((t) => t.user_id === user.user_id)
  return null
}
