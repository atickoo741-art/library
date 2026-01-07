/* eslint-disable react-refresh/only-export-components */
import { type Session, type User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { Profile } from '../lib/types'

type AuthContextValue = {
  session: Session | null
  user: User | null
  profile: Profile | null
  isAdmin: boolean
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function fetchOrCreateProfile(user: User): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (error) throw error
  if (data) return data as Profile

  const displayName =
    (user.user_metadata?.display_name as string | undefined) ??
    (user.email ? user.email.split('@')[0] : null)

  const { data: inserted, error: insertError } = await supabase
    .from('profiles')
    .insert({ id: user.id, display_name: displayName })
    .select('*')
    .single()

  if (insertError) throw insertError
  return inserted as Profile
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setSessionLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  const user = session?.user ?? null

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    enabled: !!user,
    queryFn: async () => fetchOrCreateProfile(user!),
  })

  const value = useMemo<AuthContextValue>(() => {
    const profile = (profileQuery.data ?? null) as Profile | null
    return {
      session,
      user,
      profile,
      isAdmin: profile?.role === 'admin',
      isLoading: sessionLoading || profileQuery.isLoading,
      signOut: async () => {
        await supabase.auth.signOut()
      },
    }
  }, [profileQuery.data, profileQuery.isLoading, session, sessionLoading, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}

