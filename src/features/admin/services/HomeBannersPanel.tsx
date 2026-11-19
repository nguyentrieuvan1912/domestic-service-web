import { useState } from 'react'
import { catalogImageUrl } from '../../../api/catalog'
import { listAdminBanners, saveAdminBanner, type BannerLayout, type BannerTheme, type HomeBanner } from '../../../api/catalog-artwork'
import ResourceStatus from '../../../components/admin/ResourceStatus'
import type { Service } from '../../../data/mockAdminServices'
import { useAdminResource } from '../../../hooks/useAdminResource'
import CatalogArtworkDialog from './CatalogArtworkDialog'
import { FULL_BANNER_SIZE, SPLIT_BANNER_SIZE } from './CatalogImageInput'

const themes: Record<BannerTheme, { label: string; background: string; badge: string }> = {
  BLUE: { label: 'Xanh dương', background: 'linear-gradient(135deg, #0284C7, #0369A1)', badge: '#B91C1C' },
  GREEN: { label: 'Xanh lá', background: 'linear-gradient(135deg, #0D9488, #115E59)', badge: '#047857' },
  ORANGE: { label: 'Cam', background: 'linear-gradient(135deg, #C2410C, #9A3412)', badge: '#7C2D12' },
  NAVY: { label: 'Xanh đậm', background: 'linear-gradient(135deg, #1E3A8A, #1E40AF)', badge: '#1D4ED8' },
}
const input = 'mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900'
const primary = 'rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50'
const outline = 'rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50'

