import { supabase } from '../lib/supabaseClient'
import type { LibraryItem, PublishStatus } from '../lib/types'

export async function listLibraryItemsAdmin(): Promise<LibraryItem[]> {
  const { data, error } = await supabase.from('library_items').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as LibraryItem[]
}

export async function updateLibraryItemAdmin(id: string, patch: Partial<LibraryItem>): Promise<LibraryItem> {
  const { data, error } = await supabase.from('library_items').update(patch).eq('id', id).select('*').single()
  if (error) throw error
  return data as LibraryItem
}

export async function deleteLibraryItemAdmin(id: string): Promise<void> {
  const { error } = await supabase.from('library_items').delete().eq('id', id)
  if (error) throw error
}

export function toggleStatus(next: PublishStatus): PublishStatus {
  return next === 'published' ? 'archived' : 'published'
}

