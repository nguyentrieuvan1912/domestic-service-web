import { Link } from 'react-router-dom'

const serviceLinks = [
  { label: 'Dọn dẹp theo ca', to: '/services/one-off' },
  { label: 'Dọn dẹp định kỳ', to: '/services/recurring' },
  { label: 'Tổng vệ sinh', to: '/services/deep-cleaning' },
  { label: 'Dịch vụ bổ sung', to: '/services/add-ons' },
]

const supportLinks = [
  { label: 'FAQ', to: '/faq' },
  { label: 'Liên hệ', to: '/contact' },
  { label: 'Điều khoản sử dụng', to: '/terms' },
  { label: 'Chính sách bảo mật', to: '/privacy' },
]

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 text-white" aria-label="CleanMaster - Trang chủ">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-lg font-black">C</span>
            <span className="text-xl font-extrabold tracking-tight">CleanMaster</span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
            Nền tảng kết nối gia đình với đội ngũ giúp việc được tuyển chọn, minh bạch và tận tâm.
          </p>
          <div className="mt-6 flex gap-3" aria-label="Mạng xã hội">
            {['Facebook', 'TikTok', 'Zalo'].map((social) => (
              <a key={social} href="#social" className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-emerald-400 hover:text-emerald-300">
                {social}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Dịch vụ</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {serviceLinks.map((link) => (
              <li key={link.to}><Link to={link.to} className="transition hover:text-emerald-300">{link.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Khám phá</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link to="/about" className="transition hover:text-emerald-300">Về CleanMaster</Link></li>
            <li><Link to="/promotions" className="transition hover:text-emerald-300">Khuyến mãi</Link></li>
            <li><Link to="/cooperation" className="transition hover:text-emerald-300">Hợp tác cùng chúng tôi</Link></li>
            <li><Link to="/blog" className="transition hover:text-emerald-300">Blog / Tin tức</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Hỗ trợ</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {supportLinks.map((link) => (
              <li key={link.to}><Link to={link.to} className="transition hover:text-emerald-300">{link.label}</Link></li>
            ))}
          </ul>
          <div className="mt-5 space-y-1 text-sm text-slate-400">
            <p>Hotline: 1900 0000</p>
            <p>Email: hello@cleanmaster.vn</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} CleanMaster. All rights reserved.</p>
          <p>Giải pháp giúp việc gia đình thông minh</p>
        </div>
      </div>
    </footer>
  )
}
