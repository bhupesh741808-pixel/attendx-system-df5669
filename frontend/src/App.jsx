import { Navigate, Route, Routes } from 'react-router-dom'
import {
  LayoutDashboard, GraduationCap, Users, BookOpen, Link2, ClipboardList, Database, Terminal, ScrollText, BarChart3, Settings,
  PlayCircle, CalendarClock, UserCircle, QrCode, History, Percent,
} from 'lucide-react'
import Layout from './components/Layout'
import Planned from './components/Planned'
import Login from './pages/Login'
import AdminOverview from './pages/admin/Overview'
import DatabaseExplorer from './pages/admin/DatabaseExplorer'
import AttendanceRecords from './pages/admin/AttendanceRecords'
import AuditLogs from './pages/admin/AuditLogs'
import TeacherOverview from './pages/teacher/Overview'
import StudentOverview from './pages/student/Overview'
import { useSession, homeFor } from './lib/session'

// `planned` items render an honest roadmap card (see PLAN.md) instead of a fake screen.
const ADMIN_NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true, el: <AdminOverview /> },
  { to: '/admin/students', label: 'Students', icon: GraduationCap, planned: 3, items: ['List, search & filter students', 'Add student (users + students in one transaction)', 'Edit details', 'Delete with confirmation'] },
  { to: '/admin/teachers', label: 'Teachers', icon: Users, planned: 3, items: ['List teachers', 'Add & edit teachers'] },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen, planned: 3, items: ['Create, edit and delete courses', 'Assign a teacher'] },
  { to: '/admin/enrollments', label: 'Enrollments', icon: Link2, planned: 3, items: ['Enroll students in courses', 'UNIQUE (student_id, course_id) enforced'] },
  { to: '/admin/attendance', label: 'Attendance Records', icon: ClipboardList, el: <AttendanceRecords /> },
  { to: '/admin/database', label: 'Database Explorer', icon: Database, el: <DatabaseExplorer /> },
  { to: '/admin/sql', label: 'SQL Playground', icon: Terminal, planned: 6, items: ['Predefined read-only SELECT demos', 'WHERE, ORDER BY, JOINs, GROUP BY, COUNT, AVG', 'Attendance-percentage query', 'Runs against PostgreSQL via the API'] },
  { to: '/admin/audit', label: 'Audit Logs', icon: ScrollText, el: <AuditLogs /> },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3, planned: 6, items: ['SQL-driven analytics', 'CSV export'] },
  { to: '/admin/settings', label: 'Settings', icon: Settings, planned: 6, items: ['Admin profile & password change'] },
]
const TEACHER_NAV = [
  { to: '/teacher', label: 'Overview', icon: LayoutDashboard, end: true, el: <TeacherOverview /> },
  { to: '/teacher/courses', label: 'My Courses', icon: BookOpen, planned: 4, items: ['Assigned courses with live stats'] },
  { to: '/teacher/students', label: 'Students', icon: GraduationCap, planned: 4, items: ['Enrolled students per course'] },
  { to: '/teacher/start', label: 'Start Attendance', icon: PlayCircle, planned: 4, items: ['Select course & expiry', 'Server creates session + secure random token', 'QR code displayed (only the SHA-256 hash is stored)', 'Live attendance count'] },
  { to: '/teacher/sessions', label: 'Attendance Sessions', icon: CalendarClock, planned: 4, items: ['OPEN / CLOSED sessions', 'Close session'] },
  { to: '/teacher/records', label: 'Attendance Records', icon: ClipboardList, planned: 4, items: ['Present / absent / late lists', 'Correct a record with a reason (audited)'] },
  { to: '/teacher/reports', label: 'Reports', icon: BarChart3, planned: 6, items: ['Export attendance as CSV'] },
  { to: '/teacher/profile', label: 'Profile', icon: UserCircle, planned: 3, items: ['Update profile details'] },
]
const STUDENT_NAV = [
  { to: '/student', label: 'Overview', icon: LayoutDashboard, end: true, el: <StudentOverview /> },
  { to: '/student/profile', label: 'My Profile', icon: UserCircle, planned: 3, items: ['View & update own profile'] },
  { to: '/student/courses', label: 'My Courses', icon: BookOpen, planned: 5, items: ['Enrolled courses'] },
  { to: '/student/scan', label: 'Scan Attendance QR', icon: QrCode, planned: 5, items: ['Camera QR scanner', 'Manual token entry fallback', 'Server validates token, expiry, enrollment, duplicates'] },
  { to: '/student/history', label: 'Attendance History', icon: History, planned: 5, items: ['Full history with filters'] },
  { to: '/student/percentage', label: 'Attendance Percentage', icon: Percent, planned: 5, items: ['Subject-wise percentage trends'] },
]

function RoleArea({ role, nav }) {
  const { user } = useSession()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) return <Navigate to={homeFor(user.role)} replace />
  return <Layout nav={nav} />
}

function routesFor(nav, base) {
  return nav.map((n) => {
    const path = n.to === base ? undefined : n.to.slice(base.length + 1)
    const el = n.el || <Planned title={n.label} milestone={n.planned} items={n.items} />
    return path ? <Route key={n.to} path={path} element={el} /> : <Route key={n.to} index element={el} />
  })
}

export default function App() {
  const { user } = useSession()
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<RoleArea role="ADMIN" nav={ADMIN_NAV} />}>{routesFor(ADMIN_NAV, '/admin')}</Route>
      <Route path="/teacher" element={<RoleArea role="TEACHER" nav={TEACHER_NAV} />}>{routesFor(TEACHER_NAV, '/teacher')}</Route>
      <Route path="/student" element={<RoleArea role="STUDENT" nav={STUDENT_NAV} />}>{routesFor(STUDENT_NAV, '/student')}</Route>
      <Route path="*" element={<Navigate to={user ? homeFor(user.role) : '/login'} replace />} />
    </Routes>
  )
}
