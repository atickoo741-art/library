import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

const schema = z
  .object({
    displayName: z.string().min(2).max(64),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((v) => v.password === v.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' })

type FormValues = z.infer<typeof schema>

export function SignupPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: '', email: '', password: '', confirmPassword: '' },
  })

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">Sign up</h1>
        <p className="text-sm text-slate-700">Create an account to submit entries for review.</p>
      </div>

      <form
        className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft"
        onSubmit={form.handleSubmit(async (values) => {
          setServerError(null)
          setSuccess(null)
          const { error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
              data: { display_name: values.displayName },
            },
          })
          if (error) {
            setServerError(error.message)
            return
          }
          setSuccess('Account created. You can now log in.')
          navigate('/login', { replace: true })
        })}
      >
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Display name</label>
          <Input {...form.register('displayName')} />
          {form.formState.errors.displayName && (
            <div className="text-xs text-rose-700">{form.formState.errors.displayName.message}</div>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Email</label>
          <Input type="email" autoComplete="email" {...form.register('email')} />
          {form.formState.errors.email && <div className="text-xs text-rose-700">{form.formState.errors.email.message}</div>}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Password</label>
          <Input type="password" autoComplete="new-password" {...form.register('password')} />
          {form.formState.errors.password && (
            <div className="text-xs text-rose-700">{form.formState.errors.password.message}</div>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Confirm password</label>
          <Input type="password" autoComplete="new-password" {...form.register('confirmPassword')} />
          {form.formState.errors.confirmPassword && (
            <div className="text-xs text-rose-700">{form.formState.errors.confirmPassword.message}</div>
          )}
        </div>

        {serverError && <div className="text-xs text-rose-700">{serverError}</div>}
        {success && <div className="text-xs text-emerald-700">{success}</div>}

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Creating…' : 'Create account'}
        </Button>
      </form>

      <div className="text-sm text-slate-700">
        Already have an account? <Link to="/login">Log in</Link>.
      </div>
    </div>
  )
}

