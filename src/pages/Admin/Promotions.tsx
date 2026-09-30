import { useState } from 'react'
import type { Promotion } from '../../data/mockAdminPromotions'
import { mockAdminPromotions } from '../../data/mockAdminPromotions'
import PromotionModal from '../../features/admin/promotions/PromotionModal'
import PromotionTable from '../../features/admin/promotions/PromotionTable'

type FilterTab = 'ALL' | 'ACTIVE' | 'SCHEDULED' | 'EXPIRED_DISABLED'

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: 'ALL', label: 'Tất cả chương trình' },
  { id: 'ACTIVE', label: 'Đang diễn ra' },
  { id: 'SCHEDULED', label: 'Sắp diễn ra' },
  { id: 'EXPIRED_DISABLED', label: 'Hết hạn / Đã tắt' },
]

export default function AdminPromotions() {
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL')
  const [promotions, setPromotions] = useState<Promotion[]>(mockAdminPromotions)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredPromotions = promotions.filter((item) => {
    // Tab filter logic
    let matchesTab = true
    if (activeTab === 'ACTIVE') {
      matchesTab = item.status === 'ACTIVE'
    } else if (activeTab === 'SCHEDULED') {
      matchesTab = item.status === 'SCHEDULED'
    } else if (activeTab === 'EXPIRED_DISABLED') {
      matchesTab = item.status === 'EXPIRED' || item.status === 'DISABLED'
    }

    // Search query logic
    const query = search.trim().toLowerCase()
    const matchesSearch =
      !query ||
      item.code.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)

    return matchesTab && matchesSearch
  })

  const handleSavePromotion = (saved: Promotion) => {
    setPromotions((prev) =>
      prev.some((p) => p.id === saved.id)
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [saved, ...prev]
    )
    setIsModalOpen(false)
    setEditingPromotion(null)
  }

  const handleOpenNewModal = () => {
    setEditingPromotion(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (promotion: Promotion) => {
    setEditingPromotion(promotion)
    setIsModalOpen(true)
  }

  const getTabCount = (tabId: FilterTab): number => {
    if (tabId === 'ALL') return promotions.length
    if (tabId === 'ACTIVE')
      return promotions.filter((p) => p.status === 'ACTIVE').length
    if (tabId === 'SCHEDULED')
      return promotions.filter((p) => p.status === 'SCHEDULED').length
    if (tabId === 'EXPIRED_DISABLED')
      return promotions.filter((p) => p.status === 'EXPIRED' || p.status === 'DISABLED').length
    return 0
  }

  return (
    <div className="space-y-8">
      {/* Top Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Quản trị Tiếp thị & Chiêu thị
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Quản lý khuyến mãi
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Tạo mã voucher giảm giá, thiết lập hạn sử dụng và theo dõi số lượt sử dụng của khách hàng.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={handleOpenNewModal}
            className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            + Tạo mã khuyến mãi
          </button>
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
              <span className="sr-only">Tìm kiếm mã khuyến mãi</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Tìm theo Mã code hoặc Mô tả..."
              />
            </label>
          </div>
        </div>

        {/* Promotion Table */}
        <PromotionTable
          promotions={filteredPromotions}
          onEditPromotion={handleOpenEditModal}
        />
      </section>

      {/* Slide-over Modal */}
      {isModalOpen && (
        <PromotionModal
          key={editingPromotion?.id ?? 'new-promo'}
          promotion={editingPromotion}
          onClose={() => setIsModalOpen(false)}
          onSavePromotion={handleSavePromotion}
        />
      )}
    </div>
  )
}
