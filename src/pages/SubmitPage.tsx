import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { createSubmission } from '../api/submissions'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { Textarea } from '../components/Textarea'
import { contentTypeOptions, difficultyOptions, type ContentType, type Difficulty } from '../lib/types'

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

export function SubmitPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

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
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!user) throw new Error('Not authenticated')
      return await createSubmission({
        title: values.title,
        content_type: values.content_type as ContentType,
        difficulty: values.difficulty as Difficulty,
        tags: parseTags(values.tags),
        abstract: values.abstract?.trim() ? values.abstract.trim() : null,
        body_md: values.body_md,
        code_snippet: values.code_snippet?.trim() ? values.code_snippet : null,
        author_name: values.author_name,
        source_url: values.source_url?.trim() ? values.source_url : null,
        submitted_by: user.id,
      })
    },
    onSuccess: () => {
      navigate('/my-submissions', { replace: true })
    },
  })

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">Submit an entry</h1>
        <p className="text-sm text-slate-700">
          Your submission will be reviewed by an admin. Approved items become public library entries.
        </p>
      </div>

      <form
        className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-soft"
        onSubmit={form.handleSubmit(async (values) => {
          setServerError(null)
          try {
            await mutation.mutateAsync(values)
          } catch (e) {
            setServerError(e instanceof Error ? e.message : 'Submission failed')
          }
        })}
      >
        <div className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-8 space-y-1">
            <label className="text-xs font-medium text-slate-700">Title</label>
            <Input {...form.register('title')} />
            {form.formState.errors.title && <div className="text-xs text-rose-700">{form.formState.errors.title.message}</div>}
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
          <Input {...form.register('tags')} placeholder="options, volatility, optimization" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Abstract</label>
          <Textarea {...form.register('abstract')} placeholder="Short summary (optional)" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Body (Markdown + LaTeX)</label>
          <Textarea
            {...form.register('body_md')}
            className="min-h-64 font-mono text-xs"
            placeholder={'Use Markdown. Inline math: $E=mc^2$. Block math:\n\n$$\\int_0^1 x\\,dx = 1/2$$'}
          />
          {form.formState.errors.body_md && <div className="text-xs text-rose-700">{form.formState.errors.body_md.message}</div>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Code snippet (optional)</label>
          <Textarea {...form.register('code_snippet')} className="min-h-40 font-mono text-xs" placeholder="Paste code here…" />
        </div>

        <div className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-5 space-y-1">
            <label className="text-xs font-medium text-slate-700">Author name</label>
            <Input {...form.register('author_name')} placeholder="Your name or attribution" />
            {form.formState.errors.author_name && (
              <div className="text-xs text-rose-700">{form.formState.errors.author_name.message}</div>
            )}
          </div>
          <div className="md:col-span-7 space-y-1">
            <label className="text-xs font-medium text-slate-700">Source URL (optional)</label>
            <Input {...form.register('source_url')} placeholder="https://…" />
            {form.formState.errors.source_url && (
              <div className="text-xs text-rose-700">{form.formState.errors.source_url.message}</div>
            )}
          </div>
        </div>

        {serverError && <div className="text-sm text-rose-700">{serverError}</div>}

        <div className="flex gap-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Submitting…' : 'Submit for review'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  )
}

