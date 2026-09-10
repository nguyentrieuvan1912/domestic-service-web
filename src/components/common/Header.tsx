import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

type NavigationItem = {
  label: string
  to?: string
  children?: Array<{ label: string; to: string }>
}

const navigationItems: NavigationItem[] = [
  { label: 'Giới thiệu', to: '/about' },
  {
    label: 'Dịch vụ',
    children: [
      { label: 'Dọn dẹp theo ca', to: '/services/one-off' },
      { label: 'Dọn dẹp định kỳ', to: '/services/recurring' },
      { label: 'Tổng vệ sinh', to: '/services/deep-cleaning' },
      { label: 'Dịch vụ bổ sung', to: '/services/add-ons' },
    ],
  },
  { label: 'Khuyến mãi', to: '/promotions' },
  {
    label: 'Hợp tác',
    children: [
      { label: 'Trở thành Staff', to: '/cooperation' },
      { label: 'Tuyển dụng', to: '/cooperation/recruitment' },
      { label: 'Quy trình & quyền lợi', to: '/cooperation' },
    ],
  },
  {
    label: 'Blog',
    children: [
      { label: 'Blog / Tin tức', to: '/blog' },
      { label: 'Mẹo dọn dẹp', to: '/blog?category=cleaning-tips' },
      { label: 'Kiến thức gia đình', to: '/blog?category=family' },
    ],
  },
  {
    label: 'Hỗ trợ',
    children: [
      { label: 'FAQ', to: '/faq' },
      { label: 'Liên hệ', to: '/contact' },
      { label: 'Chính sách & điều khoản', to: '/terms' },
    ],
  },
]

function ChevronIcon({ open = false }: { open?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-2 w-2 rotate-45 border-b-2 border-r-2 transition-transform duration-200 ${open ? 'translate-y-0.5 -rotate-[135deg]' : '-translate-y-0.5'}`}
    />
  )
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenMenu(null)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenMenu(null)
        setMobileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  function closeNavigation() {
    setMobileOpen(false)
    setOpenMenu(null)
  }

  function toggleMenu(label: string) {
    setOpenMenu((current) => (current === label ? null : label))
  }

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" onClick={closeNavigation} className="group flex items-center gap-3" aria-label="CleanMaster - Trang chủ">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-black text-white shadow-sm transition group-hover:bg-emerald-700">
            C
          </span>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">CleanMaster</span>
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 lg:flex">
          {navigationItems.map((item) => (
            <div key={item.label} className="relative">
              {item.children ? (
                <button
                  type="button"
                  aria-expanded={openMenu === item.label}
                  aria-haspopup="true"
                  onClick={() => toggleMenu(item.label)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {item.label}
                  <ChevronIcon open={openMenu === item.label} />
                </button>
              ) : (
                <Link
                  to={item.to ?? '/'}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {item.label}
                </Link>
              )}

              {item.children && openMenu === item.label && (
                <div className="absolute left-0 top-full mt-2 min-w-56 origin-top rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                  {item.children.map((child) => (
                    <Link
                      key={child.to}
                      to={child.to}
                      onClick={closeNavigation}
                      className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/download" className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
            Tải ứng dụng
          </Link>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((current) => !current)}
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg border border-slate-200 text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 lg:hidden"
        >
          <span className={`h-0.5 w-5 bg-current transition-transform ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-5 bg-current transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-5 bg-current transition-transform ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {mobileOpen && (
        <nav aria-label="Điều hướng mobile" className="border-t border-slate-100 bg-white px-5 py-3 lg:hidden">
          {navigationItems.map((item) => (
            <div key={item.label} className="border-b border-slate-100 last:border-b-0">
              {item.children ? (
                <>
                  <button
                    type="button"
                    aria-expanded={openMenu === item.label}
                    onClick={() => toggleMenu(item.label)}
                    className="flex w-full items-center justify-between py-3 text-left font-semibold text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    {item.label}
                    <ChevronIcon open={openMenu === item.label} />
                  </button>
                  {openMenu === item.label && (
                    <div className="pb-2 pl-4">
                      {item.children.map((child) => (
                        <Link key={child.to} to={child.to} onClick={closeNavigation} className="block py-2 text-sm text-slate-600 hover:text-emerald-700">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link to={item.to ?? '/'} onClick={closeNavigation} className="block py-3 font-semibold text-slate-800 hover:text-emerald-700">
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <Link to="/download" onClick={closeNavigation} className="mt-4 block rounded-full bg-emerald-600 px-5 py-3 text-center text-sm font-bold text-white hover:bg-emerald-700">
            Tải ứng dụng
          </Link>
        </nav>
      )}
    </header>
  )
}
