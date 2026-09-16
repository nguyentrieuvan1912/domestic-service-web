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
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 font-semibold whitespace-nowrap">Mã đơn</th>
            <th className="px-6 py-4 font-semibold">Khách hàng</th>
            <th className="px-6 py-4 font-semibold">Dịch vụ & Thời gian</th>
            <th className="px-6 py-4 font-semibold whitespace-nowrap">Điều phối</th>
            <th className="px-6 py-4 font-semibold whitespace-nowrap">Trạng thái</th>
            <th className="px-6 py-4 font-semibold whitespace-nowrap">Tổng tiền</th>
            <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {bookings.map((booking) => (
            <tr key={booking.id} className="transition hover:bg-slate-50/80">
              {/* Mã đơn */}
              <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                {booking.id}
              </td>

              {/* Khách hàng */}
              <td className="px-6 py-4">
                <div>
                  <p className="font-semibold text-slate-900">{booking.customerName}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{booking.customerPhone}</p>
                  <p className="mt-0.5 text-xs text-slate-400 line-clamp-1 max-w-xs">
                    {booking.address}
                  </p>
                </div>
              </td>

              {/* Dịch vụ & Thời gian */}
              <td className="px-6 py-4">
                <div>
                  <p className="font-semibold text-emerald-700">{booking.serviceName}</p>
                  <p className="mt-0.5 text-xs font-medium text-slate-600">
                    📅 {booking.bookingDate} ({booking.bookingTime})
                  </p>
                </div>
              </td>

              {/* Chế độ điều phối */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    dispatchModeStyles[booking.dispatchMode]
                  }`}
                >
                  {dispatchModeLabels[booking.dispatchMode]}
                </span>
              </td>

              {/* Trạng thái đơn */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    bookingStatusStyles[booking.status]
                  }`}
                >
                  {bookingStatusLabels[booking.status]}
                </span>
              </td>

              {/* Tổng tiền */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <p className="font-bold text-slate-900">
                    {new Intl.NumberFormat('vi-VN').format(booking.totalAmount)}đ
                  </p>
                  <span
                    className={`mt-0.5 inline-block text-[11px] font-semibold ${
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
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => onSelectBooking(booking)}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {bookings.length === 0 && (
        <div className="px-6 py-12 text-center text-sm text-slate-500">
          Không tìm thấy đơn đặt dịch vụ nào trong nhóm này.
        </div>
      )}
    </div>
  )
}
