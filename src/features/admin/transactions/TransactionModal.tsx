import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Transaction, TransactionStatus } from '../../../data/mockAdminTransactions'
import {
  paymentMethodLabels,
  transactionStatusLabels,
  transactionStatusStyles,
  transactionTypeLabels,
  transactionTypeStyles,
} from '../../../data/mockAdminTransactions'

type TransactionModalProps = {
  transaction: Transaction
  onClose: () => void
  onSaveTransaction: (updated: Transaction) => void
}

const inputClassName =
  'w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 transition-colors'
const labelClassName = 'block mb-1.5 text-sm font-semibold text-slate-700'

export default function TransactionModal({
  transaction,
  onClose,
  onSaveTransaction,
}: TransactionModalProps) {
  const [draft, setDraft] = useState<Transaction>(() => ({ ...transaction }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSaveTransaction(draft)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        role="presentation"
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      />

      {/* Slide-over Drawer (max-w-lg) */}
      <section
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl h-screen"
        role="dialog"
        aria-modal="true"
        aria-labelledby="trx-modal-title"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                Chi tiết đối soát chứng từ
              </p>
              <h2 id="trx-modal-title" className="mt-0.5 text-xl font-extrabold tracking-tight text-slate-900 font-mono">
                {draft.id}
              </h2>
            </div>
            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                transactionStatusStyles[draft.status]
              }`}
            >
              {transactionStatusLabels[draft.status]}
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

        {/* Content Body Form */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-slate-50/50">
            {/* KHỐI 1: Tổng quan giao dịch */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Phân loại chứng từ
                </span>
                <span
                  className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                    transactionTypeStyles[draft.type]
                  }`}
                >
                  {transactionTypeLabels[draft.type]}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <p className="font-medium text-slate-400">Mã đơn Booking tham chiếu</p>
                  <p className="font-bold text-emerald-700 font-mono text-sm mt-0.5">
                    {draft.bookingId}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-slate-400">Ngày giờ phát sinh</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{draft.createdAt}</p>
                </div>

                <div>
                  <p className="font-medium text-slate-400">Đối tượng thực hiện</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{draft.actorName}</p>
                  <p className="text-slate-500">{draft.actorPhone}</p>
                </div>

                <div>
                  <p className="font-medium text-slate-400">Phương thức thanh toán</p>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {paymentMethodLabels[draft.paymentMethod]}
                  </p>
                </div>
              </div>
            </div>

            {/* KHỐI 2: Chi tiết dòng tiền & Phân bổ */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>💳 Chi tiết dòng tiền & Phân bổ</span>
                <span
                  className={`text-sm font-extrabold ${
                    draft.type === 'PAYMENT' ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {draft.type === 'PAYMENT' ? '+' : '-'}
                  {new Intl.NumberFormat('vi-VN').format(draft.amount)}đ
                </span>
              </h3>

              {draft.breakdown && (
                <div className="rounded-lg bg-slate-50 p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Giá trị dịch vụ gốc:</span>
                    <span className="font-semibold text-slate-900">
                      {new Intl.NumberFormat('vi-VN').format(draft.breakdown.serviceFee)}đ
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Phí nền tảng hệ thống (Thu được):</span>
                    <span className="font-semibold text-emerald-700">
                      +{new Intl.NumberFormat('vi-VN').format(draft.breakdown.platformFee)}đ
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-200/80 pt-2">
                    <span className="text-slate-600 font-medium">Thu nhập Staff nhận được:</span>
                    <span className="font-bold text-blue-700">
                      {new Intl.NumberFormat('vi-VN').format(draft.breakdown.staffEarning)}đ
                    </span>
                  </div>
                </div>
              )}

              {draft.description && (
                <p className="text-xs text-slate-500 italic pt-1">
                  Mô tả: {draft.description}
                </p>
              )}
            </div>

            {/* KHỐI 3: Cập nhật Trạng thái (Hành động) */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                ⚙️ Cập nhật Trạng thái Đối soát
              </h3>

              <div>
                <label className={labelClassName}>Trạng thái xử lý giao dịch</label>
                <select
                  value={draft.status}
                  onChange={(e) =>
                    setDraft({ ...draft, status: e.target.value as TransactionStatus })
                  }
                  className={`${inputClassName} font-semibold`}
                >
                  <option value="SUCCESS">🟢 SUCCESS - Thành công & Đã quyết toán</option>
                  <option value="PENDING">🟡 PENDING - Chờ đối soát / Chờ duyệt lệnh</option>
                  <option value="FAILED">🔴 FAILED - Thất bại / Từ chối giao dịch</option>
                </select>
              </div>
            </div>
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
              Lưu cập nhật
            </button>
          </footer>
        </form>
      </section>
    </>
  )
}
