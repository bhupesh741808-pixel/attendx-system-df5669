import { CheckCircle2, Clock, XCircle, Percent } from 'lucide-react'
import { PageHeader, StatCard, DataTable, Badge, fmtDateTime } from '../../components/ui'
import { useSession } from '../../lib/session'
import { profileFor, studentCourseStats, attendanceRows } from '../../lib/data'

function Ring({ value }) {
  const r = 26, c = 2 * Math.PI * r
  const tone = value >= 75 ? '#1f3568' : value >= 60 ? '#d97706' : '#e11d48'
  return (
    <svg width="68" height="68" viewBox="0 0 68 68">
      <circle cx="34" cy="34" r={r} stroke="#e2e8f5" strokeWidth="7" fill="none" />
      <circle cx="34" cy="34" r={r} stroke={tone} strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray={`${(value / 100) * c} ${c}`} transform="rotate(-90 34 34)" />
      <text x="34" y="38" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0b1f4d">{Math.round(value)}%</text>
    </svg>
  )
}

export default function StudentOverview() {
  const { user } = useSession()
  const student = profileFor(user)
  const courses = studentCourseStats(student.student_id)
  const history = attendanceRows().filter((r) => r.student_id === student.student_id) // own records only
  const t = history.reduce((a, r) => ({ ...a, [r.status]: a[r.status] + 1 }), { PRESENT: 0, LATE: 0, ABSENT: 0 })
  const overall = history.length ? Math.round(((t.PRESENT + t.LATE) / history.length) * 1000) / 10 : null

  return (
    <>
      <PageHeader title={`Hi, ${user.full_name.split(' ')[0]}`} subtitle={`${student.roll_no} · ${student.department} · Semester ${student.semester}`} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Present" value={t.PRESENT} icon={CheckCircle2} tone="green" />
        <StatCard label="Late" value={t.LATE} icon={Clock} tone="amber" />
        <StatCard label="Absent" value={t.ABSENT} icon={XCircle} tone="red" />
        <StatCard label="Overall attendance" value={overall === null ? '—' : `${overall}%`} icon={Percent} hint="Late counts as attended" />
      </div>

      <h3 className="mb-3 mt-8 font-semibold text-navy-900">Subject-wise attendance</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((c) => (
          <div key={c.course_id} className="card flex items-center gap-4 p-5">
            {c.total ? <Ring value={c.percentage} /> : <div className="grid h-[68px] w-[68px] place-items-center rounded-full border-[7px] border-navy-50 text-xs font-semibold text-slate-400">N/A</div>}
            <div className="min-w-0 flex-1">
              <div className="font-mono text-xs font-semibold text-navy-500">{c.course_code}</div>
              <div className="font-semibold text-navy-900">{c.title}</div>
              <div className="text-xs text-slate-500">{c.teacher}</div>
              <div className="mt-2 text-xs text-slate-600">
                {c.total ? <>{c.present} present · {c.late} late · {c.absent} absent of {c.sessions} sessions</> : 'No sessions held yet'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mb-3 mt-8 font-semibold text-navy-900">Attendance history</h3>
      <DataTable
        rows={history}
        placeholder="Search history…"
        columns={[
          { key: 'date', label: 'Date & time', render: (r) => fmtDateTime(r.marked_at) },
          { key: 'course_code', label: 'Course' },
          { key: 'session_id', label: 'Session', mono: true },
          { key: 'status', label: 'Status', render: (r) => <Badge value={r.status} /> },
          { key: 'verification_method', label: 'Verified by' },
        ]}
      />
    </>
  )
}
