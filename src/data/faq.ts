export interface FAQItem {
  id: string
  audience: 'CUSTOMER' | 'STAFF'
  question: string
  answer: string
  order: number
}

export const faqItems: FAQItem[] = [
  {
    id: 'customer-booking',
    audience: 'CUSTOMER',
    question: 'Tôi có cần đăng nhập trên website để đọc Blog hoặc đặt dịch vụ không?',
    answer: 'Không. Website là trang giới thiệu dịch vụ và Blog mở công khai không có đăng nhập. Để đặt lịch, chọn khu vực và theo dõi đơn hàng theo thời gian thực, bạn vui lòng tải Mobile App CleanMaster.',
    order: 1,
  },
  {
    id: 'customer-change-staff',
    audience: 'CUSTOMER',
    question: 'Tôi có thể tự chọn nhân viên yêu thích hoặc đặt lại nhanh không?',
    answer: 'Có. Khi đặt lịch hoặc dùng tính năng Đặt lại nhanh (Quick Rebook), bạn có thể chọn nhân viên đã từng phục vụ tốt. Nhân viên có tối đa 5 phút để xác nhận; nếu hết giờ, bạn có thể chọn người khác hoặc để hệ thống tự động ghép.',
    order: 2,
  },
  {
    id: 'customer-ai',
    audience: 'CUSTOMER',
    question: 'Trợ lý AI CleanMaster 24/7 hỗ trợ tôi như thế nào?',
    answer: 'Trợ lý AI trên ứng dụng hỗ trợ cả nhắn tin (Chat) và nói chuyện trực tiếp (Voice AI) để tư vấn gói dịch vụ theo diện tích, so sánh giá và giải đáp chính sách. AI không tự quyết định giá, thanh toán, hoàn tiền hay xác nhận đặt đơn thay bạn.',
    order: 3,
  },
  {
    id: 'customer-call-chat',
    audience: 'CUSTOMER',
    question: 'Tôi liên hệ với nhân viên phụ trách đơn bằng cách nào để đảm bảo riêng tư?',
    answer: 'Ngay trong chi tiết đơn hàng trên ứng dụng có tích hợp Chat trực tiếp và Gọi thoại/Video (LiveKit) bảo mật, giúp bạn trao đổi đường đi và yêu cầu công việc mà không cần lộ số điện thoại cá nhân.',
    order: 4,
  },
  {
    id: 'customer-payment-cancel',
    audience: 'CUSTOMER',
    question: 'Thanh toán và hủy lịch hoạt động ra sao?',
    answer: 'Bạn có thể thanh toán bằng Tiền mặt sau khi hoàn thành, Ví CleanMaster hoặc chuyển khoản/QR (payOS) và áp dụng mã khuyến mãi hợp lệ. Chính sách hủy lịch phụ thuộc thời điểm hủy và trạng thái đơn, luôn hiển thị rõ trên App trước khi xác nhận.',
    order: 5,
  },
  {
    id: 'customer-theme',
    audience: 'CUSTOMER',
    question: 'Ứng dụng có hỗ trợ chế độ Tối (Dark Mode) không?',
    answer: 'Có. Cả Khách hàng và Nhân viên đều có thể vào mục Tài khoản → Giao diện & Màu nền để chuyển đổi giữa chế độ Sáng, Tối hoặc Theo hệ thống và chọn 1 trong 6 tông màu nền yêu thích.',
    order: 6,
  },
  {
    id: 'staff-application',
    audience: 'STAFF',
    question: 'Tôi có thể tự tạo tài khoản Staff trên Mobile App không?',
    answer: 'Không. Website chỉ tiếp nhận thông tin ứng tuyển. Sau khi bạn hoàn tất phỏng vấn, xác minh CCCD và đào tạo tại công ty, Admin sẽ tạo tài khoản Staff để bạn đăng nhập nhận việc.',
    order: 7,
  },
  {
    id: 'staff-schedule-areas',
    audience: 'STAFF',
    question: 'Trước khi nhận ca, tôi cần thiết lập những gì trên ứng dụng?',
    answer: 'Bạn cần thực hiện 2 bước trong mục Tài khoản: (1) Đăng ký lịch làm việc theo tuần và (2) Quản lý khu vực hoạt động (chọn tối đa 30 phường, xã hoặc đặc khu tại TP. Hồ Chí Minh) để hệ thống ghép đúng ca gần bạn.',
    order: 8,
  },
  {
    id: 'staff-income',
    audience: 'STAFF',
    question: 'Tôi nhận thu nhập và rút tiền như thế nào?',
    answer: 'Thu nhập được quyết toán vào Ví nhân viên sau khi đơn hoàn thành. Sau khi liên kết tài khoản ngân hàng đã xác minh, bạn có thể gửi yêu cầu rút tiền để hệ thống tự động tạo lệnh chi qua payOS minh bạch.',
    order: 9,
  },
  {
    id: 'staff-training',
    audience: 'STAFF',
    question: 'Tôi có được đào tạo trước khi nhận việc không?',
    answer: 'Có. Ứng viên phù hợp sẽ được hướng dẫn quy trình phục vụ, chụp ảnh minh chứng ca làm và cách sử dụng ứng dụng trước khi bắt đầu nhận việc. Bạn cũng có thể xem trước tại trang Hướng dẫn nhân viên sử dụng App.',
    order: 10,
  },
]
