import { Link } from 'react-router-dom'
import type { LibraryItem } from '../lib/types'
import { ContentTypeBadge, DifficultyBadge } from './Badge'

export function ItemCard({ item }: { item: LibraryItem }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link to={`/item/${encodeURIComponent(item.slug)}`} className="block text-base font-semibold no-underline">
            {item.title}
          </Link>
          {item.abstract && <p className="mt-1 text-sm text-slate-700">{item.abstract}</p>}
          {item.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.slice(0, 6).map((t) => (
                <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="flex gap-2">
            <ContentTypeBadge value={item.content_type} />
            <DifficultyBadge value={item.difficulty} />
          </div>
          <div className="text-xs text-slate-500">{new Date(item.created_at).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  )
}

