import { API_BASE_URL } from './catalog'
import type { Customer } from '../data/mockAdminCustomers'
import type { Candidate } from '../data/mockAdminCandidates'
import type { Staff } from '../data/mockAdminStaff'

export type AccountRole = 'CUSTOMER' | 'STAFF' | 'ADMIN'
export interface AccountUser { id: number; fullName: string; email: string; phone: string; role: AccountRole; status: string }
export interface AccountSession { accessToken: string; expiresAt: string; user: AccountUser }
export const sessionKey = (role: AccountRole) => `cleanmaster_identity_${role}`
export function readSession(role: AccountRole): AccountSession | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(sessionKey(role)) || 'null') as AccountSession | null
    return value?.user?.role === role && typeof value.accessToken === 'string' && Date.parse(value.expiresAt) > Date.now() ? value : null
  } catch { return null }
}
export function saveSession(role: AccountRole, value: AccountSession | null) {
  if (value) sessionStorage.setItem(sessionKey(role), JSON.stringify(value))
  else sessionStorage.removeItem(sessionKey(role))
  window.dispatchEvent(new Event('identity-session'))
}
export async function identityRequest<T>(path: string, options: RequestInit = {}, role?: AccountRole): Promise<T> {
  const session = role ? readSession(role) : null
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/identity${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(session ? { Authorization: `Bearer ${session.accessToken}` } : {}), ...options.headers },
    })
  } catch { throw new Error('Không thể kết nối backend. Vui lòng thử lại.') }
  if (!response.ok) {
    const problem = await response.json().catch(() => null) as { detail?: string; errors?: Record<string, string> } | null
    if (response.status === 401 && role) saveSession(role, null)
    throw new Error(problem?.errors ? `Thông tin không hợp lệ: ${Object.keys(problem.errors).join(', ')}` : problem?.detail || 'Không thể xử lý yêu cầu. Vui lòng thử lại.')
  }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>
}
export async function loginAccount(identifier: string, password: string, role: AccountRole) {
  const session = await identityRequest<AccountSession>('/auth/login', { method: 'POST', body: JSON.stringify({ identifier, password }) })
  if (session.user.role !== role) {
    await identityRequest('/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${session.accessToken}` } })
    throw new Error(role === 'ADMIN' ? 'Tài khoản này không có quyền quản trị.' : 'Vui lòng sử dụng tài khoản khách hàng.')
  }
  saveSession(role, session)
}
export async function logoutAccount(role: AccountRole) {
  try { await identityRequest('/auth/logout', { method: 'POST' }, role) }
  finally { saveSession(role, null) }
}
const date = (value: string) => new Date(value).toLocaleDateString('vi-VN')
export async function getCustomers(): Promise<Customer[]> {
  const data = await identityRequest<(Omit<Customer, 'id' | 'status'> & { id: number; status: string })[]>('/admin/customers', {}, 'ADMIN')
  return data.map(item => ({ ...item, id: String(item.id), joinDate: date(item.joinDate), status: item.status === 'BLOCKED' ? 'LOCKED' : item.status as Customer['status'] }))
}
export const saveCustomerStatus = (customer: Customer) => identityRequest<void>(`/admin/customers/${customer.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: customer.status, statusNote: customer.statusNote }) }, 'ADMIN')
type CandidateResponse = Omit<Candidate, 'id' | 'staffId'> & { id: number; staffId?: number | null }
const candidateView = (value: CandidateResponse): Candidate => ({ ...value, id: String(value.id), staffId: value.staffId ? String(value.staffId) : undefined, registeredAt: date(value.registeredAt) })
export const getCandidates = async () => (await identityRequest<CandidateResponse[]>('/admin/candidates', {}, 'ADMIN')).map(candidateView)
export const createCandidate = async (candidate: Candidate) => candidateView(await identityRequest<CandidateResponse>('/admin/candidates', { method: 'POST', body: JSON.stringify(candidate) }, 'ADMIN'))
export const advanceCandidate = async (candidate: Candidate) => candidateView(await identityRequest<CandidateResponse>(`/admin/candidates/${candidate.id}`, { method: 'PATCH', body: JSON.stringify(candidate) }, 'ADMIN'))
export const provisionStaff = async (id: string, password: string, rank: string) => candidateView(await identityRequest<CandidateResponse>(`/admin/candidates/${id}/staff-account`, { method: 'POST', body: JSON.stringify({ password, rank }) }, 'ADMIN'))
export async function getStaff(): Promise<Staff[]> {
  const items = await identityRequest<(Pick<Staff, 'fullName' | 'phone' | 'identityCard' | 'rank' | 'joinDate' | 'averageRating' | 'statusNote' | 'dateOfBirth' | 'birthYear' | 'gender' | 'experienceYears' | 'bio' | 'avatar' | 'email'> & { id: number; status: string })[]>('/admin/staff', {}, 'ADMIN')
  return items.map(item => ({ ...item, id: String(item.id), identityCard: item.identityCard || '', status: item.status === 'BLOCKED' ? 'LOCKED' : item.status as Staff['status'],
    joinDate: date(item.joinDate), baseFee: null,
    income: 0, totalTrips: 0, completedBookings: 0, cancelledBookings: 0, skillIds: [], areaIds: [], violations: [] }))
}
export const saveStaffAccount = (staff: Staff) => identityRequest<void>(`/admin/staff/${staff.id}`, { method: 'PATCH', body: JSON.stringify({ fullName: staff.fullName, phone: staff.phone, status: staff.status, statusNote: staff.statusNote, rank: staff.rank, dateOfBirth: staff.dateOfBirth || undefined, birthYear: staff.birthYear, gender: staff.gender, experienceYears: staff.experienceYears, bio: staff.bio }) }, 'ADMIN')
