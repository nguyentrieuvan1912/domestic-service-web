import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { blogCategories as blogCategoryLabels, publicBlog } from '../../api/blog'
import type { BlogCategory, BlogSummary } from '../../api/blog'
import Reveal from '../../components/common/Reveal'

type BlogFilter = 'ALL' | BlogCategory

function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim()
}

export default function Blog() {
  const [params, setParams] = useSearchParams()
  const selectedCategory = params.get('category')
  const activeFilter: BlogFilter =
    selectedCategory === 'cleaning-tips'
      ? 'CLEANING_TIPS'
      : selectedCategory === 'family'
        ? 'FAMILY_KNOWLEDGE'
        : 'ALL'
  const setActiveFilter = (filter: BlogFilter) =>
    setParams(filter === 'ALL' ? {} : { category: filter === 'CLEANING_TIPS' ? 'cleaning-tips' : 'family' })

  const [blogPosts, setBlogPosts] = useState<BlogSummary[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    void publicBlog<BlogSummary[]>('', controller.signal)
      .then((data) => {
        setBlogPosts(data)
        setError('')
      })
      .catch((cause) => {
        if (!controller.signal.aborted) setError(cause.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [attempt])

  const counts = useMemo(() => {
    return {
      ALL: blogPosts.length,
      CLEANING_TIPS: blogPosts.filter((p) => p.category === 'CLEANING_TIPS').length,
      FAMILY_KNOWLEDGE: blogPosts.filter((p) => p.category === 'FAMILY_KNOWLEDGE').length,
    }
  }, [blogPosts])

  const visiblePosts = useMemo(() => {
    const keyword = normalizeSearch(search)
    return blogPosts.filter((post) => {
      if (activeFilter !== 'ALL' && post.category !== activeFilter) return false
      if (!keyword) return true
      return (
        normalizeSearch(post.title).includes(keyword) ||
        normalizeSearch(post.excerpt).includes(keyword)
      )
    })
  }, [blogPosts, activeFilter, search])

  const showFeatured = !search.trim() && visiblePosts.length > 1
  const featuredPost = showFeatured ? visiblePosts[0] : null
  const gridPosts = showFeatured ? visiblePosts.slice(1) : visiblePosts

  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-[#f3faf7] px-4 py-12 sm:px-5 sm:py-20 lg:px-8">
        <div className="cm-blob-drift pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-200/45 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 shadow-sm">
            Blog & Cẩm nang CleanMaster
          </p>
          <h1 className="cm-fade-up mt-4 max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:mt-5 sm:text-5xl">
            Cảm hứng cho một tổ ấm nhẹ nhàng hơn.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
            Mẹo dọn dẹp thực tế, kiến thức chăm sóc gia đình và cập nhật tính năng mới từ hệ sinh thái ứng dụng CleanMaster — mở đọc tự do không cần đăng nhập.
          </p>

          {/* Search input */}
          <div className="mt-8 max-w-xl">
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200/80 bg-white px-4 py-2.5 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
              <span aria-hidden="true" className="text-slate-400">🔍</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm bài viết, mẹo dọn dẹp, kiến thức gia đình…"
                aria-label="Tìm bài viết"
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Lọc bài viết">
            {(['ALL', 'CLEANING_TIPS', 'FAMILY_KNOWLEDGE'] as BlogFilter[]).map((filter) => {
              const isActive = filter === activeFilter
              const label = filter === 'ALL' ? 'Tất cả' : blogCategoryLabels[filter]
              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(filter)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-emerald-700'
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {counts[filter]}
                  </span>
                </button>
              )
            })}
          </div>
          {!loading && !error && (
            <p className="text-xs font-semibold text-slate-500">
              Hiển thị {visiblePosts.length} bài viết
            </p>
          )}
        </div>

        {loading && (
          <div role="status" className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70">
                <div className="aspect-[1.6/1] bg-slate-200/80" />
                <div className="space-y-3 p-6">
                  <div className="h-3 w-24 rounded bg-slate-200" />
                  <div className="h-5 w-4/5 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div role="alert" className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}{' '}
            <button
              type="button"
              onClick={() => {
                setLoading(true)
                setAttempt((value) => value + 1)
              }}
              className="ml-2 font-bold underline"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Featured Post */}
        {featuredPost && (
          <Reveal className="mt-10">
            <Link
              to={`/blog/${featuredPost.slug}`}
              aria-label={featuredPost.title}
              className="group grid overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 lg:grid-cols-[1.15fr_1fr]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={featuredPost.coverUrl}
                  alt={featuredPost.title}
                  className="aspect-[16/10] h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-5 top-5 rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-bold text-white shadow">
                  Bài viết nổi bật
                </span>
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <div className="flex items-center gap-3 text-xs font-bold text-emerald-700">
                  <span className="rounded-full bg-emerald-50 px-3 py-1">
                    {blogCategoryLabels[featuredPost.category]}
                  </span>
                  <time dateTime={featuredPost.publishedAt || featuredPost.updatedAt} className="text-slate-400">
                    {new Date(featuredPost.publishedAt || featuredPost.updatedAt).toLocaleDateString('vi-VN')}
                  </time>
                </div>
                <h2 className="mt-4 text-2xl font-black leading-snug text-slate-900 transition group-hover:text-emerald-700 sm:text-3xl">
                  {featuredPost.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{featuredPost.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
                  Đọc chi tiết <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </Reveal>
        )}

        {/* Post Grid */}
        <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {gridPosts.map((post, index) => (
            <Reveal key={post.id} delayMs={index * 60}>
              <Link
                to={`/blog/${post.slug}`}
                aria-label={post.title}
                className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-4"
              >
                <div className="overflow-hidden">
                  <img
                    src={post.coverUrl}
                    alt={post.title}
                    className="aspect-[1.6/1] w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-3 text-xs font-bold text-emerald-700">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1">{blogCategoryLabels[post.category]}</span>
                    <time dateTime={post.publishedAt || post.updatedAt} className="text-slate-400">
                      {new Date(post.publishedAt || post.updatedAt).toLocaleDateString('vi-VN')}
                    </time>
                  </div>
                  <h2 className="mt-4 text-xl font-black leading-snug text-slate-900 transition group-hover:text-emerald-700">
                    {post.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                    Đọc tiếp →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {!loading && !error && visiblePosts.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
            <p className="text-base font-bold text-slate-800">Không tìm thấy bài viết phù hợp.</p>
            <p className="mt-2 text-sm text-slate-500">Thử đổi từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
          </div>
        )}
      </main>
    </div>
  )
}
