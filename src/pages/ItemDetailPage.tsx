import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { getLibraryItemBySlug } from '../api/library'
import { ContentTypeBadge, DifficultyBadge } from '../components/Badge'
import { Markdown } from '../components/Markdown'

export function ItemDetailPage() {
  const { slug } = useParams()
  const query = useQuery({
    queryKey: ['library-item', slug],
    enabled: !!slug,
    queryFn: () => getLibraryItemBySlug(slug!),
  })

  if (query.isLoading) return <div className="text-sm text-slate-600">Loading…</div>
  if (query.isError || !query.data) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-soft">
        Item not found. <Link to="/search">Back to search</Link>
      </div>
    )
  }

  const item = query.data

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <ContentTypeBadge value={item.content_type} />
          <DifficultyBadge value={item.difficulty} />
          <span className="text-xs text-slate-500">{new Date(item.created_at).toLocaleDateString()}</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{item.title}</h1>
        {item.abstract && <p className="text-sm text-slate-700">{item.abstract}</p>}
        <div className="text-xs text-slate-600">
          By <span className="font-medium">{item.author_name}</span>
          {item.source_url ? (
            <>
              {' '}
              ·{' '}
              <a href={item.source_url} target="_blank" rel="noreferrer">
                source
              </a>
            </>
          ) : null}
        </div>
      </div>

      {item.body_md ? <Markdown value={item.body_md} /> : <div className="text-sm text-slate-600">No content.</div>}

      {item.code_snippet ? (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="text-xs font-semibold text-slate-700">Code snippet</div>
          <pre className="mt-2 overflow-x-auto rounded-md bg-slate-950 p-3 text-xs text-slate-100">
            <code>{item.code_snippet}</code>
          </pre>
        </div>
      ) : null}
    </div>
  )
}

