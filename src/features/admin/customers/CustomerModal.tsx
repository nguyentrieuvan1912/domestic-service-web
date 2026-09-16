import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Customer, CustomerStatus } from '../../../data/mockAdminCustomers'
import {
  customerStatusLabels,
  customerStatusStyles,
} from '../../../data/mockAdminCustomers'

type CustomerModalProps = {
  customer: Customer
  onClose: () => void
  onSaveCustomer: (updated: Customer) => void
}

type ModalTab = 'overview' | 'history'

const inputClassName =
  'w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 transition-colors disabled:bg-slate-100 disabled:text-slate-500'
const labelClassName = 'block mb-1.5 text-sm font-semibold text-slate-700'

export default function CustomerModal({
  customer,
  onClose,
  onSaveCustomer,
}: CustomerModalProps) {
  const [draft, setDraft] = useState<Customer>(() => ({ ...customer }))
  const [activeTab, setActiveTab] = useState<ModalTab>('overview')

  const handleStatusChange = (status: CustomerStatus) => {
    setDraft((prev) => ({
      ...prev,
      status,
      statusNote: status === 'ACTIVE' ? '' : prev.statusNote || '',
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSaveCustomer(draft)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        role="presentation"
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      />

      {/* Slide-over Drawer (max-w-xl) */}
      <section
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-white shadow-2xl h-screen"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-modal-title"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                Hồ sơ tài khoản khách hàng
              </p>
              <h2 id="customer-modal-title" className="mt-0.5 text-xl font-bold text-slate-950">
                {draft.fullName}
              </h2>
            </div>
            <span
              className={`rounded-full border px-2.5 py-1 text-xs font-bold ${
                customerStatusStyles[draft.status]
              }`}
            >
              {customerStatusLabels[draft.status]}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition"
          >
            ×
          </button>
        </header>

        {/* 2 Internal Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-white px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Thông tin & Tổng quan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeTab === 'history'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Lịch sử Booking ({draft.recentBookings.length})
          </button>
        </div>

        {/* Form & Body Content */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* TAB 1: Thông tin & Tổng quan */}
            {activeTab === 'overview' && (
              <section className="space-y-6">
                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Tổng số đơn đã đặt
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {draft.totalBookings} đơn
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Tích lũy từ khi tham gia</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-emerald-50/60 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                      Tổng chi tiêu tích lũy
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-emerald-800">
                      {new Intl.NumberFormat('vi-VN').format(draft.totalSpent)}đ
                    </p>
                    <p className="mt-1 text-xs text-emerald-600">Đã thanh toán trên hệ thống</p>
                  </div>
                </div>

                {/* Read-only Contact Information */}
                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                    Thông tin liên hệ & Địa chỉ
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={labelClassName}>Họ và tên</label>
                      <input
                        readOnly
                        value={draft.fullName}
                        className={`${inputClassName} bg-slate-50 font-semibold`}
                      />
                    </div>

                    <div>
                      <label className={labelClassName}>Số điện thoại</label>
                      <input
                        readOnly
                        value={draft.phone}
                        className={`${inputClassName} bg-slate-50`}
                      />
                    </div>

                    <div>
                      <label className={labelClassName}>Địa chỉ Email</label>
                      <input
                        readOnly
                        value={draft.email}
                        className={`${inputClassName} bg-slate-50`}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={labelClassName}>Địa chỉ phục vụ mặc định</label>
                      <input
                        readOnly
                        value={draft.address}
                        className={`${inputClassName} bg-slate-50`}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={labelClassName}>Ngày đăng ký tham gia</label>
                      <input
                        readOnly
                        value={draft.joinDate}
                        className={`${inputClassName} bg-slate-50`}
                      />
                    </div>
                  </div>
                </div>

                {/* Status Update Form */}
                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                    Quản lý Trạng thái Tài khoản
                  </h3>

                  <div>
                    <label className={labelClassName}>Trạng thái tài khoản</label>
                    <select
                      value={draft.status}
                      onChange={(e) => handleStatusChange(e.target.value as CustomerStatus)}
                      className={`${inputClassName} font-semibold`}
                    >
                      <option value="ACTIVE">🟢 ACTIVE - Đang hoạt động bình thường</option>
                      <option value="LOCKED">🔴 LOCKED - Bị khóa / Hạn chế truy cập</option>
                    </select>
                  </div>

                  {draft.status === 'LOCKED' && (
                    <div>
                      <label className={labelClassName}>Lý do khóa tài khoản</label>
                      <textarea
                        required
                        value={draft.statusNote || ''}
                        onChange={(e) => setDraft({ ...draft, statusNote: e.target.value })}
                        rows={3}
                        className={`${inputClassName} resize-none`}
                        placeholder="Nhập lý do khóa tài khoản khách hàng..."
                      />
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* TAB 2: Lịch sử Booking */}
            {activeTab === 'history' && (
              <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                  Danh sách đơn hàng gần đây ({draft.recentBookings.length})
                </h3>

                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Mã đơn</th>
                        <th className="px-4 py-3">Dịch vụ</th>
                        <th className="px-4 py-3">Ngày</th>
                        <th className="px-4 py-3">Số tiền</th>
                        <th className="px-4 py-3 text-right">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {draft.recentBookings.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-bold text-slate-900">{item.id}</td>
                          <td className="px-4 py-3 font-medium text-slate-700">{item.serviceName}</td>
                          <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{item.date}</td>
                          <td className="px-4 py-3 font-semibold text-emerald-700 whitespace-nowrap">
                            {new Intl.NumberFormat('vi-VN').format(item.amount)}đ
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                item.status === 'Hoàn thành'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : item.status === 'Đã hủy'
                                  ? 'bg-rose-50 text-rose-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {draft.recentBookings.length === 0 && (
                    <div className="p-6 text-center text-slate-400">
                      Chưa có lịch sử đơn hàng.
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <footer className="sticky bottom-0 z-10 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              Lưu thay đổi
            </button>
          </footer>
        </form>
      </section>
    </>
  )
}
