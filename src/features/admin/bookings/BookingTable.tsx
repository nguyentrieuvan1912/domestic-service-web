import type { Booking } from '../../../data/mockAdminBookings'
import {
  bookingStatusLabels,
  bookingStatusStyles,
  dispatchModeLabels,
  dispatchModeStyles,
} from '../../../data/mockAdminBookings'

type BookingTableProps = {
  bookings: Booking[]
  onSelectBooking: (booking: Booking) => void
}

export default function BookingTable({ bookings, onSelectBooking }: BookingTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50/80 text-xs uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3.5 whitespace-nowrap">Mã đơn</th>
            <th className="px-4 py-3.5 min-w-[180px]">Khách hàng</th>
            <th className="px-4 py-3.5 min-w-[180px]">Dịch vụ & Thời gian</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Điều phối</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Trạng thái</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Tổng tiền</th>
            <th className="px-4 py-3.5 text-right whitespace-nowrap w-24">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {bookings.map((booking) => (
            <tr key={booking.id} className="transition hover:bg-slate-50/80">
              {/* Mã đơn */}
              <td className="px-4 py-3.5 font-extrabold text-slate-800 font-mono text-xs whitespace-nowrap">
                {booking.id}
              </td>

              {/* Khách hàng */}
              <td className="px-4 py-3.5 min-w-[180px]">
                <div>
                  <p className="font-semibold text-slate-800 leading-tight">{booking.customerName}</p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500 leading-none">{booking.customerPhone}</p>
                  <p className="mt-0.5 text-xs text-slate-400 leading-relaxed line-clamp-1 max-w-xs">
                    {booking.address}
                  </p>
                </div>
              </td>

              {/* Dịch vụ & Thời gian */}
              <td className="px-4 py-3.5 min-w-[180px]">
                <div>
                  <p className="font-semibold text-emerald-700 leading-tight">{booking.serviceName}</p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500 whitespace-nowrap leading-tight">
                    📅 {booking.bookingDate} ({booking.bookingTime})
                  </p>
                </div>
              </td>

              {/* Chế độ điều phối */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide leading-none ${
                    dispatchModeStyles[booking.dispatchMode]
                  }`}
                >
                  {dispatchModeLabels[booking.dispatchMode]}
                </span>
              </td>

              {/* Trạng thái đơn */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide leading-none ${
                    bookingStatusStyles[booking.status]
                  }`}
                >
                  {bookingStatusLabels[booking.status]}
                </span>
              </td>

              {/* Tổng tiền */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <div>
                  <p className="font-extrabold text-slate-900 leading-tight">
                    {new Intl.NumberFormat('vi-VN').format(booking.totalAmount)}đ
                  </p>
                  <span
                    className={`mt-0.5 inline-block text-[11px] font-semibold leading-none ${
                      booking.paymentStatus === 'PAID'
                        ? 'text-emerald-600'
                        : booking.paymentStatus === 'REFUNDED'
                        ? 'text-purple-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {booking.paymentStatus === 'PAID'
                      ? '✓ Đã thanh toán'
                      : booking.paymentStatus === 'REFUNDED'
                      ? '↩ Đã hoàn tiền'
                      : '⏳ Chưa thanh toán'}
                  </span>
                </div>
              </td>

              {/* Thao tác */}
              <td className="px-4 py-3.5 text-right whitespace-nowrap w-24">
                <button
                  type="button"
                  onClick={() => onSelectBooking(booking)}
                  className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {bookings.length === 0 && (
        <div className="px-4 py-10 text-center text-sm text-slate-500">
          Không tìm thấy đơn đặt dịch vụ nào trong nhóm này.
        </div>
      )}
    </div>
  )
}
