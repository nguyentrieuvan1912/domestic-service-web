import type { Promotion } from '../../../data/mockAdminPromotions'
import {
  promotionStatusLabels,
  promotionStatusStyles,
} from '../../../data/mockAdminPromotions'

type PromotionTableProps = {
  promotions: Promotion[]
  onEditPromotion: (promotion: Promotion) => void
}

const formatDateVi = (dateStr: string) => {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

export default function PromotionTable({
  promotions,
  onEditPromotion,
}: PromotionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50/80 text-xs uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3.5 min-w-[220px]">Mã Code / Mô tả</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Mức giảm</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Thời gian áp dụng</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Đã dùng / Tối đa</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Trạng thái</th>
            <th className="px-4 py-3.5 text-right whitespace-nowrap w-24">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {promotions.map((item) => (
            <tr key={item.id} className="transition hover:bg-slate-50/80">
              {/* Mã Code & Mô tả */}
              <td className="px-4 py-3.5 min-w-[220px]">
                <div>
                  <span className="inline-block font-mono font-bold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md text-xs leading-none">
                    {item.code}
                  </span>
                  <p className="mt-1.5 text-xs font-medium text-slate-600 leading-relaxed line-clamp-2 max-w-md">
                    {item.description}
                  </p>
                </div>
              </td>

              {/* Mức giảm */}
              <td className="px-4 py-3.5 font-extrabold text-slate-800 whitespace-nowrap leading-tight">
                {item.discountType === 'PERCENT' ? (
                  <div>
                    <span>Giảm {item.discountValue}%</span>
                    {item.maxDiscount && (
                      <p className="text-xs text-slate-500 font-normal mt-0.5">
                        Tối đa {new Intl.NumberFormat('vi-VN').format(item.maxDiscount)}đ
                      </p>
                    )}
                  </div>
                ) : (
                  <span>Giảm {new Intl.NumberFormat('vi-VN').format(item.discountValue)}đ</span>
                )}
              </td>

              {/* Thời gian áp dụng */}
              <td className="px-4 py-3.5 text-xs font-medium text-slate-600 whitespace-nowrap leading-tight">
                {formatDateVi(item.validFrom)} - {formatDateVi(item.validTo)}
              </td>

              {/* Đã dùng / Giới hạn */}
              <td className="px-4 py-3.5 text-xs font-semibold text-slate-700 whitespace-nowrap leading-tight">
                <span className="text-emerald-700 font-bold">{item.usedCount}</span> /{' '}
                {item.usageLimit} lượt
              </td>

              {/* Trạng thái */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide leading-none ${
                    promotionStatusStyles[item.status]
                  }`}
                >
                  {promotionStatusLabels[item.status]}
                </span>
              </td>

              {/* Thao tác */}
              <td className="px-4 py-3.5 text-right whitespace-nowrap w-24">
                <button
                  type="button"
                  onClick={() => onEditPromotion(item)}
                  className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                >
                  Cập nhật
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {promotions.length === 0 && (
        <div className="px-4 py-10 text-center text-sm text-slate-500">
          Chưa có chương trình khuyến mãi nào trong nhóm này.
        </div>
      )}
    </div>
  )
}
