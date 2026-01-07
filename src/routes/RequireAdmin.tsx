import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export function RequireAdmin() {
  const { user, isAdmin, isLoading } = useAuth()

  if (isLoading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return <Outlet />
}

