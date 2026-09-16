import { useCallback, useEffect, useState } from 'react'

export const ADMIN_SESSION_KEY = 'cleanmaster_admin_session'

export type AdminSession = {
  isAuthenticated: boolean
  role: 'ADMIN'
}

const readSession = (): AdminSession | null => {
  const storedSession = localStorage.getItem(ADMIN_SESSION_KEY)

  if (!storedSession) {
    return null
  }

  try {
    return JSON.parse(storedSession) as AdminSession
  } catch {
    localStorage.removeItem(ADMIN_SESSION_KEY)
    return null
  }
}

export function useAdminAuth() {
  const [session, setSession] = useState<AdminSession | null>(() => readSession())

  const login = useCallback(() => {
    const nextSession: AdminSession = {
      isAuthenticated: true,
      role: 'ADMIN',
    }

    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(nextSession))
    setSession(nextSession)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_SESSION_KEY)
    setSession(null)
  }, [])

  useEffect(() => {
    const handleStorageChange = () => setSession(readSession())

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return {
    session,
    isAuthenticated: session?.isAuthenticated === true,
    login,
    logout,
  }
}