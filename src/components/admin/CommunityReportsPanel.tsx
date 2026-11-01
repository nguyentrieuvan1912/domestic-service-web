import AdminWorkBadge from './AdminWorkBadge'
import { useCallback, useEffect, useRef, useState } from 'react'
import { adminRequest } from '../../api/operations'
import { useAdminResource } from '../../hooks/useAdminResource'
import ResourceStatus from './ResourceStatus'
import { CommunityAssets, type CommunityAsset } from './CommunityAttachments'

export const reportReasons = [{ id: 'SPAM', label: 'Spam / quảng cáo' }, { id: 'MISINFORMATION', label: 'Thông tin sai lệch' }, { id: 'ABUSE', label: 'Xúc phạm / nội dung không phù hợp' }, { id: 'OTHER', label: 'Lý do khác' }]
type Report = { id: number; commentId: number; reason: string; detail: string; status: string; resolution: string | null; moderationNote: string | null; createdAt: string; reviewedAt: string | null; reviewedBy: string | null; reporter: string; authorId: number; author: string; authorRole: string; accountStatus: string; content: string; media: CommunityAsset[]; commentCreatedAt: string; deleted: boolean; postId: number; postContent: string; postAuthor: string; postStatus: string; parentId: number | null; parentContent: string | null; parentAuthor: string | null }
type Page = { items: Report[]; hasMore: boolean; nextBefore: number }
const actions = [{ id: 'DISMISS', label: 'Bỏ qua báo cáo' }, { id: 'DELETE', label: 'Xóa bình luận' }, { id: 'BLOCK', label: 'Chặn tài khoản' }, { id: 'DELETE_AND_BLOCK', label: 'Xóa và chặn tài khoản' }]
const button = 'min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40'
export default function CommunityReportsPanel({ changed }: { changed: () => void }) {
  const [status, setStatus] = useState('OPEN'), [before, setBefore] = useState<number | null>(null)
  const load = useCallback(() => adminRequest<Page>('identity', '/admin/community/reports?status=' + status + (before ? '&before=' + before : '')), [status, before])
  const resource = useAdminResource(load, { items: [], hasMore: false, nextBefore: 0 } as Page)
  const [opened, setOpened] = useState<number | null>(null), [decision, setDecision] = useState<{ report: Report; action: string } | null>(null), [note, setNote] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false), [notice, setNotice] = useState('')
  const locked = useRef(false)
  // Refresh the first page without moving a moderator away from an open decision.
  const retry = useRef(resource.retry); retry.current = resource.retry
  useEffect(() => { const timer = setInterval(() => { if (!before && !decision && !locked.current && document.visibilityState === 'visible') retry.current() }, 15000); return () => clearInterval(timer) }, [before, decision])
  const resolve = async () => {
    if (!decision || locked.current) return
    locked.current = true; setBusy(true); setError(''); setNotice('')
    try {
      await adminRequest('identity', '/admin/community/reports/' + decision.report.id, 'PATCH', { action: decision.action, note: note.trim() })
      setNotice(`Đã xử lý báo cáo #${decision.report.id}: ${actions.find(item => item.id === decision.action)?.label}.`)
      setDecision(null); setNote(''); resource.retry(); changed()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa xử lý được báo cáo.') }
    finally { locked.current = false; setBusy(false) }
  }
  return <div className="space-y-3 rounded-xl border border-orange-200 bg-orange-50/30 p-4">
    <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold text-slate-900">Báo cáo bình luận<AdminWorkBadge target="/admin/reviews#community-reports" /></h3><button className={button} disabled={busy} onClick={resource.retry}>Tải lại báo cáo</button></div>
    <div className="flex flex-wrap gap-2">{[{ id: 'OPEN', label: 'Chờ xử lý' }, { id: 'RESOLVED', label: 'Đã xử lý' }, { id: 'DISMISSED', label: 'Đã bỏ qua' }, { id: 'ALL', label: 'Tất cả' }].map(item => <button key={item.id} disabled={busy || !!decision} aria-pressed={status === item.id} className={button + (status === item.id ? ' border-orange-500 bg-orange-100 text-orange-900' : '')} onClick={() => { setStatus(item.id); setBefore(null); setOpened(null) }}>{item.label}</button>)}</div>
    <ResourceStatus {...resource} />{error && <p role="alert" className="text-sm text-red-700">{error}</p>}{notice && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
    {!resource.loading && !resource.error && !resource.data.items.length && <p className="text-sm text-slate-500">Không có báo cáo trong mục này.</p>}
    {resource.data.items.map(report => <article key={report.id} className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2"><div className="min-w-0"><p className="break-words font-bold">#{report.id} · {report.author} <span className={'ml-1 inline-block rounded px-2 py-1 text-xs ' + (report.status === 'OPEN' ? 'bg-orange-100 text-orange-900' : 'bg-slate-100 text-slate-600')}>{report.status === 'OPEN' ? 'CHỜ XỬ LÝ' : report.status === 'DISMISSED' ? 'Đã bỏ qua' : 'Đã xử lý'}</span></p><p className="mt-1 text-slate-600">{reportReasons.find(item => item.id === report.reason)?.label} · Bình luận #{report.commentId} · {new Date(report.createdAt).toLocaleString('vi-VN')}</p></div><button className={button} aria-expanded={opened === report.id} onClick={() => setOpened(opened === report.id ? null : report.id)}>{opened === report.id ? 'Thu gọn' : 'Xem báo cáo'}</button></div>
      {opened === report.id && <div className="mt-3 space-y-3 border-t pt-3">
        <p><strong>Người báo cáo:</strong> {report.reporter}</p><p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]"><strong>Mô tả:</strong> {report.detail || 'Không có mô tả bổ sung'}</p>
        <div className="space-y-2 rounded-lg bg-slate-50 p-3"><p className="font-semibold">Bình luận của {report.author} · Tài khoản #{report.authorId} ({report.authorRole})</p><p className="text-xs text-slate-500">{new Date(report.commentCreatedAt).toLocaleString('vi-VN')} · Tài khoản: {report.accountStatus === 'BLOCKED' ? 'Đã chặn' : report.accountStatus}{report.deleted && ' · Bình luận đã được xóa khỏi thảo luận'}</p>
          {report.parentId && <blockquote className="whitespace-pre-wrap break-words border-l-2 border-slate-300 pl-3 [overflow-wrap:anywhere]">Trả lời {report.parentAuthor}: {report.parentContent || 'Ảnh / video'}</blockquote>}
          <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{report.content}</p><CommunityAssets media={report.media} />
        </div>
        <details className="rounded-lg border p-3"><summary className="cursor-pointer font-semibold">Ngữ cảnh bài #{report.postId} · {report.postAuthor}</summary><p className="mt-2 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{report.postContent || 'Bài viết có ảnh / video'}</p></details>
        {report.status === 'OPEN' ? <div className="flex flex-wrap gap-2">{actions.map(action => <button key={action.id} disabled={busy || !!decision || (action.id.includes('BLOCK') && (report.authorRole === 'ADMIN' || report.accountStatus === 'BLOCKED')) || (action.id === 'DELETE' && report.deleted)} className={button + (action.id === 'DELETE_AND_BLOCK' ? ' border-red-300 text-red-700' : '')} onClick={() => { setDecision({ report, action: action.id }); setNote(''); setError('') }}>{action.label}</button>)}</div> : <p className="whitespace-pre-wrap break-words text-slate-600">{actions.find(item => item.id === report.resolution)?.label} · {report.reviewedBy} {report.reviewedAt && new Date(report.reviewedAt).toLocaleString('vi-VN')}<br />{report.moderationNote}</p>}
      </div>}
    </article>)}
    {decision && <div role="region" aria-label="Xác nhận xử lý báo cáo" className="space-y-3 rounded-xl border-2 border-red-300 bg-white p-4">
      <h4 className="font-bold text-slate-900">Xác nhận: {actions.find(item => item.id === decision.action)?.label}</h4><p className="text-sm">Bình luận #{decision.report.commentId} · {decision.report.author} · Tài khoản #{decision.report.authorId}</p>
      {decision.action.includes('BLOCK') && <p className="text-sm font-semibold text-red-700">Tài khoản sẽ bị chặn đăng nhập và thu hồi toàn bộ phiên đang hoạt động. Có thể mở khóa trong quản lý tài khoản.</p>}
      {decision.action.startsWith('DELETE') && <p className="text-sm text-slate-600">Nội dung và tệp bị gỡ khỏi phần thảo luận. Hồ sơ báo cáo vẫn giữ nội dung để đối chiếu.</p>}
      <label className="block text-sm font-semibold">{decision.action.includes('BLOCK') ? 'Lý do chặn (bắt buộc)' : 'Ghi chú xử lý'}<textarea disabled={busy} className="mt-2 w-full rounded-lg border p-3 font-normal" value={note} maxLength={2000} onChange={event => setNote(event.target.value)} /></label>
      <div className="flex flex-wrap gap-2"><button disabled={busy || (decision.action.includes('BLOCK') && !note.trim())} className="min-h-11 rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-40" onClick={() => void resolve()}>{busy ? 'Đang lưu…' : 'Xác nhận xử lý'}</button><button disabled={busy} className={button} onClick={() => { setDecision(null); setError('') }}>Quay lại</button></div>
    </div>}
    <div className="flex flex-wrap gap-2">{before && <button disabled={busy || !!decision} className={button} onClick={() => setBefore(null)}>Về báo cáo mới nhất</button>}{resource.data.hasMore && <button disabled={busy || !!decision || resource.loading} className={button} onClick={() => { setBefore(resource.data.nextBefore); setOpened(null) }}>Trang báo cáo trước</button>}</div>
  </div>
}
