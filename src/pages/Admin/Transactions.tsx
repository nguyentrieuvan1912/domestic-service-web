import { useState } from 'react'
import type { Transaction } from '../../data/mockAdminTransactions'
import { mockAdminTransactions } from '../../data/mockAdminTransactions'
import TransactionModal from '../../features/admin/transactions/TransactionModal'
import TransactionTable from '../../features/admin/transactions/TransactionTable'

type FilterTab = 'ALL' | 'PAYMENT' | 'PAYOUT_REFUND'

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'PAYMENT', label: 'Dòng tiền Thu (Payments)' },
  { id: 'PAYOUT_REFUND', label: 'Dòng tiền Chi (Payout/Refund)' },
]

export default function AdminTransactions() {
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL')
  const [transactions, setTransactions] = useState<Transaction[]>(mockAdminTransactions)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [search, setSearch] = useState('')

  const filteredTransactions = transactions.filter((item) => {
    // Tab filter logic
    let matchesTab = true
    if (activeTab === 'PAYMENT') {
      matchesTab = item.type === 'PAYMENT'
    } else if (activeTab === 'PAYOUT_REFUND') {
      matchesTab = item.type === 'PAYOUT' || item.type === 'REFUND'
    }

    // Search query logic
    const query = search.trim().toLowerCase()
    const matchesSearch =
      !query ||
      item.id.toLowerCase().includes(query) ||
      item.bookingId.toLowerCase().includes(query) ||
      item.actorName.toLowerCase().includes(query) ||
      item.actorPhone.toLowerCase().includes(query)

    return matchesTab && matchesSearch
  })

  const handleSaveTransaction = (updated: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    )
    setSelectedTransaction(null)
  }

  // Summary Metrics
  const totalRevenue = transactions
    .filter((t) => t.type === 'PAYMENT' && t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalPlatformFees = transactions
    .filter((t) => t.status === 'SUCCESS')
    .reduce((sum, t) => sum + (t.platformFee || 0), 0)

  const totalExpenses = transactions
    .filter((t) => (t.type === 'PAYOUT' || t.type === 'REFUND') && t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0)

  const getTabCount = (tabId: FilterTab): number => {
    if (tabId === 'ALL') return transactions.length
    if (tabId === 'PAYMENT') return transactions.filter((t) => t.type === 'PAYMENT').length
    if (tabId === 'PAYOUT_REFUND')
      return transactions.filter((t) => t.type === 'PAYOUT' || t.type === 'REFUND').length
    return 0
  }

  return (
    <div className="space-y-8">
      {/* Top Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Quản trị Tài chính & Dòng tiền
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            Lịch sử giao dịch & Tài chính
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Theo dõi nhật ký nạp/rút tiền, doanh thu thanh toán dịch vụ và đối soát tiền.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Dòng tiền Thu (Thanh toán)
          </p>
          <p className="mt-2 text-2xl font-extrabold text-emerald-700 tracking-tight">
            +{new Intl.NumberFormat('vi-VN').format(totalRevenue)}đ
          </p>
          <p className="mt-1 text-xs text-slate-400">Từ các đơn hoàn tất thanh toán</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Phí nền tảng hệ thống
          </p>
          <p className="mt-2 text-2xl font-extrabold text-sky-700 tracking-tight">
            {new Intl.NumberFormat('vi-VN').format(totalPlatformFees)}đ
          </p>
          <p className="mt-1 text-xs text-slate-400">Tổng phí CleanMaster giữ lại</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Dòng tiền Chi (Payout/Refund)
          </p>
          <p className="mt-2 text-2xl font-extrabold text-rose-600 tracking-tight">
            -{new Intl.NumberFormat('vi-VN').format(totalExpenses)}đ
          </p>
          <p className="mt-1 text-xs text-slate-400">Đã giải ngân cho Staff & Hoàn tiền</p>
        </div>
      </div>

      {/* Filter Tabs & Search Container */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          {/* Filter Tabs */}
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
              <span className="sr-only">Tìm kiếm giao dịch</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Tìm theo Mã GD (TRX-xxx) hoặc Mã đơn (BK-xxx)..."
              />
            </label>
          </div>
        </div>

        {/* Transaction Table */}
        <TransactionTable
          transactions={filteredTransactions}
          onSelectTransaction={(trx) => setSelectedTransaction(trx)}
        />
      </section>

      {/* Detail Modal */}
      {selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onSaveTransaction={handleSaveTransaction}
        />
      )}
    </div>
  )
}

