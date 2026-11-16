import { identityRequest } from './identity'
import { API_BASE_URL } from './catalog'

export type BlogCategory = 'CLEANING_TIPS' | 'FAMILY_KNOWLEDGE'
export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export interface RichNode { type?: string; text?: string; attrs?: Record<string, unknown>; marks?: { type: string; attrs?: Record<string, unknown> }[]; content?: RichNode[] }
export interface BlogSummary { id: number; slug: string; title: string; excerpt: string; category: BlogCategory; coverUrl: string; authorName: string; status: BlogStatus; version: number; publishedAt: string | null; updatedAt: string }
export interface BlogArticle extends BlogSummary { document: RichNode }
export type BlogDraft = Omit<BlogArticle, 'id' | 'updatedAt' | 'publishedAt'> & { id?: number }
export const blogCategories: Record<BlogCategory, string> = { CLEANING_TIPS: 'Mẹo dọn dẹp', FAMILY_KNOWLEDGE: 'Kiến thức gia đình' }
export async function publicBlog<T>(path = '', signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api/v1/identity/blog${path}`, { signal })
  if (!response.ok) throw new Error(response.status === 404 ? 'Bài viết không tồn tại hoặc chưa được xuất bản.' : 'Chưa tải được bài viết. Vui lòng thử lại.')
  return response.json() as Promise<T>
}
export const listAdminBlog = () => identityRequest<BlogSummary[]>('/admin/blog', {}, 'ADMIN')
export const getAdminBlog = (id: number) => identityRequest<BlogArticle>(`/admin/blog/${id}`, {}, 'ADMIN')
export const saveBlog = (draft: BlogDraft) => identityRequest<BlogArticle>(`/admin/blog${draft.id ? `/${draft.id}` : ''}`, { method: draft.id ? 'PUT' : 'POST', body: JSON.stringify(draft) }, 'ADMIN')
export const blogMediaCapabilities = () => identityRequest<{ enabled: boolean }>('/admin/blog/media/capabilities', {}, 'ADMIN')
export async function uploadBlogMedia(file: File): Promise<{ url: string; type: 'image' | 'video' }> {
  const type = file.type.startsWith('image/') ? 'image' : 'video'
  const allowed = type === 'image' ? ['image/jpeg', 'image/png', 'image/webp'] : ['video/mp4', 'video/webm', 'video/quicktime']
  if (!allowed.includes(file.type) || file.size > (type === 'image' ? 10 : 50) * 1024 * 1024) throw new Error('Chọn ảnh JPG/PNG/WebP tối đa 10 MB hoặc video MP4/WebM/MOV tối đa 50 MB, 2 phút.')
  const ticket = await identityRequest<{ id: number; uploadUrl: string; apiKey: string; signature: string; params: Record<string, string> }>('/admin/blog/media/signature', { method: 'POST', body: JSON.stringify({ type }) }, 'ADMIN')
  const data = new FormData()
  Object.entries(ticket.params).forEach(([key, value]) => data.append(key, value))
  data.append('api_key', ticket.apiKey); data.append('signature', ticket.signature); data.append('file', file)
  const upload = await fetch(ticket.uploadUrl, { method: 'POST', body: data })
  if (!upload.ok) throw new Error('Tải tệp lên Cloudinary thất bại. Nội dung đang soạn vẫn được giữ.')
  return identityRequest(`/admin/blog/media/${ticket.id}/complete`, { method: 'POST' }, 'ADMIN')
}
export const blogSlug = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 180).replace(/-$/, '')
