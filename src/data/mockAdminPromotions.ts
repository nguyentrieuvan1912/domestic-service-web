export type PromotionStatus = 'ACTIVE' | 'SCHEDULED' | 'EXPIRED' | 'DISABLED'
export type DiscountType = 'PERCENT' | 'FIXED'

export interface Promotion {
  id: string
  code: string
  description: string
  discountType: DiscountType
  discountValue: number
  maxDiscount?: number
  validFrom: string
  validTo: string
  usageLimit: number
  usedCount: number
  status: PromotionStatus
}

export const promotionStatusLabels: Record<PromotionStatus, string> = {
  ACTIVE: 'Đang diễn ra',
  SCHEDULED: 'Sắp diễn ra',
  EXPIRED: 'Đã hết hạn',
  DISABLED: 'Đã tắt',
}

export const promotionStatusStyles: Record<PromotionStatus, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  SCHEDULED: 'bg-blue-50 text-blue-700 border-blue-200',
  EXPIRED: 'bg-slate-100 text-slate-600 border-slate-200',
  DISABLED: 'bg-rose-50 text-rose-700 border-rose-200',
}

export const discountTypeLabels: Record<DiscountType, string> = {
  PERCENT: 'Theo phần trăm (%)',
  FIXED: 'Số tiền cố định (VNĐ)',
}

export const mockAdminPromotions: Promotion[] = [
  {
    id: 'promo-001',
    code: 'CLEAN2026',
    description: 'Giảm 20% cho tất cả đơn hàng vệ sinh nhà cửa chào thu 2026',
    discountType: 'PERCENT',
    discountValue: 20,
    maxDiscount: 50000,
    validFrom: '2026-09-01',
    validTo: '2026-10-31',
    usageLimit: 500,
    usedCount: 184,
    status: 'ACTIVE',
  },
  {
    id: 'promo-002',
    code: 'AIRCON50K',
    description: 'Giảm trực tiếp 50.000đ khi đặt dịch vụ vệ sinh & bảo dưỡng máy lạnh',
    discountType: 'FIXED',
    discountValue: 50000,
    validFrom: '2026-09-10',
    validTo: '2026-09-30',
    usageLimit: 200,
    usedCount: 76,
    status: 'ACTIVE',
  },
  {
    id: 'promo-003',
    code: 'MIDAUTUMN',
    description: 'Chương trình khuyến mãi đặc biệt Tết Trung Thu gia đình',
    discountType: 'PERCENT',
    discountValue: 15,
    maxDiscount: 100000,
    validFrom: '2026-09-25',
    validTo: '2026-10-05',
    usageLimit: 300,
    usedCount: 0,
    status: 'SCHEDULED',
  },
  {
    id: 'promo-004',
    code: 'SUMMEREND',
    description: 'Ưu đãi tri ân khách hàng thân thiết cuối mùa hè 2026',
    discountType: 'FIXED',
    discountValue: 30000,
    validFrom: '2026-08-01',
    validTo: '2026-08-31',
    usageLimit: 1000,
    usedCount: 942,
    status: 'EXPIRED',
  },
  {
    id: 'promo-005',
    code: 'VIPNEWMEMBER',
    description: 'Tặng 100.000đ cho thành viên mới đăng ký gói chăm sóc trẻ em',
    discountType: 'FIXED',
    discountValue: 100000,
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    usageLimit: 100,
    usedCount: 45,
    status: 'DISABLED',
  },
]
