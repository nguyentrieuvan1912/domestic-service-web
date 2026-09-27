export type ReviewStatus = 'PUBLISHED' | 'HIDDEN' | 'RESOLVED'

export interface Review {
  id: string
  bookingId: string
  customerName: string
  customerPhone: string
  staffName: string
  serviceName: string
  rating: number
  content: string
  createdAt: string
  status: ReviewStatus
  internalNote?: string
}

export const reviewStatusLabels: Record<ReviewStatus, string> = {
  PUBLISHED: 'Đang hiển thị',
  HIDDEN: 'Đã ẩn (Vi phạm)',
  RESOLVED: 'Đã giải quyết',
}

export const reviewStatusStyles: Record<ReviewStatus, string> = {
  PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  HIDDEN: 'bg-rose-50 text-rose-700 border-rose-200',
  RESOLVED: 'bg-blue-50 text-blue-700 border-blue-200',
}

export const mockAdminReviews: Review[] = [
  {
    id: 'REV-001',
    bookingId: 'BK-88204',
    customerName: 'Đặng Bích Ngọc',
    customerPhone: '0972 554 332',
    staffName: 'Nguyễn Thị Lan',
    serviceName: 'Chăm sóc người cao tuổi',
    rating: 5,
    content: 'Chị Lan rất dịu dàng và chu đáo. Nấu cháo cụ ăn hết sạch và nhắc uống thuốc rất đúng giờ. Sẽ tiếp tục đặt lại!',
    createdAt: '15/09/2026 17:30',
    status: 'PUBLISHED',
    internalNote: '',
  },
  {
    id: 'REV-002',
    bookingId: 'BK-88190',
    customerName: 'Trần Văn Mạnh',
    customerPhone: '0912 887 665',
    staffName: 'Trần Văn Minh',
    serviceName: 'Vệ sinh máy lạnh',
    rating: 2,
    content: 'Staff đến trễ 40 phút nhưng không thông báo trước. Khi vệ sinh làm văng nước dơ ra sàn gỗ phòng khách.',
    createdAt: '14/09/2026 11:15',
    status: 'RESOLVED',
    internalNote: 'Đã gọi điện xin lỗi khách hàng, nhắc nhở Staff Trần Văn Minh và tặng voucher bồi thường 50.000đ.',
  },
  {
    id: 'REV-003',
    bookingId: 'BK-88155',
    customerName: 'Lê Thị Thu Hà',
    customerPhone: '0918 334 556',
    staffName: 'Lê Hoài Phương',
    serviceName: 'Chăm sóc trẻ em',
    rating: 5,
    content: 'Cô Phương chơi với bé rất thân thiện, bé nhà mình rất thích. Kỹ năng hỗ trợ bé ăn chiều rất chuyên nghiệp.',
    createdAt: '12/09/2026 20:10',
    status: 'PUBLISHED',
    internalNote: '',
  },
  {
    id: 'REV-004',
    bookingId: 'BK-88112',
    customerName: 'Vũ Hoàng Nam',
    customerPhone: '0903 998 776',
    staffName: 'Phạm Quốc Huy',
    serviceName: 'Vệ sinh nhà theo giờ',
    rating: 1,
    content: 'Làm ăn vớ vẩn, lừa đảo xúc phạm người dùng [từ ngữ thô tục đã bị hệ thống bộ lọc tự động gắn cờ].',
    createdAt: '10/09/2026 09:45',
    status: 'HIDDEN',
    internalNote: 'Hệ thống tự động ẩn do chứa từ ngữ công kích thô tục. Đã liên hệ tài khoản để làm rõ lý do.',
  },
  {
    id: 'REV-005',
    bookingId: 'BK-88095',
    customerName: 'Phạm Minh Tuấn',
    customerPhone: '0937 889 900',
    staffName: 'Nguyễn Thị Lan',
    serviceName: 'Vệ sinh nhà theo giờ',
    rating: 4,
    content: 'Dọn dẹp sạch sẻ, thái độ tốt. Tuy nhiên lau kính cửa ban công vẫn còn vết mờ nhẹ.',
    createdAt: '08/09/2026 14:00',
    status: 'PUBLISHED',
    internalNote: '',
  },
  {
    id: 'REV-006',
    bookingId: 'BK-88080',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0908 112 233',
    staffName: 'Trần Văn Minh',
    serviceName: 'Vệ sinh máy giặt',
    rating: 5,
    content: 'Máy giặt giặt xong thơm tho không còn mùi hôi. Thợ kiểm tra ống xả nước rất kỹ lưỡng.',
    createdAt: '05/09/2026 16:20',
    status: 'PUBLISHED',
    internalNote: '',
  },
]
