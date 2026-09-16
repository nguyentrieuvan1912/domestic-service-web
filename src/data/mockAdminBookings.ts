export type BookingStatus =
  | 'SEARCHING'
  | 'MATCHED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'

export type DispatchMode = 'AUTO' | 'MANUAL'

export interface BookingDetailItem {
  label: string
  value: string
}

export interface Booking {
  id: string
  customerName: string
  customerPhone: string
  address: string
  serviceId: string
  serviceName: string
  bookingDate: string
  bookingTime: string
  status: BookingStatus
  dispatchMode: DispatchMode
  staffId?: string
  staffName?: string
  staffPhone?: string
  staffAvatar?: string
  subtotal: number
  platformFee: number
  discount: number
  totalAmount: number
  paymentMethod: string
  paymentStatus: 'PAID' | 'UNPAID' | 'REFUNDED'
  dynamicDetails: Record<string, string>
  createdAt: string
  cancelReason?: string
}

export const bookingStatusLabels: Record<BookingStatus, string> = {
  SEARCHING: 'Đang tìm Staff',
  MATCHED: 'Đã có Staff',
  IN_PROGRESS: 'Đang thực hiện',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
}

export const bookingStatusStyles: Record<BookingStatus, string> = {
  SEARCHING: 'bg-amber-50 text-amber-700 border-amber-200',
  MATCHED: 'bg-blue-50 text-blue-700 border-blue-200',
  IN_PROGRESS: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
}

export const dispatchModeLabels: Record<DispatchMode, string> = {
  AUTO: 'Tự động (Hệ thống)',
  MANUAL: 'Khách chọn',
}

export const dispatchModeStyles: Record<DispatchMode, string> = {
  AUTO: 'bg-sky-50 text-sky-700 border-sky-200',
  MANUAL: 'bg-purple-50 text-purple-700 border-purple-200',
}

