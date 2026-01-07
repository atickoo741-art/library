function requiredEnv(name: string, value: unknown): string {
  if (!value || typeof value !== 'string') throw new Error(`Missing required env var: ${name}`)
  return value
}

export const env = {
  supabaseUrl: requiredEnv('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
  supabaseAnonKey: requiredEnv('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY),
}

