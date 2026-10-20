import { useState } from 'react'
import { adminRequest } from '../../api/operations'
import { useAdminResource } from '../../hooks/useAdminResource'
import ResourceStatus from './ResourceStatus'

type Topup = { id: number; staffId: number; amount: number; amountReceived: number; status: string; createdAt: string; paidAt: string | null; verifiedAt: string | null }
type Capabilities = { topupEnabled: boolean; payoutEnabled: boolean; message: string }
const load = async () => {
  const [capabilities, topups] = await Promise.all([adminRequest<Capabilities>('finance', '/payment-capabilities'), adminRequest<Topup[]>('finance', '/admin/topups')])
  return { capabilities, topups }
}
const labels: Record<string, string> = { CREATING: 'Đang tạo / cần khôi phục', PENDING: 'Chờ chuyển khoản', PAID: 'Đã nhận tiền', CANCELLED: 'Đã hủy liên kết', EXPIRED: 'Hết hạn liên kết', REVIEW: 'Cần đối soát' }
const money = (value: number) => value.toLocaleString('vi-VN') + 'đ'
export default function StaffTopupPanel() {
  const resource = useAdminResource(load, { capabilities: { topupEnabled: false, payoutEnabled: false, message: '' }, topups: [] })
  const [busy, setBusy] = useState(false), [error, setError] = useState('')
  const refresh = async (id: number) => {
    if (busy) return
    setBusy(true); setError('')
    try { await adminRequest('finance', '/admin/topups/' + id + '/refresh', 'POST'); resource.retry() }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa đối soát được.') }
    finally { setBusy(false) }
  }
  return <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex flex-wrap justify-between gap-3"><h2 className="text-lg font-bold text-slate-900">Nạp tiền nhân viên · payOS</h2><button onClick={resource.retry} className="rounded-lg border px-3 py-2 text-sm">Tải lại</button></div>
    <ResourceStatus {...resource} />
    <p className="text-sm text-slate-600">{resource.data.capabilities.message}</p>
    <p className="text-sm text-slate-500">Tiền nạp là khoản phải trả nhân viên, không phải doanh thu dịch vụ. Dữ liệu chỉ ghi đã nhận sau khi xác minh với payOS. Chuyển tiền rút tự động chưa bật.</p>
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    {!resource.loading && !resource.error && resource.data.topups.length === 0 && <p className="text-sm text-slate-500">Chưa có yêu cầu nạp tiền.</p>}
    {resource.data.topups.map(item => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 py-3 text-sm">
      <div className="min-w-0 space-y-1"><p className="font-semibold">#{item.id} · Nhân viên #{item.staffId} · {money(item.amount)}</p><p>{labels[item.status] || item.status} · Đã nhận {money(item.amountReceived)}</p><p className="text-xs text-slate-500">Tạo: {new Date(item.createdAt).toLocaleString('vi-VN')}{item.verifiedAt ? ' · Kiểm tra: ' + new Date(item.verifiedAt).toLocaleString('vi-VN') : ''}</p></div>
      {item.status !== 'PAID' && <button disabled={busy || !resource.data.capabilities.topupEnabled} onClick={() => void refresh(item.id)} className="rounded-lg border border-emerald-200 px-3 py-2 font-semibold text-emerald-700 disabled:opacity-40">Đối soát với payOS</button>}
    </div>)}
  </section>
}
