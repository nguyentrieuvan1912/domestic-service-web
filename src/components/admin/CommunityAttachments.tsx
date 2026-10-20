import { useEffect, useRef, useState } from 'react'
import { adminRequest } from '../../api/operations'
export type CommunityAsset = { id: number; uri: string; type: 'image' | 'video' }
type Ticket = { id: number; uploadUrl: string; apiKey: string; signature: string; params: Record<string, string> }
export function useCommunityAttachments() {
  const [files, setFiles] = useState<File[]>([]), [enabled, setEnabled] = useState(false), [progress, setProgress] = useState('')
  const tickets = useRef(new Map<File, Ticket>()), uploaded = useRef(new Map<File, CommunityAsset>())
  useEffect(() => { let alive = true; void adminRequest<{ enabled: boolean }>('identity', '/community/media/capabilities').then(value => { if (alive) setEnabled(value.enabled) }).catch(() => {}); return () => { alive = false } }, [])
  const clear = () => { setFiles([]); setProgress(''); tickets.current.clear(); uploaded.current.clear() }
  const upload = async () => {
    const ids: number[] = []
    try {
      for (const [index, file] of files.entries()) {
        const type = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : ''
        if (!type || file.size > (type === 'image' ? 10 : 50) * 1024 * 1024) throw new Error('Ảnh tối đa 10 MB; video tối đa 50 MB.')
        if (!uploaded.current.has(file)) {
          setProgress(`Đang tải và xác minh tệp ${index + 1}/${files.length}`)
          let ticket = tickets.current.get(file)
          if (!ticket) { ticket = await adminRequest<Ticket>('identity', '/community/media/signature', 'POST', { type }); tickets.current.set(file, ticket) }
          const url = new URL(ticket.uploadUrl)
          if (url.protocol !== 'https:' || url.hostname !== 'api.cloudinary.com') throw new Error('Địa chỉ tải tệp không hợp lệ.')
          const form = new FormData(); Object.entries(ticket.params).forEach(([name, value]) => form.append(name, value)); form.append('api_key', ticket.apiKey); form.append('signature', ticket.signature); form.append('file', file)
          const response = await fetch(ticket.uploadUrl, { method: 'POST', body: form, signal: AbortSignal.timeout(120000) }).catch(() => undefined)
          try { uploaded.current.set(file, await adminRequest<CommunityAsset>('identity', `/community/media/${ticket.id}/complete`, 'POST')) }
          catch (cause) { if (response?.status === 403) throw new Error('Cloudinary từ chối tải tệp (403). Kiểm tra quyền Upload/Create của API Key.'); throw cause }
        }
        ids.push(uploaded.current.get(file)!.id)
      }
      return ids
    } finally { setProgress('') }
  }
  return { files, setFiles, enabled, progress, upload, clear }
}
export function AttachmentInput({ value, busy, onError }: { value: ReturnType<typeof useCommunityAttachments>; busy: boolean; onError: (text: string) => void }) {
  return <div className="space-y-2 text-xs text-slate-500"><label className="block font-semibold text-emerald-800">Ảnh / Video (tối đa 4 tệp)<input aria-label="Ảnh hoặc video bình luận" className="mt-2 block w-full min-w-0 text-xs" type="file" multiple disabled={busy || !value.enabled} accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" onChange={event => { const files = Array.from(event.target.files || []); if (files.length > 4) { onError('Mỗi bình luận tối đa 4 tệp.'); event.target.value = ''; return } value.setFiles(files) }} /></label><p>{value.files.length} tệp đã chọn · Ảnh 10 MB · Video 50 MB / 2 phút{!value.enabled && ' · Chưa kết nối Cloudinary'}</p>{!!value.files.length && <button disabled={busy} className="font-semibold text-red-700" onClick={value.clear}>Bỏ các tệp đã chọn</button>}{value.progress && <p role="status">{value.progress}</p>}</div>
}
export function CommunityAssets({ media }: { media: CommunityAsset[] }) {
  return <div className="grid min-w-0 gap-2 sm:grid-cols-2">{media.map(item => item.type === 'video' ? <video key={item.id} src={item.uri} controls preload="metadata" className="max-h-64 w-full rounded-lg bg-black" /> : <a key={item.id} href={item.uri} target="_blank" rel="noreferrer"><img loading="lazy" src={item.uri} alt="Ảnh bình luận — mở đầy đủ" className="max-h-64 w-full rounded-lg bg-slate-100 object-contain" /></a>)}</div>
}
