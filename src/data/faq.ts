export interface FAQItem {
  id: string
  audience: 'CUSTOMER' | 'STAFF'
  question: string
  answer: string
  order: number
}

export const faqItems: FAQItem[] = [
  {
    id: 'customer-change-staff',
    audience: 'CUSTOMER',
    question: 'Tôi có thể đổi Staff không?',
    answer: 'Bạn có thể gửi yêu cầu hỗ trợ trên Mobile App. Đội ngũ vận hành sẽ tiếp nhận và hỗ trợ tìm lựa chọn phù hợp cho các lịch tiếp theo.',
    order: 1,
  },
  {
    id: 'customer-cancel-fee',
    audience: 'CUSTOMER',
    question: 'Hủy lịch có mất phí không?',
    answer: 'Chính sách hủy phụ thuộc vào thời điểm bạn gửi yêu cầu và trạng thái xử lý của lịch. Thông tin áp dụng cụ thể sẽ được hiển thị trên Mobile App trước khi bạn xác nhận.',
    order: 2,
  },
  {
    id: 'customer-booking',
    audience: 'CUSTOMER',
    question: 'Tôi đặt dịch vụ ở đâu?',
    answer: 'Website giúp bạn tìm hiểu dịch vụ. Để chọn thời gian, khu vực và xác nhận, bạn vui lòng tải Mobile App CleanMaster.',
    order: 3,
  },
  {
    id: 'customer-ai',
    audience: 'CUSTOMER',
    question: 'AI hỗ trợ tôi như thế nào?',
    answer: 'AI có thể tư vấn và gợi ý dịch vụ dựa trên nhu cầu bạn cung cấp. AI không tự quyết định giá, thanh toán, refund hoặc xác nhận booking thay bạn.',
    order: 4,
  },
  {
    id: 'staff-income',
    audience: 'STAFF',
    question: 'Tôi nhận thu nhập như thế nào?',
    answer: 'Thông tin thu nhập và quy trình đối soát sẽ được quản lý theo chính sách của công ty và tài khoản Staff sau khi bạn được tuyển chọn.',
    order: 5,
  },
  {
    id: 'staff-application',
    audience: 'STAFF',
    question: 'Tôi có thể tự tạo tài khoản Staff trên Mobile App không?',
    answer: 'Không. Website chỉ tiếp nhận thông tin tuyển dụng. Sau khi hoàn tất tuyển chọn, tài khoản Staff sẽ được Admin tạo theo quy trình của công ty.',
    order: 6,
  },
  {
    id: 'staff-training',
    audience: 'STAFF',
    question: 'Tôi có được đào tạo trước khi nhận việc không?',
    answer: 'Có. Ứng viên phù hợp sẽ được hướng dẫn và đào tạo theo quy trình tuyển chọn trước khi bắt đầu nhận việc.',
    order: 7,
  },
]
