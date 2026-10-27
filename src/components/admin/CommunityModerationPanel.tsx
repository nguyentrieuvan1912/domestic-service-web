import AdminWorkBadge from './AdminWorkBadge'
import { useCallback, useEffect, useRef, useState } from 'react'
import { adminRequest } from '../../api/operations'
import { useAdminResource } from '../../hooks/useAdminResource'
import ResourceStatus from './ResourceStatus'
import CommunityReportsPanel, { reportReasons } from './CommunityReportsPanel'
import { AttachmentInput, CommunityAssets, useCommunityAttachments } from './CommunityAttachments'

type Media = { id: number; uri: string; type: 'image' | 'video' }
type Reaction = 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'SUPPORT'
const reactions: { id: Reaction; label: string }[] = [{ id: 'LIKE', label: '👍' }, { id: 'LOVE', label: '❤️' }, { id: 'HAHA', label: '😆' }, { id: 'WOW', label: '😮' }, { id: 'SAD', label: '😢' }, { id: 'SUPPORT', label: '🤗' }]
type Comment = { id: number; media: Media[]; deleted: boolean; author: string; content: string; parentId: number | null; parentAuthor: string | null; parentContent: string | null; myReaction: Reaction | null; reactions: Partial<Record<Reaction, number>>; createdAt: string }
type Page = { items: Comment[]; hasMore: boolean; nextBefore: number; deletedIds: number[] }
type Post = { id: number; author: string; content: string; status: string; media: Media[]; commentCount: number; myReaction: Reaction | null; reactions: Partial<Record<Reaction, number>> }
type Ticket = { id: number; uploadUrl: string; apiKey: string; signature: string; params: Record<string, string> }
const load = () => adminRequest<Post[]>('identity', '/admin/community/posts')
const key = () => 'community-' + Date.now() + '-' + Math.random().toString(36).slice(2)
const button = 'min-h-11 rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 disabled:opacity-40'
const merge = (old: Comment[], incoming: Comment[]) => [...new Map([...old, ...incoming].map(item => [item.id, item])).values()].sort((a, b) => a.id - b.id)
const statuses = [
  { id: 'ALL', label: 'Tất cả' }, { id: 'PENDING', label: 'Chờ duyệt' },
  { id: 'PUBLISHED', label: 'Đã công bố' }, { id: 'HIDDEN', label: 'Đã ẩn' },
]
function PostStatus({ status }: { status: string }) {
  const color = status === 'PENDING' ? 'border-amber-300 bg-amber-100 text-amber-900' : status === 'PUBLISHED' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-300 bg-slate-100 text-slate-700'
  return <span className={'inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-sm font-bold ' + color}>{status === 'PENDING' && <span aria-hidden="true">◷</span>}{statuses.find(item => item.id === status)?.label || status}</span>
}