export const mockAdminBookings: Booking[] = [
  {
    id: 'BK-88201',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0908 112 233',
    address: '142 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP.HCM',
    serviceId: 'service-air-conditioner',
    serviceName: 'Vệ sinh máy lạnh',
    bookingDate: '16/09/2026',
    bookingTime: '14:30 - 16:00',
    status: 'SEARCHING',
    dispatchMode: 'AUTO',
    subtotal: 400000,
    platformFee: 30000,
    discount: 50000,
    totalAmount: 380000,
    paymentMethod: 'Ví Momo',
    paymentStatus: 'PAID',
    dynamicDetails: {
      'Loại máy lạnh': 'Máy lạnh treo tường (1 - 2.5 HP)',
      'Số lượng máy': '2 máy',
      'Yêu cầu nạp gas': 'Có (Gas R32)',
      'Vị trí lắp đặt': 'Lầu 2 và Lầu 3 (Có sẵn thang)',
    },
    createdAt: '16/09/2026 13:15',
  },
  {
    id: 'BK-88202',
    customerName: 'Lê Thị Thu Hà',
    customerPhone: '0918 334 556',
    address: 'Chung cư Vinhomes Central Park, Bình Thạnh, TP.HCM',
    serviceId: 'service-childcare',
    serviceName: 'Chăm sóc trẻ em',
    bookingDate: '16/09/2026',
    bookingTime: '17:00 - 20:00',
    status: 'MATCHED',
    dispatchMode: 'MANUAL',
    staffId: 'staff-003',
    staffName: 'Lê Hoài Phương',
    staffPhone: '0987 654 321',
    subtotal: 450000,
    platformFee: 40000,
    discount: 0,
    totalAmount: 490000,
    paymentMethod: 'Thẻ ATM / ZaloPay',
    paymentStatus: 'PAID',
    dynamicDetails: {
      'Độ tuổi của trẻ': '3 tuổi (Bé gái)',
      'Thời lượng chăm sóc': '3 tiếng',
      'Kỹ năng yêu cầu': 'Biết đọc truyện, hỗ trợ bé ăn chiều',
      'Lưu ý đặc biệt': 'Bé dị ứng đậu phộng, không cho ăn đồ ngọt',
    },
    createdAt: '16/09/2026 10:00',
  },
  {
    id: 'BK-88203',
    customerName: 'Phạm Minh Tuấn',
    customerPhone: '0937 889 900',
    address: '88 Đường số 7, KDC Him Lam, Quận 7, TP.HCM',
    serviceId: 'service-home-cleaning',
    serviceName: 'Vệ sinh nhà theo giờ',
    bookingDate: '16/09/2026',
    bookingTime: '08:00 - 12:00',
    status: 'IN_PROGRESS',
    dispatchMode: 'AUTO',
    staffId: 'staff-001',
    staffName: 'Nguyễn Thị Lan',
    staffPhone: '0901 234 567',
    subtotal: 360000,
    platformFee: 30000,
    discount: 30000,
    totalAmount: 360000,
    paymentMethod: 'Tiền mặt (COD)',
    paymentStatus: 'UNPAID',
    dynamicDetails: {
      'Diện tích căn nhà': '80m2 (2 phòng ngủ, 2 WC)',
      'Số lượng Staff': '1 người (4 tiếng)',
      'Dụng cụ vệ sinh': 'Staff tự mang theo dụng cụ & hóa chất',
      'Ghi chú cho Staff': 'Ưu tiên lau dọn kỹ khu vực bếp và ban công',
    },
    createdAt: '15/09/2026 20:45',
  },
  {
    id: 'BK-88204',
    customerName: 'Đặng Bích Ngọc',
    customerPhone: '0972 554 332',
    address: '254 Nam Kỳ Khởi Nghĩa, Phường 7, Quận 3, TP.HCM',
    serviceId: 'service-elderly-care',
    serviceName: 'Chăm sóc người cao tuổi',
    bookingDate: '15/09/2026',
    bookingTime: '08:00 - 17:00',
    status: 'COMPLETED',
    dispatchMode: 'MANUAL',
    staffId: 'staff-001',
    staffName: 'Nguyễn Thị Lan',
    staffPhone: '0901 234 567',
    subtotal: 800000,
    platformFee: 50000,
    discount: 100000,
    totalAmount: 750000,
    paymentMethod: 'Ví CleanMaster',
    paymentStatus: 'PAID',
    dynamicDetails: {
      'Độ tuổi người bệnh': '78 tuổi (Cụ bà)',
      'Mức độ hỗ trợ': 'Cần hỗ trợ di chuyển và nhắc uống thuốc',
      'Thực đơn dinh dưỡng': 'Nấu cháo yến mạch buổi trưa',
      'Đánh giá dịch vụ': '⭐⭐⭐⭐⭐ (5/5 sao - Rất chu đáo)',
    },
    createdAt: '14/09/2026 16:20',
  },
  {
    id: 'BK-88205',
    customerName: 'Hoàng Quốc Việt',
    customerPhone: '0966 778 899',
    address: '12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
    serviceId: 'service-washing-machine',
    serviceName: 'Vệ sinh máy giặt',
    bookingDate: '14/09/2026',
    bookingTime: '10:00 - 11:30',
    status: 'CANCELLED',
    dispatchMode: 'AUTO',
    subtotal: 350000,
    platformFee: 30000,
    discount: 0,
    totalAmount: 380000,
    paymentMethod: 'Ví Momo',
    paymentStatus: 'REFUNDED',
    dynamicDetails: {
      'Loại máy giặt': 'Máy giặt cửa trước (Inverter)',
      'Tải trọng máy': '9 kg',
      'Tình trạng': 'Máy có mùi hôi và xả nước chậm',
    },
    createdAt: '14/09/2026 08:10',
    cancelReason: 'Khách bận đột xuất bão lịch trình, đã hoàn tiền 100%',
  },
]
