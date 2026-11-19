import { useMemo, useState } from 'react'
import { Search, Inbox, CheckCircle2 } from 'lucide-react'

export function Logo({ light = false, size = 'md' }) {
  const box = size === 'lg' ? 'h-11 w-11 rounded-xl' : 'h-9 w-9 rounded-lg'
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${box} grid place-items-center ${light ? 'bg-white text-navy-900' : 'bg-navy-900 text-white'}`}>
        <CheckCircle2 className={size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} strokeWidth={2.5} />
      </div>
      <div className="leading-tight">
        <div className={`font-extrabold tracking-tight ${size === 'lg' ? 'text-2xl' : 'text-lg'} ${light ? 'text-white' : 'text-navy-900'}`}>
          Attend<span className={light ? 'text-sky-300' : 'text-navy-500'}>X</span>
        </div>
        <div className={`text-[11px] font-medium ${light ? 'text-navy-200' : 'text-slate-500'}`}>Attendance, Verified.</div>
      </div>
    </div>
  )
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions}
    </div>
  )
}

export function StatCard({ label, value, icon: Icon, hint, tone = 'navy' }) {
  const tones = {
    navy: 'bg-navy-50 text-navy-700',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-rose-50 text-rose-700',
    amber: 'bg-amber-50 text-amber-700',
  }
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        {Icon && <span className={`grid h-9 w-9 place-items-center rounded-xl ${tones[tone]}`}><Icon className="h-[18px] w-[18px]" /></span>}
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight text-navy-900 tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </div>
  )
}

const STATUS = {
  PRESENT: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  LATE: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  ABSENT: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  OPEN: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  CLOSED: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  STUDENT: 'bg-navy-50 text-navy-700 ring-1 ring-navy-200',
  TEACHER: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  ADMIN: 'bg-navy-900 text-white',
}
export const Badge = ({ value }) => <span className={`badge ${STATUS[value] || 'bg-slate-100 text-slate-600'}`}>{value}</span>

export const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
export const fmtDateTime = (iso) => new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export function EmptyState({ title = 'No records found', text = 'Try adjusting your search or filters.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Inbox className="h-9 w-9 text-navy-200" />
      <div className="mt-3 text-sm font-semibold text-navy-900">{title}</div>
      <div className="text-xs text-slate-500">{text}</div>
    </div>
  )
}

/**
 * Searchable table. columns: [{ key, label, render?, mono? }]
 * `filters` slot renders extra controls next to search; filtering by them is done by the caller.
 */
export function DataTable({ columns, rows, searchable = true, placeholder = 'Search…', filters, dense }) {
  const [q, setQ] = useState('')
  const visible = useMemo(() => {
    if (!q.trim()) return rows
    const needle = q.toLowerCase()
    return rows.filter((r) => columns.some((c) => String(r[c.key] ?? '').toLowerCase().includes(needle)))
  }, [q, rows, columns])

  return (
    <div className="card overflow-hidden">
      {(searchable || filters) && (
        <div className="flex flex-wrap items-center gap-3 border-b border-navy-100 p-4">
          {searchable && (
            <div className="relative min-w-56 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input className="input pl-9" placeholder={placeholder} value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          )}
          {filters}
          <span className="ml-auto text-xs font-medium text-slate-500">{visible.length} of {rows.length} rows</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-navy-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>{columns.map((c) => <th key={c.key} className={`whitespace-nowrap px-4 ${dense ? 'py-2' : 'py-3'}`}>{c.label}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {visible.map((r, i) => (
              <tr key={i} className="hover:bg-navy-50/40">
                {columns.map((c) => (
                  <td key={c.key} className={`whitespace-nowrap px-4 ${dense ? 'py-2' : 'py-3'} ${c.mono ? 'font-mono text-xs' : ''}`}>
                    {c.render ? c.render(r) : String(r[c.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <EmptyState />}
      </div>
    </div>
  )
}
