import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Category, DynamicField, DynamicFieldType, Service } from '../../../data/mockAdminServices'

type ServiceModalProps = {
  service: Service | null
  categories: Category[]
  onClose: () => void
  onSave: (service: Service) => void
}

const inputClassName = 'w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 transition-colors'
const labelClassName = 'block mb-2 text-sm font-semibold text-slate-700'

const createEmptyField = (): DynamicField => ({ id: `field-${Date.now()}`, fieldName: '', fieldType: 'text', isRequired: false })

const createDraft = (service: Service | null, categories: Category[]): Service => service ?? {
  id: `service-${Date.now()}`,
  name: '',
  description: '',
  categoryId: categories[0]?.id ?? '',
  categoryName: categories[0]?.name ?? '',
  icon: 'DV',
  isActive: true,
  dynamicFields: [],
}

export default function ServiceModal({ service, categories, onClose, onSave }: ServiceModalProps) {
  const [draft, setDraft] = useState(() => createDraft(service, categories))

  const updateField = (fieldId: string, changes: Partial<DynamicField>) => setDraft((current) => ({ ...current, dynamicFields: current.dynamicFields.map((field) => field.id === fieldId ? { ...field, ...changes } : field) }))
  const addField = () => setDraft((current) => ({ ...current, dynamicFields: [...current.dynamicFields, createEmptyField()] }))
  const removeField = (fieldId: string) => setDraft((current) => ({ ...current, dynamicFields: current.dynamicFields.filter((field) => field.id !== fieldId) }))
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); onSave(draft) }

  return (
    <>
      <div className="fixed inset-0 w-screen h-screen z-40 bg-slate-900/50 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()} />
      <section className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
        <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4"><div><p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Cấu hình dịch vụ</p><h2 id="service-modal-title" className="mt-1 text-xl font-bold text-slate-950">{service ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}</h2></div><button type="button" onClick={onClose} aria-label="Đóng cửa sổ" className="flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-slate-400 transition hover:bg-slate-200 hover:text-slate-900">×</button></header>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
            <section><h3 className="font-semibold text-slate-900">Thông tin cơ bản</h3><div className="mt-4 grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><label className={labelClassName}>Tên dịch vụ</label><input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className={inputClassName} placeholder="Ví dụ: Tổng vệ sinh nhà" /></div><div><label className={labelClassName}>Danh mục</label><select value={draft.categoryId} onChange={(event) => { const category = categories.find((item) => item.id === event.target.value); setDraft({ ...draft, categoryId: event.target.value, categoryName: category?.name ?? '' }) }} className={inputClassName}>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div><div><label className={labelClassName}>Mã biểu tượng / hình ảnh</label><input value={draft.icon} onChange={(event) => setDraft({ ...draft, icon: event.target.value.slice(0, 3).toUpperCase() })} className={inputClassName} placeholder="DV" /></div><div className="sm:col-span-2"><label className={labelClassName}>Mô tả</label><textarea required value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} rows={3} className={`${inputClassName} resize-none`} placeholder="Mô tả ngắn về dịch vụ" /></div></div></section>
            <section><div><h3 className="font-semibold text-slate-900">Cấu hình biểu mẫu động</h3><p className="mt-1 text-sm text-slate-500">Các trường này sẽ xuất hiện trong biểu mẫu đặt dịch vụ của khách hàng.</p></div><div className="mt-4">{draft.dynamicFields.length === 0 && <div className="mb-4 rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">Chưa có trường dữ liệu. Hãy thêm trường đầu tiên.</div>}{draft.dynamicFields.map((field, index) => <div key={field.id} className="relative mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="mb-4 flex items-center justify-between pr-10"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trường {index + 1}</span></div><button type="button" onClick={() => removeField(field.id)} aria-label={`Xóa trường ${index + 1}`} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 transition hover:bg-rose-100 hover:text-rose-700"><svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M6 7l1 13h10l1-13" /><path d="M9 7V4h6v3" /></svg></button><div className="grid gap-4"><div><label className={labelClassName}>Tên trường</label><input required value={field.fieldName} onChange={(event) => updateField(field.id, { fieldName: event.target.value })} className={inputClassName} placeholder="Ví dụ: Độ tuổi của bé" /></div><div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClassName}>Loại trường</label><select value={field.fieldType} onChange={(event) => updateField(field.id, { fieldType: event.target.value as DynamicFieldType })} className={inputClassName}><option value="text">Văn bản</option><option value="number">Số</option><option value="select">Danh sách lựa chọn</option></select></div><label className="flex items-center gap-2 self-end pb-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={field.isRequired} onChange={(event) => updateField(field.id, { isRequired: event.target.checked })} className="h-4 w-4 accent-emerald-600" /> Bắt buộc</label></div>{field.fieldType === 'select' && <div><label className={labelClassName}>Các lựa chọn</label><input value={field.options?.join(', ') ?? ''} onChange={(event) => updateField(field.id, { options: event.target.value.split(',').map((option) => option.trim()).filter(Boolean) })} className={inputClassName} placeholder="Ví dụ: 1 HP, 1.5 HP, 2 HP" /></div>}</div></div>)}</div><button type="button" onClick={addField} className="w-full border-2 border-dashed border-slate-300 text-slate-600 hover:bg-slate-50 py-3 rounded-xl font-medium transition"> Thêm trường dữ liệu</button></section>
          </div>
          <footer className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4"><button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Hủy</button><button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">Lưu dịch vụ</button></footer>
        </form>
      </section>
    </>
  )
}