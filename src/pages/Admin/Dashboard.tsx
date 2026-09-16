const kpis = [
  { label: 'Tổng đơn đặt dịch vụ', value: '1,248', detail: '+12.8% so với tháng trước', tone: 'text-emerald-600' },
  { label: 'Doanh thu', value: '482.6M', detail: '+8.4% so với tháng trước', tone: 'text-blue-600' },
  { label: 'Nhân viên rảnh', value: '86', detail: 'Đang sẵn sàng nhận đơn', tone: 'text-amber-600' },
  { label: 'Khách hàng mới', value: '324', detail: '+16.2% so với tháng trước', tone: 'text-violet-600' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-emerald-600">Tổng quan vận hành</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Tổng quan</h1>
        <p className="mt-2 text-sm text-slate-500">Theo dõi hiệu suất các nhóm dịch vụ trên toàn hệ thống.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Các chỉ số tổng quan">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
            <p className={`mt-4 text-3xl font-bold ${kpi.tone}`}>{kpi.value}</p>
            <p className="mt-2 text-xs text-slate-500">{kpi.detail}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-semibold text-slate-950">Hoạt động gần đây</h2>
          <p className="mt-1 text-sm text-slate-500">Các đơn đặt dịch vụ mới nhất từ nhiều nhóm dịch vụ.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Mã đơn</th>
                <th className="px-6 py-4 font-semibold">Khách hàng</th>
                <th className="px-6 py-4 font-semibold">Dịch vụ</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 text-right font-semibold">Giá trị</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-6 py-4 font-semibold text-slate-900">#CM-10248</td>
                <td className="px-6 py-4 text-slate-600">Nguyễn Minh Anh</td>
                <td className="px-6 py-4 text-slate-600">Vệ sinh nhà</td>
                <td className="px-6 py-4"><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Đang tìm nhân viên</span></td>
                <td className="px-6 py-4 text-right font-semibold text-slate-900">450.000đ</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-slate-900">#CM-10247</td>
                <td className="px-6 py-4 text-slate-600">Trần Quốc Bảo</td>
                <td className="px-6 py-4 text-slate-600">Vệ sinh máy lạnh</td>
                <td className="px-6 py-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Đã tìm thấy</span></td>
                <td className="px-6 py-4 text-right font-semibold text-slate-900">320.000đ</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-slate-900">#CM-10246</td>
                <td className="px-6 py-4 text-slate-600">Lê Hoài Phương</td>
                <td className="px-6 py-4 text-slate-600">Chăm sóc trẻ em</td>
                <td className="px-6 py-4"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Hoàn thành</span></td>
                <td className="px-6 py-4 text-right font-semibold text-slate-900">680.000đ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}