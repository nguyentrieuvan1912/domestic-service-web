import { useState } from 'react'
import type { Booking } from '../../data/mockAdminBookings'
import { mockAdminBookings } from '../../data/mockAdminBookings'
import BookingModal from '../../features/admin/bookings/BookingModal'
import BookingTable from '../../features/admin/bookings/BookingTable'

type FilterTab = 'ALL' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: 'ALL', label: 'Tất cả đơn' },
  { id: 'PROCESSING', label: 'Đang xử lý & Thực hiện' },
  { id: 'COMPLETED', label: 'Hoàn thành' },
  { id: 'CANCELLED', label: 'Đã hủy' },
]

export default function AdminBookings() {
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL')
  const [bookings, setBookings] = useState<Booking[]>(mockAdminBookings)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [search, setSearch] = useState('')

  const filteredBookings = bookings.filter((booking) => {
    // Tab filter logic
    let matchesTab = true
    if (activeTab === 'PROCESSING') {
      matchesTab =
        booking.status === 'SEARCHING' ||
        booking.status === 'MATCHED' ||
        booking.status === 'IN_PROGRESS'
    } else if (activeTab === 'COMPLETED') {
      matchesTab = booking.status === 'COMPLETED'
    } else if (activeTab === 'CANCELLED') {
      matchesTab = booking.status === 'CANCELLED'
    }

    // Search query logic
    const query = search.trim().toLowerCase()
    const matchesSearch =
      !query ||
      booking.id.toLowerCase().includes(query) ||
      booking.customerName.toLowerCase().includes(query) ||
      booking.customerPhone.toLowerCase().includes(query) ||
      booking.serviceName.toLowerCase().includes(query)

    return matchesTab && matchesSearch
  })

  const handleUpdateBooking = (updated: Booking) => {
    setBookings((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    )
    setSelectedBooking(updated)
  }

  const getTabCount = (tabId: FilterTab): number => {
    if (tabId === 'ALL') return bookings.length
    if (tabId === 'PROCESSING')
      return bookings.filter(
        (b) =>
          b.status === 'SEARCHING' ||
          b.status === 'MATCHED' ||
          b.status === 'IN_PROGRESS'
      ).length
    if (tabId === 'COMPLETED')
      return bookings.filter((b) => b.status === 'COMPLETED').length
    if (tabId === 'CANCELLED')
      return bookings.filter((b) => b.status === 'CANCELLED').length
    return 0
  }

  return (
    <div className="space-y-8">
      {/* Top Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Quản trị Vận hành & Điều phối
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Quản lý đơn đặt dịch vụ
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Theo dõi trạng thái đơn hàng, giám sát luồng tự động tìm Staff hoặc khách tự chọn, xem chi tiết tùy chọn dịch vụ.
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
              <span className="sr-only">Tìm kiếm đơn hàng</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Tìm theo Mã đơn (BK-xxx), Tên, SĐT..."
              />
            </label>
          </div>
        </div>

        {/* Data Table */}
        <BookingTable
          bookings={filteredBookings}
          onSelectBooking={(booking) => setSelectedBooking(booking)}
        />
      </section>

      {/* Detail Slide-over Modal */}
      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdateBooking={handleUpdateBooking}
        />
      )}
    </div>
  )
}
