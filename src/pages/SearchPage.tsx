import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { searchLibraryItems } from '../api/library'
import { ItemCard } from '../components/ItemCard'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { contentTypeOptions, difficultyOptions, type ContentType, type Difficulty } from '../lib/types'

function parseTagsParam(raw: string | null): string[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const q = searchParams.get('q') ?? ''
  const contentType = (searchParams.get('contentType') ?? 'all') as ContentType | 'all'
  const difficulty = (searchParams.get('difficulty') ?? 'all') as Difficulty | 'all'
  const sort = (searchParams.get('sort') ?? 'relevance') as 'relevance' | 'newest'
  const tagsParam = searchParams.get('tags')

  const [tagsInput, setTagsInput] = useState(tagsParam ?? '')

  const tags = useMemo(() => parseTagsParam(tagsParam), [tagsParam])

  const query = useQuery({
    queryKey: ['search', q, contentType, difficulty, tags.join(','), sort],
    queryFn: () => searchLibraryItems({ q, contentType, difficulty, tags, sort }),
  })

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <form
          className="grid gap-3 md:grid-cols-12"
          onSubmit={(e) => {
            e.preventDefault()
            const next = new URLSearchParams(searchParams)
            next.set('q', q)
            next.set('contentType', contentType)
            next.set('difficulty', difficulty)
            next.set('sort', sort)
            if (tagsInput.trim()) next.set('tags', tagsInput.trim())
            else next.delete('tags')
            setSearchParams(next, { replace: true })
          }}
        >
          <div className="md:col-span-5">
            <label className="text-xs font-medium text-slate-700">Query</label>
            <Input
              value={q}
              onChange={(e) => {
                const next = new URLSearchParams(searchParams)
                next.set('q', e.target.value)
                setSearchParams(next, { replace: true })
              }}
              placeholder="Search title, abstract, body, tags…"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-700">Type</label>
            <Select
              value={contentType}
              onChange={(e) => {
                const next = new URLSearchParams(searchParams)
                next.set('contentType', e.target.value)
                setSearchParams(next, { replace: true })
              }}
            >
              <option value="all">All</option>
              {contentTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-700">Difficulty</label>
            <Select
              value={difficulty}
              onChange={(e) => {
                const next = new URLSearchParams(searchParams)
                next.set('difficulty', e.target.value)
                setSearchParams(next, { replace: true })
              }}
            >
              <option value="all">All</option>
              {difficultyOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-medium text-slate-700">Tags (comma-separated)</label>
            <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="options, volatility" />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-medium text-slate-700">Sort</label>
            <Select
              value={sort}
              onChange={(e) => {
                const next = new URLSearchParams(searchParams)
                next.set('sort', e.target.value)
                setSearchParams(next, { replace: true })
              }}
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest</option>
            </Select>
          </div>
          <div className="flex items-end md:col-span-3">
            <Button type="submit" variant="secondary" className="w-full">
              Apply
            </Button>
          </div>
        </form>
      </div>

      {query.isLoading && <div className="text-sm text-slate-600">Loading…</div>}
      {query.isError && <div className="text-sm text-rose-700">Failed to load results.</div>}

      {query.data && query.data.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-soft">
          No results. Try a broader query.
        </div>
      )}

      <div className="space-y-3">
        {query.data?.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

