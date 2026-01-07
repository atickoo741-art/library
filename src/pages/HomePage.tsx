import { Link } from 'react-router-dom'
import { SearchBar } from '../components/SearchBar'
import { contentTypeOptions, difficultyOptions } from '../lib/types'

export function HomePage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">An interactive library for quant finance.</h1>
        <p className="max-w-2xl text-sm text-slate-700">
          Browse algorithms, formulas, proofs, papers, and strategies. Submit new entries for review and publication.
        </p>
        <div className="max-w-2xl">
          <SearchBar />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <h2 className="text-sm font-semibold">Browse by content type</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {contentTypeOptions.map((o) => (
              <Link
                key={o.value}
                to={`/search?contentType=${encodeURIComponent(o.value)}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-800 no-underline hover:bg-slate-50"
              >
                {o.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <h2 className="text-sm font-semibold">Browse by difficulty</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {difficultyOptions.map((o) => (
              <Link
                key={o.value}
                to={`/search?difficulty=${encodeURIComponent(o.value)}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-800 no-underline hover:bg-slate-50"
              >
                {o.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

