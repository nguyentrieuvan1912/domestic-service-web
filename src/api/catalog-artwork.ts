import { adminRequest } from './operations'

export type BannerLayout = 'SPLIT' | 'FULL_IMAGE'
export type BannerTheme = 'BLUE' | 'GREEN' | 'ORANGE' | 'NAVY'

export type HomeBanner = {
  id: number
  serviceId: number
  title: string
  badge: string
  description: string
  buttonLabel: string
  theme: BannerTheme
  layout: BannerLayout
  imageUrl: string
  sortOrder: number
  active: boolean
}

export const listAdminBanners = () => adminRequest<HomeBanner[]>('catalog', '/admin/home-banners')

export const saveAdminBanner = (banner: HomeBanner, imageData: string) => {
  const { id, serviceId, title, badge, description, buttonLabel, theme, layout, sortOrder, active } = banner
  return adminRequest<{ id: number }>('catalog', '/admin/home-banners' + (id ? '/' + id : ''), id ? 'PUT' : 'POST',
    { serviceId, title, badge, description, buttonLabel, theme, layout, sortOrder, active, imageData })
}

export const saveServiceImage = (id: string, imageData: string) =>
  adminRequest<{ imageUrl: string }>('catalog', '/admin/services/' + id + '/image', 'PUT', { imageData })
