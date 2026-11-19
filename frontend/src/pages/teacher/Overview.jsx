import { BookOpen, Users, CalendarCheck, Percent } from 'lucide-react'
import { PageHeader, StatCard, DataTable, Badge, fmtDateTime } from '../../components/ui'
import { useSession } from '../../lib/session'
import { profileFor, teacherCourses, courseById, studentName, studentById } from '../../lib/data'
import { attendance_sessions, attendance_records, enrollments } from '../../data/fixtures'

export default function TeacherOverview() {
  const { user } = useSession()
  const teacher = profileFor(user)
  const myCourses = teacherCourses(teacher.teacher_id)
  const courseIds = myCourses.map((c) => c.course_id)
  const sessions = attendance_sessions.filter((s) => s.teacher_id === teacher.teacher_id)
  const recs = attendance_records.filter((r) => sessions.some((s) => s.session_id === r.session_id))
  const pctAll = recs.length ? Math.round((recs.filter((r) => r.status !== 'ABSENT').length / recs.length) * 1000) / 10 : 0
  const roster = enrollments.filter((e) => courseIds.includes(e.course_id))

  return (
    <>
      <PageHeader title={`Welcome, ${user.full_name}`} subtitle={`${teacher.employee_no} · ${teacher.department} Department`} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Assigned courses" value={myCourses.length} icon={BookOpen} />
        <StatCard label="Enrolled students" value={new Set(roster.map((e) => e.student_id)).size} icon={Users} hint={`${roster.length} enrollments`} />
        <StatCard label="Sessions held" value={sessions.length} icon={CalendarCheck} />
        <StatCard label="Avg. attendance" value={sessions.length ? `${pctAll}%` : '—'} icon={Percent} tone="green" />
      </div>

      <h3 className="mb-3 mt-8 font-semibold text-navy-900">My courses</h3>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {myCourses.map((c) => (
          <div key={c.course_id} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-xs font-semibold text-navy-500">{c.course_code}</div>
                <div className="mt-1 font-semibold text-navy-900">{c.title}</div>
              </div>
              <span className="rounded-lg bg-navy-50 px-2 py-1 text-xs font-semibold text-navy-700">{c.credits} cr</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-navy-50 py-2"><div className="text-lg font-bold text-navy-900">{c.enrolled}</div><div className="text-[11px] text-slate-500">Students</div></div>
              <div className="rounded-xl bg-navy-50 py-2"><div className="text-lg font-bold text-navy-900">{c.sessions}</div><div className="text-[11px] text-slate-500">Sessions</div></div>
              <div className="rounded-xl bg-navy-50 py-2"><div className="text-lg font-bold text-navy-900">{c.total ? `${c.percentage}%` : '—'}</div><div className="text-[11px] text-slate-500">Attendance</div></div>
            </div>
            {c.total > 0 && (
              <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-navy-50">
                <div className="bg-navy-700" style={{ width: `${(c.present / c.total) * 100}%` }} />
                <div className="bg-amber-500" style={{ width: `${(c.late / c.total) * 100}%` }} />
                <div className="bg-rose-500" style={{ width: `${(c.absent / c.total) * 100}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 className="mb-3 mt-8 font-semibold text-navy-900">Recent sessions</h3>
      {sessions.length === 0 ? (
        <div className="card p-6 text-sm text-slate-500">No attendance sessions yet for your courses.</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {sessions.map((s) => {
            const rs = attendance_records.filter((r) => r.session_id === s.session_id)
            return (
              <div key={s.session_id} className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-navy-900">Session #{s.session_id} · {courseById(s.course_id).course_code}</div>
                    <div className="text-xs text-slate-500">{fmtDateTime(s.starts_at)}</div>
                  </div>
                  <Badge value={s.status} />
                </div>
                <div className="mt-4 space-y-2">
                  {rs.map((r) => (
                    <div key={r.attendance_id} className="flex items-center justify-between text-sm">
                      <span><span className="font-mono text-xs text-slate-400">{studentById(r.student_id).roll_no}</span> <span className="ml-2 text-navy-900">{studentName(r.student_id)}</span></span>
                      <span className="flex items-center gap-2"><span className="text-xs text-slate-400">{r.verification_method}</span><Badge value={r.status} /></span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <h3 className="mb-3 mt-8 font-semibold text-navy-900">Enrolled students</h3>
      <DataTable
        rows={roster.map((e) => ({ ...e, roll_no: studentById(e.student_id).roll_no, name: studentName(e.student_id), course: courseById(e.course_id).course_code }))}
        placeholder="Search students…"
        columns={[
          { key: 'roll_no', label: 'Roll no', mono: true },
          { key: 'name', label: 'Student' },
          { key: 'course', label: 'Course' },
        ]}
      />
    </>
  )
}
