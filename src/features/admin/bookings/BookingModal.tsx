import type { Booking } from '../../../data/mockAdminBookings'
import {
  bookingStatusLabels,
  bookingStatusStyles,
  dispatchModeLabels,
  dispatchModeStyles,
} from '../../../data/mockAdminBookings'

type BookingModalProps = {
  booking: Booking
  onClose: () => void
  onUpdateBooking: (updated: Booking) => void
}

export default function BookingModal({
  booking,
  onClose,
  onUpdateBooking,
}: BookingModalProps) {
  const handleCancelBooking = () => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn hủy đơn hàng ${booking.id} của khách hàng ${booking.customerName}?`
      )
    ) {
      const updated: Booking = {
        ...booking,
        status: 'CANCELLED',
        cancelReason: 'Đơn bị hủy trực tiếp bởi Quản trị viên hệ thống',
        paymentStatus: booking.paymentStatus === 'PAID' ? 'REFUNDED' : booking.paymentStatus,
      }
      onUpdateBooking(updated)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        role="presentation"
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      />

      {/* Slide-over Drawer (max-w-2xl) */}
      <section
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-white shadow-2xl h-screen"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                Chi tiết đơn dịch vụ
              </p>
              <h2 id="booking-modal-title" className="mt-0.5 text-xl font-bold text-slate-950">
                Mã đơn: {booking.id}
              </h2>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${
                bookingStatusStyles[booking.status]
              }`}
            >
              {bookingStatusLabels[booking.status]}
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

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-slate-50/50">
          {/* CARD 1: Thông tin Dịch vụ & Khách hàng */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>👤 Thông tin Khách hàng & Dịch vụ</span>
              <span className="text-xs font-normal text-slate-400">Tạo lúc: {booking.createdAt}</span>
            </h3>

            {/* General Info Grid */}
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-xs font-medium text-slate-400">Họ và tên khách hàng</p>
                <p className="font-semibold text-slate-900 mt-0.5">{booking.customerName}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Số điện thoại liên hệ</p>
                <p className="font-semibold text-slate-900 mt-0.5">{booking.customerPhone}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-medium text-slate-400">Địa chỉ phục vụ</p>
                <p className="font-semibold text-slate-900 mt-0.5">{booking.address}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Dịch vụ yêu cầu</p>
                <p className="font-bold text-emerald-700 mt-0.5">{booking.serviceName}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Thời gian thực hiện</p>
                <p className="font-semibold text-slate-900 mt-0.5">
                  📅 {booking.bookingDate} ({booking.bookingTime})
                </p>
              </div>
            </div>

            {/* Dynamic Service Details */}
            {Object.keys(booking.dynamicDetails).length > 0 && (
              <div className="mt-4 border-t border-slate-100 pt-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Tùy chọn chi tiết của dịch vụ:
                </p>
                <div className="rounded-lg bg-slate-50 p-3 space-y-2 text-xs">
                  {Object.entries(booking.dynamicDetails).map(([key, val]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-slate-200/60 pb-1.5 last:border-0 last:pb-0">
                      <span className="font-medium text-slate-600">{key}:</span>
                      <span className="font-semibold text-slate-900 sm:text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CARD 2: Trạng thái Điều phối */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              ⚙️ Trạng thái Điều phối Nhân viên
            </h3>

            <div className="flex items-center justify-between text-sm">
              <span className="text-xs font-medium text-slate-500">Chế độ điều phối:</span>
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${
                  dispatchModeStyles[booking.dispatchMode]
                }`}
              >
                {dispatchModeLabels[booking.dispatchMode]}
              </span>
            </div>

            {/* Staff info based on status */}
            {booking.status === 'SEARCHING' && (
              <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 text-center">
                <p className="text-sm font-semibold text-amber-800 animate-pulse">
                  🔄 Hệ thống đang quét tìm Staff phù hợp khu vực gần nhất...
                </p>
                <p className="mt-1 text-xs text-amber-600">
                  Tự động ghép nối nhân viên theo kỹ năng & thời gian khả dụng.
                </p>
              </div>
            )}

            {(booking.status === 'MATCHED' ||
              booking.status === 'IN_PROGRESS' ||
              booking.status === 'COMPLETED') &&
              booking.staffName && (
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white shadow-sm">
                      {booking.staffName
                        .split(' ')
                        .map((p) => p[0])
                        .slice(-2)
                        .join('')}
                    </span>
                    <div>
                      <p className="text-xs text-blue-600 font-semibold uppercase">Nhân viên tiếp nhận</p>
                      <p className="font-bold text-slate-900 text-base">{booking.staffName}</p>
                      <p className="text-xs text-slate-500">SĐT: {booking.staffPhone}</p>
                    </div>
                  </div>
                  <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800">
                    ID: {booking.staffId}
                  </span>
                </div>
              )}

            {booking.status === 'CANCELLED' && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
                <p className="text-xs font-bold uppercase text-rose-700">Đơn hàng đã bị hủy</p>
                <p className="mt-1 text-xs text-slate-600">
                  Lý do: {booking.cancelReason || 'Không có lý do cụ thể'}
                </p>
              </div>
            )}
          </div>

          {/* CARD 3: Tóm tắt Thanh toán */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>💳 Tóm tắt Thanh toán</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {booking.paymentMethod}
              </span>
            </h3>

            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Giá dịch vụ gốc:</span>
                <span className="font-semibold text-slate-900">
                  {new Intl.NumberFormat('vi-VN').format(booking.subtotal)}đ
                </span>
              </div>

              <div className="flex justify-between">
                <span>Phí nền tảng & điều phối:</span>
                <span className="font-semibold text-slate-900">
                  +{new Intl.NumberFormat('vi-VN').format(booking.platformFee)}đ
                </span>
              </div>

              {booking.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Khuyến mãi / Mã giảm giá:</span>
                  <span className="font-semibold">
                    -{new Intl.NumberFormat('vi-VN').format(booking.discount)}đ
                  </span>
                </div>
              )}

              <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                <span className="text-base font-bold text-slate-900">Tổng thanh toán:</span>
                <span className="text-xl font-extrabold text-emerald-700">
                  {new Intl.NumberFormat('vi-VN').format(booking.totalAmount)}đ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="sticky bottom-0 z-10 flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
          {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' ? (
            <button
              type="button"
              onClick={handleCancelBooking}
              className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 transition"
            >
              Hủy đơn hàng
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Đóng
          </button>
        </footer>
      </section>
    </>
  )
}
