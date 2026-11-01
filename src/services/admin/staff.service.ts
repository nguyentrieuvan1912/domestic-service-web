import { http } from '../../api/axiosClient'
import type { Staff, StaffLevel, StaffStatus, StaffViolation } from '../../data/mockAdminStaff'

export interface BackendStaffDto {
  id: number
  fullName: string
  phone: string
  identityCard?: string
  status: string
  statusNote?: string
  rank?: string
  joinDate?: string
  averageRating?: number
  dateOfBirth?: string
  birthYear?: number
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  experienceYears?: number
  bio?: string
  avatar?: string
  email?: string
}

export interface BackendStaffOperationsDto {
  capabilities?: { id: number; serviceId: number; status: string }[]
  restrictions?: { id: number; type: string; reason: string; startsAt: string; endsAt?: string; status: string }[]
  availability?: { saved?: { areaIds?: string[] } }
  completedBookings?: number
  cancelledBookings?: number
  averageRating?: number
  reviewCount?: number
}

export interface BackendStaffWalletDto {
  balance?: {
    totalEarned?: number
    availableBalance?: number
  }
  incomes?: {
    staffAmount: number
    incomeDate: string
    status: string
  }[]
}

export interface StaffRewardRequest {
  tripsBonus?: boolean
  incomeBonus?: boolean
  ratingBonus?: boolean
  period?: string
}

/**
 * Mapper biến đổi Backend DTO sang Staff Model cho UI Admin Web
 */
export function mapBackendToStaff(
  base: BackendStaffDto,
  ops?: BackendStaffOperationsDto | null,
  wallet?: BackendStaffWalletDto | null,
  period = 'CURRENT'
): Staff {
  const status: StaffStatus =
    base.status === 'BLOCKED' ? 'LOCKED' : base.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE'

  const rank: StaffLevel =
    base.rank === 'PROFESSIONAL' || base.rank === 'STANDARD' || base.rank === 'INTERN'
      ? base.rank
      : 'INTERN'

  const completed = ops?.completedBookings ?? 0
  const cancelled = ops?.cancelledBookings ?? 0
  const totalTrips = completed + cancelled

  // Tính thu nhập theo period
  let income = 0
  if (wallet?.balance?.totalEarned != null) {
    if (period === 'ALL') {
      income = wallet.balance.totalEarned
    } else if (wallet.incomes && Array.isArray(wallet.incomes)) {
      const targetMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() - (period === 'PREVIOUS' ? 1 : 0),
        15
      )
        .toLocaleDateString('sv-SE')
        .slice(0, 7)

      income = wallet.incomes
        .filter((i) => i.status === 'SETTLED' && i.incomeDate?.slice(0, 7) === targetMonth)
        .reduce((sum, i) => sum + (i.staffAmount || 0), 0)

      // Fallback nếu kỳ hiện tại chưa quyết toán xong
      if (income === 0 && wallet.balance.totalEarned > 0) {
        income = wallet.balance.totalEarned
      }
    } else {
      income = wallet.balance.totalEarned
    }
  }

  const skillIds =
    ops?.capabilities
      ?.filter((c) => c.status === 'APPROVED')
      ?.map((c) => String(c.serviceId)) ?? []

  const areaIds = ops?.availability?.saved?.areaIds ?? []

  const violations: StaffViolation[] = (ops?.restrictions ?? []).map((r) => ({
    id: String(r.id),
    reason: r.reason || '',
    date: r.startsAt
      ? new Date(r.startsAt).toLocaleDateString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' })
      : '',
    penalty:
      r.type === 'SUSPENSION'
        ? 'Đình chỉ nhận việc'
        : r.type === 'SERVICE_LIMIT'
          ? 'Hạn chế dịch vụ'
          : 'Cảnh báo',
  }))

  const rawRating = ops?.averageRating ?? base.averageRating ?? 5.0
  const averageRating = typeof rawRating === 'number' ? rawRating : parseFloat(String(rawRating)) || 5.0

  let formattedJoinDate = ''
  if (base.joinDate) {
    try {
      formattedJoinDate = new Date(base.joinDate).toLocaleDateString('vi-VN')
    } catch {
      formattedJoinDate = base.joinDate
    }
  }

  return {
    id: String(base.id),
    fullName: base.fullName || '',
    phone: base.phone || '',
    identityCard: base.identityCard || '',
    status,
    statusNote: base.statusNote || '',
    rank,
    baseFee: null,
    joinDate: formattedJoinDate,
    income,
    averageRating,
    totalTrips,
    completedBookings: completed,
    cancelledBookings: cancelled,
    skillIds,
    areaIds,
    violations,
    dateOfBirth: base.dateOfBirth,
    birthYear: base.birthYear,
    gender: base.gender,
    experienceYears: base.experienceYears,
    bio: base.bio,
    avatar: base.avatar,
    email: base.email,
  }
}

