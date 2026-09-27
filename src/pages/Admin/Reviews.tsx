import { useState } from 'react'
import type { Review } from '../../data/mockAdminReviews'
import { mockAdminReviews } from '../../data/mockAdminReviews'
import ReviewModal from '../../features/admin/reviews/ReviewModal'
import ReviewTable from '../../features/admin/reviews/ReviewTable'

type FilterTab = 'ALL' | 'POSITIVE' | 'NEEDS_ACTION' | 'HIDDEN'

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: 'ALL', label: 'Tất cả đánh giá' },
  { id: 'POSITIVE', label: 'Tích cực (4-5★)' },
  { id: 'NEEDS_ACTION', label: 'Cần xử lý (1-3★)' },
  { id: 'HIDDEN', label: 'Bị ẩn / Vi phạm' },
]

export default function AdminReviews() {
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL')
  const [reviews, setReviews] = useState<Review[]>(mockAdminReviews)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [search, setSearch] = useState('')

  const filteredReviews = reviews.filter((item) => {
    // Tab filter logic
    let matchesTab = true
    if (activeTab === 'POSITIVE') {
      matchesTab = item.rating >= 4 && item.status !== 'HIDDEN'
    } else if (activeTab === 'NEEDS_ACTION') {
      matchesTab = item.rating <= 3 || item.status === 'RESOLVED'
    } else if (activeTab === 'HIDDEN') {
      matchesTab = item.status === 'HIDDEN'
    }

    // Search query logic
    const query = search.trim().toLowerCase()
    const matchesSearch =
      !query ||
      item.bookingId.toLowerCase().includes(query) ||
      item.customerName.toLowerCase().includes(query) ||
      item.staffName.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query)

    return matchesTab && matchesSearch
  })

  const handleSaveReview = (updated: Review) => {
    setReviews((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    )
    setSelectedReview(null)
  }

  const getTabCount = (tabId: FilterTab): number => {
    if (tabId === 'ALL') return reviews.length
    if (tabId === 'POSITIVE')
      return reviews.filter((r) => r.rating >= 4 && r.status !== 'HIDDEN').length
    if (tabId === 'NEEDS_ACTION')
      return reviews.filter((r) => r.rating <= 3 || r.status === 'RESOLVED').length
    if (tabId === 'HIDDEN')
      return reviews.filter((r) => r.status === 'HIDDEN').length
    return 0
  }

  return (
    <div className="space-y-8">
      {/* Top Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Quản trị Chất lượng & Chăm sóc khách hàng
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            Quản lý đánh giá & Hỗ trợ
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Theo dõi ý kiến phản hồi của khách hàng, xử lý các khiếu nại chất lượng dịch vụ và kiểm duyệt nội dung thô tục.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Container */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          {/* Status Filter Tabs */}
          <div className="flex gap-1 overflow-x-auto">
            {filterTabs.map((tab) => {
              const count = getTabCount(tab.id)
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-80">
            <label className="relative block">
              <span className="sr-only">Tìm kiếm đánh giá</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Tìm theo Mã đơn (BK-xxx), Tên Khách/Staff..."
              />
            </label>
          </div>
        </div>

        {/* Review Table */}
        <ReviewTable
          reviews={filteredReviews}
          onSelectReview={(rev) => setSelectedReview(rev)}
        />
      </section>

      {/* Detail & Edit Modal */}
      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onSaveReview={handleSaveReview}
        />
      )}
    </div>
  )
}
