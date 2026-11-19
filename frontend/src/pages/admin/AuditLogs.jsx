import { PageHeader, DataTable, Badge, fmtDateTime } from '../../components/ui'
import { auditRows } from '../../lib/data'

export default function AuditLogs() {
  return (
    <>
      <PageHeader title="Audit logs" subtitle="Every entry references a valid user (FK → users.user_id)." />
      <DataTable
        rows={auditRows()}
        placeholder="Search actions, users, details…"
        columns={[
          { key: 'log_id', label: 'ID', mono: true },
          { key: 'created_at', label: 'When', render: (r) => fmtDateTime(r.created_at) },
          { key: 'actor', label: 'User' },
          { key: 'role', label: 'Role', render: (r) => <Badge value={r.role} /> },
          { key: 'action', label: 'Action', mono: true },
          { key: 'entity', label: 'Entity', render: (r) => <span className="font-mono text-xs">{r.entity}#{r.entity_id}</span> },
          { key: 'details', label: 'Details' },
        ]}
      />
    </>
  )
}
