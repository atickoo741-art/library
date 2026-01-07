import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { Button } from './Button'
import { cn } from '../lib/cn'

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'rounded-md px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900',
          isActive && 'bg-slate-100 text-slate-900',
        )
      }
    >
      {children}
    </NavLink>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, profile, isAdmin, signOut } = useAuth()

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm font-semibold tracking-tight no-underline">
              Quant Library
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              <NavItem to="/search">Search</NavItem>
              {user && <NavItem to="/submit">Submit</NavItem>}
              {user && <NavItem to="/my-submissions">My submissions</NavItem>}
              {isAdmin && <NavItem to="/admin">Admin</NavItem>}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden text-xs text-slate-600 md:inline">
                  {profile?.display_name ?? user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={() => void signOut()}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-slate-700 no-underline hover:underline">
                  Log in
                </Link>
                <Link to="/signup" className="text-sm font-medium text-slate-900 no-underline hover:underline">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-slate-500">
          Built with React, Tailwind, and Supabase.
        </div>
      </footer>
    </div>
  )
}

