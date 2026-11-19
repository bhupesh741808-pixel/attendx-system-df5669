import { Users, GraduationCap, BookOpen, CalendarCheck, CheckCircle2, XCircle, Clock, Percent } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { PageHeader, StatCard, DataTable, Badge, fmtDateTime } from '../../components/ui'
import { overallStats, courseStats, studentStats, auditRows } from '../../lib/data'

const C = { present: '#1f3568', late: '#d97706', absent: '#e11d48' }

export default function AdminOverview() {
  const s = overallStats()
  const courses = courseStats()
  const split = [
    { name: 'Present', value: s.present, color: C.present },
    { name: 'Late', value: s.late, color: C.late },
    { name: 'Absent', value: s.absent, color: C.absent },
  ]

  return (
    <>
      <PageHeader title="Admin overview" subtitle="Institution-wide attendance at a glance." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total students" value={s.totalStudents} icon={GraduationCap} />
        <StatCard label="Total teachers" value={s.totalTeachers} icon={Users} />
        <StatCard label="Total courses" value={s.totalCourses} icon={BookOpen} />
        <StatCard label="Attendance sessions" value={s.totalSessions} icon={CalendarCheck} />
        <StatCard label="Present" value={s.present} icon={CheckCircle2} tone="green" />
        <StatCard label="Late" value={s.late} icon={Clock} tone="amber" />
        <StatCard label="Absent" value={s.absent} icon={XCircle} tone="red" />
        <StatCard label="Overall attendance" value={`${s.percentage}%`} icon={Percent} hint="(present + late) ÷ total records" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-navy-900">Course-wise attendance %</h3>
            <span className="text-xs text-slate-500">Courses without sessions show 0%</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={courses} margin={{ left: -16 }}>
                <CartesianGrid vertical={false} stroke="#e2e8f5" />
                <XAxis dataKey="course_code" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} unit="%" />
                <Tooltip cursor={{ fill: '#f2f5fb' }} formatter={(v) => [`${v}%`, 'Attendance']} labelFormatter={(l) => courses.find((c) => c.course_code === l)?.title} />
                <Bar dataKey="percentage" fill={C.present} radius={[6, 6, 0, 0]} maxBarSize={56} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="mb-2 font-semibold text-navy-900">Status distribution</h3>
          <div className="h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={split} dataKey="value" innerRadius={52} outerRadius={78} paddingAngle={3} stroke="none">
                  {split.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-2">
            {split.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600"><span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />{d.name}</span>
                <span className="font-semibold tabular-nums text-navy-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div>
          <h3 className="mb-3 font-semibold text-navy-900">Student-wise summary</h3>
          <DataTable
            searchable={false}
            rows={studentStats()}
            columns={[
              { key: 'roll_no', label: 'Roll no', mono: true },
              { key: 'full_name', label: 'Student' },
              { key: 'present', label: 'P' },
              { key: 'late', label: 'L' },
              { key: 'absent', label: 'A' },
              { key: 'percentage', label: 'Attendance', render: (r) => <span className="font-semibold text-navy-900">{r.total ? `${r.percentage}%` : '—'}</span> },
            ]}
          />
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-navy-900">Recent activity</h3>
          <div className="card divide-y divide-navy-50">
            {auditRows().map((l) => (
              <div key={l.log_id} className="flex items-start gap-3 p-4">
                <Badge value={l.role} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm"><span className="font-semibold text-navy-900">{l.actor}</span> <span className="text-slate-500">· {l.action.replaceAll('_', ' ').toLowerCase()}</span></div>
                  <div className="truncate text-xs text-slate-500">{l.details}</div>
                </div>
                <div className="whitespace-nowrap text-xs text-slate-400">{fmtDateTime(l.created_at)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
