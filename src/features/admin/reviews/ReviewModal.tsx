import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Review, ReviewStatus } from '../../../data/mockAdminReviews'
import {
  reviewStatusLabels,
  reviewStatusStyles,
} from '../../../data/mockAdminReviews'

type ReviewModalProps = {
  review: Review
  onClose: () => void
  onSaveReview: (saved: Review) => void
}

const inputClassName =
  'w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 transition-colors'
const labelClassName = 'block mb-1.5 text-sm font-semibold text-slate-700'

export default function ReviewModal({
  review,
  onClose,
  onSaveReview,
}: ReviewModalProps) {
  const [draft, setDraft] = useState<Review>(() => ({ ...review }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSaveReview(draft)
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
        aria-labelledby="review-modal-title"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                Phản hồi & Khiếu nại khách hàng
              </p>
              <h2 id="review-modal-title" className="mt-0.5 text-xl font-extrabold tracking-tight text-slate-950">
                Chi tiết Đánh giá
              </h2>
            </div>
            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                reviewStatusStyles[draft.status]
              }`}
            >
              {reviewStatusLabels[draft.status]}
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
            {/* CARD 1: Thông tin gốc đánh giá */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Mức độ hài lòng
                </span>
                <div className="flex items-center gap-1 font-bold text-amber-500 text-sm">
                  <span>★</span>
                  <span className="text-slate-900">{draft.rating}.0 / 5.0</span>
                </div>
              </div>

              {/* Quote block */}
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1.5">
                  Nội dung trích dẫn đánh giá của khách:
                </p>
                <blockquote className="rounded-r-lg border-l-4 border-emerald-500 bg-slate-50 p-3.5 text-xs text-slate-700 italic leading-relaxed font-medium">
                  "{draft.content}"
                </blockquote>
              </div>

              {/* Reference Grid */}
              <div className="grid gap-3 sm:grid-cols-2 text-xs pt-2 border-t border-slate-100">
                <div>
                  <p className="font-medium text-slate-400">Tên khách hàng</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{draft.customerName}</p>
                  <p className="text-slate-500">{draft.customerPhone}</p>
                </div>

                <div>
                  <p className="font-medium text-slate-400">Nhân viên tiếp nhận</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{draft.staffName}</p>
                  <p className="text-emerald-700 font-medium">{draft.serviceName}</p>
                </div>

                <div>
                  <p className="font-medium text-slate-400">Mã đơn dịch vụ</p>
                  <p className="font-bold text-slate-900 font-mono mt-0.5">{draft.bookingId}</p>
                </div>

                <div>
                  <p className="font-medium text-slate-400">Thời gian đánh giá</p>
                  <p className="font-medium text-slate-700 mt-0.5">{draft.createdAt}</p>
                </div>
              </div>
            </div>

            {/* CARD 2: Xử lý nghiệp vụ */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                ⚙️ Xử lý Nghiệp vụ & Kiểm duyệt
              </h3>

              <div>
                <label className={labelClassName}>Trạng thái hiển thị</label>
                <select
                  value={draft.status}
                  onChange={(e) =>
                    setDraft({ ...draft, status: e.target.value as ReviewStatus })
                  }
                  className={`${inputClassName} font-semibold`}
                >
                  <option value="PUBLISHED">🟢 PUBLISHED - Công khai hiển thị</option>
                  <option value="RESOLVED">🔵 RESOLVED - Đã giải quyết khiếu nại</option>
                  <option value="HIDDEN">🔴 HIDDEN - Ẩn do vi phạm từ ngữ</option>
                </select>
              </div>

              <div>
                <label className={labelClassName}>Ghi chú xử lý nội bộ</label>
                <textarea
                  rows={3}
                  value={draft.internalNote || ''}
                  onChange={(e) => setDraft({ ...draft, internalNote: e.target.value })}
                  className={`${inputClassName} resize-none`}
                  placeholder="Nhập ghi chú xử lý (VD: Đã liên hệ bồi thường 50k, đã gọi điện xin lỗi...)"
                />
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
              Lưu trạng thái
            </button>
          </footer>
        </form>
      </section>
    </>
  )
}
