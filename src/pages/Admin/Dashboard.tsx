import { Link as RouterLink } from 'react-router-dom'
import { getOverview, emptyOverview, overviewKpis, overviewYear } from '../../api/overview'
import { exportCsv } from '../../api/operations'
import { useAdminResource } from '../../hooks/useAdminResource'

const loadDashboard = () => getOverview('month')
const bookingStatusStyles: Record<string, string> = {
  WAITING_STAFF: 'bg-amber-50 text-amber-700 border-amber-200',
  SEARCHING: 'bg-amber-50 text-amber-700 border-amber-200',
  MATCHED: 'bg-blue-50 text-blue-700 border-blue-200',
  IN_PROGRESS: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
}

export default function AdminDashboard() {
  const resource = useAdminResource(loadDashboard, emptyOverview)
  const data = resource.data
  const kpis = overviewKpis(data, [new Date().getMonth() + 1])
  const recentBookings = data.bookings.slice(0, 5).map(b => ({ id: b.id, customerName: b.customerName, serviceName: b.serviceName, amount: b.totalAmount, status: b.status, statusLabel: b.status, time: b.createdAt }))
  const topStaff = [...data.staff].sort((a,b) => b.completedBookings - a.completedBookings).slice(0,5).map(s => ({ id: s.id, name: s.fullName, phone: s.phone, specialty: s.rank, rating: s.averageRating, totalTrips: s.completedBookings, rank: s.rank }))
  const handleExportReport = () => {
    exportCsv('bao-cao-'+overviewYear+'.csv', [['Tháng','Doanh thu đã xác nhận','Chuyển tiền Staff đã xác nhận','Phí đã quyết toán'], ...data.monthly.map(m => [m.month,m.revenue,m.payout,m.platformFee])])
  }

  return (
    <div className="space-y-8">
      {resource.loading && <p role="status">Đang tải báo cáo...</p>}
      {resource.error && <p role="alert">{resource.error} <button onClick={resource.retry}>Thử lại</button></p>}
      {/* 1. Header & Greeting Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Cổng thông tin Quản trị SaaS
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            Chào mừng trở lại, Admin! 👋
          </h1>
          <p className="mt-1.5 text-xs font-medium text-slate-500 flex items-center gap-2">
            <span>📅 Báo cáo vận hành hệ thống CleanMaster</span>
            <span>•</span>
            <span className="text-slate-700 font-semibold">{new Date().toLocaleDateString('vi-VN')}</span>
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={handleExportReport}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 whitespace-nowrap"
          >
            📥 Tải báo cáo tháng
          </button>
        </div>
      </div>

      {/* 2. KPI Cards Grid (4 columns) */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <article
            key={kpi.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {kpi.title}
            </p>
            <p className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
              {kpi.value}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span
                className={`inline-flex items-center font-bold ${
                  kpi.isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {kpi.change}
              </span>
              <span className="text-slate-400 font-medium">{kpi.subtext}</span>
            </div>
          </article>
        ))}
      </section>

      {/* 3. Split Content Grid (3 columns: 2 for Recent Bookings, 1 for Top Staff) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2/3 width) - Recent Bookings */}
        <section className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span>🛒</span> Đơn đặt dịch vụ mới nhất
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 font-medium">
                  5 đơn đặt hàng vừa phát sinh trên nền tảng
                </p>
              </div>
              <RouterLink
                to="/admin/bookings"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition"
              >
                Xem tất cả đơn →
              </RouterLink>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-xs uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5 whitespace-nowrap">Mã đơn</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Khách hàng</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Dịch vụ</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Số tiền</th>
                    <th className="px-4 py-3.5 text-right whitespace-nowrap">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="transition hover:bg-slate-50/80">
                      <td className="px-4 py-3.5 font-extrabold text-slate-800 font-mono text-xs whitespace-nowrap">
                        {booking.id}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800 whitespace-nowrap">
                        {booking.customerName}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-emerald-700 whitespace-nowrap">
                        {booking.serviceName}
                      </td>
                      <td className="px-4 py-3.5 font-extrabold text-slate-900 whitespace-nowrap">
                        {new Intl.NumberFormat('vi-VN').format(booking.amount)}đ
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide leading-none ${
                            bookingStatusStyles[booking.status]
                          }`}
                        >
                          {booking.statusLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/50 rounded-b-xl">
            <p className="text-xs text-slate-500 font-medium text-right">
              Dữ liệu được đọc từ Booking và Finance khi mở báo cáo
            </p>
          </div>
        </section>

        {/* Right Column (1/3 width) - Top Staff */}
        <section className="lg:col-span-1 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span>⭐</span> Nhân viên xuất sắc
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 font-medium">
                  Xếp hạng theo số đơn hoàn tất
                </p>
              </div>
              <RouterLink
                to="/admin/staff"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition"
              >
                Tất cả Staff →
              </RouterLink>
            </div>

            <div className="divide-y divide-slate-100 p-2">
              {topStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-sm leading-none">
                      {staff.name
                        .split(' ')
                        .map((p) => p[0])
                        .slice(-2)
                        .join('')}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm leading-tight">
                        {staff.name}
                      </p>
                      <p className="text-xs font-medium text-slate-400 mt-0.5 line-clamp-1">
                        {staff.specialty}
                      </p>
                    </div>
                  </div>

                  <div className="text-right whitespace-nowrap pl-2">
                    <div className="flex items-center justify-end gap-1 font-bold text-slate-800 text-xs">
                      <span className="text-amber-500">★</span>
                      <span>{staff.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                      {staff.totalTrips} chuyến
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/50 rounded-b-xl">
            <p className="text-xs text-slate-500 font-medium text-center">
              Dựa trên đánh giá sao & tổng số chuyến hoàn thành
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}