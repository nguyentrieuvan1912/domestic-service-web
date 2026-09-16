import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../hooks/useAdminAuth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { isAuthenticated, login } = useAdminAuth()
  const [email, setEmail] = useState('admin@cleanmaster.vn')
  const [password, setPassword] = useState('cleanmaster')

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    login()
    navigate('/admin/dashboard', { replace: true })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-600">CleanMaster</p>
          <h1 className="text-3xl font-bold text-slate-950">Đăng nhập quản trị</h1>
          <p className="mt-2 text-sm text-slate-500">Truy cập trung tâm điều hành đa dịch vụ gia đình.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Mật khẩu
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <button type="submit" className="w-full rounded-lg bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-emerald-600">
            Đăng nhập
          </button>
        </form>
      </section>
    </main>
  )
}