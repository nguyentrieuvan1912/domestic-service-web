import { useState, type ReactNode } from 'react'
import { CatalogImageInput, prepareCatalogImage, type ImageSize } from './CatalogImageInput'

type Props = {
  title: string
  size: ImageSize
  imageUrl: string
  imageRequired?: boolean
  onClose: () => void
  onSave: (imageData: string) => Promise<void>
  children?: ReactNode
  preview: (image: string) => ReactNode
}

export default function CatalogArtworkDialog({ title, size, imageUrl, imageRequired, onClose, onSave, children, preview }: Props) {
  const [upload, setUpload] = useState<{ width: number; height: number; data: string } | null>(null)
  const [preparing, setPreparing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const imageData = upload?.width === size.width && upload.height === size.height ? upload.data : ''

  const pick = async (file: File) => {
    setError('')
    setPreparing(true)
    try { setUpload({ ...size, data: await prepareCatalogImage(file, size) }) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa xử lý được ảnh.') }
    finally { setPreparing(false) }
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
    <section role="dialog" aria-modal="true" aria-label={title} className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <button type="button" aria-label="Đóng" disabled={saving} onClick={onClose} className="rounded-lg border border-slate-200 px-3 py-1 text-xl text-slate-600">×</button>
      </header>
      <form className="flex min-h-0 flex-col" onSubmit={async event => {
        event.preventDefault()
        if (preparing || saving || (imageRequired && !imageData)) return
        setSaving(true)
        setError('')
        try { await onSave(imageData) }
        catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa lưu được thay đổi.') }
        finally { setSaving(false) }
      }}>
        <div className="space-y-4 overflow-y-auto px-5 py-4">
          <fieldset disabled={preparing || saving} className="space-y-4">{children}</fieldset>
          <CatalogImageInput size={size} disabled={preparing || saving} onPick={file => { void pick(file) }} />
          {preparing && <p role="status" className="text-sm text-slate-600">Đang xử lý ảnh…</p>}
          {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
          <div><p className="mb-2 text-sm font-semibold text-slate-800">Xem trước</p>{preview(imageData || imageUrl)}</div>
        </div>
        <footer className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
          <button type="button" disabled={saving} onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Hủy</button>
          <button type="submit" disabled={saving || preparing || (imageRequired && !imageData)} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Đang lưu…' : 'Lưu thay đổi'}</button>
        </footer>
      </form>
    </section>
  </div>
}
