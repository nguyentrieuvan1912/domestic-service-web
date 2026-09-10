import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { type ServicePackage, servicePackages } from '../../data/services'

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
      <div role="dialog" aria-modal="true" aria-labelledby="app-download-title" className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-9" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-5">
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-black text-emerald-700">C</span>
            <h2 id="app-download-title" className="mt-5 text-2xl font-black tracking-tight text-slate-900">Đặt dịch vụ trên Mobile App</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng thông báo" className="flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">×</button>
        </div>
        <p className="mt-4 leading-7 text-slate-600">Tải ứng dụng CleanMaster để chọn thời gian, khu vực và xác nhận dịch vụ. Website hiện không thực hiện đặt lịch trực tiếp.</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link to="/download" onClick={onClose} className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white hover:bg-slate-800">App Store</Link>
          <Link to="/download" onClick={onClose} className="rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-bold text-white hover:bg-emerald-700">Google Play</Link>
        </div>
        <p className="mt-5 text-center text-xs text-slate-500">QR placeholder sẽ được cập nhật khi Mobile App sẵn sàng.</p>
      </div>
    </div>
  )
}

function ServiceCard({ service, onBook }: { service: ServicePackage; onBook: () => void }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
      <div className="relative overflow-hidden">
        <img src={service.imageUrl} alt={service.name} className="aspect-[1.6/1] w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm">{service.code.replaceAll('_', ' ')}</span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">{service.name}</h2>
        <p className="mt-3 leading-7 text-slate-600">{service.description}</p>
        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-slate-50 p-3"><dt className="text-xs font-semibold text-slate-500">Thời lượng</dt><dd className="mt-1 font-bold text-slate-900">{service.duration}</dd></div>
          <div className="rounded-xl bg-slate-50 p-3"><dt className="text-xs font-semibold text-slate-500">Phạm vi</dt><dd className="mt-1 font-bold text-slate-900">{service.areaRange}</dd></div>
        </dl>
        <div className="mt-6">
          <h3 className="text-sm font-bold text-slate-900">Phù hợp với</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{service.suitableFor}</p>
        </div>
        <div className="mt-6 border-t border-slate-100 pt-5">
          <h3 className="text-sm font-bold text-slate-900">Add-on đi kèm</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {service.addOns?.map((addOn) => <span key={addOn.id} className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">{addOn.name.replace('Vệ sinh ', '')}</span>)}
          </div>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3">
          <Link to={`/services/${service.slug}`} className="inline-flex items-center justify-center rounded-full border border-emerald-600 px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">Xem chi tiết</Link>
          <button type="button" onClick={onBook} className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">Đặt dịch vụ</button>
        </div>
      </div>
    </article>
  )
}

export default function Services() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="bg-slate-50">
      <section className="bg-[#f3faf7] px-5 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Dịch vụ CleanMaster</p>
          <div className="mt-4 grid gap-7 lg:grid-cols-[1fr_0.75fr] lg:items-end">
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">Chọn dịch vụ phù hợp với nhịp sống của gia đình.</h1>
            <p className="max-w-lg leading-7 text-slate-600">Từ dọn dẹp theo ca đến tổng vệ sinh, mỗi gói được thiết kế để không gian của bạn luôn sạch sẽ và dễ chịu.</p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:px-8">
        <div className="grid gap-7 lg:grid-cols-3">
          {servicePackages.map((service) => <ServiceCard key={service.id} service={service} onBook={() => setIsModalOpen(true)} />)}
        </div>
        <section className="mt-14 rounded-3xl border border-dashed border-emerald-300 bg-emerald-50 p-7 sm:p-9">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Dịch vụ bổ sung</p><h2 className="mt-2 text-2xl font-black text-slate-900">Chăm chút kỹ hơn cho từng góc nhỏ</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Sofa, rèm, nệm và thảm có thể được thêm vào gói dịch vụ phù hợp khi bạn đặt trên Mobile App.</p></div>
            <Link to="/services/add-ons" className="shrink-0 rounded-full border border-emerald-600 px-5 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">Xem chi tiết add-on</Link>
          </div>
        </section>
      </main>

      {isModalOpen && <AppDownloadModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
