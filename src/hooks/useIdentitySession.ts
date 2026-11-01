import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react'
import { identityRequest, loginAccount, logoutAccount, readSession, saveSession, sessionKey } from '../api/identity'
import type { AccountRole, AccountUser } from '../api/identity'

const subscribe = (notify: () => void) => {
  window.addEventListener('identity-session', notify)
  window.addEventListener('storage', notify)
  return () => { window.removeEventListener('identity-session', notify); window.removeEventListener('storage', notify) }
}
export function useIdentitySession(role: AccountRole) {
  const stored = useSyncExternalStore(subscribe, () => sessionStorage.getItem(sessionKey(role)), () => null)
  const session = useMemo(() => { void stored; return readSession(role) }, [stored, role])
  useEffect(() => {
    if (!session) return
    const timer = window.setTimeout(() => saveSession(role, null), Math.max(0, Date.parse(session.expiresAt) - Date.now()))
    return () => window.clearTimeout(timer)
  }, [session, role])
  const login = useCallback((identifier: string, password: string) => loginAccount(identifier, password, role), [role])
  const logout = useCallback(() => logoutAccount(role), [role])
  const validate = useCallback(async () => {
    const user = await identityRequest<AccountUser>('/auth/me', {}, role)
    if (user.role !== role) { saveSession(role, null); throw new Error('Tài khoản không có quyền truy cập.') }
    return user
  }, [role])
  return { session, isAuthenticated: !!session, login, logout, validate }
}
