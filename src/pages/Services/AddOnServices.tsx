import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { addOnPricingNote, addOnServices, type AddOnSlug } from '../../data/addons'

function AppDownloadModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5 py-8" role="presentation" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="addon-modal-title" className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">CleanMaster App</p>
            <h2 id="addon-modal-title" className="mt-2 text-2xl font-bold text-slate-900">Đặt dịch vụ trên ứng dụng</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng" className="text-2xl leading-none text-slate-400 hover:text-slate-700">×</button>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">Tải ứng dụng để chọn hạng mục, nhập kích thước và xem mức phí trước khi xác nhận.</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link to="/download" onClick={onClose} className="rounded-lg bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800">App Store</Link>
          <Link to="/download" onClick={onClose} className="rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700">Google Play</Link>
        </div>
      </div>
    </div>
  )
}

function CompactList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-slate-600 md:grid-cols-2">
      {items.slice(0, 6).map((item) => (
        <li key={item} className="flex items-start gap-2 leading-5">
          <span className="font-bold text-blue-600">✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function PricingBox({ service, onBook }: { service: typeof addOnServices[number]; onBook: () => void }) {
  return (
    <aside className="sticky top-28 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Bảng giá tham khảo</p>
      <h2 className="mt-2 text-lg font-bold text-slate-900">{service.pricingType}</h2>
      <div className="mt-3">
        {service.pricing.map((price) => (
          <div key={price.label} className="flex items-center justify-between gap-3 border-b border-gray-200 py-2 last:border-0">
            <div>
              <p className="text-sm text-slate-600">{price.label}</p>
              <p className="text-[11px] text-slate-400">{price.note}</p>
            </div>
            <p className="whitespace-nowrap text-sm font-semibold text-blue-600">{price.price}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">{addOnPricingNote}</p>
      <button type="button" onClick={onBook} className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Đặt dịch vụ</button>
    </aside>
  )
}

export default function AddOnServices() {
  const [activeTab, setActiveTab] = useState<AddOnSlug>('sofa')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const activeService = addOnServices.find((service) => service.slug === activeTab) ?? addOnServices[0]

  return (
    <div className="bg-white text-slate-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight">Vệ sinh Sofa - Rèm - Nệm - Thảm</h1>
          <p className="mt-2 text-sm text-slate-600">Dịch vụ vệ sinh bổ sung cho những bề mặt thường xuyên sử dụng trong gia đình.</p>
          <nav className="mt-5 flex gap-4 overflow-x-auto border-b border-gray-200" aria-label="Danh mục dịch vụ bổ sung">
            {addOnServices.map((service) => {
              const isActive = service.slug === activeTab
              return <button key={service.slug} type="button" role="tab" aria-selected={isActive} onClick={() => setActiveTab(service.slug)} className={`shrink-0 border-b-2 px-1 pb-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:border-blue-300 hover:text-blue-600'}`}>{service.shortName}</button>
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
          <section className="md:col-span-7">
            <img src={activeService.imageUrl} alt={activeService.name} className="w-full aspect-[7/3] object-cover rounded-xl shadow-sm bg-slate-100" />
            <h2 className="mt-5 text-2xl font-bold text-slate-900">{activeService.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{activeService.description}</p>
            <div className="mt-5">
              <h3 className="text-lg font-bold text-slate-900">Quy trình thực hiện</h3>
              <CompactList items={activeService.process} />
            </div>
            <div className="mt-5">
              <h3 className="text-lg font-bold text-slate-900">Tại sao chọn CleanMaster?</h3>
              <CompactList items={activeService.benefits} />
            </div>
          </section>
          <section className="md:col-span-5">
            <PricingBox service={activeService} onBook={() => setIsModalOpen(true)} />
          </section>
        </div>
      </main>

      {isModalOpen && <AppDownloadModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
