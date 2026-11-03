import { useEffect, useState } from 'react'
import { adminRequest } from '../../api/operations'

type Evidence = { id: number; staffId: number; assignmentId: number; stage: 'BEFORE' | 'AFTER'; thumbnailUrl: string; createdAt: string; messageId: number; sha256: string; width: number; height: number }
export default function BookingEvidencePanel({ bookingId }: { bookingId: string }) {
 const [items, setItems] = useState<Evidence[]>([]), [error, setError] = useState(''), [loading, setLoading] = useState(true)
 const [selected, setSelected] = useState<Evidence | null>(null), [original, setOriginal] = useState(''), [imageError, setImageError] = useState(''), [imageLoading, setImageLoading] = useState(false)
 useEffect(() => {
  let active = true, running = false
  setItems([]); setSelected(null); setLoading(true); setError('')
  const load = async () => { if (running || document.hidden) return; running = true; try { const result = await adminRequest<Evidence[]>('booking', `/bookings/${bookingId}/evidence`); if (active) { setItems(result); setError('') } } catch (e) { if (active) setError(e instanceof Error ? e.message : 'Chưa tải được ảnh minh chứng.') } finally { running = false; if (active) setLoading(false) } }
  void load(); const timer = setInterval(() => void load(), 15000)
  return () => { active = false; clearInterval(timer) }
 }, [bookingId])
 useEffect(() => {
  let active = true; setOriginal(''); setImageError('')
  if (selected) { setImageLoading(true); void adminRequest<{ dataUrl: string }>('booking', `/bookings/${bookingId}/evidence/${selected.id}/original`).then(result => { if (active) setOriginal(result.dataUrl) }).catch(e => { if (active) setImageError(e instanceof Error ? e.message : 'Chưa tải được ảnh gốc.') }).finally(() => { if (active) setImageLoading(false) }) }
  return () => { active = false }
 }, [bookingId, selected])
 return <section className="space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
  <div><h3 className="text-sm font-bold uppercase text-slate-900">Ảnh minh chứng trước / sau</h3><p className="mt-1 text-xs leading-5 text-slate-500">Ảnh được lưu cùng đơn, nhân viên gửi và tin nhắn chat để đối chiếu khiếu nại.</p></div>
  {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
  {loading && <p className="text-sm text-slate-500">Đang tải minh chứng…</p>}
  {!loading && !error && !items.length && <p className="rounded-xl border border-dashed border-slate-200 bg-white p-5 text-center text-sm text-slate-400">Đơn chưa có ảnh minh chứng được gửi.</p>}
  {(['BEFORE', 'AFTER'] as const).map(stage => <div key={stage} className="space-y-3"><h4 className="text-xs font-bold text-emerald-800">{stage === 'BEFORE' ? 'TRƯỚC KHI THỰC HIỆN' : 'SAU KHI THỰC HIỆN'} · {items.filter(e => e.stage === stage).length} ảnh</h4><div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{items.filter(e => e.stage === stage).map(e => <article key={e.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white"><button onClick={() => setSelected(e)} className="block w-full text-left" aria-label={`Xem ảnh gốc minh chứng #${e.id}`}><img src={e.thumbnailUrl} alt={`Minh chứng ${stage === 'BEFORE' ? 'trước' : 'sau'} của nhân viên #${e.staffId}`} className="h-40 w-full object-cover"/><div className="space-y-1 p-3"><p className="text-xs font-bold text-slate-800">Nhân viên #{e.staffId} · Ảnh #{e.id}</p><p className="text-[11px] text-slate-500">{new Date(e.createdAt).toLocaleString('vi-VN')}</p><p className="text-[11px] text-emerald-700">Xem ảnh gốc →</p></div></button><details className="border-t border-slate-100 px-3 py-2 text-[10px] text-slate-500"><summary className="cursor-pointer font-semibold">Dấu vết minh chứng</summary><p className="mt-2">Ca #{e.assignmentId} · Tin nhắn #{e.messageId}</p><p>{e.width} × {e.height} px</p><p className="mt-1 break-all">SHA-256: {e.sha256}</p></details></article>)}</div></div>)}
  {selected && <div role="dialog" aria-modal="true" aria-label="Ảnh minh chứng gốc" className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-4 bg-slate-950/95 p-6"><div className="flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 text-white"><p className="text-sm font-semibold">Ảnh #{selected.id} · Nhân viên #{selected.staffId} · {selected.stage === 'BEFORE' ? 'Trước' : 'Sau'} · {new Date(selected.createdAt).toLocaleString('vi-VN')}</p><button autoFocus onClick={() => setSelected(null)} className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900">Đóng ảnh</button></div>{imageLoading && <p className="text-sm text-white">Đang tải ảnh gốc…</p>}{imageError && <p role="alert" className="text-sm text-red-300">{imageError}</p>}<img src={original || selected.thumbnailUrl} alt="Ảnh minh chứng gốc" className="max-h-[75vh] max-w-full object-contain"/></div>}
 </section>
}
