import { useState } from 'react'
import { Link } from 'react-router-dom'
import { blogCategoryLabels, blogPosts, type BlogPost } from '../../data/blogs'

type BlogFilter = 'ALL' | BlogPost['category']

export default function Blog() {
  const [activeFilter, setActiveFilter] = useState<BlogFilter>('ALL')
  const visiblePosts = activeFilter === 'ALL' ? blogPosts : blogPosts.filter((post) => post.category === activeFilter)

  return (
    <div className="bg-slate-50">
      <section className="bg-[#f3faf7] px-5 py-16 sm:py-20 lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Blog CleanMaster</p><h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Cảm hứng cho một tổ ấm nhẹ nhàng hơn.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Mẹo dọn dẹp, kiến thức gia đình và những góc nhìn hữu ích cho cuộc sống hàng ngày.</p></div></section>
      <main className="mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:px-8"><div className="flex flex-wrap gap-3" role="tablist" aria-label="Lọc bài viết">{(['ALL', 'CLEANING_TIPS', 'FAMILY_KNOWLEDGE'] as BlogFilter[]).map((filter) => { const isActive = filter === activeFilter; const label = filter === 'ALL' ? 'Tất cả' : blogCategoryLabels[filter]; return <button key={filter} type="button" role="tab" aria-selected={isActive} onClick={() => setActiveFilter(filter)} className={`rounded-full px-5 py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${isActive ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-emerald-700'}`}>{label}</button> })}</div><div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">{visiblePosts.map((post) => <article key={post.id} className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/70 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10"><div className="overflow-hidden"><img src={post.imageUrl} alt={post.title} className="aspect-[1.6/1] w-full object-cover transition duration-500 group-hover:scale-105" /></div><div className="p-6"><div className="flex items-center justify-between gap-3 text-xs font-bold text-emerald-700"><span>{blogCategoryLabels[post.category]}</span><time dateTime={post.date}>{new Date(post.date).toLocaleDateString('vi-VN')}</time></div><h2 className="mt-4 text-xl font-black leading-snug text-slate-900">{post.title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p><Link to={`/blog/${post.slug}`} className="mt-6 inline-flex font-bold text-emerald-700 hover:text-emerald-800">Đọc bài viết <span className="ml-2">→</span></Link></div></article>)}</div>{visiblePosts.length === 0 && <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">Chưa có bài viết trong danh mục này.</div>}</main>
    </div>
  )
}
