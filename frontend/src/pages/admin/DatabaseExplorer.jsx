import { useState } from 'react'
import { Table2, KeyRound, Link2, Network, ShieldCheck } from 'lucide-react'
import { PageHeader, DataTable, Badge } from '../../components/ui'
import { schema, tables, relationships } from '../../data/fixtures'

const NAMES = Object.keys(schema)

export default function DatabaseExplorer() {
  const [view, setView] = useState('er')
  const [active, setActive] = useState('users')

  return (
    <>
      <PageHeader
        title="Database Explorer"
        subtitle="Eight relational tables, normalised to 3NF. Inspect columns, keys, constraints and records."
        actions={
          <div className="flex rounded-xl border border-navy-100 bg-white p-1">
            <button onClick={() => setView('er')} className={`btn px-3 py-1.5 ${view === 'er' ? 'bg-navy-900 text-white' : 'text-navy-700'}`}><Network className="h-4 w-4" /> ER diagram</button>
            <button onClick={() => setView('tables')} className={`btn px-3 py-1.5 ${view === 'tables' ? 'bg-navy-900 text-white' : 'text-navy-700'}`}><Table2 className="h-4 w-4" /> Tables</button>
          </div>
        }
      />
      {view === 'er' ? <ERDiagram onOpen={(t) => { setActive(t); setView('tables') }} /> : <TableView active={active} setActive={setActive} />}
    </>
  )
}

