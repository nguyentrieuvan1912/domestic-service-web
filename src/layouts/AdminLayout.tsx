import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../hooks/useAdminAuth'

const menuItems = [
  { label: 'Tổng quan', path: '/admin/dashboard' },
  { label: 'Dịch vụ', path: '/admin/services' },
  { label: 'Ứng viên tuyển dụng', path: '/admin/candidates' },
  { label: 'Nhân viên', path: '/admin/staff' },
  { label: 'Khách hàng', path: '/admin/customers' },
  { label: 'Đơn đặt dịch vụ', path: '/admin/bookings' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const { logout } = useAdminAuth()

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 text-slate-900">
      <aside className="flex h-full w-full shrink-0 flex-col bg-slate-950 text-slate-300 lg:w-56">
        <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 font-bold text-slate-950">C</div>
          <div>
            <p className="font-semibold tracking-wide text-white">CleanMaster</p>
            <p className="text-xs text-slate-500">Trung tâm quản trị</p>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto p-4 lg:flex-1 lg:flex-col" aria-label="Điều hướng quản trị">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-emerald-400 text-slate-950' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Cổng quản trị</p>
            <p className="mt-1 text-sm text-slate-500">Quản trị nền tảng dịch vụ gia đình</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">AD</div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              Đăng xuất
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}