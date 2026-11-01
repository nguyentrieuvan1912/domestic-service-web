import { useCallback } from 'react'
import { adminRequest } from '../../api/operations'
import { useAdminResource } from '../../hooks/useAdminResource'
import { FinanceStatus } from '../../features/admin/transactions/FinanceUI'
import ResourceStatus from './ResourceStatus'

type Review = { id: number; adminId: number; adminName: string | null; oldStatus: string | null; newStatus: string; accountNumber: string; accountHolder: string; verificationNote: string; legacy: boolean; reviewedAt: string }
export default function BankReviewHistory({ account, close }: { account: { id: number; bankName?: string; accountNumber: string; accountHolder: string }; close: () => void }) {
  const load = useCallback(() => adminRequest<Review[]>('finance', `/admin/bank-accounts/${account.id}/history`), [account.id])
  const resource = useAdminResource(load, [] as Review[])
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" onClick={close}>
    <section role="dialog" aria-modal="true" aria-labelledby="bank-history-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl" onClick={event => event.stopPropagation()}>
      <header className="mb-5 flex items-start justify-between gap-3"><div><h2 id="bank-history-title" className="font-semibold text-slate-900">Lịch sử kiểm duyệt tài khoản</h2><p className="mt-1 text-xs leading-5 text-slate-500">{account.bankName || 'Ngân hàng chưa xác định'} · ****{account.accountNumber.slice(-4)} · {account.accountHolder}</p></div><button type="button" onClick={close} className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600">Đóng</button></header>
      <ResourceStatus {...resource} />
      <div className="space-y-3">{resource.data.map(review => <article key={review.id} className="rounded-xl border border-slate-200 p-4 text-sm"><div className="flex flex-wrap items-center justify-between gap-2"><FinanceStatus status={review.newStatus} /><time className="text-xs text-slate-400">{new Date(review.reviewedAt).toLocaleString('vi-VN')}</time></div><p className="mt-3 font-medium text-slate-800">{review.adminName || `Admin #${review.adminId}`}{review.adminName && <span className="ml-2 text-xs font-normal text-slate-400">Admin #{review.adminId}</span>}</p>{review.oldStatus && <p className="mt-1 text-xs text-slate-500">Trước đó: {review.oldStatus === 'PENDING' ? 'Chờ xác minh' : review.oldStatus === 'VERIFIED' ? 'Đã xác minh' : 'Ngừng sử dụng'}</p>}<p className="mt-2 whitespace-pre-wrap break-words text-xs leading-6 text-slate-600">{review.verificationNote || 'Không có ghi chú trong hồ sơ cũ.'}</p>{review.legacy && <p className="mt-2 text-[11px] leading-5 text-slate-400">Thông tin xét duyệt đã lưu trước khi bật lịch sử chi tiết. Hồ sơ cũ chỉ ghi mã Admin.</p>}</article>)}</div>
      {!resource.loading && !resource.error && !resource.data.length && <p className="py-8 text-center text-sm text-slate-500">Chưa có lần kiểm duyệt nào được ghi nhận.</p>}
      <p className="mt-5 text-xs leading-5 text-slate-400">Lịch sử được lưu từ quyết định của Admin đã đăng nhập, kèm thông tin tài khoản tại thời điểm kiểm duyệt.</p>
    </section>
  </div>
}
