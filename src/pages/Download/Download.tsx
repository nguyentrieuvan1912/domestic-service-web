import { Link } from 'react-router-dom'
import Reveal from '../../components/common/Reveal'

function QRCard({ platform, caption }: { platform: string; caption: string }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="grid aspect-square w-full place-items-center rounded-xl bg-slate-950 p-3.5">
        <div className="grid h-full w-full grid-cols-7 grid-rows-7 gap-1 opacity-95">
          {Array.from({ length: 49 }, (_, index) => {
            const row = Math.floor(index / 7)
            const col = index % 7
            const isCorner = (row < 2 && col < 2) || (row < 2 && col > 4) || (row > 4 && col < 2)
            const filled = isCorner || (index * 13 + row * 5 + col) % 3 === 0
            return <span key={index} className={`rounded-[2px] ${filled ? 'bg-white' : 'bg-slate-800'}`} />
          })}
        </div>
      </div>
      <p className="mt-3 text-center text-sm font-black text-slate-900">{platform}</p>
      <p className="mt-1 text-center text-xs text-slate-500">{caption}</p>
    </div>
  )
}

const appHighlights = [
  'Trợ lý AI tư vấn 24/7 bằng Chat & Giọng nói',
  'Đặt lại nhanh với nhân viên yêu thích',
  'Chat & Gọi Video trực tiếp trong đơn hàng',
  'Quản lý lịch tuần & 30 khu vực TP.HCM cho Staff',
  'Ví điện tử & rút thu nhập tự động qua payOS',
  'Tùy biến giao diện Sáng / Tối & 6 màu nền',
]

export default function Download() {
  return (
    <div className="relative overflow-hidden bg-[#f3faf7]">
      <div className="cm-blob-drift pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-200/45 blur-3xl" />
      <main className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.85fr] lg:px-8 lg:py-24">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 shadow-sm">
            Ứng dụng di động CleanMaster
          </p>
          <h1 className="mt-5 max-w-xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
            Tải ứng dụng CleanMaster cho Khách hàng & Đối tác.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Đặt lịch chăm sóc tổ ấm, trò chuyện cùng Trợ lý AI giọng nói, gọi video bảo mật và quản lý công việc chỉ trên một ứng dụng duy nhất.
          </p>

          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {appHighlights.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm font-semibold text-slate-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid max-w-sm grid-cols-2 gap-4">
            <QRCard platform="App Store" caption="Dành cho iOS" />
            <QRCard platform="Google Play" caption="Dành cho Android" />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/services" className="rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700">
              Khám phá dịch vụ
            </Link>
            <Link to="/employee-guideline" className="rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 transition hover:border-emerald-500 hover:text-emerald-700">
              Hướng dẫn Staff dùng App
            </Link>
          </div>
        </Reveal>

        <Reveal delayMs={120} className="flex justify-center lg:justify-end">
          <div className="relative h-[580px] w-[290px] rounded-[3rem] border-[10px] border-slate-950 bg-slate-900 p-3 shadow-2xl shadow-emerald-950/20 sm:h-[640px] sm:w-[320px]">
            <div className="relative h-full overflow-hidden rounded-[2.2rem] bg-slate-50">
              <div className="flex items-center justify-between bg-emerald-600 px-5 pb-5 pt-8 text-white">
                <div>
                  <p className="text-xs text-emerald-100">Xin chào,</p>
                  <p className="mt-1 font-black">CleanMaster App</p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 font-black">C</span>
              </div>
              <div className="space-y-3 p-4">
                <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200/70">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Trợ lý AI 24/7</p>
                  <p className="mt-1.5 text-base font-black text-slate-900">Hỏi bằng giọng nói hoặc chat</p>
                  <div className="mt-3 h-2 rounded-full bg-emerald-200">
                    <div className="h-2 w-3/4 rounded-full bg-emerald-600" />
                  </div>
                </div>
                <p className="pt-1 text-xs font-black uppercase tracking-wider text-slate-500">Tính năng nổi bật</p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-xs font-black text-emerald-700">⚡</span>
                    <div>
                      <p className="text-xs font-extrabold text-slate-800">Đặt lại nhanh 1 chạm</p>
                      <p className="text-[10px] text-slate-500">Chọn nhân viên yêu thích</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-xs font-black text-sky-700">☎</span>
                    <div>
                      <p className="text-xs font-extrabold text-slate-800">Chat & Gọi Video</p>
                      <p className="text-[10px] text-slate-500">An toàn ngay trong đơn</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-xs font-black text-amber-700">☾</span>
                    <div>
                      <p className="text-xs font-extrabold text-slate-800">Sáng / Tối & 6 màu nền</p>
                      <p className="text-[10px] text-slate-500">Tùy chỉnh trong Tài khoản</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex justify-around border-t border-slate-200 bg-white px-2 py-3.5 text-[10px] font-bold text-emerald-700">
                <span>Trang chủ</span>
                <span>Cộng đồng</span>
                <span>Đơn hàng</span>
                <span>Tin nhắn</span>
                <span>Tài khoản</span>
              </div>
            </div>
            <div className="cm-float-slow absolute -right-8 top-24 hidden rounded-2xl border border-emerald-100 bg-white p-4 shadow-xl sm:block">
              <p className="text-xs text-slate-500">Trợ lý AI Voice</p>
              <p className="mt-1 font-black text-emerald-700">24/7</p>
            </div>
          </div>
        </Reveal>
      </main>
    </div>
  )
}