function TableView({ active, setActive }) {
  const def = schema[active]
  const rows = tables[active]
  const cols = def.columns.filter((c) => !c.hidden)

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <div className="card h-fit p-2">
        {NAMES.map((n) => (
          <button key={n} onClick={() => setActive(n)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-mono text-xs ${active === n ? 'bg-navy-900 text-white' : 'text-navy-800 hover:bg-navy-50'}`}>
            {n}<span className={active === n ? 'text-navy-200' : 'text-slate-400'}>{tables[n].length}</span>
          </button>
        ))}
      </div>

      <div className="min-w-0 space-y-6">
        <div className="card p-5">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="font-mono text-lg font-bold text-navy-900">{active}</h2>
            <span className="text-sm text-slate-500">{def.description}</span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr><th className="py-2 pr-4">Column</th><th className="py-2 pr-4">Data type</th><th className="py-2 pr-4">Key</th><th className="py-2">Constraints</th></tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {def.columns.map((c) => (
                  <tr key={c.name}>
                    <td className="py-2.5 pr-4 font-mono text-xs font-semibold text-navy-900">{c.name}</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-slate-600">{c.type}</td>
                    <td className="py-2.5 pr-4">
                      {c.pk && <span className="badge gap-1 bg-amber-50 text-amber-700 ring-1 ring-amber-200"><KeyRound className="h-3 w-3" />PK</span>}
                      {c.fk && <button onClick={() => setActive(c.fk.split('.')[0])} className="badge gap-1 bg-sky-50 text-sky-700 ring-1 ring-sky-200 hover:bg-sky-100"><Link2 className="h-3 w-3" />FK → {c.fk}</button>}
                    </td>
                    <td className="py-2.5">
                      <div className="flex flex-wrap gap-1">{c.constraints.map((k) => <span key={k} className="rounded-md bg-navy-50 px-1.5 py-0.5 font-mono text-[11px] text-navy-700">{k}</span>)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {def.tableConstraints && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-navy-50 pt-4">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              {def.tableConstraints.map((t) => <span key={t} className="rounded-md bg-emerald-50 px-2 py-1 font-mono text-xs text-emerald-800">{t}</span>)}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-navy-900">Records</h3>
          <DataTable
            dense
            rows={rows}
            placeholder={`Search ${active}…`}
            columns={cols.map((c) => ({
              key: c.name,
              label: c.name,
              mono: true,
              render: ['role', 'status'].includes(c.name) ? (r) => <Badge value={r[c.name]} /> : undefined,
            }))}
          />
          {schema[active].columns.some((c) => c.hidden) && <p className="mt-2 text-xs text-slate-500">password_hash is stored as a bcrypt hash and is never sent to the browser.</p>}
        </div>
      </div>
    </div>
  )
}

/* ---------- ER diagram (SVG, hand-laid-out grid) ---------- */
const BOX_W = 210
const POS = {
  users: { x: 380, y: 20 },
  students: { x: 120, y: 200 },
  teachers: { x: 640, y: 200 },
  audit_logs: { x: 900, y: 20 },
  enrollments: { x: 20, y: 440 },
  courses: { x: 380, y: 380 },
  attendance_sessions: { x: 700, y: 520 },
  attendance_records: { x: 300, y: 660 },
}
const boxH = (t) => 34 + schema[t].columns.length * 20 + 8

function anchor(t, other) {
  const a = POS[t], b = POS[other]
  const ah = boxH(t)
  const cx = a.x + BOX_W / 2, cy = a.y + ah / 2
  const bx = b.x + BOX_W / 2, by = b.y + boxH(other) / 2
  const dx = bx - cx, dy = by - cy
  if (Math.abs(dx) * ah > Math.abs(dy) * BOX_W) return { x: dx > 0 ? a.x + BOX_W : a.x, y: cy }
  return { x: cx, y: dy > 0 ? a.y + ah : a.y }
}

function ERDiagram({ onOpen }) {
  const [hover, setHover] = useState(null)
  return (
    <div className="card overflow-x-auto p-4">
      <div className="mb-3 flex flex-wrap gap-4 px-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><KeyRound className="h-3.5 w-3.5 text-amber-600" /> Primary key</span>
        <span className="flex items-center gap-1.5"><Link2 className="h-3.5 w-3.5 text-sky-600" /> Foreign key</span>
        <span>Hover a table to highlight its relationships · click to inspect</span>
      </div>
      <svg viewBox="0 0 1130 880" className="min-w-[900px] w-full">
        <defs>
          <marker id="many" markerWidth="12" markerHeight="12" refX="1" refY="6" orient="auto"><path d="M1 6 L11 1 M1 6 L11 11 M1 6 L11 6" stroke="#5f7bb8" fill="none" strokeWidth="1.4" /></marker>
          <marker id="one" markerWidth="12" markerHeight="12" refX="11" refY="6" orient="auto"><path d="M7 1 L7 11 M10 1 L10 11" stroke="#5f7bb8" strokeWidth="1.4" /></marker>
        </defs>
        {relationships.map((r) => {
          const p1 = anchor(r.from, r.to), p2 = anchor(r.to, r.from)
          const on = hover && (hover === r.from || hover === r.to)
          const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2
          return (
            <g key={r.from + r.to} opacity={hover && !on ? 0.15 : 1}>
              <path d={`M${p1.x},${p1.y} L${p2.x},${p2.y}`} stroke={on ? '#1f3568' : '#94a8d3'} strokeWidth={on ? 2 : 1.4} fill="none" markerStart={r.kind === '1 : 1' ? 'url(#one)' : 'url(#many)'} markerEnd="url(#one)" />
              <rect x={mx - 22} y={my - 9} width="44" height="18" rx="9" fill="#fff" stroke="#c3cfe8" />
              <text x={mx} y={my + 4} textAnchor="middle" fontSize="10" fontWeight="600" fill="#1f3568">{r.kind}</text>
            </g>
          )
        })}
        {Object.entries(POS).map(([t, p]) => (
          <g key={t} transform={`translate(${p.x},${p.y})`} className="cursor-pointer" onMouseEnter={() => setHover(t)} onMouseLeave={() => setHover(null)} onClick={() => onOpen(t)} opacity={hover && hover !== t && !relationships.some((r) => (r.from === hover && r.to === t) || (r.to === hover && r.from === t)) ? 0.35 : 1}>
            <rect width={BOX_W} height={boxH(t)} rx="12" fill="#fff" stroke={hover === t ? '#1f3568' : '#c3cfe8'} strokeWidth={hover === t ? 2 : 1} />
            <path d={`M0 12 a12 12 0 0 1 12 -12 h${BOX_W - 24} a12 12 0 0 1 12 12 v18 h-${BOX_W} z`} fill="#0b1f4d" />
            <text x="12" y="20" fontSize="12" fontWeight="700" fill="#fff" fontFamily="JetBrains Mono, monospace">{t}</text>
            {schema[t].columns.map((c, i) => (
              <g key={c.name} transform={`translate(12, ${48 + i * 20})`}>
                <text fontSize="10.5" fontFamily="JetBrains Mono, monospace" fill={c.pk ? '#b45309' : c.fk ? '#0369a1' : '#334155'} fontWeight={c.pk || c.fk ? 700 : 400}>
                  {c.pk ? '🔑 ' : c.fk ? '↗ ' : '   '}{c.name}
                </text>
                <text x={BOX_W - 24} textAnchor="end" fontSize="9.5" fontFamily="JetBrains Mono, monospace" fill="#94a3b8">{c.type.length > 14 ? c.type.slice(0, 13) + '…' : c.type}</text>
              </g>
            ))}
          </g>
        ))}
      </svg>
      <div className="mt-2 grid gap-3 px-2 text-xs text-slate-600 sm:grid-cols-3">
        <div className="rounded-xl bg-navy-50 p-3"><b className="text-navy-900">One-to-one:</b> users ↔ students, users ↔ teachers (UNIQUE user_id).</div>
        <div className="rounded-xl bg-navy-50 p-3"><b className="text-navy-900">One-to-many:</b> teachers → courses, courses → sessions, sessions → records, users → audit_logs.</div>
        <div className="rounded-xl bg-navy-50 p-3"><b className="text-navy-900">Many-to-many:</b> students ↔ courses through <span className="font-mono">enrollments</span>.</div>
      </div>
    </div>
  )
}
