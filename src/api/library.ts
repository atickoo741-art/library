import { supabase } from '../lib/supabaseClient'
import type { Difficulty, ContentType, SearchLibraryItemResult, LibraryItem } from '../lib/types'

export type SearchParams = {
  q?: string
  contentType?: ContentType | 'all'
  difficulty?: Difficulty | 'all'
  tags?: string[]
  sort?: 'relevance' | 'newest'
}

export async function searchLibraryItems(params: SearchParams): Promise<SearchLibraryItemResult[]> {
  const q = params.q?.trim() ?? ''

  const { data, error } = await supabase.rpc('search_library_items', {
    q,
    content_type: params.contentType && params.contentType !== 'all' ? params.contentType : null,
    difficulty: params.difficulty && params.difficulty !== 'all' ? params.difficulty : null,
    tags: params.tags && params.tags.length > 0 ? params.tags : null,
    sort: params.sort ?? 'relevance',
    limit_n: 50,
    offset_n: 0,
  })

  if (error) throw error
  return (data ?? []) as SearchLibraryItemResult[]
}

export async function getLibraryItemBySlug(slug: string): Promise<LibraryItem> {
  const { data, error } = await supabase.from('library_items').select('*').eq('slug', slug).single()
  if (error) throw error
  return data as LibraryItem
}

