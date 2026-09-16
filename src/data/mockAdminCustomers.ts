export type CustomerStatus = 'ACTIVE' | 'LOCKED'

export interface CustomerBookingHistory {
  id: string
  serviceName: string
  date: string
  amount: number
  status: string
}

export interface Customer {
  id: string
  fullName: string
  phone: string
  email: string
  address: string
  joinDate: string
  totalBookings: number
  totalSpent: number
  status: CustomerStatus
  statusNote?: string
  recentBookings: CustomerBookingHistory[]
}

export const customerStatusLabels: Record<CustomerStatus, string> = {
  ACTIVE: 'Hoạt động',
  LOCKED: 'Bị khóa',
}

export const customerStatusStyles: Record<CustomerStatus, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  LOCKED: 'bg-rose-50 text-rose-700 border-rose-200',
}

export const mockAdminCustomers: Customer[] = [
  {
    id: 'cust-001',
    fullName: 'Nguyễn Văn An',
    phone: '0908 112 233',
    email: 'nguyenvanan@gmail.com',
    address: '142 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP.HCM',
    joinDate: '10/01/2025',
    totalBookings: 18,
    totalSpent: 6450000,
    status: 'ACTIVE',
    statusNote: '',
    recentBookings: [
      { id: 'BK-88201', serviceName: 'Vệ sinh máy lạnh', date: '16/09/2026', amount: 380000, status: 'Đang tìm Staff' },
      { id: 'BK-88150', serviceName: 'Vệ sinh nhà theo giờ', date: '02/09/2026', amount: 420000, status: 'Hoàn thành' },
      { id: 'BK-88092', serviceName: 'Vệ sinh máy giặt', date: '15/08/2026', amount: 350000, status: 'Hoàn thành' },
      { id: 'BK-87980', serviceName: 'Tổng vệ sinh nhà', date: '20/07/2026', amount: 1200000, status: 'Hoàn thành' },
    ],
  },
  {
    id: 'cust-002',
    fullName: 'Lê Thị Thu Hà',
    phone: '0918 334 556',
    email: 'thuha.le@outlook.com',
    address: 'Chung cư Vinhomes Central Park, Bình Thạnh, TP.HCM',
    joinDate: '15/03/2025',
    totalBookings: 24,
    totalSpent: 11200000,
    status: 'ACTIVE',
    statusNote: '',
    recentBookings: [
      { id: 'BK-88202', serviceName: 'Chăm sóc trẻ em', date: '16/09/2026', amount: 490000, status: 'Đã có Staff' },
      { id: 'BK-88188', serviceName: 'Chăm sóc trẻ em', date: '12/09/2026', amount: 490000, status: 'Hoàn thành' },
      { id: 'BK-88145', serviceName: 'Nấu ăn gia đình', date: '05/09/2026', amount: 600000, status: 'Hoàn thành' },
    ],
  },
  {
    id: 'cust-003',
    fullName: 'Phạm Minh Tuấn',
    phone: '0937 889 900',
    email: 'tuan.pham@company.vn',
    address: '88 Đường số 7, KDC Him Lam, Quận 7, TP.HCM',
    joinDate: '22/05/2025',
    totalBookings: 8,
    totalSpent: 3100000,
    status: 'ACTIVE',
    statusNote: '',
    recentBookings: [
      { id: 'BK-88203', serviceName: 'Vệ sinh nhà theo giờ', date: '16/09/2026', amount: 360000, status: 'Đang thực hiện' },
      { id: 'BK-88110', serviceName: 'Vệ sinh thiết bị bếp', date: '28/08/2026', amount: 500000, status: 'Hoàn thành' },
    ],
  },
  {
    id: 'cust-004',
    fullName: 'Đặng Bích Ngọc',
    phone: '0972 554 332',
    email: 'bichngoc.dang@gmail.com',
    address: '254 Nam Kỳ Khởi Nghĩa, Phường 7, Quận 3, TP.HCM',
    joinDate: '08/08/2025',
    totalBookings: 12,
    totalSpent: 5800000,
    status: 'ACTIVE',
    statusNote: '',
    recentBookings: [
      { id: 'BK-88204', serviceName: 'Chăm sóc người cao tuổi', date: '15/09/2026', amount: 750000, status: 'Hoàn thành' },
      { id: 'BK-88160', serviceName: 'Chăm sóc người cao tuổi', date: '08/09/2026', amount: 750000, status: 'Hoàn thành' },
    ],
  },
  {
    id: 'cust-005',
    fullName: 'Vũ Hoàng Nam',
    phone: '0903 998 776',
    email: 'hoangnam.vu@yahoo.com',
    address: '45 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP.HCM',
    joinDate: '01/02/2026',
    totalBookings: 3,
    totalSpent: 850000,
    status: 'LOCKED',
    statusNote: 'Tài khoản bị khóa do liên tục hủy đơn không lý do 3 lần trong tuần',
    recentBookings: [
      { id: 'BK-88120', serviceName: 'Giặt ủi cao cấp', date: '01/09/2026', amount: 250000, status: 'Đã hủy' },
      { id: 'BK-88099', serviceName: 'Vệ sinh máy lạnh', date: '25/08/2026', amount: 350000, status: 'Đã hủy' },
    ],
  },
]
