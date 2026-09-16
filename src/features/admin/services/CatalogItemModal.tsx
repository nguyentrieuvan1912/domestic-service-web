import { useState } from 'react'
import type { FormEvent } from 'react'
import type { AddOn, Category, Service, ServicePackage } from '../../../data/mockAdminServices'

type CatalogItem = Category | ServicePackage | AddOn
type CatalogMode = 'category' | 'package' | 'addon'

type CatalogItemModalProps = {
  mode: CatalogMode
  item: CatalogItem | null
  services: Service[]
  onClose: () => void
  onSave: (item: CatalogItem) => void
}

const inputClassName = 'w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 transition-colors'
const labelClassName = 'block mb-2 text-sm font-semibold text-slate-700'

const titles: Record<CatalogMode, string> = {
  category: 'danh mục',
  package: 'gói dịch vụ',
  addon: 'dịch vụ bổ sung',
}

const createDraft = (mode: CatalogMode, item: CatalogItem | null, services: Service[]): CatalogItem => {
  if (item) return item
  if (mode === 'category') return { id: `category-${Date.now()}`, name: '', description: '', serviceCount: 0 }
  return { id: `${mode}-${Date.now()}`, serviceId: services[0]?.id ?? '', name: '', description: '', price: 0, duration: '', isActive: true }
}

export default function CatalogItemModal({ mode, item, services, onClose, onSave }: CatalogItemModalProps) {
  const [draft, setDraft] = useState(() => createDraft(mode, item, services))
  const isCategory = mode === 'category'
  const serviceItem = draft as ServicePackage | AddOn

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave(draft)
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()} />
      <section className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="catalog-modal-title">
        <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div><p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Thông tin {titles[mode]}</p><h2 id="catalog-modal-title" className="mt-1 text-xl font-bold text-slate-950">{item ? `Chỉnh sửa ${titles[mode]}` : `Thêm ${titles[mode]}`}</h2></div>
          <button type="button" onClick={onClose} aria-label="Đóng cửa sổ" className="flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-slate-400 transition hover:bg-slate-200 hover:text-slate-900">×</button>
        </header>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            <div><label className={labelClassName}>Tên</label><input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className={inputClassName} placeholder={`Nhập tên ${titles[mode]}`} /></div>
            <div><label className={labelClassName}>Mô tả</label><textarea required value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} rows={4} className={`${inputClassName} resize-none`} placeholder={`Nhập mô tả ${titles[mode]}`} /></div>
            {!isCategory && <>
              <div><label className={labelClassName}>Dịch vụ áp dụng</label><select value={serviceItem.serviceId} onChange={(event) => setDraft({ ...draft, serviceId: event.target.value })} className={inputClassName}>{services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select></div>
              <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClassName}>Giá tiền</label><input required min="0" type="number" value={serviceItem.price} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} className={inputClassName} placeholder="Nhập giá tiền" /></div><div><label className={labelClassName}>Thời lượng</label><input required value={serviceItem.duration} onChange={(event) => setDraft({ ...draft, duration: event.target.value })} className={inputClassName} placeholder="Ví dụ: 2 giờ" /></div></div>
            </>}
          </div>
          <footer className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4"><button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Hủy bỏ</button><button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">Lưu thay đổi</button></footer>
        </form>
      </section>
    </>
  )
}
