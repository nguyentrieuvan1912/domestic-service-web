import { useState } from 'react'
import type { Staff, StaffStatus } from '../../data/mockAdminStaff'
import { mockAdminStaff } from '../../data/mockAdminStaff'
import { mockAdminServices } from '../../data/mockAdminServices'
import StaffModal from '../../features/admin/staff/StaffModal'
import StaffTable from '../../features/admin/staff/StaffTable'

type StaffTab = StaffStatus

const tabs: { id: StaffTab; label: string }[] = [
  { id: 'ACTIVE', label: 'Đang hoạt động' },
  { id: 'INACTIVE', label: 'Tạm ngưng' },
  { id: 'LOCKED', label: 'Bị khóa / Hạn chế' },
]

export default function AdminStaff() {
  const [activeTab, setActiveTab] = useState<StaffTab>('ACTIVE')
  const [staffList, setStaffList] = useState<Staff[]>(mockAdminStaff)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState('')

  const visibleStaff = staffList.filter((member) => {
    const matchesTab = member.status === activeTab
    const query = search.trim().toLowerCase()
    const matchesSearch =
      !query ||
      member.fullName.toLowerCase().includes(query) ||
      member.phone.toLowerCase().includes(query)
    return matchesTab && matchesSearch
  })

  const saveStaff = (member: Staff) => {
    setStaffList((current) =>
      current.some((item) => item.id === member.id)
        ? current.map((item) => (item.id === member.id ? member : item))
        : [member, ...current]
    )
    setEditingStaff(null)
    setIsModalOpen(false)
  }

  const handleOpenNewModal = () => {
    setEditingStaff(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (member: Staff) => {
    setEditingStaff(member)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-8">
      {/* Top Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Quản trị nhân sự chính thức
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Quản lý nhân viên
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Quản lý trạng thái, cấp bậc lương, kỹ năng chuyên môn và lịch sử vi phạm của nhân viên.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={handleOpenNewModal}
            className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            + Thêm nhân viên mới
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar Container */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          {/* 3 Status Filter Tabs */}
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const count = staffList.filter((member) => member.status === tab.id).length
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
          <div className="w-full sm:w-72">
            <label className="relative block">
              <span className="sr-only">Tìm kiếm nhân viên</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Tìm theo tên hoặc số điện thoại..."
              />
            </label>
          </div>
        </div>

        {/* Staff Data Table */}
        <StaffTable
          staff={visibleStaff}
          services={mockAdminServices}
          onEdit={handleOpenEditModal}
        />
      </section>

      {/* Slide-over Profile/Edit Modal */}
      {isModalOpen && (
        <StaffModal
          key={editingStaff?.id ?? 'new-staff'}
          staff={editingStaff}
          services={mockAdminServices}
          onClose={() => setIsModalOpen(false)}
          onSave={saveStaff}
        />
      )}
    </div>
  )
}
