import { useState } from 'react'
import type { Customer, CustomerStatus } from '../../data/mockAdminCustomers'
import { mockAdminCustomers } from '../../data/mockAdminCustomers'
import CustomerModal from '../../features/admin/customers/CustomerModal'
import CustomerTable from '../../features/admin/customers/CustomerTable'

type FilterTab = 'ALL' | CustomerStatus

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: 'ALL', label: 'Tất cả khách hàng' },
  { id: 'ACTIVE', label: 'Đang hoạt động' },
  { id: 'LOCKED', label: 'Bị khóa / Hạn chế' },
]

export default function AdminCustomers() {
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL')
  const [customers, setCustomers] = useState<Customer[]>(mockAdminCustomers)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [search, setSearch] = useState('')

  const filteredCustomers = customers.filter((customer) => {
    // Tab filter logic
    const matchesTab = activeTab === 'ALL' || customer.status === activeTab

    // Search query logic
    const query = search.trim().toLowerCase()
    const matchesSearch =
      !query ||
      customer.fullName.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query)

    return matchesTab && matchesSearch
  })

  const handleSaveCustomer = (updated: Customer) => {
    setCustomers((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    )
    setSelectedCustomer(null)
  }

  const getTabCount = (tabId: FilterTab): number => {
    if (tabId === 'ALL') return customers.length
    return customers.filter((c) => c.status === tabId).length
  }

  return (
    <div className="space-y-8">
      {/* Top Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Quản trị Nền tảng & Khách hàng
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Quản lý khách hàng
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Quản lý danh sách tài khoản khách hàng, theo dõi chi tiêu lũy kế và lịch sử đặt dịch vụ.
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
              <span className="sr-only">Tìm kiếm khách hàng</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Tìm theo Tên, SĐT, Email..."
              />
            </label>
          </div>
        </div>

        {/* Customer Table */}
        <CustomerTable
          customers={filteredCustomers}
          onSelectCustomer={(customer) => setSelectedCustomer(customer)}
        />
      </section>

      {/* Slide-over Detail & Edit Modal */}
      {selectedCustomer && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onSaveCustomer={handleSaveCustomer}
        />
      )}
    </div>
  )
}
