import { useCatalogResource } from './useCatalogResource'
import { money } from '../api/catalog'
import type { Promotion } from '../data/promotions'

export interface CatalogPromotion {
  id: number; code: string; name: string; description: string; discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number; maxDiscountAmount: number | null; minimumBookingAmount: number;
  startDate: string; endDate: string; usageLimit: number | null; usedCount: number; isActive: boolean; serviceIds: number[]
}
export function usePromotions() {
  const result = useCatalogResource<CatalogPromotion[]>('/promotions')
  const promotions: Promotion[] = (result.data || []).map((item, index) => ({
    id: String(item.id), code: item.code, title: item.name, description: item.description,
    discountType: item.discountType, discountValue: item.discountValue,
    discountLabel: item.discountType === 'PERCENTAGE' ? `Giảm ${item.discountValue}%` : `Giảm ${money(item.discountValue)}`,
    terms: [`Đơn từ ${money(item.minimumBookingAmount)}`, item.maxDiscountAmount != null ? `giảm tối đa ${money(item.maxDiscountAmount)}` : '', item.serviceIds.length ? 'áp dụng cho các dịch vụ được chỉ định' : ''].filter(Boolean).join('; '),
    startsAt: item.startDate, endsAt: item.endDate, status: item.isActive ? 'ACTIVE' : 'UPCOMING',
    tone: index % 2 ? 'from-slate-900 to-slate-700' : 'from-emerald-600 to-teal-500',
  }))
  return { ...result, promotions }
}
