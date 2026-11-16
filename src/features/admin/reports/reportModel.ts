import type { ReportData, FinanceReportRecord } from '../../../api/reports'
import type { BackendBooking } from '../../../api/operations'
import { bookingStatus } from '../../../api/operations'
import { bookingStatusLabels } from '../../../data/mockAdminBookings'
import { catalogGroupLabel } from '../services/catalogGroups'

export type ReportType = 'revenue' | 'fees' | 'completion' | 'staff' | 'cashflow' | 'services' | 'districts'
export type ReportPeriod = `m${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}` | 'q1' | 'q2' | 'q3' | 'q4' | 'year'
export type CellValue = string | number
export type CellFormat = 'text' | 'money' | 'number' | 'percent' | 'date'
export interface ReportColumn { key: string; label: string; format?: CellFormat; width?: number }
export interface ReportTable { title: string; columns: ReportColumn[]; rows: Record<string, CellValue>[] }
export interface ReportDocument { id: string; title: string; period: string; capturedAt: string; scope: string; notes: string[]; metrics: { label: string; value: CellValue; format?: CellFormat }[]; tables: ReportTable[] }
export interface ReportSelection { type: ReportType; month?: number; group?: string; district?: string; status?: string }
export const reportNames: Record<ReportType, string> = { revenue: 'Doanh thu đã xác nhận', fees: 'Phí hệ thống đã quyết toán', completion: 'Tình hình và tỷ lệ hoàn thành đơn', staff: 'Nhân viên đang hoạt động', cashflow: 'Dòng tiền thu - chi', services: 'Doanh thu theo nhóm dịch vụ', districts: 'Nhu cầu đặt dịch vụ theo khu vực' }
export function monthsFor(period: ReportPeriod) {
  return period.startsWith('m') ? [Number(period.slice(1))] : period.startsWith('q') ? [1, 2, 3].map(month => (Number(period[1]) - 1) * 3 + month) : Array.from({ length: 12 }, (_, i) => i + 1)
}
export function monthAt(value: string) {
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return { year: 0, month: 0 }
  const parts = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' }).formatToParts(date)
  return { year: Number(parts.find(part => part.type === 'year')?.value), month: Number(parts.find(part => part.type === 'month')?.value) }
}
export function formatReportValue(value: CellValue, format: CellFormat = 'text') {
  if (format === 'date') return value ? new Date(value).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : '—'
  if (format === 'money') return new Intl.NumberFormat('vi-VN').format(Number(value)) + ' đ'
  if (format === 'number') return new Intl.NumberFormat('vi-VN').format(Number(value))
  if (format === 'percent') return Number(value).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + '%'
  return String(value)
}
const money = (key: string, label: string): ReportColumn => ({ key, label, format: 'money', width: 22 })
const numeric = (key: string, label: string): ReportColumn => ({ key, label, format: 'number', width: 16 })
const text = (key: string, label: string, width = 28): ReportColumn => ({ key, label, width })
const dateColumn = (key: string, label: string): ReportColumn => ({ key, label, format: 'date', width: 24 })
const sum = <T,>(items: T[], get: (item: T) => number) => items.reduce((total, item) => total + Number(get(item) || 0), 0)
const methods: Record<string, string> = { CASH: 'Tiền mặt', BANK_TRANSFER: 'Chuyển khoản', BANK_TRANSFER_QR: 'Chuyển khoản QR', WALLET: 'Ví khách hàng' }
const kindLabels = { REVENUE: 'Thu thanh toán', PAYOUT: 'Chi rút tiền', REFUND: 'Chi hoàn tiền', FEE: 'Phí quyết toán' }

