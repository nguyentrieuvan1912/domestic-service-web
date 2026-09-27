import type { Review } from '../../../data/mockAdminReviews'
import {
  reviewStatusLabels,
  reviewStatusStyles,
} from '../../../data/mockAdminReviews'

type ReviewTableProps = {
  reviews: Review[]
  onSelectReview: (review: Review) => void
}

export default function ReviewTable({
  reviews,
  onSelectReview,
}: ReviewTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50/80 text-xs uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3.5 whitespace-nowrap">Đơn hàng</th>
            <th className="px-4 py-3.5 whitespace-nowrap min-w-[160px]">Khách hàng</th>
            <th className="px-4 py-3.5 whitespace-nowrap min-w-[160px]">Nhân viên thực hiện</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Đánh giá</th>
            <th className="px-4 py-3.5">Nội dung phản hồi</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Trạng thái</th>
            <th className="px-4 py-3.5 text-right whitespace-nowrap w-24">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {reviews.map((item) => (
            <tr key={item.id} className="transition hover:bg-slate-50/80">
              {/* Đơn hàng */}
              <td className="px-4 py-3.5 font-extrabold text-slate-800 font-mono text-xs whitespace-nowrap">
                {item.bookingId}
              </td>

              {/* Khách hàng */}
              <td className="px-4 py-3.5 whitespace-nowrap min-w-[160px]">
                <div>
                  <p className="font-semibold text-slate-800 leading-tight">{item.customerName}</p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500 leading-none">{item.customerPhone}</p>
                </div>
              </td>

              {/* Staff thực hiện */}
              <td className="px-4 py-3.5 whitespace-nowrap min-w-[160px]">
                <div>
                  <p className="font-semibold text-slate-800 leading-tight">{item.staffName}</p>
                  <p className="mt-0.5 text-xs font-medium text-emerald-700 leading-none">{item.serviceName}</p>
                </div>
              </td>

              {/* Đánh giá (Số sao ⭐) */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-1 font-bold text-slate-800 text-xs">
                  <span className="text-amber-500">★</span>
                  <span>{item.rating}.0</span>
                </div>
              </td>

              {/* Nội dung */}
              <td className="px-4 py-3.5">
                <p className="text-xs text-slate-600 font-medium line-clamp-1 max-w-xs leading-normal">
                  {item.content}
                </p>
              </td>

              {/* Trạng thái */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide leading-none ${
                    reviewStatusStyles[item.status]
                  }`}
                >
                  {reviewStatusLabels[item.status]}
                </span>
              </td>

              {/* Thao tác */}
              <td className="px-4 py-3.5 text-right whitespace-nowrap w-24">
                <button
                  type="button"
                  onClick={() => onSelectReview(item)}
                  className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {reviews.length === 0 && (
        <div className="px-4 py-10 text-center text-sm text-slate-500">
          Chưa có đánh giá nào phù hợp với bộ lọc.
        </div>
      )}
    </div>
  )
}
