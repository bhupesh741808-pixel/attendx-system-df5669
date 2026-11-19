import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import { Logo, Badge } from './ui'
import { useSession } from '../lib/session'

export default function Layout({ nav }) {
  const { user, logout } = useSession()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const doLogout = () => { logout(); navigate('/login', { replace: true }) }
  const initials = user.full_name.replace(/^(Dr\.|Mr\.|Ms\.)\s*/, '').split(' ').map((p) => p[0]).slice(0, 2).join('')

  const sidebar = (
    <aside className="flex h-full w-64 flex-col bg-navy-900 text-navy-100">
      <div className="flex items-center justify-between px-5 py-5">
        <Logo light />
        <button className="lg:hidden text-navy-200" onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {nav.map(({ to, label, icon: Icon, end, planned }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-white text-navy-900 shadow' : 'text-navy-200 hover:bg-navy-800 hover:text-white'}`
            }
          >
            <Icon className="h-[18px] w-[18px]" />
            <span className="flex-1">{label}</span>
            {planned && <span className="rounded-md bg-navy-700/70 px-1.5 py-0.5 text-[10px] font-semibold text-navy-200">SOON</span>}
          </NavLink>
        ))}
        <button onClick={doLogout} className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-navy-200 hover:bg-navy-800 hover:text-white">
          <LogOut className="h-[18px] w-[18px]" /> Logout
        </button>
      </nav>
      <div className="m-3 rounded-xl bg-navy-800 p-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-sky-300 text-sm font-bold text-navy-900">{initials}</div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-white">{user.full_name}</div>
            <div className="truncate text-xs text-navy-300">{user.email}</div>
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-screen">
      <div className="sticky top-0 hidden h-screen lg:block">{sidebar}</div>
      {open && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="h-full">{sidebar}</div>
          <div className="flex-1 bg-navy-950/40" onClick={() => setOpen(false)} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-navy-100 bg-white/85 px-5 py-3 backdrop-blur">
          <button className="lg:hidden text-navy-900" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <div className="text-sm text-slate-500">CSE Department · Semester 3 · 2026–27</div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 sm:inline">Preview data</span>
            <Badge value={user.role} />
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-5 lg:p-8"><Outlet /></main>
      </div>
    </div>
  )
}
