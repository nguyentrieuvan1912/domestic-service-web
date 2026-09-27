export interface DashboardKpi {
  id: string
  title: string
  value: string
  change: string
  isPositive: boolean
  subtext: string
}

export interface RecentBookingSummary {
  id: string
  customerName: string
  serviceName: string
  time: string
  amount: number
  status: 'SEARCHING' | 'MATCHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  statusLabel: string
}

export interface TopStaffMember {
  id: string
  name: string
  phone: string
  specialty: string
  rating: number
  totalTrips: number
  rank: 'Tiêu chuẩn' | 'Chuyên nghiệp'
}

export const mockDashboardKpis: DashboardKpi[] = [
  {
    id: 'kpi-revenue',
    title: 'Tổng doanh thu tháng',
    value: '125.500.000đ',
    change: '+14.2%',
    isPositive: true,
    subtext: 'so với tháng 08/2026',
  },
  {
    id: 'kpi-bookings',
    title: 'Tổng đơn đặt dịch vụ',
    value: '342 đơn',
    change: '+8.5%',
    isPositive: true,
    subtext: 'so với tháng 08/2026',
  },
  {
    id: 'kpi-active-staff',
    title: 'Nhân viên đang hoạt động',
    value: '45 nhân viên',
    change: '+5.0%',
    isPositive: true,
    subtext: 'tỷ lệ khả dụng 94%',
  },
  {
    id: 'kpi-new-customers',
    title: 'Khách hàng đăng ký mới',
    value: '128 người',
    change: '+12.1%',
    isPositive: true,
    subtext: 'tăng trưởng người dùng mới',
  },
]

export const mockRecentBookings: RecentBookingSummary[] = [
  {
    id: 'BK-88201',
    customerName: 'Nguyễn Văn An',
    serviceName: 'Vệ sinh máy lạnh',
    time: '16/09/2026 - 14:30',
    amount: 380000,
    status: 'SEARCHING',
    statusLabel: 'Đang tìm Staff',
  },
  {
    id: 'BK-88202',
    customerName: 'Lê Thị Thu Hà',
    serviceName: 'Chăm sóc trẻ em',
    time: '16/09/2026 - 17:00',
    amount: 490000,
    status: 'MATCHED',
    statusLabel: 'Đã có Staff',
  },
  {
    id: 'BK-88203',
    customerName: 'Phạm Minh Tuấn',
    serviceName: 'Vệ sinh nhà theo giờ',
    time: '16/09/2026 - 08:00',
    amount: 360000,
    status: 'IN_PROGRESS',
    statusLabel: 'Đang thực hiện',
  },
  {
    id: 'BK-88204',
    customerName: 'Đặng Bích Ngọc',
    serviceName: 'Chăm sóc người cao tuổi',
    time: '15/09/2026 - 08:00',
    amount: 750000,
    status: 'COMPLETED',
    statusLabel: 'Hoàn thành',
  },
  {
    id: 'BK-88205',
    customerName: 'Hoàng Quốc Việt',
    serviceName: 'Vệ sinh máy giặt',
    time: '14/09/2026 - 10:00',
    amount: 380000,
    status: 'CANCELLED',
    statusLabel: 'Đã hủy',
  },
]

export const mockTopStaff: TopStaffMember[] = [
  {
    id: 'staff-001',
    name: 'Nguyễn Thị Lan',
    phone: '0901 234 567',
    specialty: 'Vệ sinh nhà & Chăm sóc người già',
    rating: 4.9,
    totalTrips: 186,
    rank: 'Chuyên nghiệp',
  },
  {
    id: 'staff-003',
    name: 'Lê Hoài Phương',
    phone: '0987 654 321',
    specialty: 'Chăm sóc trẻ em & Bảo mẫu',
    rating: 5.0,
    totalTrips: 92,
    rank: 'Chuyên nghiệp',
  },
  {
    id: 'staff-002',
    name: 'Trần Văn Minh',
    phone: '0912 345 678',
    specialty: 'Bảo dưỡng & Vệ sinh điện lạnh',
    rating: 4.8,
    totalTrips: 124,
    rank: 'Tiêu chuẩn',
  },
  {
    id: 'staff-005',
    name: 'Vũ Thị Hồng',
    phone: '0933 881 223',
    specialty: 'Nấu ăn gia đình & Đi chợ hộ',
    rating: 4.9,
    totalTrips: 110,
    rank: 'Chuyên nghiệp',
  },
]
