import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { identityRequest, saveSession } from '../../api/identity'
import type { AccountSession } from '../../api/identity'
import { useIdentitySession } from '../../hooks/useIdentitySession'

type Challenge = { challengeId: string; email: string; expiresAt: string; resendAt: string }
type Verified = { verificationToken: string; email: string; expiresAt: string }
export default function CustomerAuth({ register = false }: { register?: boolean }) {
  const auth = useIdentitySession('CUSTOMER')
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '', confirm: '' })
  const [step, setStep] = useState<'email' | 'code' | 'profile'>('email')
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [verified, setVerified] = useState<Verified | null>(null)
  const [code, setCode] = useState('')
  const [now, setNow] = useState(() => Date.now())
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer) }, [])
  if (auth.isAuthenticated) return <Navigate to="/account" replace />
  const update = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }))
  const send = async () => {
    const next = await identityRequest<Challenge>('/auth/register/email', { method: 'POST', body: JSON.stringify({ email: form.email.trim() }) })
    setChallenge(next); update('email', next.email); setVerified(null); setCode(''); setStep('code')
  }
  const run = async (action: () => Promise<void>) => {
    if (busy) return
    setBusy(true); setError('')
    try { await action() } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể xử lý yêu cầu.') } finally { setBusy(false) }
  }
  const submit = (event: FormEvent) => {
    event.preventDefault()
    void run(async () => {
      if (register && step === 'email') { await send(); return }
      if (register && step === 'code') {
        const result = await identityRequest<Verified>('/auth/register/verify', { method: 'POST', body: JSON.stringify({ challengeId: challenge?.challengeId, code }) })
        setVerified(result); setStep('profile'); return
      }
      if (register) {
        if (form.password !== form.confirm) throw new Error('Mật khẩu xác nhận không khớp.')
        const session = await identityRequest<AccountSession>('/auth/register', { method: 'POST', body: JSON.stringify({ fullName: form.fullName, phone: form.phone, password: form.password, verificationToken: verified?.verificationToken }) })
        saveSession('CUSTOMER', session)
      } else await auth.login(form.email, form.password)
      navigate('/account', { replace: true })
    })
  }
  const wait = challenge ? Math.max(0, Math.ceil((Date.parse(challenge.resendAt) - now) / 1000)) : 0
  const input = 'mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
  return <main className="bg-slate-50 px-5 py-16"><section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
    <p className="text-sm font-semibold text-emerald-600">CleanMaster</p><h1 className="mt-2 text-3xl font-bold text-slate-950">{register ? 'Đăng ký khách hàng' : 'Đăng nhập khách hàng'}</h1>
    {register && <p className="mt-3 text-sm text-slate-600">{step === 'email' ? 'Bước 1/3: Nhập Gmail để nhận mã xác thực.' : step === 'code' ? `Bước 2/3: Nhập mã 6 chữ số đã gửi đến ${challenge?.email}. Mã có hiệu lực 10 phút.` : `Bước 3/3: Gmail ${verified?.email} đã xác thực. Hoàn tất thông tin của bạn.`}</p>}
    <form onSubmit={submit} className="mt-6 space-y-4"><fieldset disabled={busy} className="space-y-4">
      {(!register || step === 'email') && <label className="block text-sm font-semibold text-slate-700">{register ? 'Gmail' : 'Email hoặc số điện thoại'}<input type={register ? 'email' : 'text'} autoComplete="username" required maxLength={254} value={form.email} onChange={event => update('email', event.target.value)} className={input} placeholder={register ? 'tenban@gmail.com' : undefined} /></label>}
      {register && step === 'code' && <><label className="block text-sm font-semibold text-slate-700">Mã xác thực<input inputMode="numeric" autoComplete="one-time-code" required pattern="[0-9]{6}" maxLength={6} value={code} onChange={event => setCode(event.target.value.replace(/[^0-9]/g, ''))} className={input} /></label><button type="button" disabled={wait > 0} onClick={() => { void run(send) }} className="text-sm font-semibold text-emerald-700 disabled:text-slate-400">{wait > 0 ? `Gửi lại mã sau ${wait}s` : 'Gửi lại mã'}</button></>}
      {register && step === 'profile' && <><label className="block text-sm font-semibold text-slate-700">Họ và tên<input autoComplete="name" required maxLength={160} value={form.fullName} onChange={event => update('fullName', event.target.value)} className={input} /></label>
      <label className="block text-sm font-semibold text-slate-700">Số điện thoại<input autoComplete="tel" type="tel" required pattern="(?:0[0-9]{9}|\+84[0-9]{9})" title="10 số bắt đầu bằng 0 hoặc +84 và 9 số" value={form.phone} onChange={event => update('phone', event.target.value)} className={input} /></label></>}
      {(!register || step === 'profile') && <label className="block text-sm font-semibold text-slate-700">Mật khẩu<input type="password" autoComplete={register ? 'new-password' : 'current-password'} required minLength={register ? 8 : undefined} maxLength={72} value={form.password} onChange={event => update('password', event.target.value)} className={input} /></label>}
      {register && step === 'profile' && <label className="block text-sm font-semibold text-slate-700">Xác nhận mật khẩu<input type="password" autoComplete="new-password" required minLength={8} maxLength={72} value={form.confirm} onChange={event => update('confirm', event.target.value)} className={input} /></label>}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}<button className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white disabled:opacity-50" type="submit">{busy ? 'Đang xử lý...' : !register ? 'Đăng nhập' : step === 'email' ? 'Tiếp theo' : step === 'code' ? 'Xác thực' : 'Tạo tài khoản'}</button>
      {register && step !== 'email' && <button type="button" onClick={() => { setStep('email'); setChallenge(null); setVerified(null); setError(''); setForm(current => ({ ...current, password: '', confirm: '' })) }} className="text-sm text-slate-600">Đổi Gmail / xác thực lại</button>}
    </fieldset></form><p className="mt-5 text-center text-sm text-slate-600">{register ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}<Link to={register ? '/login' : '/register'} className="font-semibold text-emerald-700">{register ? 'Đăng nhập' : 'Đăng ký'}</Link></p>
  </section></main>
}
