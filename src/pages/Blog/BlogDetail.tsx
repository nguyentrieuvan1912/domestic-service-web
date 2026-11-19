import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { blogCategories, publicBlog } from '../../api/blog'
import type { BlogArticle } from '../../api/blog'
import ArticleContent from '../../features/blog/ArticleContent'

export default function BlogDetail() {
  const { slug } = useParams()
  return <LoadedArticle key={slug} slug={slug || ''} />
}

function LoadedArticle({ slug }: { slug: string }) {
  const [article, setArticle] = useState<BlogArticle | null>(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0 })
    const controller = new AbortController()
    void publicBlog<BlogArticle>(`/${encodeURIComponent(slug || '')}`, controller.signal)
      .then((data) => {
        setArticle(data)
        setError('')
      })
      .catch((cause) => {
        if (!controller.signal.aborted) setError(cause.message)
      })
    return () => controller.abort()
  }, [slug])

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0) {
        setProgress(0)
        return
      }
      setProgress(Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">{error}</h1>
        <Link to="/blog" className="mt-6 inline-block font-semibold text-emerald-700 hover:underline">
          ← Về trang Blog
        </Link>
      </div>
    )
  }

  if (!article) {
    return <p role="status" className="p-20 text-center text-slate-500">Đang tải bài viết…</p>
  }

  const readMinutes = Math.max(1, Math.ceil(JSON.stringify(article.document).split(/\s+/).length / 240))

  return (
    <article className="relative bg-[#fafbf9] pb-20">
      {/* Reading progress bar */}
      <div aria-hidden="true" className="fixed left-0 right-0 top-0 z-[60] h-1 bg-transparent">
        <div
          className="h-full bg-emerald-600 transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header className="cm-fade-up mx-auto max-w-5xl px-6 pb-10 pt-10 sm:pt-16">
        <Link to="/blog" className="text-sm font-semibold text-slate-500 transition hover:text-emerald-700">
          ← Tất cả bài viết
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-800">
            {blogCategories[article.category]}
          </span>
          <span className="text-slate-500">{readMinutes} phút đọc</span>
        </div>
        <h1 className="mt-5 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl">
          {article.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{article.excerpt}</p>
        <div className="mt-7 flex items-center gap-3 border-t border-slate-200 pt-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 font-bold text-white">
            C
          </span>
          <div>
            <p className="text-sm font-bold text-slate-800">{article.authorName}</p>
            <p className="mt-1 text-xs text-slate-500">
              {new Date(article.publishedAt || article.updatedAt).toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <img
          src={article.coverUrl}
          alt={article.title}
          className="aspect-[16/7] w-full rounded-3xl object-cover shadow-sm"
        />
      </div>

      <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white px-6 py-10 shadow-sm ring-1 ring-slate-100 sm:px-12">
        <ArticleContent document={article.document} />
      </div>

      <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-between gap-4 px-6">
        <Link to="/blog" className="font-semibold text-emerald-700 hover:underline">
          ← Khám phá bài viết khác
        </Link>
        <Link
          to="/download"
          className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
        >
          Trải nghiệm ứng dụng CleanMaster ↗
        </Link>
      </div>
    </article>
  )
}
