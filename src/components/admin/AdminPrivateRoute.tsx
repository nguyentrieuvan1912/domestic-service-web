import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { useEffect, useState } from 'react'

export default function AdminPrivateRoute() {
  const location = useLocation()
  const { isAuthenticated, session, validate } = useAdminAuth()
  const [verifiedToken, setVerifiedToken] = useState('')
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    if (session) void validate().then(() => { if (active) { setVerifiedToken(session.accessToken); setError('') } }).catch(cause => { if (active) setError(cause.message) })
    return () => { active = false }
  }, [session, validate, attempt])

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  if (verifiedToken !== session?.accessToken) return <div className="p-8 text-slate-700">{error ? <><p role="alert">{error}</p><button className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-white" onClick={() => setAttempt(value => value + 1)}>Thử lại</button></> : <p role="status">Đang kiểm tra phiên đăng nhập...</p>}</div>
  return <Outlet />
}
