import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { useAdminResource } from '../../hooks/useAdminResource'
import { readSession } from '../../api/identity'
import { dateTime } from '../../api/operations'
import {
  changeKnowledge, knowledgeHistory, loadKnowledge, readKnowledge, saveKnowledge, searchKnowledge,
  type KnowledgeDocument, type KnowledgeEdit, type KnowledgeRevision, type KnowledgeSearch,
} from '../../api/knowledge'

const input = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100'
const primary = 'rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-40'
const secondary = 'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40'
const indexLabels = { PENDING: 'Chờ lập chỉ mục', INDEXING: 'Đang lập chỉ mục', READY: 'Sẵn sàng', FAILED: 'Lập chỉ mục lỗi' }

function KnowledgeDialog({ title, children, close, locked = false }: {
  title: string; children: ReactNode; close: () => void; locked?: boolean
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const label = useId()
  useEffect(() => { dialog.current?.showModal() }, [])
  return <dialog ref={dialog} aria-labelledby={label}
    onCancel={event => { event.preventDefault(); if (!locked) close() }}
    className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl border-0 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/40">
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
      <h2 id={label} className="text-lg font-bold">{title}</h2>
      <button type="button" disabled={locked} onClick={close} aria-label="Đóng" className="rounded-lg px-3 py-1 text-xl text-slate-500 disabled:opacity-40">×</button>
    </div>
    {children}
  </dialog>
}

function KnowledgeEditor({ initial, close, saved }: { initial: KnowledgeEdit; close: () => void; saved: () => void }) {
  const [edit, setEdit] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const running = useRef(false)
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (running.current) return
    running.current = true
    setBusy(true)
    setError('')
    try { await saveKnowledge(edit); saved() }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa lưu được tài liệu.') }
    finally { running.current = false; setBusy(false) }
  }
  return <KnowledgeDialog title={initial.id ? 'Chỉnh sửa tài liệu' : 'Thêm tài liệu cho trợ lý AI'} close={close} locked={busy}>
    <form onSubmit={event => void submit(event)} className="space-y-5 p-6">
      <p className="text-sm leading-6 text-slate-500">Lưu nội dung thành bản nháp, sau đó duyệt để trợ lý sử dụng. Khi sửa tài liệu đã duyệt, nội dung được đưa về bản nháp để kiểm tra lại.</p>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <label className="block space-y-2 text-sm font-semibold">Tiêu đề
        <input autoFocus required maxLength={200} className={input} value={edit.title} onChange={event => setEdit({ ...edit, title: event.target.value })} />
      </label>
      <label className="block space-y-2 text-sm font-semibold">Nguồn tài liệu
        <input maxLength={500} placeholder="https://… hoặc cleanmaster:…" className={input} value={edit.sourceUri || ''} onChange={event => setEdit({ ...edit, sourceUri: event.target.value })} />
      </label>
      <label className="block space-y-2 text-sm font-semibold">Nội dung hướng dẫn đã kiểm tra
        <textarea required rows={14} maxLength={50000} className={input + ' resize-y leading-7'} value={edit.content} onChange={event => setEdit({ ...edit, content: event.target.value })} />
      </label>
      <p className="text-right text-xs text-slate-400">{edit.content.length.toLocaleString('vi-VN')} / 50.000 ký tự</p>
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <button type="button" disabled={busy} className={secondary} onClick={close}>Hủy</button>
        <button disabled={busy} className={primary}>{busy ? 'Đang lưu…' : 'Lưu bản nháp'}</button>
      </div>
    </form>
  </KnowledgeDialog>
}

