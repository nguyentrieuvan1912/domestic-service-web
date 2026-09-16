import type { Service } from './mockAdminServices'
import { mockAdminServices } from './mockAdminServices'

export type StaffStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED'
export type StaffLevel = 'INTERN' | 'STANDARD' | 'PROFESSIONAL'

export interface StaffViolation {
  id: string
  date: string
  reason: string
  penalty: string
}

export interface Staff {
  id: string
  fullName: string
  phone: string
  identityCard: string
  status: StaffStatus
  statusNote: string
  rank: StaffLevel
  baseFee: number
  joinDate: string
  income: number
  averageRating: number
  totalTrips: number
  completedBookings: number
  cancelledBookings: number
  skillIds: string[]
  areaIds: string[]
  violations: StaffViolation[]
}

export interface StaffSkill {
  id: string
  staffId: string
  serviceId: Service['id']
  serviceName: Service['name']
  certificateName?: string
}

export const staffLevelLabels: Record<StaffLevel, string> = {
  INTERN: 'Thực tập sinh',
  STANDARD: 'Tiêu chuẩn',
  PROFESSIONAL: 'Chuyên nghiệp',
}

export const staffLevelFees: Record<StaffLevel, number> = {
  INTERN: 80000,
  STANDARD: 110000,
  PROFESSIONAL: 150000,
}

export const mockAdminStaff: Staff[] = [
  {
    id: 'staff-001',
    fullName: 'Nguyễn Thị Lan',
    phone: '0901 234 567',
    identityCard: '079203001245',
    status: 'ACTIVE',
    statusNote: '',
    rank: 'PROFESSIONAL',
    baseFee: 150000,
    joinDate: '12/03/2025',
    income: 24800000,
    averageRating: 4.9,
    totalTrips: 186,
    completedBookings: 178,
    cancelledBookings: 8,
    skillIds: ['service-home-cleaning', 'service-deep-cleaning'],
    areaIds: ['quan-1', 'quan-3'],
    violations: [],
  },
  {
    id: 'staff-002',
    fullName: 'Trần Văn Minh',
    phone: '0912 345 678',
    identityCard: '079198004521',
    status: 'ACTIVE',
    statusNote: '',
    rank: 'STANDARD',
    baseFee: 110000,
    joinDate: '21/06/2025',
    income: 19400000,
    averageRating: 4.8,
    totalTrips: 124,
    completedBookings: 119,
    cancelledBookings: 5,
    skillIds: ['service-air-conditioner', 'service-washing-machine'],
    areaIds: ['quan-7', 'quan-tan-binh'],
    violations: [
      {
        id: 'v-101',
        date: '08/08/2026',
        reason: 'Khách phàn nàn về thái độ phục vụ',
        penalty: 'Nhắc nhở bằng văn bản & trừ 5 điểm rèn luyện',
      },
    ],
  },
  {
    id: 'staff-003',
    fullName: 'Lê Hoài Phương',
    phone: '0987 654 321',
    identityCard: '079201008734',
    status: 'INACTIVE',
    statusNote: 'Tạm ngưng nghỉ phép cá nhân đến hết 25/09/2026',
    rank: 'PROFESSIONAL',
    baseFee: 150000,
    joinDate: '04/01/2025',
    income: 21600000,
    averageRating: 5.0,
    totalTrips: 92,
    completedBookings: 88,
    cancelledBookings: 4,
    skillIds: ['service-childcare'],
    areaIds: ['quan-2', 'quan-binh-thanh'],
    violations: [],
  },
  {
    id: 'staff-004',
    fullName: 'Phạm Quốc Huy',
    phone: '0938 112 233',
    identityCard: '079199006812',
    status: 'LOCKED',
    statusNote: 'Bị khóa do vắng mặt không lý do nhiều lần',
    rank: 'INTERN',
    baseFee: 80000,
    joinDate: '15/08/2026',
    income: 1200000,
    averageRating: 3.9,
    totalTrips: 12,
    completedBookings: 9,
    cancelledBookings: 3,
    skillIds: ['service-home-cleaning'],
    areaIds: ['quan-1'],
    violations: [
      {
        id: 'v-102',
        date: '10/09/2026',
        reason: 'Vắng mặt không báo trước',
        penalty: 'Khóa tài khoản 7 ngày',
      },
      {
        id: 'v-103',
        date: '14/09/2026',
        reason: 'Hủy lịch phút chót',
        penalty: 'Trừ 200.000 VNĐ vào ví thu nhập',
      },
    ],
  },
]

export const mockStaffSkills: StaffSkill[] = mockAdminStaff.flatMap((staff) =>
  staff.skillIds.map((serviceId) => {
    const service = mockAdminServices.find((item) => item.id === serviceId)
    return {
      id: `${staff.id}-${serviceId}`,
      staffId: staff.id,
      serviceId,
      serviceName: service?.name ?? 'Dịch vụ chưa xác định',
      certificateName:
        serviceId === 'service-childcare'
          ? 'Chứng chỉ chăm sóc trẻ em'
          : undefined,
    }
  })
)
