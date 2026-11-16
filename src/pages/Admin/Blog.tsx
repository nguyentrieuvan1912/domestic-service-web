import { useState } from 'react'
import { Link } from 'react-router-dom'
import { blogCategories, getAdminBlog, listAdminBlog } from '../../api/blog'
import type { BlogDraft } from '../../api/blog'
import { readSession } from '../../api/identity'
import { useAdminResource } from '../../hooks/useAdminResource'
import ResourceStatus from '../../components/admin/ResourceStatus'
import BlogStudio from '../../features/blog/BlogStudio'

const statusLabels = { DRAFT: 'Bản nháp', PUBLISHED: 'Đã xuất bản', ARCHIVED: 'Đã ẩn' }
export default function AdminBlog() {
  const resource = useAdminResource(listAdminBlog, [])
  const [draft, setDraft] = useState<BlogDraft | null>(null)
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const [category, setCategory] = useState('ALL')
  const [page, setPage] = useState(1)
  const visible = resource.data.filter(article => (status === 'ALL' || article.status === status) && (category === 'ALL' || article.category === category) && `${article.title} ${article.authorName} ${article.slug}`.toLocaleLowerCase('vi').includes(search.toLocaleLowerCase('vi')))
  const totalPages = Math.max(1, Math.ceil(visible.length / 12))
  const currentPage = Math.min(page, totalPages)
  const create = () => setDraft({ title: '', slug: '', excerpt: '', coverUrl: '', category: 'CLEANING_TIPS', authorName: readSession('ADMIN')?.user.fullName || '', status: 'DRAFT', version: 0, document: { type: 'doc', content: [{ type: 'paragraph' }] } })
  const open = async (id: number) => { setLoadingId(id); setError(''); try { setDraft(await getAdminBlog(id)) } catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa tải được bài viết.') } finally { setLoadingId(null) } }
  return <div className="mx-auto max-w-7xl space-y-6"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-emerald-700">Nội dung & cảm hứng</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Bài viết & Studio</h1><p className="mt-2 text-sm text-slate-500">Soạn câu chuyện, thiết kế nội dung và xuất bản lên Blog CleanMaster.</p></div><button onClick={create} className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-800">＋ Thêm bài viết</button></header>
    <ResourceStatus {...resource} />{error && <p role="alert" className="text-red-600">{error}</p>}
    <div className="grid gap-4 sm:grid-cols-3">{(['PUBLISHED', 'DRAFT', 'ARCHIVED'] as const).map(value => <button key={value} type="button" onClick={() => { setStatus(value); setPage(1) }} className={`rounded-xl border bg-white p-5 text-left ${status === value ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200'}`}><span className="text-sm text-slate-500">{statusLabels[value]}</span><p className="mt-2 text-3xl font-bold">{resource.data.filter(article => article.status === value).length}</p></button>)}</div>
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="grid gap-3 border-b border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-[1fr_200px_220px]"><input aria-label="Tìm bài viết" value={search} onChange={event => { setSearch(event.target.value); setPage(1) }} placeholder="Tìm tiêu đề, tác giả hoặc đường dẫn…" className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm" /><select aria-label="Trạng thái bài viết" value={status} onChange={event => { setStatus(event.target.value); setPage(1) }} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"><option value="ALL">Tất cả trạng thái</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><select aria-label="Chuyên mục bài viết" value={category} onChange={event => { setCategory(event.target.value); setPage(1) }} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"><option value="ALL">Tất cả chuyên mục</option>{Object.entries(blogCategories).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
      <div className="divide-y divide-slate-100">{visible.slice((currentPage - 1) * 12, currentPage * 12).map(article => <article key={article.id} className="flex flex-wrap items-center gap-4 p-5 hover:bg-slate-50/50">{article.coverUrl ? <img src={article.coverUrl} alt="" className="h-20 w-28 rounded-lg object-cover" /> : <div className="flex h-20 w-28 items-center justify-center rounded-lg bg-emerald-50 text-2xl text-emerald-700">✎</div>}<div className="min-w-[200px] flex-1"><p className="text-xs font-semibold text-emerald-700">{blogCategories[article.category]}</p><h2 className="mt-1 text-base font-bold">{article.title}</h2><p className="mt-2 text-xs text-slate-400">{article.authorName} · Cập nhật {new Date(article.updatedAt).toLocaleString('vi-VN')}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${article.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700' : article.status === 'DRAFT' ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-slate-500'}`}>{statusLabels[article.status]}</span><div className="flex items-center gap-3">{article.status === 'PUBLISHED' && <Link to={`/blog/${article.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-slate-500">Xem bài ↗</Link>}<button disabled={loadingId !== null} type="button" onClick={() => void open(article.id)} className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 disabled:opacity-50">{loadingId === article.id ? 'Đang mở…' : 'Mở Studio'}</button></div></article>)}</div>
      {!resource.loading && !visible.length && <p className="p-12 text-center text-slate-500">Chưa có bài viết phù hợp. Bạn có thể tạo bài viết mới trong Studio.</p>}
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm text-slate-500"><span>{visible.length} bài viết · Trang {currentPage}/{totalPages}</span><div className="flex gap-2"><button disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className="rounded border px-3 py-1 disabled:opacity-40">Trước</button><button disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)} className="rounded border px-3 py-1 disabled:opacity-40">Sau</button></div></div>
    </section>
    {draft && <BlogStudio key={draft.id || 'new'} initial={draft} onClose={() => setDraft(null)} onSaved={resource.retry} />}
  </div>
}
