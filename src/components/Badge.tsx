import { cn } from '../lib/cn'
import type { ContentType, Difficulty, SubmissionStatus } from '../lib/types'

export function ContentTypeBadge({ value }: { value: ContentType }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', 'border-slate-200 bg-white')}>
      {value}
    </span>
  )
}

export function DifficultyBadge({ value }: { value: Difficulty }) {
  const tone =
    value === 'beginner'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : value === 'intermediate'
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : 'border-rose-200 bg-rose-50 text-rose-800'
  return <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', tone)}>{value}</span>
}

export function SubmissionStatusBadge({ value }: { value: SubmissionStatus }) {
  const tone =
    value === 'pending'
      ? 'border-slate-200 bg-slate-50 text-slate-800'
      : value === 'approved'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
        : 'border-rose-200 bg-rose-50 text-rose-800'
  return <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', tone)}>{value}</span>
}

