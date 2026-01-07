import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteLibraryItemAdmin, listLibraryItemsAdmin, updateLibraryItemAdmin } from '../../api/adminLibrary'
import { Button } from '../../components/Button'
import { ContentTypeBadge, DifficultyBadge } from '../../components/Badge'
import type { LibraryItem } from '../../lib/types'

export function AdminLibraryPage() {
  const qc = useQueryClient()
  const query = useQuery({
    queryKey: ['admin-library-items'],
    queryFn: listLibraryItemsAdmin,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<LibraryItem> }) => updateLibraryItemAdmin(id, patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin-library-items'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteLibraryItemAdmin(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin-library-items'] })
    },
  })

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">Library items</h1>
        <p className="text-sm text-slate-700">Manage published and archived items.</p>
      </div>

      {query.isLoading && <div className="text-sm text-slate-600">Loading…</div>}
      {query.isError && <div className="text-sm text-rose-700">Failed to load items.</div>}

      {query.data && query.data.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-soft">
          No items yet.
        </div>
      )}

      <div className="space-y-3">
        {query.data?.map((it) => (
          <div key={it.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="text-sm font-semibold">{it.title}</div>
                <div className="flex flex-wrap items-center gap-2">
                  <ContentTypeBadge value={it.content_type} />
                  <DifficultyBadge value={it.difficulty} />
                  <span className="text-xs text-slate-500">{it.publish_status}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={updateMutation.isPending}
                  onClick={() =>
                    void updateMutation.mutateAsync({
                      id: it.id,
                      patch: { publish_status: it.publish_status === 'published' ? 'archived' : 'published' },
                    })
                  }
                >
                  {it.publish_status === 'published' ? 'Archive' : 'Unarchive'}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={deleteMutation.isPending}
                  onClick={() => {
                    if (!confirm('Delete this item? This cannot be undone.')) return
                    void deleteMutation.mutateAsync(it.id)
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

