import { http } from '../api/axiosClient'
import type { Candidate, CandidateGender, CandidateSource } from '../data/mockAdminCandidates'
import type { CatalogCategory, CatalogPage, CatalogService } from '../api/catalog'

export type PartnerCatalogService = CatalogService & { categoryGroup: string | null }

export interface PartnerCaptcha { id: string; image: string; expiresAt: string }
export const getPartnerCaptcha = () => http.get<PartnerCaptcha>('/identity/candidates/captcha')

export interface ApplicationData {
  fullName: string
  email: string
  phone: string
  identityCard: string
  birthYear: number
  gender: CandidateGender
  area: string
  source: CandidateSource
  services: string[]
  note?: string
  captchaId: string
  captchaCode: string
}

export type CandidateBackendResponse = Omit<Candidate, 'id' | 'staffId'> & {
  id: number | string
  staffId?: number | string | null
}

export const candidateView = (item: CandidateBackendResponse): Candidate => {
  let registeredAt = ''
  if (item.registeredAt) {
    try {
      registeredAt = new Date(item.registeredAt).toLocaleDateString('vi-VN')
    } catch {
      registeredAt = String(item.registeredAt)
    }
  }

  // Normalization: APPLIED status is mapped to PENDING for the stage workflow
  const rawStatus = (item.status as string) || 'PENDING'
  const status = rawStatus === 'APPLIED' ? 'PENDING' : (rawStatus as Candidate['status'])

  return {
    ...item,
    id: String(item.id),
    staffId: item.staffId ? String(item.staffId) : undefined,
    status,
    subStatus: item.subStatus || (status === 'PENDING' ? 'Chờ duyệt' : ''),
    services: Array.isArray(item.services) ? item.services : [],
    registeredAt,
  }
}

/**
 * Gửi hồ sơ ứng tuyển từ trang Guest (Public endpoint, không yêu cầu JWT)
 */
export const submitApplication = async (
  data: ApplicationData
): Promise<{ success: boolean; message: string; data?: Candidate }> => {
  try {
    const payload = {
      fullName: data.fullName.trim(),
      phone: data.phone.trim().replaceAll(/\s+/g, ''),
      email: data.email.trim(),
      cccd: data.identityCard.trim().replaceAll(/\s+/g, ''),
      identityCard: data.identityCard.trim().replaceAll(/\s+/g, ''),
      birthYear: Number(data.birthYear),
      gender: data.gender,
      area: data.area,
      source: data.source || 'Website CleanMaster',
      services: data.services,
      note: data.note || 'Đăng ký ứng tuyển trực tuyến qua website CleanMaster',
      captchaId: data.captchaId,
      captchaCode: data.captchaCode,
    }

    const response = await http.post<CandidateBackendResponse>(
      '/identity/candidates/apply',
      payload
    )

    // Phát event thông báo để bảng Admin tự động cập nhật nếu đang mở
    window.dispatchEvent(new Event('admin-data-changed'))

    return {
      success: true,
      message: 'Đăng ký thành công! CleanMaster sẽ liên hệ với bạn trong vòng 24h để hẹn lịch phỏng vấn.',
      data: response ? candidateView(response) : undefined,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Đăng ký ứng tuyển thất bại. Vui lòng thử lại.'
    throw new Error(message, { cause: error })
  }
}

/**
 * Lấy danh sách ứng viên (Admin endpoint, tự động gắn JWT Token qua Interceptor)
 */
export const getAdminCandidates = async (status?: string): Promise<Candidate[]> => {
  const query = status && status !== 'ALL' ? `?status=${encodeURIComponent(status)}` : ''
  const items = await http.get<CandidateBackendResponse[]>(`/identity/admin/candidates${query}`)

  if (!Array.isArray(items)) {
    return []
  }

  return items.map(candidateView)
}

/**
 * Cập nhật trạng thái ứng viên (Duyệt/Từ chối/Chuyển giai đoạn)
 */
export const updateCandidateStatus = async (
  id: string | number,
  status: string,
  note?: string
): Promise<Candidate> => {
  const result = await http.patch<CandidateBackendResponse>(
    `/identity/admin/candidates/${id}/status`,
    { status, note }
  )
  window.dispatchEvent(new Event('admin-data-changed'))
  return candidateView(result)
}

/**
 * Chuyển ứng viên qua các giai đoạn tiếp nhận, học việc, đánh giá
 */
export const advanceCandidate = async (candidate: Candidate): Promise<Candidate> => {
  const result = await http.patch<CandidateBackendResponse>(
    `/identity/admin/candidates/${candidate.id}`,
    candidate
  )
  window.dispatchEvent(new Event('admin-data-changed'))
  return candidateView(result)
}

/**
 * Cấp tài khoản Staff cho ứng viên sau khi hoàn thành đánh giá
 */
export const provisionStaff = async (
  id: string,
  password: string,
  rank: string,
  avatar: string
): Promise<Candidate> => {
  const result = await http.post<CandidateBackendResponse>(
    `/identity/admin/candidates/${id}/staff-account`,
    { password, rank, avatar }
  )
  window.dispatchEvent(new Event('admin-data-changed'))
  return candidateView(result)
}

/**
 * Tạo ứng viên mới từ bảng Admin
 */
export const createCandidate = async (candidate: Partial<Candidate>): Promise<Candidate> => {
  const result = await http.post<CandidateBackendResponse>(
    '/identity/admin/candidates',
    candidate
  )
  window.dispatchEvent(new Event('admin-data-changed'))
  return candidateView(result)
}

export const getCandidates = getAdminCandidates

/**
 * Lấy danh sách dịch vụ hoạt động từ catalog-service để hiển thị động trên Form ứng tuyển
 */
export const getActiveCatalogServices = async (): Promise<PartnerCatalogService[]> => {
  const categories = await http.get<CatalogCategory[]>('/catalog/categories')
  const result: CatalogService[] = []
  let page = 0
  let totalPages: number
  do {
    const data = await http.get<CatalogPage>(`/catalog/services?page=${page}&size=100`)
    result.push(...data.items)
    totalPages = data.totalPages
    page++
  } while (page < totalPages)
  return result.map(service => ({ ...service, categoryGroup: categories.find(category => category.id === service.categoryId)?.group ?? null }))
}
