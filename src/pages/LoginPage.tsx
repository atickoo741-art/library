import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">Log in</h1>
        <p className="text-sm text-slate-700">Access submissions and admin review (if enabled).</p>
      </div>

      <form
        className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft"
        onSubmit={form.handleSubmit(async (values) => {
          setServerError(null)
          const { error } = await supabase.auth.signInWithPassword(values)
          if (error) {
            setServerError(error.message)
            return
          }
          navigate(from, { replace: true })
        })}
      >
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Email</label>
          <Input type="email" autoComplete="email" {...form.register('email')} />
          {form.formState.errors.email && <div className="text-xs text-rose-700">{form.formState.errors.email.message}</div>}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Password</label>
          <Input type="password" autoComplete="current-password" {...form.register('password')} />
          {form.formState.errors.password && (
            <div className="text-xs text-rose-700">{form.formState.errors.password.message}</div>
          )}
        </div>

        {serverError && <div className="text-xs text-rose-700">{serverError}</div>}

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <div className="text-sm text-slate-700">
        No account? <Link to="/signup">Create one</Link>.
      </div>
    </div>
  )
}

