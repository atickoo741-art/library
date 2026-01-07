import { Link } from 'react-router-dom'

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">Admin</h1>
        <p className="text-sm text-slate-700">Review submissions and manage published library items.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/admin/submissions"
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft no-underline hover:bg-slate-50"
        >
          <div className="text-sm font-semibold text-slate-900">Review queue</div>
          <div className="mt-1 text-sm text-slate-700">Approve/reject/edit user submissions.</div>
        </Link>

        <Link
          to="/admin/library"
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft no-underline hover:bg-slate-50"
        >
          <div className="text-sm font-semibold text-slate-900">Library items</div>
          <div className="mt-1 text-sm text-slate-700">Archive/unarchive and delete items.</div>
        </Link>
      </div>
    </div>
  )
}

