import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { listSubmissionsAdmin } from '../../api/submissions'
import { SubmissionStatusBadge } from '../../components/Badge'
import { Select } from '../../components/Select'
import type { SubmissionStatus } from '../../lib/types'

export function AdminSubmissionsPage() {
  const [params, setParams] = useSearchParams()
  const status = (params.get('status') ?? 'pending') as SubmissionStatus | 'all'

  const query = useQuery({
    queryKey: ['admin-submissions', status],
    queryFn: () => listSubmissionsAdmin(status),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Submissions</h1>
          <p className="text-sm text-slate-700">Review and publish submissions.</p>
        </div>
        <div className="w-full md:w-56">
          <label className="text-xs font-medium text-slate-700">Status</label>
          <Select
            value={status}
            onChange={(e) => {
              const next = new URLSearchParams(params)
              next.set('status', e.target.value)
              setParams(next, { replace: true })
            }}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All</option>
          </Select>
        </div>
      </div>

      {query.isLoading && <div className="text-sm text-slate-600">Loading…</div>}
      {query.isError && <div className="text-sm text-rose-700">Failed to load submissions.</div>}

      {query.data && query.data.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-soft">
          No submissions.
        </div>
      )}

      <div className="space-y-3">
        {query.data?.map((s) => (
          <Link
            key={s.id}
            to={`/admin/submissions/${s.id}`}
            className="block rounded-lg border border-slate-200 bg-white p-4 shadow-soft no-underline hover:bg-slate-50"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900">{s.title}</div>
                <div className="mt-1 text-xs text-slate-600">
                  Submitted {new Date(s.created_at).toLocaleString()}
                </div>
              </div>
              <SubmissionStatusBadge value={s.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

