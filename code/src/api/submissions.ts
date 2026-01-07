import { supabase } from '../lib/supabaseClient'
import type { Submission, SubmissionStatus } from '../lib/types'

export async function createSubmission(input: Omit<Submission, 'id' | 'status' | 'admin_notes' | 'reviewed_by' | 'reviewed_at' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase.from('submissions').insert(input).select('*').single()
  if (error) throw error
  return data as Submission
}

export async function listMySubmissions(): Promise<Submission[]> {
  const { data, error } = await supabase.from('submissions').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Submission[]
}

export async function listSubmissionsAdmin(status?: SubmissionStatus | 'all'): Promise<Submission[]> {
  let query = supabase.from('submissions').select('*').order('created_at', { ascending: false })
  if (status && status !== 'all') query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Submission[]
}

export async function getSubmissionAdmin(id: string): Promise<Submission> {
  const { data, error } = await supabase.from('submissions').select('*').eq('id', id).single()
  if (error) throw error
  return data as Submission
}

export async function updateSubmissionAdmin(id: string, patch: Partial<Submission>): Promise<Submission> {
  const { data, error } = await supabase.from('submissions').update(patch).eq('id', id).select('*').single()
  if (error) throw error
  return data as Submission
}

export async function approveSubmission(id: string, notes?: string | null): Promise<string> {
  const { data, error } = await supabase.rpc('approve_submission', { submission_id: id, notes: notes ?? null })
  if (error) throw error
  return data as unknown as string
}

export async function rejectSubmission(id: string, notes?: string | null): Promise<void> {
  const { error } = await supabase.rpc('reject_submission', { submission_id: id, notes: notes ?? null })
  if (error) throw error
}

