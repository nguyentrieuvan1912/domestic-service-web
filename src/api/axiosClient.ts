import axios from 'axios'
import type { AxiosInstance, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { readSession, saveSession } from './identity'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')

export function getAdminAccessToken(): string | null {
  return readSession('ADMIN')?.accessToken ?? null
}

/**
 * Axios instance cấu hình chung cho Web Admin kết nối qua API Gateway (:8080/api/v1)
 */
export const axiosClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  allowAbsoluteUrls: false,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
})

// Chỉ đính kèm phiên Admin khi gọi API không công khai.
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isPublic =
      config.url?.includes('/candidates/apply') ||
      config.url?.includes('/candidates/captcha') ||
      config.url?.startsWith('/catalog/services') ||
      config.url?.startsWith('/catalog/categories') ||
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
    const token = getAdminAccessToken()
    if (token && error.response?.status === 401 && error.config?.headers?.Authorization === `Bearer ${token}`) saveSession('ADMIN', null)

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
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
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
