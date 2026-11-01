import AvatarPicker from '../../components/common/AvatarPicker'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useIdentitySession } from '../../hooks/useIdentitySession'
import { identityRequest } from '../../api/identity'
import type { AccountUser } from '../../api/identity'

export default function Account() {
  const { session, isAuthenticated, logout } = useIdentitySession('CUSTOMER')
  const [user, setUser] = useState<(AccountUser & { avatar: string }) | null>(null)
  const [form, setForm] = useState({ fullName: '', phone: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    let active = true
    if (session) void identityRequest<AccountUser & { avatar: string }>('/auth/profile', {}, 'CUSTOMER').then(value => {
      if (active) { setUser(value); setForm({ fullName: value.fullName, phone: value.phone }) }
    }).catch(cause => { if (active) setError(cause.message) })
    return () => { active = false }
  }, [session])
  if (!isAuthenticated) return <Navigate to="/login" replace />
  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (busy) return
    setBusy(true); setError(''); setMessage('')
    try {
      const saved = await identityRequest<AccountUser & { avatar: string }>('/customer/profile', { method: 'PATCH', body: JSON.stringify(form) }, 'CUSTOMER')
      setUser(saved); setForm({ fullName: saved.fullName, phone: saved.phone }); setMessage('Đã lưu thông tin của bạn.')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa lưu được thông tin.') }
    finally { setBusy(false) }
  }
  const input = 'mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500'
  return <main className="bg-slate-50 px-5 py-16"><section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><h1 className="text-3xl font-bold text-slate-950">Tài khoản của tôi</h1>
    {error && <p role="alert" className="mt-4 text-red-600">{error}</p>}{message && <p role="status" className="mt-4 text-emerald-700">{message}</p>}
    {user && <div className="mt-6"><AvatarPicker value={user.avatar} disabled={busy} onChange={async avatar => {
      setBusy(true); setError(''); setMessage('')
      try { const saved = await identityRequest<AccountUser & { avatar: string }>('/auth/avatar', { method: 'PATCH', body: JSON.stringify({ avatar }) }, 'CUSTOMER'); setUser(saved); setMessage('Đã cập nhật ảnh đại diện.') } finally { setBusy(false) }
    }} /></div>}
    {user ? <form className="my-6 space-y-4" onSubmit={save}><fieldset disabled={busy} className="space-y-4">
      <label className="block text-sm text-slate-700">Họ và tên<input className={input} autoComplete="name" required maxLength={160} value={form.fullName} onChange={event => setForm(current => ({ ...current, fullName: event.target.value }))} /></label>
      <div className="text-sm text-slate-700">Gmail đã xác thực<p className="mt-2 font-semibold">{user.email}</p></div>
      <label className="block text-sm text-slate-700">Số điện thoại<input className={input} autoComplete="tel" type="tel" required pattern="(?:0[0-9]{9}|\+84[0-9]{9})" value={form.phone} onChange={event => setForm(current => ({ ...current, phone: event.target.value }))} /></label>
      <button type="submit" className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
    </fieldset></form> : !error && <p className="my-6" role="status">Đang tải tài khoản...</p>}
    <button disabled={busy} onClick={() => { void logout().catch(() => setError('Đã thoát trên trình duyệt; không kết nối được backend để thu hồi phiên.')) }} className="mt-4 rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700">Đăng xuất</button>
  </section></main>
}