export function reportSnapshot(data: ReportData, year: number, period: ReportPeriod, selection?: ReportSelection) {
  const months = selection?.month ? [selection.month] : monthsFor(period)
  const inPeriod = (date: string) => { const parts = monthAt(date); return parts.year === year && months.includes(parts.month) }
  const finance = data.finance.filter(record => inPeriod(record.effectiveAt))
  const bookings = data.bookings.filter(booking => inPeriod(booking.createdAt))
  const bookingMap = new Map(data.bookings.map(booking => [String(booking.id), booking]))
  const serviceMap = new Map(data.catalog.services.map(service => [service.id, service]))
  const categoryMap = new Map(data.catalog.categories.map(category => [category.id, category]))
  const staffMap = new Map(data.staff.map(staff => [staff.id, staff]))
  const customerMap = new Map(data.customers.map(customer => [String(customer.id), customer]))
  const areaFor = (booking: BackendBooking) => booking.address.ward || booking.address.district || 'Chưa có khu vực'
  const groupFor = (booking?: BackendBooking) => {
    if (!booking) return 'UNMATCHED'
    const service = serviceMap.get(String(booking.serviceId))
    return service ? categoryMap.get(service.categoryId)?.group || 'UNGROUPED' : 'UNGROUPED'
  }
  const groupLabel = (group: string) => group === 'UNMATCHED' ? 'Chưa đối chiếu được đơn' : catalogGroupLabel(group)
  const serviceFor = (booking?: BackendBooking) => booking?.service.name || booking?.service.serviceName || serviceMap.get(String(booking?.serviceId))?.name || 'Chưa có thông tin dịch vụ'
  const completed = bookings.filter(booking => booking.status === 'COMPLETED')
  const activeStaff = data.staff.filter(staff => staff.status === 'ACTIVE')
  const totalKind = (kind: FinanceReportRecord['kind']) => sum(finance.filter(record => record.kind === kind), record => record.amount)
  const monthly = months.map(month => {
    const records = finance.filter(record => monthAt(record.effectiveAt).month === month)
    const value = (kind: FinanceReportRecord['kind']) => sum(records.filter(record => record.kind === kind), record => record.amount)
    return { month: `T${month}`, monthNumber: month, revenue: value('REVENUE'), payout: value('PAYOUT'), refunds: value('REFUND'), fees: value('FEE'), net: value('REVENUE') - value('PAYOUT') - value('REFUND') }
  })
  const serviceGroups = [...new Set(finance.filter(record => record.kind === 'REVENUE').map(record => groupFor(bookingMap.get(String(record.bookingId)))))].map(group => {
    const records = finance.filter(record => record.kind === 'REVENUE' && groupFor(bookingMap.get(String(record.bookingId))) === group)
    const amount = sum(records, record => record.amount)
    return { group, name: groupLabel(group), amount, records: records.length, value: totalKind('REVENUE') ? amount * 100 / totalKind('REVENUE') : 0 }
  }).sort((a, b) => b.amount - a.amount)
  const districts = [...new Set(bookings.map(areaFor))].map(district => {
    const records = bookings.filter(booking => areaFor(booking) === district)
    return { district, bookings: records.length, completed: records.filter(booking => booking.status === 'COMPLETED').length, cancelled: records.filter(booking => bookingStatus(booking.status) === 'CANCELLED').length, amount: sum(records, booking => booking.totalAmount) }
  }).sort((a, b) => b.bookings - a.bookings || a.district.localeCompare(b.district, 'vi'))
  const staffFor = (booking: BackendBooking) => [...new Set(booking.assignments.filter(item => ['ACCEPTED', 'COMPLETED'].includes(item.status)).map(item => staffMap.get(String(item.staffId))?.fullName || `Không tìm thấy hồ sơ #${item.staffId}`))].join(', ') || 'Chưa phân công'
  const bookingRows = (items: typeof bookings) => items.map(booking => ({ id: String(booking.id), code: booking.bookingCode || `#${booking.id}`, createdAt: booking.createdAt, startsAt: booking.startsAt, service: serviceFor(booking), customer: booking.address.recipientName || booking.address.receiverName || customerMap.get(String(booking.customerId))?.fullName || 'Chưa có tên khách', phone: booking.address.recipientPhone || booking.address.receiverPhone || '', staff: staffFor(booking), area: areaFor(booking), address: booking.address.fullAddress || booking.address.detailAddress || '', status: bookingStatusLabels[bookingStatus(booking.status)], rawStatus: booking.status, amount: Number(booking.totalAmount), payment: booking.paymentStatus, cancelReason: booking.cancellationReason || '' }))
  const financialRows = (items: FinanceReportRecord[]) => items.map(record => {
    const booking = bookingMap.get(String(record.bookingId))
    const person = ['PAYOUT', 'FEE'].includes(record.kind) ? staffMap.get(String(record.actorId)) : customerMap.get(String(record.actorId))
    return { id: `${record.kind}-${record.id}`, kind: kindLabels[record.kind], effectiveAt: record.effectiveAt, code: booking?.bookingCode || (record.bookingId ? `#${record.bookingId}` : '—'), service: booking ? serviceFor(booking) : record.bookingId ? 'Chưa đối chiếu được đơn' : '—', group: groupLabel(groupFor(booking)), person: person?.fullName || `Không tìm thấy hồ sơ #${record.actorId}`, phone: person?.phone || '', amount: Number(record.amount), method: methods[record.method] || record.method || '—', status: record.status, reference: record.reference || '—', description: record.description || '', serviceAmount: Number(record.serviceAmount || 0), staffAmount: Number(record.staffAmount || 0), tipAmount: Number(record.tipAmount || 0) }
  })
  return { months, monthly, serviceGroups, districts, finance, bookings, completed, activeStaff, totalKind, bookingRows, financialRows, areaFor, groupFor, groupLabel, staffMap }
}

