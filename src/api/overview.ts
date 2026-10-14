import { adminRequest, getAdminBookings, getAdminStaff } from './operations'
import type { MonthlyData, AnalyticsKpi } from '../data/mockAdminAnalytics'
type MonthlyBooking = { month: number; bookings: number; completed: number; cancelled: number }
type MoneySeries = { month: number; amount: number }[]
export const overviewYear = new Date().getFullYear()
export async function getOverview(period='year') {
  const [booking, finance, bookings, staff] = await Promise.all([
    adminRequest<{ monthly: MonthlyBooking[]; serviceShares: { name: string; value: number; amount: number }[]; districts: { district: string; bookings: number }[] }>('booking', '/admin/statistics?year=' + overviewYear + '&period=' + encodeURIComponent(period)),
    adminRequest<{ revenue: MoneySeries; payouts: MoneySeries; fees: MoneySeries; refunds: MoneySeries }>('finance', '/admin/statistics?year=' + overviewYear), getAdminBookings(), getAdminStaff(),
  ])
  const amount = (series: MoneySeries, month: number) => Number(series.find(x => x.month === month)?.amount || 0)
  const monthly: MonthlyData[] = Array.from({ length: 12 }, (_, i) => ({ month: 'T' + (i + 1), revenue: amount(finance.revenue, i + 1), payout: amount(finance.payouts, i + 1), platformFee: amount(finance.fees, i + 1) }))
  return { booking, finance, monthly, bookings, staff }
}
export const emptyOverview: Awaited<ReturnType<typeof getOverview>> = { booking: { monthly: [], serviceShares: [], districts: [] }, finance: { revenue: [], payouts: [], fees: [], refunds: [] }, monthly: [], bookings: [], staff: [] }
export function overviewKpis(data: typeof emptyOverview, months: number[]): AnalyticsKpi[] {
  const records = data.booking.monthly.filter(x => months.includes(x.month)), financial = data.monthly.filter(x => months.includes(Number(x.month.slice(1))))
  const total = records.reduce((sum, x) => sum + Number(x.bookings), 0), completed = records.reduce((sum, x) => sum + Number(x.completed), 0)
  const money = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + 'đ'
  return [
    { id: 'revenue', title: 'Doanh thu đã xác nhận', value: money(financial.reduce((s, x) => s + x.revenue, 0)), change: '', isPositive: true, subtext: 'Thanh toán đã ghi nhận trong Finance' },
    { id: 'fees', title: 'Phí hệ thống đã quyết toán', value: money(financial.reduce((s, x) => s + x.platformFee, 0)), change: '', isPositive: true, subtext: 'Theo thu nhập đã quyết toán' },
    { id: 'complete', title: 'Tỷ lệ hoàn thành đơn', value: total ? (completed * 100 / total).toFixed(1) + '%' : 'Chưa có đơn', change: '', isPositive: true, subtext: completed + '/' + total + ' đơn trong kỳ' },
    { id: 'staff', title: 'Nhân viên đang hoạt động', value: String(data.staff.filter(s => s.status === 'ACTIVE').length), change: '', isPositive: true, subtext: 'Trạng thái tài khoản hiện tại' },
  ]
}
