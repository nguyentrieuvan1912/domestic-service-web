export interface Promotion {
  id: string
  code: string
  title: string
  description: string
  discountLabel: string
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT'
  discountValue: number
  terms: string
  startsAt: string
  endsAt: string
  status: 'ACTIVE' | 'UPCOMING' | 'EXPIRED'
  imageUrl?: string
  tone: string
}

export const promotions: Promotion[] = [
  {
    id: 'promotion-welcome',
    code: 'WELCOME20',
    title: 'Ưu đãi cho lần đầu trải nghiệm',
    description: 'Khám phá dịch vụ dọn dẹp chuyên nghiệp với mức giá dễ bắt đầu.',
    discountLabel: 'Giảm 20%',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    terms: 'Áp dụng cho khách hàng sử dụng dịch vụ lần đầu.',
    startsAt: '2026-01-01T00:00:00+07:00',
    endsAt: '2026-09-30T23:59:59+07:00',
    status: 'ACTIVE',
    tone: 'from-emerald-600 to-teal-500',
  },
  {
    id: 'promotion-recurring',
    code: 'RECURRING15',
    title: 'Đặt lịch định kỳ, thêm nhiều tiện lợi',
    description: 'Ưu đãi dành cho khách hàng chọn lịch chăm sóc nhà cửa lâu dài.',
    discountLabel: 'Tiết kiệm 15%',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    terms: 'Áp dụng khi đăng ký gói dọn dẹp định kỳ trên Mobile App.',
    startsAt: '2026-01-01T00:00:00+07:00',
    endsAt: '2026-12-31T23:59:59+07:00',
    status: 'ACTIVE',
    tone: 'from-slate-900 to-slate-700',
  },
]