const financeColumns = [text('id', 'Mã giao dịch', 22), dateColumn('effectiveAt', 'Ngày xác nhận'), text('code', 'Mã đơn', 20), text('service', 'Dịch vụ', 35), text('person', 'Khách hàng / Nhân viên', 28), text('phone', 'Điện thoại', 18), money('amount', 'Số tiền (VND)'), text('method', 'Phương thức', 20), text('status', 'Trạng thái', 22), text('reference', 'Tham chiếu', 30), text('description', 'Ghi chú', 40)]
const bookingColumns = [text('code', 'Mã đơn', 20), dateColumn('createdAt', 'Ngày tạo đơn'), dateColumn('startsAt', 'Lịch thực hiện'), text('service', 'Dịch vụ', 35), text('customer', 'Khách hàng'), text('phone', 'Điện thoại', 18), text('staff', 'Nhân viên', 32), text('area', 'Khu vực'), text('address', 'Địa chỉ', 40), text('status', 'Trạng thái', 22), money('amount', 'Giá trị đơn (VND)'), text('payment', 'Thanh toán', 18), text('cancelReason', 'Lý do hủy', 40)]

export function buildReport(data: ReportData, year: number, period: ReportPeriod, selection: ReportSelection): ReportDocument {
  const snapshot = reportSnapshot(data, year, period, selection)
  const { months, finance, bookings, totalKind } = snapshot
  const periodLabel = months.length === 12 ? `Năm ${year}` : months.length === 1 ? `Tháng ${months[0]}/${year}` : `Tháng ${months[0]}–${months.at(-1)}/${year}`
  const report: ReportDocument = { id: `${selection.type}-${year}-${months.join('-')}`, title: reportNames[selection.type], period: periodLabel, capturedAt: data.capturedAt, scope: 'Toàn hệ thống', notes: ['Múi giờ: Việt Nam (UTC+7). Dữ liệu đọc từ các API có xác thực của hệ thống.'], metrics: [], tables: [] }
  if (selection.type === 'revenue') {
    const rows = finance.filter(record => record.kind === 'REVENUE')
    report.metrics = [{ label: 'Tổng thu đã xác nhận', value: totalKind('REVENUE'), format: 'money' }, { label: 'Giao dịch thu', value: rows.length, format: 'number' }, { label: 'Hoàn tiền đã xử lý trong kỳ', value: totalKind('REFUND'), format: 'money' }]
    report.notes.push('Tính theo paid_at của thanh toán PAID/PARTIALLY_REFUNDED/REFUNDED; hoàn tiền trình bày riêng theo ngày hoàn thực tế, không trừ hai lần vào doanh thu gốc.')
    report.tables = [{ title: 'Doanh thu và hoàn tiền theo tháng', columns: [text('month', 'Tháng', 16), money('revenue', 'Thu đã xác nhận'), money('refunds', 'Hoàn tiền đã xử lý')], rows: snapshot.monthly }, { title: 'Chi tiết thanh toán đã xác nhận', columns: financeColumns, rows: snapshot.financialRows(rows) }]
  } else if (selection.type === 'fees') {
    const rows = finance.filter(record => record.kind === 'FEE')
    report.metrics = [{ label: 'Phí hệ thống', value: totalKind('FEE'), format: 'money' }, { label: 'Lượt quyết toán', value: rows.length, format: 'number' }, { label: 'Thu nhập nhân viên đã quyết toán', value: sum(rows, row => Number(row.staffAmount)), format: 'money' }]
    report.notes.push('Theo settled_at của từng khoản thu nhập SETTLED. Một đơn có thể có nhiều nhân viên. Phí hệ thống là khoản phân bổ trong doanh thu, không phải dòng tiền thu thêm.')
    report.tables = [{ title: 'Chi tiết quyết toán thu nhập', columns: [text('id', 'Mã quyết toán', 22), dateColumn('effectiveAt', 'Ngày quyết toán'), text('code', 'Mã đơn', 20), text('service', 'Dịch vụ', 35), text('person', 'Nhân viên'), text('phone', 'Điện thoại', 18), money('serviceAmount', 'Giá trị phân bổ'), money('amount', 'Phí hệ thống'), money('staffAmount', 'Thu nhập nhân viên'), money('tipAmount', 'Tiền tip'), text('status', 'Trạng thái')], rows: snapshot.financialRows(rows) }]
  } else if (selection.type === 'completion') {
    const rows = selection.status ? bookings.filter(booking => bookingStatus(booking.status) === selection.status) : bookings
    report.scope = selection.status ? `Trạng thái: ${bookingStatusLabels[selection.status as keyof typeof bookingStatusLabels] || selection.status}` : report.scope
    report.metrics = [{ label: 'Đơn tạo trong kỳ', value: bookings.length, format: 'number' }, { label: 'Hoàn thành', value: snapshot.completed.length, format: 'number' }, { label: 'Tỷ lệ hoàn thành', value: bookings.length ? snapshot.completed.length * 100 / bookings.length : 0, format: 'percent' }]
    report.notes.push('Chọn đơn theo ngày tạo (created_at); trạng thái là trạng thái hiện tại của đơn, không phải lịch sử trạng thái tại thời điểm cuối kỳ.')
    report.tables = [{ title: 'Tổng hợp trạng thái', columns: [text('status', 'Trạng thái'), numeric('count', 'Số đơn')], rows: Object.entries(bookingStatusLabels).map(([status, label]) => ({ status: label, count: bookings.filter(booking => bookingStatus(booking.status) === status).length })) }, { title: 'Chi tiết đơn đặt dịch vụ', columns: bookingColumns, rows: snapshot.bookingRows(rows) }]
  } else if (selection.type === 'staff') {
    const rows = snapshot.activeStaff.map(staff => {
      const assigned = bookings.filter(booking => booking.assignments.some(item => String(item.staffId) === staff.id && ['ACCEPTED', 'COMPLETED'].includes(item.status)))
      const settled = finance.filter(record => record.kind === 'FEE' && String(record.actorId) === staff.id)
      return { id: staff.id, name: staff.fullName, phone: staff.phone, email: staff.email || '', rank: ({ INTERN: 'Thực tập sinh', STANDARD: 'Tiêu chuẩn', PROFESSIONAL: 'Chuyên nghiệp' })[staff.rank] || staff.rank, status: 'Đang hoạt động', assigned: assigned.length, completed: assigned.filter(booking => booking.status === 'COMPLETED').length, income: sum(settled, row => Number(row.staffAmount)), rating: Number(staff.averageRating || 0) }
    })
    report.metrics = [{ label: 'Tài khoản đang hoạt động', value: rows.length, format: 'number' }, { label: 'Lượt nhận đơn trong kỳ', value: sum(rows, row => row.assigned), format: 'number' }, { label: 'Thu nhập quyết toán trong kỳ', value: sum(rows, row => row.income), format: 'money' }]
    report.notes.push('Danh sách tài khoản ACTIVE tại thời điểm lấy dữ liệu; không suy diễn trạng thái lịch sử theo kỳ. Số đơn theo ngày tạo đơn; thu nhập theo ngày quyết toán. Đánh giá là chỉ số hiện tại trong hồ sơ.')
    report.tables = [{ title: 'Chi tiết nhân viên đang hoạt động', columns: [text('id', 'Mã NV', 14), text('name', 'Họ tên'), text('phone', 'Điện thoại', 18), text('email', 'Email', 34), text('rank', 'Xếp hạng'), text('status', 'Tài khoản'), numeric('assigned', 'Lượt nhận đơn'), numeric('completed', 'Đơn hoàn thành'), money('income', 'Thu nhập quyết toán'), numeric('rating', 'Đánh giá hiện tại')], rows }]
  } else if (selection.type === 'cashflow') {
    report.metrics = [{ label: 'Thu thanh toán', value: totalKind('REVENUE'), format: 'money' }, { label: 'Chi rút tiền', value: totalKind('PAYOUT'), format: 'money' }, { label: 'Chi hoàn tiền', value: totalKind('REFUND'), format: 'money' }, { label: 'Thu trừ rút và hoàn', value: totalKind('REVENUE') - totalKind('PAYOUT') - totalKind('REFUND'), format: 'money' }]
    report.notes.push('Theo ngày thu/chi đã xác nhận. Đây là biến động của ba loại nghiệp vụ, không phải số dư tài khoản ngân hàng hoặc lợi nhuận. Nạp ví nhân viên và các dòng tiền khác không nằm trong báo cáo này.')
    report.tables = [{ title: 'Tổng hợp dòng tiền theo tháng', columns: [text('month', 'Tháng', 14), money('revenue', 'Thu thanh toán'), money('payout', 'Chi rút tiền'), money('refunds', 'Chi hoàn tiền'), money('net', 'Thu - rút - hoàn'), money('fees', 'Phí đã quyết toán')], rows: snapshot.monthly }, { title: 'Chi tiết giao dịch đã xác nhận', columns: [text('kind', 'Loại nghiệp vụ', 22), ...financeColumns], rows: snapshot.financialRows(finance.filter(row => row.kind !== 'FEE')) }]
  } else if (selection.type === 'services') {
    const groups = selection.group ? snapshot.serviceGroups.filter(group => group.group === selection.group) : snapshot.serviceGroups
    const rows = finance.filter(record => record.kind === 'REVENUE' && (!selection.group || snapshot.groupFor(data.bookings.find(booking => String(booking.id) === String(record.bookingId))) === selection.group))
    report.scope = selection.group ? snapshot.groupLabel(selection.group) : 'Tất cả nhóm dịch vụ'
    report.metrics = [{ label: 'Doanh thu nhóm đã chọn', value: sum(rows, row => row.amount), format: 'money' }, { label: 'Giao dịch thu', value: rows.length, format: 'number' }, { label: 'Số nhóm hiển thị', value: groups.length, format: 'number' }]
    report.notes.push('Nhóm theo danh mục dịch vụ hiện tại; tính từ thanh toán đã xác nhận theo ngày thu, không tính từ giá trị đơn chưa thanh toán. Giao dịch thiếu dữ liệu đối chiếu được giữ trong nhóm riêng, không bị bỏ khỏi tổng.')
    report.tables = [{ title: 'Cơ cấu doanh thu theo nhóm', columns: [text('name', 'Nhóm dịch vụ', 40), numeric('records', 'Giao dịch thu'), money('amount', 'Doanh thu'), { key: 'value', label: 'Tỷ trọng toàn kỳ', format: 'percent', width: 20 }], rows: groups }, { title: 'Thanh toán thuộc nhóm', columns: financeColumns, rows: snapshot.financialRows(rows) }]
  } else {
    const districts = selection.district ? snapshot.districts.filter(row => row.district === selection.district) : snapshot.districts
    const rows = selection.district ? bookings.filter(booking => snapshot.areaFor(booking) === selection.district) : bookings
    report.scope = selection.district || 'Tất cả khu vực'
    report.metrics = [{ label: 'Đơn đặt dịch vụ', value: rows.length, format: 'number' }, { label: 'Số khu vực', value: districts.length, format: 'number' }, { label: 'Giá trị đơn đặt', value: sum(rows, booking => booking.totalAmount), format: 'money' }]
    report.notes.push('Khu vực lấy từ địa chỉ đã lưu trong đơn; ưu tiên phường/xã, sau đó quận/huyện. Đơn theo ngày tạo. Giá trị đơn gồm mọi trạng thái, không đồng nghĩa doanh thu đã thu. Bảng tổng hợp có đầy đủ khu vực, không giới hạn Top 5.')
    report.tables = [{ title: 'Tổng hợp theo khu vực', columns: [text('district', 'Khu vực', 35), numeric('bookings', 'Số đơn'), numeric('completed', 'Hoàn thành'), numeric('cancelled', 'Đã hủy'), money('amount', 'Giá trị đơn đặt')], rows: districts }, { title: 'Chi tiết đơn theo khu vực', columns: bookingColumns, rows: snapshot.bookingRows(rows) }]
  }
  return report
}
