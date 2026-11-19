import { useMemo, useState } from 'react'
import { PageHeader, DataTable, Badge, fmtDate } from '../../components/ui'
import { attendanceRows, studentName } from '../../lib/data'
import { courses, students } from '../../data/fixtures'

export default function AttendanceRecords() {
  const all = useMemo(attendanceRows, [])
  const [course, setCourse] = useState('')
  const [student, setStudent] = useState('')
  const [date, setDate] = useState('')

  const rows = all.filter((r) =>
    (!course || r.course_code === course) &&
    (!student || r.student_id === Number(student)) &&
    (!date || r.date.slice(0, 10) === date))

  const sel = 'input w-auto py-2'
  return (
    <>
      <PageHeader title="Attendance records" subtitle="attendance_records ⋈ attendance_sessions ⋈ courses ⋈ students" />
      <DataTable
        rows={rows}
        placeholder="Search by student, roll no, course…"
        filters={
          <>
            <select className={sel} value={course} onChange={(e) => setCourse(e.target.value)}>
              <option value="">All courses</option>
              {courses.map((c) => <option key={c.course_id} value={c.course_code}>{c.course_code}</option>)}
            </select>
            <select className={sel} value={student} onChange={(e) => setStudent(e.target.value)}>
              <option value="">All students</option>
              {students.map((s) => <option key={s.student_id} value={s.student_id}>{studentName(s.student_id)}</option>)}
            </select>
            <input type="date" className={sel} value={date} onChange={(e) => setDate(e.target.value)} />
            {(course || student || date) && <button className="btn-ghost py-2" onClick={() => { setCourse(''); setStudent(''); setDate('') }}>Clear</button>}
          </>
        }
        columns={[
          { key: 'attendance_id', label: 'ID', mono: true },
          { key: 'session_id', label: 'Session', mono: true },
          { key: 'date', label: 'Date', render: (r) => fmtDate(r.date) },
          { key: 'course_code', label: 'Course' },
          { key: 'roll_no', label: 'Roll no', mono: true },
          { key: 'student_name', label: 'Student' },
          { key: 'status', label: 'Status', render: (r) => <Badge value={r.status} /> },
          { key: 'verification_method', label: 'Verified by' },
        ]}
      />
    </>
  )
}
