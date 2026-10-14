import { API_BASE_URL } from './catalog'
import { readSession, saveSession, getStaff, saveStaffAccount } from './identity'
import type { AddOn, Category, Service, ServicePackage } from '../data/mockAdminServices'
import type { Promotion } from '../data/mockAdminPromotions'
import type { Booking } from '../data/mockAdminBookings'
import type { Review } from '../data/mockAdminReviews'
import type { Staff } from '../data/mockAdminStaff'
import type { Transaction } from '../data/mockAdminTransactions'

export async function adminRequest<T>(service: string, path: string, method = 'GET', body?: unknown): Promise<T> {
  const session = readSession('ADMIN')
  if (!session) throw new Error('Vui lòng đăng nhập quản trị viên.')
  const response = await fetch(`${API_BASE_URL}/api/v1/${service}${path}`, {
    method, headers: { Authorization: `Bearer ${session.accessToken}`, 'Content-Type': 'application/json' },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }), signal: AbortSignal.timeout(20000),
  }).catch(() => { throw new Error('Không kết nối được hệ thống. Vui lòng thử lại.') })
  if (!response.ok) {
    if (response.status === 401) saveSession('ADMIN', null)
    const problem = await response.json().catch(() => null)
    throw new Error(problem?.detail || 'Chưa xử lý được yêu cầu.')
  }
  return response.status === 204 ? undefined as T : response.json()
}
type RawCatalog = { categories: (Omit<Category, 'id'> & { id: number })[]; services: (Omit<Service, 'id' | 'categoryId' | 'dynamicFields'> & { id: number; categoryId: number; dynamicFields: (Omit<Service['dynamicFields'][number], 'id'> & { id: number })[] })[]; packages: (Omit<ServicePackage, 'id' | 'serviceId'> & { id: number; serviceId: number })[]; addOns: (Omit<AddOn, 'id' | 'serviceId'> & { id: number; serviceId: number })[] }
export async function getAdminCatalog() {
  const raw = await adminRequest<RawCatalog>('catalog', '/admin/snapshot')
  return { categories: raw.categories.map(x => ({ ...x, id: String(x.id), description: x.description || '', serviceCount: raw.services.filter(s => s.categoryId === x.id).length })),
    services: raw.services.map(x => ({ ...x, id: String(x.id), categoryId: String(x.categoryId), description: x.description || '', dynamicFields: x.dynamicFields.map(f => ({ ...f, id: String(f.id) })) })),
    packages: raw.packages.map(x => ({ ...x, id: String(x.id), serviceId: String(x.serviceId), description: x.description || '' })),
    addOns: raw.addOns.map(x => ({ ...x, id: String(x.id), serviceId: String(x.serviceId), description: x.description || '' })), }
}
export const saveCatalogItem = (kind: string, item: Service | Category | ServicePackage | AddOn) => {
  const existing = /^\d+$/.test(item.id)
  const body = { ...item, ...('dynamicFields' in item ? { dynamicFields: (item.dynamicFields as Service['dynamicFields']).map(f => ({ ...f, id: /^\d+$/.test(f.id) ? Number(f.id) : undefined })) } : {}) }
  return adminRequest<{ id: number }>('catalog', `/admin/catalog/${kind}${existing ? '/' + item.id : ''}`, existing ? 'PUT' : 'POST', body)
}
type RawPromotion = Omit<Promotion, 'id' | 'validFrom' | 'validTo'> & { id: number; startsAt: string; endsAt: string }
export async function getAdminPromotions(): Promise<Promotion[]> {
  return (await adminRequest<RawPromotion[]>('catalog', '/admin/promotions')).map(x => ({ ...x, id: String(x.id), validFrom: new Date(x.startsAt).toLocaleDateString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }), validTo: new Date(Date.parse(x.endsAt) - 1).toLocaleDateString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }) }))
}
export async function saveAdminPromotion(item: Promotion) {
  const exists = /^\d+$/.test(item.id)
  await adminRequest('catalog', '/admin/promotions' + (exists ? '/' + item.id : ''), exists ? 'PUT' : 'POST', item)
}
export interface BackendBooking {
  id: number; bookingCode: string; customerId: number; serviceId: number; status: string; mode: string;
  startsAt: string; endsAt: string; createdAt: string; packagePrice: number; addOnsTotal: number; totalAmount: number; discountAmount: number;
  service: { configuration?: Record<string,unknown>; configurationLabels?:Record<string,string>; answerLabels?: Record<string,string>; name?: string; serviceName?: string; answers?: Record<string, unknown> }; address: { recipientName?: string; recipientPhone?: string; receiverName?: string; receiverPhone?: string; fullAddress?: string; detailAddress?: string; district?: string };
  assignments: { staffId: number; status: string }[]; paymentStatus: string; paymentMethod: string; cancellationReason?: string;
}
export const bookingStatus = (status: string): Booking['status'] => status === 'IN_PROGRESS' ? 'IN_PROGRESS' : status === 'COMPLETED' ? 'COMPLETED' : ['CANCELLED', 'REFUNDING', 'REFUNDED', 'ABSENT', 'REJECTED', 'NO_STAFF_FOUND'].includes(status) ? 'CANCELLED' : ['CONFIRMED', 'ACCEPTED', 'STAFF_ASSIGNED'].includes(status) ? 'MATCHED' : 'SEARCHING'
export const dateTime = (date: string) => new Date(date).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
export async function getAdminBookings(): Promise<Booking[]> {
  const [records, people] = await Promise.all([adminRequest<BackendBooking[]>('booking', '/bookings'), getStaff()])
  return records.map(x => {
    const assigned = x.assignments.find(a => ['ACCEPTED', 'COMPLETED'].includes(a.status)); const staff = people.find(s => s.id === String(assigned?.staffId))
    return { id: String(x.id), bookingCode: x.bookingCode, customerName: x.address.recipientName || x.address.receiverName || '', customerPhone: x.address.recipientPhone || x.address.receiverPhone || '', address: x.address.fullAddress || x.address.detailAddress || '', district: x.address.district || '', serviceId: String(x.serviceId), serviceName: x.service.name || x.service.serviceName || '',
      bookingDate: new Date(x.startsAt).toLocaleDateString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'}), bookingTime: `${new Date(x.startsAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone:'Asia/Ho_Chi_Minh' })} - ${new Date(x.endsAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`, status: bookingStatus(x.status), rawStatus: x.status, dispatchMode: x.mode === 'MODE_A' ? 'MANUAL' : 'AUTO',
      staffId: staff?.id, staffName: staff?.fullName, staffPhone: staff?.phone, subtotal: x.packagePrice + x.addOnsTotal, platformFee: 0, discount: x.discountAmount, totalAmount: x.totalAmount, paymentMethod: x.paymentMethod, paymentStatus: x.paymentStatus === 'PAID' ? 'PAID' : x.paymentStatus === 'REFUNDED' ? 'REFUNDED' : 'UNPAID', dynamicDetails: Object.fromEntries(Object.entries({...x.service.answers,...x.service.configuration}).map(([key, value]) => [x.service.answerLabels?.[key] || x.service.configurationLabels?.[key] || key, String(value)])), createdAt: dateTime(x.createdAt), cancelReason: x.cancellationReason }
  })
}
export async function cancelAdminBooking(item: Booking) { await adminRequest('booking', `/bookings/${item.id}/cancel`, 'POST', { reason: item.cancelReason || 'Admin hủy đơn' }) }
export async function getAdminReviews(): Promise<Review[]> {
  const [records, bookings, staff] = await Promise.all([adminRequest<(Omit<Review, 'id' | 'content'> & { id: number; comment: string; staffId: number; serviceId: number; bookingId: number })[]>('booking', '/reviews'), getAdminBookings(), getStaff()])
  return records.map(x => { const b = bookings.find(b => b.id === String(x.bookingId)); return { ...x, id: String(x.id), bookingId: String(x.bookingId), content: x.comment || '', customerName: b?.customerName || '', customerPhone: b?.customerPhone || '', staffName: staff.find(s => s.id === String(x.staffId))?.fullName || '', serviceName: b?.serviceName || '', createdAt: dateTime(x.createdAt) } })
}
export const saveAdminReview = (item: Review) => adminRequest('booking', '/admin/reviews/' + item.id, 'PATCH', { status: item.status, internalNote: item.internalNote || '' })
export interface StaffOperations { capabilities: { id: number; serviceId: number; status: string }[]; restrictions: { id: number; type: string; reason: string; startsAt: string; endsAt?: string; status: string }[]; availability: { saved: { areaIds: string[] } }; completedBookings: number; cancelledBookings: number; averageRating: number; reviewCount: number }
export async function getAdminStaff(period='ALL'): Promise<Staff[]> {
  const people = await getStaff()
  return Promise.all(people.map(async person => {
    const [ops, wallet] = await Promise.all([adminRequest<StaffOperations>('booking', `/admin/staff/${person.id}/operations?period=${period}`), adminRequest<{ balance: { totalEarned: number }; incomes: {staffAmount:number;incomeDate:string;status:string}[] }>('finance', `/admin/staff/${person.id}/wallet`)])
    const areaKeys: Record<string, string> = { 'Quận 1': 'quan-1', 'Quận 2': 'quan-2', 'Quận 3': 'quan-3', 'Quận 7': 'quan-7', 'Tân Bình': 'quan-tan-binh', 'Bình Thạnh': 'quan-binh-thanh' }
    return { ...person, skillIds: ops.capabilities.filter(c => c.status === 'APPROVED').map(c => String(c.serviceId)), areaIds: ops.availability.saved.areaIds.map(a => areaKeys[a] || a), totalTrips: ops.completedBookings + ops.cancelledBookings, completedBookings: ops.completedBookings, cancelledBookings: ops.cancelledBookings, income: period==='ALL'?wallet.balance.totalEarned:wallet.incomes.filter(i=>i.status==='SETTLED' && i.incomeDate.slice(0,7)===new Date(new Date().getFullYear(),new Date().getMonth()-(period==='PREVIOUS'?1:0),15).toLocaleDateString('sv-SE').slice(0,7)).reduce((sum,i)=>sum+i.staffAmount,0), averageRating: ops.averageRating,
      violations: ops.restrictions.map(r => ({ id: String(r.id), reason: r.reason, date: new Date(r.startsAt).toLocaleDateString('sv-SE',{timeZone:'Asia/Ho_Chi_Minh'}), penalty: r.type === 'SUSPENSION' ? 'Đình chỉ nhận việc' : r.type === 'SERVICE_LIMIT' ? 'Hạn chế dịch vụ' : 'Cảnh báo' })) }
  }))
}
export async function saveAdminStaff(person: Staff) {
  await saveStaffAccount(person)
  let saved: StaffOperations
  try { saved = await adminRequest<StaffOperations>('booking', `/admin/staff/${person.id}/operations`, 'PUT', { skillIds: person.skillIds, areaIds: person.areaIds,
    restrictions: person.violations.map(v => ({ id: /^\d+$/.test(v.id) ? Number(v.id) : undefined, type: v.penalty.includes('Đình chỉ') ? 'SUSPENSION' : v.penalty.includes('Hạn chế') ? 'SERVICE_LIMIT' : 'WARNING', reason: v.reason, startsAt: calendarInstant(v.date), status: 'ACTIVE' })) }) } catch(cause) { throw new Error('Phần tài khoản đã lưu. Năng lực/khu vực/vi phạm chưa lưu đầy đủ: '+(cause instanceof Error?cause.message:'Vui lòng tải lại hồ sơ.')) }
  for (const v of person.violations) {
    const amount = v.penalty.match(/(?:Trừ|Phạt)\s+([\d.,]+)\s*(?:VNĐ|VND|đ)/i)
    if(!amount)continue
    const value=Number(amount[1].replace(/[.,]/g,''));const restriction=saved.restrictions.find(r=>r.reason===v.reason && r.startsAt.slice(0,10)===calendarInstant(v.date).slice(0,10))
    if(!restriction)throw new Error('Vi phạm đã lưu, nhưng chưa liên kết được đề xuất phạt. Tải lại hồ sơ để kiểm tra.')
    await adminRequest('finance','/admin/staff/'+person.id+'/penalties','POST',{amount:value,reason:v.reason,requestKey:'restriction:'+restriction.id})
  }

}
function calendarInstant(value: string) {
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? value+'T00:00:00+07:00' : match ? `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}T00:00:00+07:00` : value
  const instant = Date.parse(date)
  if (!Number.isFinite(instant)) throw new Error('Ngày ghi nhận vi phạm không hợp lệ.')
  return new Date(instant).toISOString()
}
export async function getAdminTransactions(): Promise<Transaction[]> {
  const [records, staff, customers] = await Promise.all([adminRequest<(Omit<Transaction, 'actorName' | 'actorPhone' | 'bookingId'> & { actorId: number; bookingId: number | null })[]>('finance', '/admin/transactions'), getStaff(), adminRequest<{ id: number; fullName: string; phone: string }[]>('identity', '/admin/customers')])
  return records.map(x => { const actor = x.type === 'PAYOUT' ? staff.find(s => s.id === String(x.actorId)) : customers.find(c => c.id === x.actorId); return { ...x, bookingId: x.bookingId == null ? '' : String(x.bookingId), actorName: actor?.fullName || '', actorPhone: actor?.phone || '', createdAt: dateTime(x.createdAt) } })
}
export const saveTransactionNote = (item: Transaction) => adminRequest('finance', '/admin/transactions/' + item.type + '/' + item.id.split('-').at(-1), 'PATCH', { status: item.status, description: item.description || '' })
export function exportCsv(filename: string, rows: (string | number)[][]) {
  const cell = (value: string | number) => { const text = String(value); return '"' + (/^[=+@-]/.test(text) ? "'" : '') + text.replaceAll('"', '""') + '"' }
  const blob = new Blob(['\uFEFF' + rows.map(row => row.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
}
