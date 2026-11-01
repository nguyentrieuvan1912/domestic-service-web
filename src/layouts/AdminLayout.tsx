import AdminAvatar from '../components/admin/AdminAvatar'
import { AdminInboxContext } from '../components/admin/AdminInboxContext'
import AdminInbox, { InboxBell } from '../components/admin/AdminInbox'
import { useAdminInbox } from '../hooks/useAdminInbox'
import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../hooks/useAdminAuth'

const menuItems = [
  { label: 'Tổng quan', path: '/admin/dashboard' },
  { label: 'Dịch vụ', path: '/admin/services' },
  { label: 'Ứng viên tuyển dụng', path: '/admin/candidates' },
  { label: 'Nhân viên', path: '/admin/staff' },
  { label: 'Khách hàng', path: '/admin/customers' },
  { label: 'Đơn đặt dịch vụ', path: '/admin/bookings' },
  { label: 'Khuyến mãi', path: '/admin/promotions' },
  { label: 'Tài chính & Giao dịch', path: '/admin/transactions' },
  { label: 'Đánh giá & Hỗ trợ', path: '/admin/reviews' },
  { label: 'Thống kê & Báo cáo', path: '/admin/analytics' },
]

const menuIcons = [
  'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  'M4 7h16v14H4z M8 7V3h8v4 M4 12h16 M10 12v3h4v-3',
  'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M17 8l2 2 3-3',
  'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M17 4a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-4',
  'M20 21v-2a7 7 0 0 0-14 0v2 M13 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  'M5 5h14v16H5z M9 3h6v4H9z M9 12h6 M9 16h6',
  'M3 12V3h9l9 9-9 9z M7 7h.01',
  'M3 5h18v15H3z M3 9h18 M15 14h3',
  'M21 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3z M7 8h10 M7 12h7',
  'M4 3v18h17 M8 17v-5 M13 17V7 M18 17v-8',
]

function MenuDots() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const inbox = useAdminInbox()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('admin-sidebar-collapsed') === 'true' } catch { return false }
  })
  const [drawerRoute, setDrawerRoute] = useState<string | null>(null)
  const drawerOpen = drawerRoute === location.key
  const sidebarRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!drawerOpen) return
    const sidebar = sidebarRef.current
    const first = Array.from(sidebar?.querySelectorAll<HTMLButtonElement>('button') || []).find(button => button.getClientRects().length)
    first?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setDrawerRoute(null); menuButtonRef.current?.focus() }
      if (event.key !== 'Tab' || !sidebar) return
      const controls = Array.from(sidebar.querySelectorAll<HTMLElement>('a, button')).filter(element => element.getClientRects().length)
      const firstControl = controls[0], lastControl = controls.at(-1)
      if (event.shiftKey && document.activeElement === firstControl) { event.preventDefault(); lastControl?.focus() }
      else if (!event.shiftKey && document.activeElement === lastControl) { event.preventDefault(); firstControl?.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [drawerOpen])
  const toggleSidebar = () => {
    setCollapsed(value => {
      try { localStorage.setItem('admin-sidebar-collapsed', String(!value)) } catch { /* Keep the current tab usable when storage is unavailable. */ }
      return !value
    })
  }
  useEffect(() => {
    if (!location.hash) return
    let frame = 0
    const scroll = () => {
      const target = document.getElementById(location.hash.slice(1))
      if (!target) return false
      frame = requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }))
      return true
    }
    if (scroll()) return () => cancelAnimationFrame(frame)
    const observer = new MutationObserver(() => { if (scroll()) observer.disconnect() })
    observer.observe(document.querySelector('main') || document.body, { childList: true, subtree: true })
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [location.pathname, location.hash])
  const { logout } = useAdminAuth()

  const handleLogout = async () => {
    try { await logout() } catch { /* Browser session is cleared even when the server is unavailable. */ }
    navigate('/admin/login', { replace: true })
  }

  return (
    <AdminInboxContext.Provider value={inbox.snapshot}><div className="flex h-dvh w-full overflow-hidden bg-slate-100 text-slate-900">
      {drawerOpen && <button type="button" tabIndex={-1} aria-label="Đóng menu quản trị" onClick={() => { setDrawerRoute(null); menuButtonRef.current?.focus() }} className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm md:hidden" />}
      <aside ref={sidebarRef} id="admin-navigation" aria-label="Menu quản trị" className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 text-slate-300 transition-[width,transform] duration-200 motion-reduce:transition-none md:visible md:static md:translate-x-0 ${drawerOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'} ${collapsed ? 'md:w-20' : 'md:w-64'}`}>
        <div className={`flex min-h-20 items-center gap-3 border-b border-slate-800 px-4 py-4 ${collapsed ? 'md:justify-center md:px-2' : ''}`}>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400 font-bold text-slate-950 ${collapsed ? 'md:hidden' : ''}`}>C</div>
          <div className={`min-w-0 flex-1 ${collapsed ? 'md:hidden' : ''}`}>
            <p className="font-semibold tracking-wide text-white">CleanMaster</p>
            <p className="text-xs text-slate-500">Trung tâm quản trị</p>
          </div>
          <button type="button" onClick={toggleSidebar} aria-controls="admin-navigation" aria-expanded={!collapsed} aria-label={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'} title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'} className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-emerald-400 md:inline-flex"><MenuDots /></button>
          <button type="button" onClick={() => { setDrawerRoute(null); menuButtonRef.current?.focus() }} aria-label="Đóng menu" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:bg-slate-800 md:hidden"><MenuDots /></button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto overflow-x-hidden p-3" aria-label="Điều hướng quản trị">
          {menuItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.label}
              aria-label={item.label}
              onClick={() => setDrawerRoute(null)}
              className={({ isActive }) =>
                `relative flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-emerald-400 ${collapsed ? 'md:justify-center md:px-2' : ''} ${
                  isActive ? 'bg-emerald-400 text-slate-950' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`
              }
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0"><path d={menuIcons[index]} /></svg>
              <span className={`flex-1 ${collapsed ? 'md:sr-only' : ''}`}>{item.label}</span>{(inbox.snapshot.pending[item.path.split('/').at(-1)!] || 0) > 0 && <span aria-label={`${inbox.snapshot.pending[item.path.split('/').at(-1)!]} việc cần xử lý`} className={`ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-bold leading-5 text-white ${collapsed ? 'md:absolute md:right-0 md:top-0' : ''}`}>{inbox.snapshot.pending[item.path.split('/').at(-1)!] > 99 ? '99+' : inbox.snapshot.pending[item.path.split('/').at(-1)!]}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex min-h-20 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3.5 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button ref={menuButtonRef} type="button" onClick={() => setDrawerRoute(location.key)} aria-label="Mở menu quản trị" aria-controls="admin-navigation" aria-expanded={drawerOpen} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 md:hidden"><MenuDots /></button>
            <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Cổng quản trị</p>
            <p className="mt-0.5 hidden text-xs font-medium text-slate-500 sm:block">Quản trị nền tảng dịch vụ gia đình CleanMaster</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <InboxBell unread={inbox.snapshot.unread} open={inbox.openInbox} />
            <AdminAvatar />
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              Đăng xuất
            </button>
          </div>
        </header>
        {(inbox.error || inbox.snapshot.unavailableSources.length > 0) && <div role="status" className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-xs text-amber-900">Một số thông báo chưa cập nhật; số đếm đang giữ theo lần đồng bộ gần nhất. <button type="button" onClick={inbox.refresh} className="font-semibold underline">Thử lại</button></div>}
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <AdminInbox inbox={inbox} />
    </div></AdminInboxContext.Provider>
  )
}