export default function HomeBannersPanel({ services }: { services: Service[] }) {
  const resource = useAdminResource<HomeBanner[]>(listAdminBanners, [])
  const [draft, setDraft] = useState<HomeBanner | null>(null)
  const [originalLayout, setOriginalLayout] = useState<BannerLayout>()
  const edit = (banner: HomeBanner) => { setDraft(banner); setOriginalLayout(banner.layout) }
  const add = () => {
    setOriginalLayout(undefined)
    setDraft({
      id: 0, serviceId: Number(services.find(item => item.isActive)?.id ?? 0),
      title: '', badge: '', description: '', buttonLabel: '', theme: 'GREEN', layout: 'SPLIT', imageUrl: '',
      sortOrder: Math.min(9999, (resource.data.at(-1)?.sortOrder ?? 0) + 10), active: false,
    })
  }

  return <div className="space-y-4 p-4 sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="font-bold text-slate-900">Banner trang chủ ứng dụng</h2>
        <p className="mt-1 text-sm text-slate-600">Banner được xếp theo số thứ tự từ nhỏ đến lớn.</p>
      </div>
      <button type="button" className={primary} onClick={add} disabled={!services.length || resource.loading}>Thêm banner</button>
    </div>
    <ResourceStatus {...resource} />
    {!resource.loading && !resource.error && resource.data.length === 0 && <p className="rounded-lg border border-dashed p-6 text-center text-sm text-slate-600">Chưa có banner.</p>}
    <div className="grid gap-4 lg:grid-cols-2">
      {resource.data.map(banner => <article key={banner.id} className="min-w-0 rounded-xl border border-slate-200 p-3">
        <BannerPreview banner={banner} image={catalogImageUrl(banner.imageUrl)} />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <h3 className="break-words text-sm font-semibold text-slate-900">{banner.title}</h3>
            <p className="text-xs text-slate-600">{banner.active ? 'Đang bật' : 'Đang ẩn'} · Thứ tự {banner.sortOrder}
              {' · '}{services.find(item => Number(item.id) === banner.serviceId)?.name ?? 'Dịch vụ #' + banner.serviceId}</p>
          </div>
          <button type="button" className={outline} onClick={() => edit(banner)}>Chỉnh sửa</button>
        </div>
      </article>)}
    </div>
    {draft && <CatalogArtworkDialog title={draft.id ? 'Chỉnh sửa banner' : 'Thêm banner'}
      size={draft.layout === 'SPLIT' ? SPLIT_BANNER_SIZE : FULL_BANNER_SIZE}
      imageUrl={originalLayout === draft.layout ? catalogImageUrl(draft.imageUrl) : ''}
      imageRequired={!draft.id || originalLayout !== draft.layout} onClose={() => setDraft(null)}
      onSave={async image => {
        await saveAdminBanner(draft, image)
        setDraft(null)
        resource.retry()
      }} preview={image => <BannerPreview banner={draft} image={image} />}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold sm:col-span-2">Tên / Tiêu đề banner
          <input required maxLength={80} className={input} value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} />
        </label>
        <label className="text-sm font-semibold">Bố cục
          <select className={input} value={draft.layout} onChange={event => setDraft({ ...draft, layout: event.target.value as BannerLayout })}>
            <option value="SPLIT">Chữ và ảnh bên phải</option><option value="FULL_IMAGE">Ảnh phủ toàn thẻ</option>
          </select>
        </label>
        <label className="text-sm font-semibold">Dịch vụ khi bấm banner
          <select required className={input} value={draft.serviceId || ''} onChange={event => setDraft({ ...draft, serviceId: Number(event.target.value) })}>
            <option value="">Chọn dịch vụ</option>
            {services.map(service => <option key={service.id} value={service.id}>{service.name}{service.isActive ? '' : ' (tạm dừng)'}</option>)}
          </select>
        </label>
        {draft.layout === 'SPLIT' && <>
          <label className="text-sm font-semibold">Nhãn ưu đãi<input maxLength={30} className={input} value={draft.badge} onChange={event => setDraft({ ...draft, badge: event.target.value })} /></label>
          <label className="text-sm font-semibold">Nút hành động<input maxLength={24} className={input} value={draft.buttonLabel} onChange={event => setDraft({ ...draft, buttonLabel: event.target.value })} /></label>
          <label className="text-sm font-semibold sm:col-span-2">Mô tả<textarea rows={2} maxLength={140} className={input} value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} /></label>
          <label className="text-sm font-semibold">Màu nền
            <select className={input} value={draft.theme} onChange={event => setDraft({ ...draft, theme: event.target.value as BannerTheme })}>
              {Object.entries(themes).map(([key, theme]) => <option key={key} value={key}>{theme.label}</option>)}
            </select>
          </label>
        </>}
        <label className="text-sm font-semibold">Thứ tự hiển thị<input required type="number" min={0} max={9999} className={input} value={draft.sortOrder} onChange={event => setDraft({ ...draft, sortOrder: event.target.valueAsNumber || 0 })} /></label>
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={draft.active} onChange={event => setDraft({ ...draft, active: event.target.checked })} /> Hiển thị trên ứng dụng
      </label>
      {draft.active && !services.some(service => Number(service.id) === draft.serviceId && service.isActive) &&
        <p className="text-sm text-amber-800">Banner chỉ hiện khi dịch vụ liên kết đang hoạt động.</p>}
    </CatalogArtworkDialog>}
  </div>
}

function BannerPreview({ banner, image }: { banner: HomeBanner; image: string }) {
  if (banner.layout === 'FULL_IMAGE') return <div className="aspect-[12/5] w-full max-w-[400px] overflow-hidden rounded-xl bg-slate-100">
    {image && <img src={image} alt={banner.title} className="h-full w-full object-cover" />}
  </div>

  const theme = themes[banner.theme]
  return <div style={{ background: theme.background }} className="flex h-40 w-full max-w-[400px] gap-2 overflow-hidden rounded-xl p-4 text-white">
    <div className="flex min-w-0 flex-1 flex-col justify-evenly gap-1">
      {banner.badge && <span style={{ background: theme.badge }} className="max-w-full self-start truncate rounded-full px-2 py-0.5 text-[10px] font-bold">{banner.badge}</span>}
      <p className="line-clamp-2 text-sm font-bold leading-tight">{banner.title || 'Tiêu đề banner'}</p>
      {banner.description && <p className="line-clamp-2 text-[11px] leading-tight text-white/90">{banner.description}</p>}
      {banner.buttonLabel && <span className="max-w-full self-start truncate rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-900">{banner.buttonLabel} →</span>}
    </div>
    <div className="aspect-[55/64] w-[110px] max-w-[40%] shrink-0 self-center overflow-hidden rounded-lg bg-white/10">
      {image && <img src={image} alt="" className="h-full w-full object-cover" />}
    </div>
  </div>
}
