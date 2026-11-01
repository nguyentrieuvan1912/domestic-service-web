import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')

/**
 * Lấy token xác thực của Quản trị viên (Admin)
 * Hỗ trợ cả sessionStorage (chuẩn của hệ thống identity) và localStorage
 */
export function getAdminAccessToken(): string | null {
  try {
    // 1. Kiểm tra session Admin được lưu theo chuẩn cleanmaster_identity_ADMIN
    const sessionRaw = sessionStorage.getItem('cleanmaster_identity_ADMIN') || localStorage.getItem('cleanmaster_identity_ADMIN')
    if (sessionRaw) {
      const parsed = JSON.parse(sessionRaw)
      if (parsed?.accessToken && typeof parsed.accessToken === 'string') {
        // Kiểm tra thời hạn nếu có expiresAt
        if (!parsed.expiresAt || Date.parse(parsed.expiresAt) > Date.now()) {
          return parsed.accessToken
        }
      }
    }

    // 2. Fallback cho các trường hợp lưu token trực tiếp
    const directToken = localStorage.getItem('admin_token') || localStorage.getItem('accessToken') || sessionStorage.getItem('admin_token')
    if (directToken) return directToken
  } catch (error) {
    console.error('Lỗi khi đọc token xác thực:', error)
  }
  return null
}

/**
 * Axios instance cấu hình chung cho Web Admin kết nối qua API Gateway (:8080/api/v1)
 */
export const axiosClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
})

// Request Interceptor: Tự động đính kèm JWT Bearer token vào Header (trừ các endpoint public như nộp hồ sơ Guest)
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isPublic =
      config.url?.includes('/candidates/apply') ||
      config.headers?.['x-skip-auth'] === 'true'

    if (!isPublic) {
      const token = getAdminAccessToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Trích xuất response.data và xử lý 401 tự động
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      // Khi token hết hạn hoặc không hợp lệ, xóa session Admin và phát event
      sessionStorage.removeItem('cleanmaster_identity_ADMIN')
      localStorage.removeItem('cleanmaster_identity_ADMIN')
      localStorage.removeItem('admin_token')
      window.dispatchEvent(new Event('identity-session'))
    }

    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Không thể kết nối đến hệ thống máy chủ.'

    return Promise.reject(new Error(message))
  }
)

/**
 * Wrapper tiện ích cho các request có kiểu trả về đúng chuẩn response.data
 */
export const http = {
  get: <T = unknown>(url: string, config?: InternalAxiosRequestConfig): Promise<T> =>
    axiosClient.get(url, config) as unknown as Promise<T>,
  post: <T = unknown>(url: string, data?: unknown, config?: InternalAxiosRequestConfig): Promise<T> =>
    axiosClient.post(url, data, config) as unknown as Promise<T>,
  put: <T = unknown>(url: string, data?: unknown, config?: InternalAxiosRequestConfig): Promise<T> =>
    axiosClient.put(url, data, config) as unknown as Promise<T>,
  patch: <T = unknown>(url: string, data?: unknown, config?: InternalAxiosRequestConfig): Promise<T> =>
    axiosClient.patch(url, data, config) as unknown as Promise<T>,
  delete: <T = unknown>(url: string, config?: InternalAxiosRequestConfig): Promise<T> =>
    axiosClient.delete(url, config) as unknown as Promise<T>,
}

export default axiosClient
