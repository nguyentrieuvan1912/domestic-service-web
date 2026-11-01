/** Mirrors the public Catalog contract. No mock fallback. */
export interface CatalogCategory {
  id: number; code: string; name: string; description: string | null; iconUrl: string | null; group: string | null
}
export interface CatalogService {
  id: number; categoryId: number; categoryCode: string; categoryName: string; code: string; name: string
  description: string | null; shortDescription: string | null; serviceType: string; priceUnit: string
  basePrice: number; estimatedDurationMinutes: number; requiresQualification: boolean
  imageUrl: string | null; highlights: string[]
}
export interface CatalogDetail {
  service: CatalogService
  packages: { id: number; name: string; description: string | null; durationMinutes: number; basePrice: number; defaultStaffCount: number; maxArea: number | null }[]
  addOns: { id: number; name: string; description: string | null; price: number; extraDurationMinutes: number; imageUrl: string | null }[]
  requirements: { id: number; fieldKey: string; label: string; fieldType: string; required: boolean; options: unknown[]; validationRules: Record<string, unknown>; displayOrder: number }[]
  workflow: string[]; benefits: string[]
}
export interface CatalogPage { items: CatalogService[]; total: number; page: number; size: number; totalPages: number }

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')
export const money = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
export const priceUnit = (unit: string) => ({ PACKAGE: 'gói', HOUR: 'giờ', SESSION: 'buổi', ITEM: 'đơn vị' }[unit] || unit)

export async function catalogGet<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api/v1/catalog${path}`, { signal })
  if (!response.ok) {
    if (response.status === 404) throw new Error('Không tìm thấy dịch vụ hoặc dịch vụ đã ngừng hoạt động.')
    if (response.status === 400) throw new Error('Thông tin tìm kiếm không hợp lệ. Vui lòng kiểm tra lại.')
    throw new Error('Không thể tải dữ liệu từ backend. Vui lòng thử lại.')
  }
  return response.json() as Promise<T>
}
