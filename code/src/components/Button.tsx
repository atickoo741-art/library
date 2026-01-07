import { forwardRef } from 'react'
import { cn } from '../lib/cn'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md border text-sm font-medium transition',
        'focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50',
        size === 'sm' ? 'h-9 px-3' : 'h-10 px-4',
        variant === 'primary' && 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800',
        variant === 'secondary' && 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
        variant === 'ghost' && 'border-transparent bg-transparent text-slate-700 hover:bg-slate-100',
        variant === 'danger' && 'border-rose-200 bg-rose-600 text-white hover:bg-rose-700',
        className,
      )}
      {...props}
    />
  )
})

