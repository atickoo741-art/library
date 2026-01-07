import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  approveSubmission,
  getSubmissionAdmin,
  rejectSubmission,
  updateSubmissionAdmin,
} from '../../api/submissions'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { Select } from '../../components/Select'
import { Textarea } from '../../components/Textarea'
import { Markdown } from '../../components/Markdown'
import { contentTypeOptions, difficultyOptions } from '../../lib/types'

const schema = z.object({
  title: z.string().min(4).max(200),
  content_type: z.enum(['algorithm', 'formula', 'proof', 'paper', 'code', 'strategy']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  tags: z.string().optional(),
  abstract: z.string().max(2000).optional(),
  body_md: z.string().min(20),
  code_snippet: z.string().optional(),
  author_name: z.string().min(2).max(120),
  source_url: z.string().url().optional().or(z.literal('')),
  admin_notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

function parseTags(input?: string): string[] {
  if (!input) return []
  return input
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 25)
}

export function AdminSubmissionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [serverError, setServerError] = useState<string | null>(null)

  const query = useQuery({
    queryKey: ['admin-submission', id],
    enabled: !!id,
    queryFn: () => getSubmissionAdmin(id!),
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      content_type: 'algorithm',
      difficulty: 'beginner',
      tags: '',
      abstract: '',
      body_md: '',
      code_snippet: '',
      author_name: '',
      source_url: '',
      admin_notes: '',
    },
  })

  const preview = useWatch({ control: form.control, name: 'body_md' })

  useEffect(() => {
    if (!query.data) return
    form.reset({
      title: query.data.title,
      content_type: query.data.content_type,
      difficulty: query.data.difficulty,
      tags: query.data.tags?.join(', ') ?? '',
      abstract: query.data.abstract ?? '',
      body_md: query.data.body_md ?? '',
      code_snippet: query.data.code_snippet ?? '',
      author_name: query.data.author_name ?? '',
      source_url: query.data.source_url ?? '',
      admin_notes: query.data.admin_notes ?? '',
    })
  }, [form, query.data])

  const saveMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!id) throw new Error('Missing id')
      return await updateSubmissionAdmin(id, {
        title: values.title,
        content_type: values.content_type,
        difficulty: values.difficulty,
        tags: parseTags(values.tags),
        abstract: values.abstract?.trim() ? values.abstract.trim() : null,
        body_md: values.body_md,
        code_snippet: values.code_snippet?.trim() ? values.code_snippet : null,
        author_name: values.author_name,
        source_url: values.source_url?.trim() ? values.source_url : null,
        admin_notes: values.admin_notes?.trim() ? values.admin_notes : null,
      })
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin-submission', id] })
      await qc.invalidateQueries({ queryKey: ['admin-submissions'] })
    },
  })

  const approveMutation = useMutation({
    mutationFn: async (notes?: string) => {
      if (!id) throw new Error('Missing id')
      return await approveSubmission(id, notes ?? null)
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin-submissions'] })
      navigate('/admin/submissions', { replace: true })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: async (notes?: string) => {
      if (!id) throw new Error('Missing id')
      await rejectSubmission(id, notes ?? null)
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin-submissions'] })
      navigate('/admin/submissions', { replace: true })
    },
  })

  if (query.isLoading) return <div className="text-sm text-slate-600">Loading…</div>
  if (query.isError || !query.data) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-soft">
        Submission not found. <Link to="/admin/submissions">Back to list</Link>
      </div>
    )
  }

  const submission = query.data

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Review submission</h1>
          <div className="text-xs text-slate-600">
            Status: <span className="font-medium">{submission.status}</span> · Submitted{' '}
            {new Date(submission.created_at).toLocaleString()}
          </div>
        </div>
        <Link to="/admin/submissions" className="text-sm">
          Back to list
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-soft"
          onSubmit={form.handleSubmit(async (values) => {
            setServerError(null)
            try {
              await saveMutation.mutateAsync(values)
            } catch (e) {
              setServerError(e instanceof Error ? e.message : 'Save failed')
            }
          })}
        >
          <div className="grid gap-3 md:grid-cols-12">
            <div className="md:col-span-8 space-y-1">
              <label className="text-xs font-medium text-slate-700">Title</label>
              <Input {...form.register('title')} />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-medium text-slate-700">Type</label>
              <Select {...form.register('content_type')}>
                {contentTypeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-medium text-slate-700">Difficulty</label>
              <Select {...form.register('difficulty')}>
                {difficultyOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Tags (comma-separated)</label>
            <Input {...form.register('tags')} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Abstract</label>
            <Textarea {...form.register('abstract')} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Body (Markdown + LaTeX)</label>
            <Textarea {...form.register('body_md')} className="min-h-64 font-mono text-xs" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Code snippet</label>
            <Textarea {...form.register('code_snippet')} className="min-h-40 font-mono text-xs" />
          </div>

          <div className="grid gap-3 md:grid-cols-12">
            <div className="md:col-span-5 space-y-1">
              <label className="text-xs font-medium text-slate-700">Author name</label>
              <Input {...form.register('author_name')} />
            </div>
            <div className="md:col-span-7 space-y-1">
              <label className="text-xs font-medium text-slate-700">Source URL</label>
              <Input {...form.register('source_url')} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Admin notes</label>
            <Textarea {...form.register('admin_notes')} placeholder="Visible to the submitter" />
          </div>

          {serverError && <div className="text-sm text-rose-700">{serverError}</div>}

          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="secondary" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving…' : 'Save changes'}
            </Button>

            <Button
              type="button"
              disabled={submission.status !== 'pending' || approveMutation.isPending}
              onClick={async () => {
                setServerError(null)
                try {
                  // Persist latest edits (best-effort) before approval
                  const v = form.getValues()
                  await saveMutation.mutateAsync(v)
                  await approveMutation.mutateAsync(v.admin_notes ?? undefined)
                } catch (e) {
                  setServerError(e instanceof Error ? e.message : 'Approval failed')
                }
              }}
            >
              {approveMutation.isPending ? 'Approving…' : 'Approve & publish'}
            </Button>

            <Button
              type="button"
              variant="danger"
              disabled={submission.status !== 'pending' || rejectMutation.isPending}
              onClick={async () => {
                setServerError(null)
                try {
                  const v = form.getValues()
                  await saveMutation.mutateAsync(v)
                  await rejectMutation.mutateAsync(v.admin_notes ?? undefined)
                } catch (e) {
                  setServerError(e instanceof Error ? e.message : 'Rejection failed')
                }
              }}
            >
              {rejectMutation.isPending ? 'Rejecting…' : 'Reject'}
            </Button>
          </div>
        </form>

        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-900">Preview</div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <Markdown value={preview || ''} />
          </div>
        </div>
      </div>
    </div>
  )
}

