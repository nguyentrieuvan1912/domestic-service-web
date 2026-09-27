import { useState } from 'react'
import type { FormEvent } from 'react'
import type { DiscountType, Promotion, PromotionStatus } from '../../../data/mockAdminPromotions'

type PromotionModalProps = {
  promotion: Promotion | null
  onClose: () => void
  onSavePromotion: (saved: Promotion) => void
}

const inputClassName =
  'w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 transition-colors'
const labelClassName = 'block mb-1.5 text-sm font-semibold text-slate-700'

const createDraft = (promotion: Promotion | null): Promotion =>
  promotion
    ? { ...promotion }
    : {
        id: `promo-${Date.now()}`,
        code: '',
        description: '',
        discountType: 'PERCENT',
        discountValue: 10,
        maxDiscount: 50000,
        validFrom: new Date().toISOString().split('T')[0],
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        usageLimit: 100,
        usedCount: 0,
        status: 'ACTIVE',
      }

export default function PromotionModal({
  promotion,
  onClose,
  onSavePromotion,
}: PromotionModalProps) {
  const isNew = !promotion
  const [draft, setDraft] = useState<Promotion>(() => createDraft(promotion))

  const handleCodeChange = (val: string) => {
    // Auto convert to uppercase code
    setDraft((prev) => ({ ...prev, code: val.toUpperCase().trim() }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSavePromotion(draft)
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
        aria-labelledby="promotion-modal-title"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Chương trình ưu đãi & Khuyến mãi
            </p>
            <h2 id="promotion-modal-title" className="mt-0.5 text-xl font-bold text-slate-950">
              {isNew ? 'Tạo mã khuyến mãi mới' : `Cập nhật: ${draft.code}`}
            </h2>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {/* Hàng 1: Mã khuyến mãi & Trạng thái */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClassName}>Mã khuyến mãi (Voucher Code)</label>
                <input
                  required
                  value={draft.code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className={`${inputClassName} font-mono font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50/50`}
                  placeholder="VD: CLEAN2026"
                />
              </div>

              <div>
                <label className={labelClassName}>Trạng thái áp dụng</label>
                <select
                  value={draft.status}
                  onChange={(e) =>
                    setDraft({ ...draft, status: e.target.value as PromotionStatus })
                  }
                  className={`${inputClassName} font-semibold`}
                >
                  <option value="ACTIVE">🟢 Đang diễn ra (ACTIVE)</option>
                  <option value="SCHEDULED">🔵 Sắp diễn ra (SCHEDULED)</option>
                  <option value="EXPIRED">⚪ Đã hết hạn (EXPIRED)</option>
                  <option value="DISABLED">🔴 Đã tắt (DISABLED)</option>
                </select>
              </div>
            </div>

            {/* Hàng 2: Mô tả chương trình */}
            <div>
              <label className={labelClassName}>Mô tả chương trình</label>
              <textarea
                required
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                className={`${inputClassName} resize-none`}
                placeholder="Nhập nội dung mô tả chi tiết chương trình khuyến mãi..."
              />
            </div>

            {/* Hàng 3: Loại giảm giá */}
            <div>
              <label className={labelClassName}>Loại giảm giá</label>
              <select
                value={draft.discountType}
                onChange={(e) =>
                  setDraft({ ...draft, discountType: e.target.value as DiscountType })
                }
                className={inputClassName}
              >
                <option value="PERCENT">Giảm theo phần trăm (%)</option>
                <option value="FIXED">Giảm số tiền cố định (VNĐ)</option>
              </select>
            </div>

            {/* Hàng 4: Giá trị giảm & Giảm tối đa */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClassName}>
                  {draft.discountType === 'PERCENT'
                    ? 'Tỷ lệ giảm (%)'
                    : 'Số tiền giảm (VNĐ)'}
                </label>
                <input
                  required
                  type="number"
                  min={1}
                  value={draft.discountValue}
                  onChange={(e) =>
                    setDraft({ ...draft, discountValue: Number(e.target.value) })
                  }
                  className={inputClassName}
                  placeholder={draft.discountType === 'PERCENT' ? 'VD: 20' : 'VD: 50000'}
                />
              </div>

              {draft.discountType === 'PERCENT' && (
                <div>
                  <label className={labelClassName}>Mức giảm tối đa (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    value={draft.maxDiscount || ''}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        maxDiscount: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className={inputClassName}
                    placeholder="VD: 50000"
                  />
                </div>
              )}
            </div>

            {/* Hàng 5: Thời gian bắt đầu - Kết thúc */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClassName}>Ngày bắt đầu</label>
                <input
                  required
                  type="date"
                  value={draft.validFrom}
                  onChange={(e) => setDraft({ ...draft, validFrom: e.target.value })}
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>Ngày kết thúc</label>
                <input
                  required
                  type="date"
                  value={draft.validTo}
                  onChange={(e) => setDraft({ ...draft, validTo: e.target.value })}
                  className={inputClassName}
                />
              </div>
            </div>

            {/* Hàng 6: Lượt dùng tối đa */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClassName}>Lượt dùng tối đa</label>
                <input
                  required
                  type="number"
                  min={1}
                  value={draft.usageLimit}
                  onChange={(e) =>
                    setDraft({ ...draft, usageLimit: Number(e.target.value) })
                  }
                  className={inputClassName}
                  placeholder="VD: 500"
                />
              </div>

              {!isNew && (
                <div>
                  <label className={labelClassName}>Đã sử dụng</label>
                  <input
                    readOnly
                    value={`${draft.usedCount} lượt`}
                    className={`${inputClassName} bg-slate-50 font-semibold`}
                  />
                </div>
              )}
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
              Lưu khuyến mãi
            </button>
          </footer>
        </form>
      </section>
    </>
  )
}
