import { adminRequest, getAdminCatalog } from './operations'
import type { BackendBooking } from './operations'
import { getStaff, getCustomers } from './identity'

export interface FinanceReportRecord {
  kind: 'REVENUE' | 'PAYOUT' | 'REFUND' | 'FEE'; id: number; bookingId: number | null; actorId: number; amount: number;
  status: string; effectiveAt: string; method: string; reference: string; description: string;
  serviceAmount?: number; staffAmount?: number; tipAmount?: number
}
export async function getReportData(year: number) {
  const [finance, bookings, staff, customers, catalog, bookingTotals] = await Promise.all([
    adminRequest<FinanceReportRecord[]>('finance', `/admin/statistics/details?year=${year}`),
    adminRequest<(BackendBooking & { customerId?: number })[]>('booking', '/bookings'), getStaff(), getCustomers(), getAdminCatalog(),
    adminRequest<{ monthly: { month: number; bookings: number }[] }>('booking', `/admin/statistics?year=${year}&period=year`),
  ])
  const expected = bookingTotals.monthly.reduce((total, month) => total + Number(month.bookings), 0)
  const received = bookings.filter(booking => new Date(booking.createdAt).toLocaleDateString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).startsWith(String(year))).length
  if (expected !== received) throw new Error(`Chi tiết đơn của năm ${year} chưa khớp số tổng (${received}/${expected} đơn). Vui lòng cập nhật lại; chưa thể xuất báo cáo đầy đủ từ nguồn dữ liệu này.`)
  return { finance, bookings, staff, customers, catalog, capturedAt: new Date().toISOString() }
}
export type ReportData = Awaited<ReturnType<typeof getReportData>>
export const emptyReportData: ReportData = { finance: [], bookings: [], staff: [], customers: [], catalog: { categories: [], services: [], packages: [], addOns: [] }, capturedAt: '' }
