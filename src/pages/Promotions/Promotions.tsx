import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { promotions, type Promotion } from '../../data/promotions'

function AppDownloadModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-5 py-8 backdrop-blur-sm" role="presentation" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="promotion-app-title" className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-9" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-5">
          <div><span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-black text-emerald-700">C</span><h2 id="promotion-app-title" className="mt-5 text-2xl font-black tracking-tight text-slate-900">Dùng ưu đãi trên Mobile App</h2></div>
          <button type="button" onClick={onClose} aria-label="Đóng thông báo" className="flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">×</button>
        </div>
        <p className="mt-4 leading-7 text-slate-600">Mã ưu đãi sẽ được áp dụng khi bạn chọn dịch vụ và xác nhận trên ứng dụng CleanMaster.</p>
        <div className="mt-6 grid grid-cols-2 gap-3"><Link to="/download" onClick={onClose} className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white hover:bg-slate-800">App Store</Link><Link to="/download" onClick={onClose} className="rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-bold text-white hover:bg-emerald-700">Google Play</Link></div>
      </div>
    </div>
  )
}

function PromotionCard({ promotion, onUse }: { promotion: Promotion; onUse: () => void }) {
  const [copied, setCopied] = useState(false)
  const endDate = new Date(promotion.endsAt).toLocaleDateString('vi-VN')

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(promotion.code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <article className="relative overflow-hidden rounded-3xl border-2 border-dashed border-emerald-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-900/10">
      <div className={`relative bg-gradient-to-br ${promotion.tone} px-6 py-7 text-white sm:px-8`}>
        <span className="absolute -right-7 -top-8 text-8xl opacity-10" aria-hidden="true">✦</span>
        <div className="relative flex items-start justify-between gap-4"><span className="text-4xl font-black tracking-tight">{promotion.discountLabel}</span><span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{promotion.status === 'ACTIVE' ? 'Đang áp dụng' : promotion.status}</span></div>
        <h2 className="relative mt-5 text-xl font-black">{promotion.title}</h2>
        <p className="relative mt-2 text-sm leading-6 text-white/75">{promotion.description}</p>
      </div>
      <div className="relative p-6 sm:p-8">
        <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-slate-50" /><div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-slate-50" />
        <dl className="space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-slate-500">Mã ưu đãi</dt><dd className="font-black tracking-wider text-slate-900">{promotion.code}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Hạn sử dụng</dt><dd className="font-bold text-slate-900">{endDate}</dd></div><div><dt className="text-slate-500">Điều kiện áp dụng</dt><dd className="mt-1 leading-6 text-slate-700">{promotion.terms}</dd></div></dl>
        <div className="mt-6 grid grid-cols-2 gap-3"><button type="button" onClick={copyCode} className="rounded-xl border border-slate-300 px-3 py-3 text-sm font-bold text-slate-800 transition hover:border-emerald-500 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">{copied ? 'Đã copy' : 'Copy mã'}</button><button type="button" onClick={onUse} className="rounded-xl bg-emerald-600 px-3 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">Dùng ngay</button></div>
      </div>
    </article>
  )
}

export default function Promotions() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="bg-slate-50">
      <section className="bg-[#f3faf7] px-5 py-16 sm:py-20 lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Ưu đãi CleanMaster</p><h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">Chăm sóc tổ ấm, nhận thêm nhiều niềm vui.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Lưu lại mã ưu đãi yêu thích và dùng ngay trên Mobile App khi bạn sẵn sàng đặt dịch vụ.</p></div></section>
      <main className="mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:px-8"><div className="grid gap-7 md:grid-cols-2">{promotions.map((promotion) => <PromotionCard key={promotion.id} promotion={promotion} onUse={() => setIsModalOpen(true)} />)}</div><div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm leading-6 text-slate-600">Mã ưu đãi chỉ được áp dụng theo điều kiện tương ứng và xác nhận trên Mobile App.</div></main>
      {isModalOpen && <AppDownloadModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
