import { useQuery } from '@tanstack/react-query'
import { listMySubmissions } from '../api/submissions'
import { SubmissionStatusBadge } from '../components/Badge'

export function MySubmissionsPage() {
  const query = useQuery({
    queryKey: ['my-submissions'],
    queryFn: listMySubmissions,
  })

  if (query.isLoading) return <div className="text-sm text-slate-600">Loading…</div>
  if (query.isError) return <div className="text-sm text-rose-700">Failed to load submissions.</div>

  const items = query.data ?? []

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">My submissions</h1>
        <p className="text-sm text-slate-700">Track review status and admin notes.</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-soft">
          No submissions yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((s) => (
            <div key={s.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{s.title}</div>
                  <div className="mt-1 text-xs text-slate-600">
                    Submitted {new Date(s.created_at).toLocaleString()}
                  </div>
                </div>
                <SubmissionStatusBadge value={s.status} />
              </div>
              {s.admin_notes && (
                <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <div className="text-xs font-semibold text-slate-600">Admin notes</div>
                  <div className="mt-1 whitespace-pre-wrap">{s.admin_notes}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