/**
 * Lấy toàn bộ danh sách nhân viên từ Backend và làm giàu thông tin KPI (vận hành, ví tiền)
 */
export async function getAdminStaffList(period = 'CURRENT'): Promise<Staff[]> {
  // 1. Gọi identity-service để lấy danh sách nhân sự chính
  const staffList = await http.get<BackendStaffDto[]>('/identity/admin/staff')

  if (!Array.isArray(staffList)) {
    return []
  }

  // 2. Fetch thông tin bổ trợ (vận hành & ví) song song cho từng nhân viên
  const enrichedStaff = await Promise.all(
    staffList.map(async (person) => {
      try {
        const [ops, wallet] = await Promise.all([
          http
            .get<BackendStaffOperationsDto>(`/booking/admin/staff/${person.id}/operations?period=${period}`)
            .catch(() => null),
          http
            .get<BackendStaffWalletDto>(`/finance/admin/staff/${person.id}/wallet`)
            .catch(() => null),
        ])

        return mapBackendToStaff(person, ops, wallet, period)
      } catch (err) {
        console.warn(`Lỗi khi lấy thông tin bổ trợ cho nhân viên #${person.id}:`, err)
        return mapBackendToStaff(person, null, null, period)
      }
    })
  )

  return enrichedStaff
}

/**
 * Lấy chi tiết thông tin của một nhân viên
 */
export async function getAdminStaffDetail(id: string | number, period = 'CURRENT'): Promise<Staff | null> {
  const staffList = await http.get<BackendStaffDto[]>('/identity/admin/staff')
  const found = Array.isArray(staffList) ? staffList.find((s) => String(s.id) === String(id)) : null
  if (!found) return null

  const [ops, wallet] = await Promise.all([
    http
      .get<BackendStaffOperationsDto>(`/booking/admin/staff/${id}/operations?period=${period}`)
      .catch(() => null),
    http
      .get<BackendStaffWalletDto>(`/finance/admin/staff/${id}/wallet`)
      .catch(() => null),
  ])

  return mapBackendToStaff(found, ops, wallet, period)
}

/**
 * Lưu/cập nhật thông tin hồ sơ nhân viên và năng lực vận hành
 */
export async function saveAdminStaff(person: Staff): Promise<void> {
  // 1. Cập nhật thông tin định danh & tài khoản
  await http.patch(`/identity/admin/staff/${person.id}`, {
    fullName: person.fullName,
    phone: person.phone,
    status: person.status,
    statusNote: person.statusNote,
    rank: person.rank,
    dateOfBirth: person.dateOfBirth || undefined,
    birthYear: person.birthYear,
    gender: person.gender,
    experienceYears: person.experienceYears,
    bio: person.bio,
    avatar: person.avatar?.startsWith('data:') ? person.avatar : undefined,
  })

  // 2. Cập nhật năng lực, khu vực và vi phạm
  const restrictions = person.violations.map((v) => ({
    id: /^\d+$/.test(v.id) ? Number(v.id) : undefined,
    type: v.penalty.includes('Đình chỉ')
      ? 'SUSPENSION'
      : v.penalty.includes('Hạn chế')
        ? 'SERVICE_LIMIT'
        : 'WARNING',
    reason: v.reason,
    startsAt: calendarInstant(v.date),
    status: 'ACTIVE',
  }))

  await http.put(`/booking/admin/staff/${person.id}/operations`, {
    skillIds: person.skillIds,
    areaIds: person.areaIds,
    restrictions,
  })

  // Phát event đồng bộ cho các component admin khác
  window.dispatchEvent(new Event('admin-data-changed'))
}

/**
 * Gửi đề xuất khen thưởng KPI cho nhân viên
 */
export async function submitStaffReward(
  staffId: string | number,
  rewardData: StaffRewardRequest
): Promise<{ ids: number[]; status: string }> {
  return await http.post(`/finance/admin/staff/${staffId}/rewards`, rewardData)
}

/**
 * Phê duyệt khoản điều chỉnh (thưởng hoặc phạt)
 */
export async function applyStaffAdjustment(
  kind: 'REWARD' | 'PENALTY',
  id: string | number
): Promise<{ id: number; status: string }> {
  return await http.post(`/finance/admin/adjustments/${kind}/${id}/apply`)
}

function calendarInstant(value: string): string {
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value + 'T00:00:00+07:00'
    : match
      ? `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}T00:00:00+07:00`
      : value
  const instant = Date.parse(date)
  if (!Number.isFinite(instant)) return new Date().toISOString()
  return new Date(instant).toISOString()
}
