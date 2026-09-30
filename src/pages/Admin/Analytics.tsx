import { useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  mockAnalyticsKpis,
  mockMonthlyData,
  mockServiceShareData,
  mockTopDistrictsData,
} from '../../data/mockAdminAnalytics'

export default function AdminAnalytics() {
  const [period, setPeriod] = useState('year')

  const handleExport = () => {
    alert('Hệ thống đang chuẩn bị bộ file Báo cáo Thống kê Analytics (Format Excel / PDF)...')
  }

  // Format currency tooltip
  const formatVnd = (value: number) =>
    `${new Intl.NumberFormat('vi-VN').format(value)}đ`

  return (
    <div className="space-y-8">
      {/* Header & Filter Toolbar */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Trực quan hóa Dữ liệu & Báo cáo
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            Thống kê & Báo cáo
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Phân tích hiệu suất dòng tiền, cơ cấu tỷ trọng dịch vụ và bản đồ nhu cầu theo từng khu vực.
          </p>
        </div>

        {/* Cụm Filter & Button */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="month">Tháng này (Thg 9/2026)</option>
            <option value="q1">Quý 1 / 2026</option>
            <option value="q2">Quý 2 / 2026</option>
            <option value="q3">Quý 3 / 2026</option>
            <option value="year">Cả năm 2026</option>
          </select>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 whitespace-nowrap"
          >
            📊 Xuất Excel / PDF
          </button>
        </div>
      </div>

      {/* Khu vực 1 - Summary KPI Cards Grid (4 columns) */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockAnalyticsKpis.map((kpi) => (
          <article
            key={kpi.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {kpi.title}
            </p>
            <p className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
              {kpi.value}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span
                className={`inline-flex items-center font-bold ${
                  kpi.isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {kpi.isPositive ? '↑' : '↓'} {kpi.change}
              </span>
              <span className="text-slate-400 font-medium">{kpi.subtext}</span>
            </div>
          </article>
        ))}
      </section>

      {/* Khu vực 2 - Biểu đồ Dòng tiền & Doanh thu (AreaChart recharts) */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>📈</span> Biểu đồ Dòng tiền & Doanh thu theo tháng
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 font-medium">
              So sánh tổng thu nhập từ khách hàng và chi phí trả lương cho Staff (Đơn vị: VNĐ)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" /> Doanh thu
            </span>
            <span className="flex items-center gap-1.5 text-blue-700">
              <span className="h-3 w-3 rounded-full bg-blue-500 inline-block" /> Chi trả Staff
            </span>
          </div>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockMonthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorPayout" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                tickFormatter={(val) => `${val / 1000000}M`}
              />
              <Tooltip
                formatter={(value: any) => [formatVnd(Number(value))]}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  fontWeight: 600,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Tổng doanh thu"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="payout"
                name="Chi trả thu nhập Staff"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorPayout)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Khu vực 3 - Biểu đồ phụ (PieChart donut & BarChart nằm ngang) */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cột trái - Cơ cấu Dịch vụ (PieChart Donut) */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>🍕</span> Cơ cấu Doanh thu theo Nhóm Dịch vụ
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 font-medium">
              Tỷ trọng doanh số đóng góp từ các danh mục dịch vụ trên toàn hệ thống
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
            <div className="h-64 w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockServiceShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {mockServiceShareData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val}%`]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend details */}
            <div className="w-full md:w-1/2 space-y-2.5">
              {mockServiceShareData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50/80"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-slate-800">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 mr-2">{item.value}%</span>
                    <span className="text-slate-500 text-[11px] font-medium">({item.amount})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cột phải - Top 5 Khu vực / Quận (BarChart nằm ngang) */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>📍</span> Top 5 Khu vực / Quận có lượng Booking cao nhất
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 font-medium">
              Xếp hạng nhu cầu đặt dịch vụ gia đình theo từng quận huyện
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={mockTopDistrictsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis dataKey="district" type="category" stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} đơn đặt dịch vụ`]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                />
                <Bar dataKey="bookings" name="Số lượng đơn" fill="#10b981" radius={[0, 6, 6, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  )
}