export default function Knowledge() {
  const resource = useAdminResource(loadKnowledge, [])
  const { setData } = resource
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [edit, setEdit] = useState<KnowledgeEdit | null>(null)
  const [history, setHistory] = useState<{ title: string; revisions: KnowledgeRevision[] } | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [question, setQuestion] = useState('')
  const [searching, setSearching] = useState(false)
  const [preview, setPreview] = useState<KnowledgeSearch | null>(null)
  const running = useRef(false)
  const queued = resource.data.some(document => document.status === 'ACTIVE' && document.approvalStatus === 'APPROVED'
    && ['PENDING', 'INDEXING'].includes(document.indexStatus))
  useEffect(() => {
    if (!queued) return
    let active = true, loading = false
    const owner = readSession('ADMIN')?.accessToken
    const timer = setInterval(() => {
      if (loading || document.visibilityState !== 'visible') return
      loading = true
      void loadKnowledge().then(rows => {
        if (active && owner === readSession('ADMIN')?.accessToken) setData(rows)
      }).catch(() => { /* The regular resource refresh reports connection errors. */ })
        .finally(() => { loading = false })
    }, 4000)
    return () => { active = false; clearInterval(timer) }
  }, [queued, setData])
  const action = async (work: () => Promise<unknown>, message?: string) => {
    if (running.current) return
    running.current = true; setBusy(true); setError(''); setNotice('')
    try { await work(); if (message) setNotice(message) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa xử lý được yêu cầu.') }
    finally { running.current = false; setBusy(false) }
  }
  const open = (document: KnowledgeDocument) => action(async () => {
    const loaded = await readKnowledge(document.id)
    setEdit({ id: loaded.id, version: loaded.version, title: loaded.title, sourceUri: loaded.sourceUri, content: loaded.content })
  })
  const showHistory = (document: KnowledgeDocument) => action(async () => {
    const revisions = await knowledgeHistory(document.id)
    setHistory({ title: document.title, revisions })
  })
  const search = async (event: React.FormEvent) => {
    event.preventDefault()
    if (searching || !question.trim()) return
    setSearching(true); setError(''); setPreview(null)
    try { setPreview(await searchKnowledge(question.trim())) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa kiểm tra được nguồn.') }
    finally { setSearching(false) }
  }
  const rows = resource.data.filter(document => {
    const matches = (document.title + ' ' + (document.sourceUri || '')).toLocaleLowerCase('vi-VN').includes(query.toLocaleLowerCase('vi-VN'))
    return matches && (filter === 'all' || filter === 'draft' && document.approvalStatus === 'DRAFT'
      || filter === 'active' && document.status === 'ACTIVE' && document.approvalStatus === 'APPROVED'
      || filter === 'hidden' && document.status === 'INACTIVE' && document.approvalStatus === 'APPROVED')
  })
  return <div className="min-w-0 space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Nguồn hướng dẫn chính thức</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Tri thức trợ lý AI</h1>
        <p className="mt-2 text-sm text-slate-500">Quản lý FAQ, hướng dẫn và chính sách để trợ lý tra cứu khi trả lời khách hàng.</p></div>
      <button type="button" className={primary} disabled={busy} onClick={() => setEdit({ version: null, title: '', sourceUri: '', content: '' })}>+ Thêm tài liệu</button>
    </header>
    <div className="grid gap-4 sm:grid-cols-3">
      {[['Tài liệu', resource.data.length], ['Bản nháp', resource.data.filter(row => row.approvalStatus === 'DRAFT').length],
        ['Sẵn sàng cho AI', resource.data.filter(row => row.status === 'ACTIVE' && row.approvalStatus === 'APPROVED' && row.indexStatus === 'READY').length]].map(([label, value]) =>
        <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>)}
    </div>
    {(error || resource.error) && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error || resource.error} <button className="underline" onClick={resource.retry}>Tải lại</button></p>}
    {notice && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</p>}
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap gap-3 border-b border-slate-100 p-5">
        <input aria-label="Tìm tài liệu" className={input + ' min-w-48 flex-1'} placeholder="Tìm tiêu đề hoặc nguồn…" value={query} onChange={event => setQuery(event.target.value)} />
        <select aria-label="Trạng thái tài liệu" className={input + ' sm:w-52'} value={filter} onChange={event => setFilter(event.target.value)}>
          <option value="all">Tất cả tài liệu</option><option value="draft">Bản nháp</option><option value="active">Đã duyệt</option><option value="hidden">Đã ẩn</option>
        </select>
      </div>
      {resource.loading && <p className="px-5 py-3 text-sm text-slate-500">Đang tải tài liệu…</p>}
      <div className="divide-y divide-slate-100">{rows.map(document =>
        <article key={document.id} className="flex flex-wrap items-start gap-4 p-5">
          <div className="min-w-56 flex-1">
            <h2 className="font-bold text-slate-900">{document.title}</h2>
            <p className="mt-1 break-all text-xs text-slate-400">{document.sourceUri || 'Nguồn nội bộ'} · Bản {document.version}</p>
            <p className="mt-2 text-xs text-slate-500">Cập nhật {dateTime(document.updatedAt)}{document.indexedModel && ' · ' + document.indexedModel}</p>
            {document.indexError && <p className="mt-2 text-sm text-red-600">{document.indexError}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={'rounded-full px-3 py-1 text-xs font-semibold ' + (document.approvalStatus === 'DRAFT' ? 'bg-amber-50 text-amber-800' : document.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600')}>
              {document.approvalStatus === 'DRAFT' ? 'Bản nháp' : document.status === 'ACTIVE' ? 'Đã duyệt' : 'Đã ẩn'}
            </span>
            <span className={'rounded-full px-3 py-1 text-xs font-medium ' + (document.indexStatus === 'FAILED' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600')}>
              {indexLabels[document.indexStatus]}{document.indexStatus === 'READY' && document.chunkCount != null ? ' · ' + document.chunkCount + ' đoạn' : ''}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button disabled={busy} className={secondary} onClick={() => void open(document)}>Sửa</button>
            <button disabled={busy} className={secondary} onClick={() => void showHistory(document)}>Lịch sử</button>
            {(document.approvalStatus === 'DRAFT' || document.status === 'INACTIVE') &&
              <button disabled={busy} className={primary} onClick={() => void action(() => changeKnowledge(document, 'approve'), 'Đã duyệt. Tài liệu được đưa vào hàng chờ lập chỉ mục.')}>Duyệt & lập chỉ mục</button>}
            {document.status === 'ACTIVE' && document.approvalStatus === 'APPROVED' && <>
              {document.indexStatus === 'FAILED' && <button disabled={busy} className={secondary} onClick={() => void action(() => changeKnowledge(document, 'reindex'), 'Đã đưa tài liệu vào hàng chờ thử lại.')}>Thử lập chỉ mục lại</button>}
              <button disabled={busy} className={secondary} onClick={() => void action(() => changeKnowledge(document, 'hide'), 'Đã ẩn tài liệu khỏi nguồn trả lời của AI.')}>Ẩn</button>
            </>}
          </div>
        </article>)}</div>
      {!resource.loading && !rows.length && <p className="p-10 text-center text-sm text-slate-400">Chưa có tài liệu phù hợp.</p>}
    </section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="text-lg font-bold">Kiểm tra nguồn trả lời</h2>
      <p className="mt-1 text-sm text-slate-500">Nhập câu hỏi để xem các đoạn tài liệu đã duyệt mà trợ lý có thể tra cứu.</p>
      <form onSubmit={event => void search(event)} className="mt-4 flex flex-wrap gap-3">
        <input required maxLength={2000} aria-label="Câu hỏi kiểm tra" value={question} onChange={event => setQuestion(event.target.value)} className={input + ' min-w-52 flex-1'} placeholder="Ví dụ: Nếu đồ đạc bị hư hại thì tôi phải làm gì?" />
        <button disabled={searching} className={primary}>{searching ? 'Đang tra cứu…' : 'Kiểm tra nguồn'}</button>
      </form>
      {preview && <div className="mt-5 space-y-3">
        <p className="text-xs font-medium text-emerald-700">{preview.mode === 'HYBRID' ? 'Từ khóa + ngữ nghĩa' : preview.mode === 'KEYWORD_FALLBACK' ? 'Từ khóa · embedding tạm chưa kết nối' : 'Từ khóa · đang chờ chỉ mục ngữ nghĩa'} · {preview.embeddingModel}</p>
        {!preview.articles.length && <p className="text-sm text-slate-500">Chưa tìm thấy nguồn đủ liên quan. Kiểm tra nội dung và trạng thái tài liệu trước khi bổ sung hướng dẫn cho khách.</p>}
        {preview.articles.map(article => <div key={article.documentId} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
          <h3 className="font-semibold">{article.title} <span className="text-xs font-normal text-slate-500">· Bản {article.version}</span></h3>
          <p className="mt-1 break-all text-xs text-slate-500">{article.sourceUri || 'Nguồn nội bộ'}{preview.mode === 'HYBRID' ? ' · Tương đồng ' + article.similarity.toFixed(3) : ''}</p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{article.content}</p>
        </div>)}
      </div>}
    </section>
    {edit && <KnowledgeEditor initial={edit} close={() => setEdit(null)} saved={() => { setEdit(null); setNotice('Đã lưu bản nháp trong hệ thống. Duyệt tài liệu để trợ lý sử dụng.'); resource.retry() }} />}
    {history && <KnowledgeDialog title={'Lịch sử · ' + history.title} close={() => setHistory(null)}>
      <div className="space-y-4 p-6">{history.revisions.map(revision => <details key={revision.version} className="rounded-xl border border-slate-200 p-4">
        <summary className="cursor-pointer text-sm font-semibold">Bản {revision.version} · {dateTime(revision.createdAt)} · {revision.approvalStatus === 'DRAFT' ? 'Bản nháp' : revision.status === 'ACTIVE' ? 'Đã duyệt' : 'Đã ẩn'}</summary>
        <p className="mt-3 font-semibold">{revision.title}</p><p className="mt-1 text-xs text-slate-500">{revision.sourceUri || 'Nguồn nội bộ'} · {revision.actorId ? 'Admin #' + revision.actorId : 'Khởi tạo hệ thống'}</p>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{revision.content}</p>
      </details>)}</div>
    </KnowledgeDialog>}
  </div>
}
