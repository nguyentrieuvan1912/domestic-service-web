import { useRef, useState } from 'react'
import { API_BASE_URL } from '../../api/catalog'

export default function AvatarPicker({ value, onChange, disabled = false, staff = false, compact = false }: { value?: string; onChange: (value: string) => void | Promise<void>; disabled?: boolean; staff?: boolean; compact?: boolean }) {
  const input = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [open, setOpen] = useState(false)
  const change = async (value: string) => {
    setBusy(true); setError('')
    try { await onChange(value); setOpen(false) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa lưu được ảnh.') }
    finally { setBusy(false) }
  }
  const src = value || '/api/v1/identity/default-avatar.png'
  return <div className={compact ? "relative" : "space-y-2"}>
    <button type="button" disabled={disabled || busy} onClick={() => staff ? input.current?.click() : setOpen(!open)} aria-label="Thay đổi ảnh đại diện" className="block rounded-full focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"><img alt="Ảnh đại diện" src={src.startsWith('/') ? API_BASE_URL + src : src} className={`${compact ? "h-9 w-9" : "h-24 w-24"} rounded-full border-2 border-emerald-500 object-cover`} /></button>
    {!compact && <p className="text-xs text-slate-500">{busy ? 'Đang lưu ảnh...' : staff ? 'Bấm vào ảnh để chọn ảnh chân dung rõ mặt, chính chủ. Chỉ Admin được thay đổi.' : 'Bấm vào ảnh để đổi hoặc dùng ảnh mặc định.'} JPG/PNG, tối đa 3 MB.</p>}
    {open && <div className={compact ? "absolute right-0 top-12 z-50 flex w-64 flex-col gap-2.5 rounded-xl border bg-white p-4 shadow-xl" : "flex flex-col gap-2.5 sm:max-w-sm"}><button type="button" disabled={busy || disabled} onClick={() => input.current?.click()} className="min-h-12 rounded-xl border border-emerald-500 bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 active:opacity-70 focus-visible:outline-2 focus-visible:outline-emerald-500 disabled:opacity-45">Chọn ảnh mới</button><button type="button" disabled={busy || disabled} onClick={() => void change('')} className="min-h-12 rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:opacity-70 focus-visible:outline-2 focus-visible:outline-emerald-500 disabled:opacity-45">Không sử dụng ảnh đại diện</button></div>}
    <input ref={input} type="file" accept="image/jpeg,image/png" className="hidden" disabled={busy || disabled} onChange={async event => {
      const file = event.target.files?.[0]; event.target.value = ''; if (!file) return
      if (!['image/jpeg','image/png'].includes(file.type) || file.size > 3 * 1024 * 1024) { setError('Chọn ảnh JPG hoặc PNG, tối đa 3 MB.'); return }
      const reader = new FileReader()
      reader.onerror = () => setError('Không đọc được ảnh. Vui lòng chọn lại.')
      reader.onload = () => void change(String(reader.result))
      reader.readAsDataURL(file)
    }} />
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
  </div>
}