const applyDeleted = (items: Comment[], ids: number[] = []) => items.map(item => ({ ...item, ...(ids.includes(item.id) ? { deleted: true, content: 'Bình luận đã được quản trị viên xóa.', media: [], reactions: {}, myReaction: null } : {}), ...(item.parentId && ids.includes(item.parentId) ? { parentContent: 'Bình luận đã được quản trị viên xóa.' } : {}) }))
function Discussion({ postId, changed }: { postId: number; changed: () => void }) {
  const [items, setItems] = useState<Comment[]>([]), [draft, setDraft] = useState(''), [reply, setReply] = useState<Comment | null>(null), [error, setError] = useState(''), [busy, setBusy] = useState(false), [more, setMore] = useState(false)
  const attachments = useCommunityAttachments()
  const [report, setReport] = useState<Comment | null>(null), [reason, setReason] = useState('SPAM'), [detail, setDetail] = useState(''), [notice, setNotice] = useState('')
  const cursor = useRef(0), oldest = useRef(0), alive = useRef(true), reading = useRef(false), locked = useRef(false), initialized = useRef(false), sendKey = useRef({ body: '', key: key() })
  const refresh = useCallback(async () => {
    if (reading.current) return
    reading.current = true
    try {
      for (let round = 0; round < 3; round++) {
        const initial = !initialized.current
        const page = await adminRequest<Page>('identity', '/community/posts/' + postId + '/comments' + (initial ? '' : '?after=' + cursor.current))
        if (!alive.current) return
        initialized.current = true
        if (initial) { oldest.current = page.nextBefore; setMore(page.hasMore) }
        if (page.items.length) cursor.current = Math.max(cursor.current, ...page.items.map(item => item.id))
        setItems(old => applyDeleted(merge(old, page.items), page.deletedIds)); setReply(old => old && page.deletedIds?.includes(old.id) ? null : old); setError('')
        if (initial || !page.hasMore) break
      }
    } catch (cause) { if (alive.current) setError(cause instanceof Error ? cause.message : 'Chưa tải được bình luận.') }
    finally { reading.current = false }
  }, [postId])
  useEffect(() => { alive.current = true; void refresh(); const timer = setInterval(() => { if (document.visibilityState === 'visible') void refresh() }, 5000); return () => { alive.current = false; clearInterval(timer) } }, [refresh])
  const act = async (work: () => Promise<unknown>) => {
    if (locked.current) return
    locked.current = true; setBusy(true); setError('')
    try { await work(); if (alive.current) { await refresh(); changed() } }
    catch (cause) { if (alive.current) setError(cause instanceof Error ? cause.message : 'Chưa lưu được.') }
    finally { locked.current = false; if (alive.current) setBusy(false) }
  }
  return <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
    <h3 className="font-semibold">Thảo luận bài #{postId}</h3>
    {error && <p role="alert" className="text-red-600">{error}</p>}
    {more && <button disabled={busy} className={button} onClick={() => void act(async () => { const page = await adminRequest<Page>('identity', '/community/posts/' + postId + '/comments?before=' + oldest.current); if (alive.current) { oldest.current = page.nextBefore; setMore(page.hasMore); setItems(old => applyDeleted(merge(old, page.items), page.deletedIds)) } })}>Xem bình luận trước</button>}
    {!!notice && <p role="status" className="text-emerald-800">{notice}</p>}
    <div className="max-h-96 space-y-3 overflow-y-auto">{items.map(item => <div key={item.id} className="space-y-2 rounded-lg border border-slate-100 bg-white p-3">
      <p className="font-semibold">{item.author}</p>{item.parentId && <blockquote className="border-l-2 border-emerald-400 bg-emerald-50 p-2 text-xs text-slate-600">Trả lời {item.parentAuthor}: {item.parentContent}</blockquote>}
      <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{item.content}</p><CommunityAssets media={item.media || []} /><p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString('vi-VN')}</p>
      {!item.deleted && <div className="flex flex-wrap items-center gap-1"><button disabled={busy} className={button} onClick={() => setReply(item)}>Trả lời</button>{reactions.map(r => <button key={r.id} disabled={busy} aria-label={r.id} className={button + (item.myReaction === r.id ? ' bg-emerald-100' : '')} onClick={() => void act(async () => { const updated = await adminRequest<Comment>('identity', '/community/posts/' + postId + '/comments/' + item.id + '/reaction', 'PATCH', { reaction: item.myReaction === r.id ? null : r.id }); if (alive.current) setItems(old => merge(old, [updated])) })}>{r.label} {item.reactions[r.id] || ''}</button>)}<button disabled={busy} className={button} onClick={() => { setReport(item); setReason('SPAM'); setDetail(''); setNotice('') }}>Báo cáo</button></div>}
    </div>)}</div>
    {report && <div className="space-y-2 rounded-lg border border-amber-300 bg-amber-50 p-3"><p className="font-semibold">Báo cáo bình luận #{report.id} của {report.author}</p><label className="block">Lý do<select disabled={busy} className="ml-2 max-w-full rounded border p-2" value={reason} onChange={event => setReason(event.target.value)}>{reportReasons.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><textarea disabled={busy} className="w-full rounded-lg border p-2" maxLength={2000} value={detail} onChange={event => setDetail(event.target.value)} placeholder={reason === 'OTHER' ? 'Mô tả lý do (bắt buộc)' : 'Mô tả thêm'} /><div className="flex gap-2"><button className={button} disabled={busy || (reason === 'OTHER' && !detail.trim())} onClick={() => void act(async () => { await adminRequest('identity', `/community/posts/${postId}/comments/${report.id}/reports`, 'POST', { reason, detail }); setReport(null); setNotice('Đã lưu báo cáo bình luận.') })}>Gửi báo cáo</button><button disabled={busy} className={button} onClick={() => setReport(null)}>Đóng</button></div></div>}
    {reply && <p className="rounded bg-emerald-50 p-2 text-xs">Trả lời {reply.author}: {reply.content}<button disabled={busy} onClick={() => setReply(null)} className="ml-2 text-red-600">Bỏ</button></p>}
    <textarea disabled={busy} className="w-full rounded-lg border p-3" value={draft} onChange={event => setDraft(event.target.value)} maxLength={2000} placeholder="Viết bình luận hoặc trả lời…" />
    <AttachmentInput value={attachments} busy={busy} onError={setError} />
    <button disabled={busy || (!draft.trim() && !attachments.files.length)} className={button} onClick={() => void act(async () => {
      const mediaIds = await attachments.upload()
      const body = { content: draft.trim(), parentId: reply?.id ?? null, mediaIds }, serialized = JSON.stringify(body)
      if (sendKey.current.body !== serialized) sendKey.current = { body: serialized, key: key() }
      const saved = await adminRequest<Comment>('identity', '/community/posts/' + postId + '/comments', 'POST', { ...body, requestKey: sendKey.current.key })
      if (alive.current && typeof saved.content === 'string' && saved.reactions) setItems(old => merge(old, [saved]))
      if (alive.current) { setDraft(''); attachments.clear(); setReply(null); sendKey.current = { body: '', key: key() } }
    })}>Gửi bình luận</button>
  </div>
}
export default function CommunityModerationPanel() {
  const resource = useAdminResource(load, []), [error, setError] = useState(''), [busy, setBusy] = useState(false), [content, setContent] = useState(''), [files, setFiles] = useState<File[]>([]), [thread, setThread] = useState<number | null>(null), [enabled, setEnabled] = useState(false), [progress, setProgress] = useState('')
  const locked = useRef(false), uploaded = useRef(new Map<File, Media>()), tickets = useRef(new Map<File, Ticket>()), publishKey = useRef({ body: '', key: key() })
  const [filter, setFilter] = useState('ALL'), [limit, setLimit] = useState(10), [expanded, setExpanded] = useState<number | null>(null)
  const pendingCount = resource.data.filter(post => post.status === 'PENDING').length
  const filteredPosts = resource.data.filter(post => filter === 'ALL' || post.status === filter).sort((a, b) => Number(b.status === 'PENDING') - Number(a.status === 'PENDING') || b.id - a.id)
  useEffect(() => { let active = true; void adminRequest<{ enabled: boolean }>('identity', '/community/media/capabilities').then(value => { if (active) setEnabled(value.enabled) }).catch(() => {}); return () => { active = false } }, [])
  const act = async (work: () => Promise<unknown>) => {
    if (locked.current) return
    locked.current = true; setBusy(true); setError('')
    try { await work(); resource.retry() } catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa lưu được.') } finally { locked.current = false; setBusy(false); setProgress('') }
  }
  const publish = async () => {
    const mediaIds: number[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i], type = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : ''
      if (!type || file.size > (type === 'image' ? 10 : 50) * 1024 * 1024) throw new Error('Ảnh tối đa 10 MB; video tối đa 50 MB. Mỗi bài tối đa 4 tệp.')
      if (!uploaded.current.has(file)) {
        setProgress('Đang tải và xác minh tệp ' + (i + 1) + '/' + files.length)
        let ticket = tickets.current.get(file)
        if (!ticket) { ticket = await adminRequest<Ticket>('identity', '/community/media/signature', 'POST', { type }); tickets.current.set(file, ticket) }
        const url = new URL(ticket.uploadUrl)
        if (url.protocol !== 'https:' || url.hostname !== 'api.cloudinary.com') throw new Error('Địa chỉ tải tệp không hợp lệ.')
        const form = new FormData(); Object.entries(ticket.params).forEach(([name, value]) => form.append(name, value)); form.append('api_key', ticket.apiKey); form.append('signature', ticket.signature); form.append('file', file)
        // Confirmation uses server-side provider metadata, including on a lost upload response.
        const response = await fetch(ticket.uploadUrl, { method: 'POST', body: form, signal: AbortSignal.timeout(120000) }).catch(() => undefined)
        try { uploaded.current.set(file, await adminRequest<Media>('identity', '/community/media/' + ticket.id + '/complete', 'POST')) }
        catch (cause) { if (response?.status === 403) throw new Error('Cloudinary từ chối tải tệp (403). Kiểm tra quyền Upload/Create của API Key.'); throw cause }
      }
      mediaIds.push(uploaded.current.get(file)!.id)
    }
    const body = { content: content.trim(), mediaIds }, serialized = JSON.stringify(body)
    if (publishKey.current.body !== serialized) publishKey.current = { body: serialized, key: key() }
    await adminRequest('identity', '/community/posts', 'POST', { ...body, requestKey: publishKey.current.key })
    setContent(''); setFiles([]); uploaded.current.clear(); tickets.current.clear(); publishKey.current = { body: '', key: key() }
  }
  return <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold text-slate-900">Kiểm duyệt cộng đồng<AdminWorkBadge target="/admin/reviews#community-posts" /></h2><p className="mt-1 text-sm text-slate-500">Bài chờ duyệt được ưu tiên ở đầu danh sách. Mở chi tiết để xem đầy đủ.</p></div>{pendingCount > 0 && <span className="rounded-xl border border-amber-300 bg-amber-100 px-4 py-2 text-base font-bold text-amber-900">{pendingCount} bài chờ duyệt</span>}</div><ResourceStatus {...resource} />{error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    <div id="community-reports" className="scroll-mt-6"><CommunityReportsPanel changed={resource.retry} /></div>
    <details className="rounded-xl border border-slate-200 bg-slate-50 p-3"><summary className="cursor-pointer text-sm font-semibold text-emerald-800">Đăng thông báo từ quản trị viên</summary><div className="mt-3 space-y-3">
    <textarea disabled={busy} className="w-full rounded border p-3 text-sm" value={content} onChange={event => setContent(event.target.value)} maxLength={5000} placeholder="Thông báo từ quản trị viên" />
    <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" multiple disabled={busy || !enabled} onChange={event => { const selected = Array.from(event.target.files || []); if (selected.length > 4) { setError('Mỗi bài tối đa 4 tệp.'); return } setFiles(selected); uploaded.current.clear(); tickets.current.clear() }} />
    <p className="text-xs text-slate-500">{enabled ? files.length + ' tệp đã chọn · Video tối đa 2 phút.' : 'Chưa kết nối Cloudinary. Vẫn có thể đăng văn bản.'}</p>{progress && <p role="status" className="text-sm text-emerald-700">{progress}</p>}
    <button className={button} disabled={busy || (!content.trim() && !files.length)} onClick={() => void act(publish)}>Đăng thông báo</button>
    </div></details>
    <div className="flex flex-wrap gap-2" aria-label="Lọc trạng thái bài viết">{statuses.map(status => <button key={status.id} aria-pressed={filter === status.id} className={'rounded-lg border px-3 py-2 text-sm font-semibold ' + (filter === status.id ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-200 bg-white text-slate-600')} onClick={() => { setFilter(status.id); setLimit(10) }}>{status.label} ({status.id === 'ALL' ? resource.data.length : resource.data.filter(post => post.status === status.id).length})</button>)}</div>
    {!resource.loading && !filteredPosts.length && <p className="py-4 text-sm text-slate-500">Không có bài viết trong mục này.</p>}
    {filteredPosts.slice(0, limit).map(post => <article className={'min-w-0 rounded-xl border p-3 text-sm ' + (post.status === 'PENDING' ? 'border-amber-300 border-l-4 bg-amber-50/60' : 'border-slate-200 bg-white')} key={post.id}>
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
        {post.media.length > 0 && <button className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100" aria-label={'Xem tệp đính kèm bài ' + post.id} aria-expanded={expanded === post.id} onClick={() => setExpanded(expanded === post.id ? null : post.id)}>{post.media[0].type === 'image' ? <img src={post.media[0].uri} alt="" loading="lazy" className="h-full w-full object-cover" /> : <span className="text-xs font-bold text-slate-600">▶ Video</span>}{post.media.length > 1 && <span className="absolute bottom-0 right-0 rounded-tl bg-slate-900/80 px-1.5 text-xs font-bold text-white">+{post.media.length - 1}</span>}</button>}
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="break-words font-bold text-slate-900">{post.author}</span><span className="text-xs text-slate-500">#{post.id}</span><PostStatus status={post.status} /></div><p className="mt-1 line-clamp-2 whitespace-pre-wrap break-words text-slate-700 [overflow-wrap:anywhere]">{post.content || 'Bài viết có tệp đính kèm'}</p><p className="mt-1 text-xs text-slate-500">{post.media.length} tệp · {post.commentCount} bình luận</p></div>
        <button className={button + ' shrink-0 bg-white'} aria-expanded={expanded === post.id} aria-controls={'community-detail-' + post.id} onClick={() => setExpanded(expanded === post.id ? null : post.id)}>{expanded === post.id ? 'Thu gọn' : 'Xem / Kiểm duyệt'}</button>
      </div>
      {expanded === post.id && <div id={'community-detail-' + post.id} className="mt-3 space-y-3 border-t border-slate-200 pt-3">
        {post.status === 'PENDING' && <p className="rounded-lg bg-amber-100 p-3 font-semibold text-amber-900">Chờ quản trị viên duyệt · Bài viết chưa được hiển thị công khai.</p>}
        <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{post.content}</p>
        <div className="grid gap-3 sm:grid-cols-2">{post.media.map(item => item.type === 'video' ? <video key={item.id} src={item.uri} controls preload="metadata" className="max-h-64 w-full rounded-lg bg-black" /> : <a key={item.id} href={item.uri} target="_blank" rel="noreferrer"><img src={item.uri} alt="Ảnh bài đăng — mở ảnh đầy đủ" loading="lazy" className="max-h-64 w-full rounded-lg bg-slate-100 object-contain" /></a>)}</div>
        <div className="flex flex-wrap gap-2">{post.status !== 'PUBLISHED' && <button className={button + ' bg-emerald-700 text-white'} disabled={busy} onClick={() => void act(() => adminRequest('identity', '/admin/community/posts/' + post.id, 'PATCH', { status: 'PUBLISHED' }))}>{post.status === 'PENDING' ? 'Duyệt bài viết' : 'Công bố lại'}</button>}{post.status !== 'HIDDEN' && <button className={button} disabled={busy} onClick={() => void act(() => adminRequest('identity', '/admin/community/posts/' + post.id, 'PATCH', { status: 'HIDDEN' }))}>Ẩn bài viết</button>}<button className={button} aria-expanded={thread === post.id} onClick={() => setThread(thread === post.id ? null : post.id)}>Thảo luận ({post.commentCount})</button></div>
        <div className="flex flex-wrap gap-1">{reactions.map(r => <button key={r.id} disabled={busy} aria-label={r.id} className={button + (post.myReaction === r.id ? ' bg-emerald-100' : '')} onClick={() => void act(() => adminRequest('identity', '/community/posts/' + post.id + '/reaction', 'PATCH', { reaction: post.myReaction === r.id ? null : r.id }))}>{r.label} {post.reactions[r.id] || ''}</button>)}</div>
        {thread === post.id && <Discussion key={post.id} postId={post.id} changed={resource.retry} />}
      </div>}
    </article>)}
    {filteredPosts.length > limit && <button className={button} onClick={() => setLimit(value => value + 10)}>Xem thêm {Math.min(10, filteredPosts.length - limit)} bài viết</button>}
  </section>
}
