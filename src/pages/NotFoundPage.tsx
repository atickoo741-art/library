import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-soft">
      Page not found. <Link to="/">Go home</Link>.
    </div>
  )
}

