export type ProfileRole = 'admin' | 'user'
export type ContentType = 'algorithm' | 'formula' | 'proof' | 'paper' | 'code' | 'strategy'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type PublishStatus = 'published' | 'archived'
export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export type Profile = {
  id: string
  display_name: string | null
  role: ProfileRole
  created_at: string
}

export type LibraryItem = {
  id: string
  title: string
  slug: string
  content_type: ContentType
  difficulty: Difficulty
  tags: string[]
  abstract: string | null
  body_md: string | null
  code_snippet: string | null
  author_name: string
  source_url: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  publish_status: PublishStatus
}

export type SearchLibraryItemResult = LibraryItem & { rank: number }

export type Submission = {
  id: string
  title: string
  content_type: ContentType
  difficulty: Difficulty
  tags: string[]
  abstract: string | null
  body_md: string | null
  code_snippet: string | null
  author_name: string
  source_url: string | null
  submitted_by: string
  status: SubmissionStatus
  admin_notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

export const contentTypeOptions: { value: ContentType; label: string }[] = [
  { value: 'algorithm', label: 'Algorithm' },
  { value: 'formula', label: 'Formula' },
  { value: 'proof', label: 'Proof' },
  { value: 'paper', label: 'Paper' },
  { value: 'code', label: 'Code' },
  { value: 'strategy', label: 'Strategy' },
]

export const difficultyOptions: { value: Difficulty; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

