import { Construction } from 'lucide-react'
import { PageHeader } from './ui'

/** Honest placeholder for screens that are on the roadmap (see PLAN.md). */
export default function Planned({ title, milestone, items = [] }) {
  return (
    <>
      <PageHeader title={title} />
      <div className="card p-8">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700"><Construction className="h-5 w-5" /></div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">Scheduled · Milestone {milestone}</div>
            <h2 className="mt-1 text-lg font-bold text-navy-900">This screen needs the live PostgreSQL backend</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              It writes real data, so it ships together with the database and API in milestone {milestone} rather than as a button that only pretends to work.
            </p>
            {items.length > 0 && (
              <ul className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                {items.map((i) => <li key={i} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-400" />{i}</li>)}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
