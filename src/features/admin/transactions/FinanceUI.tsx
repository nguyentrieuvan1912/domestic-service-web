import type { ReactNode } from 'react'
export function FinanceIcon({ name, className = 'h-5 w-5' }: { name: 'in' | 'out' | 'clock' | 'refresh' | 'search' | 'file' | 'bank' | 'download'; className?: string }) {
  const paths = {
    in: <path d="M17 7 7 17M7 7v10h10" />, out: <path d="m7 17 10-10M7 7h10v10" />,
    clock: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6.1 7a7 7 0 0 1 11.6-1L20 9M4 15l2.3 3A7 7 0 0 0 17.9 17" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
    file: <><path d="M14 3H6v18h12V7l-4-4Z" /><path d="M14 3v5h4M9 12h6M9 16h6" /></>,
    bank: <path d="m3 9 9-6 9 6H3ZM5 12v6M10 12v6M14 12v6M19 12v6M3 21h18" />,
    download: <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />,
  }
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}
const labels: Record<string, string> = { PENDING: 'Chờ duyệt', APPROVED: 'Chờ chuyển tiền', PROCESSING: 'Đang đối soát', REVIEW: 'Cần kiểm tra', SUBMITTING: 'Đang gửi lệnh', PAID: 'Đã chuyển tiền', SUCCESS: 'Thành công', PROCESSED: 'Đã hoàn tiền', FAILED: 'Thất bại', REJECTED: 'Đã từ chối', CANCELLED: 'Đã hủy', VERIFIED: 'Đã xác minh', INACTIVE: 'Ngừng sử dụng', EXPIRED: 'Đã hết hạn', CREATING: 'Đang tạo', APPLIED: 'Đã ghi sổ', ISSUED: 'Đã phát hành', DRAFT: 'Bản nháp', VOID: 'Đã hủy' }
export function FinanceStatus({ status, label }: { status: string; label?: string }) {
  const tone = ['PAID', 'SUCCESS', 'VERIFIED', 'APPLIED', 'ISSUED', 'PROCESSED'].includes(status)
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : ['PENDING', 'FAILED', 'REJECTED'].includes(status)
      ? 'border-red-200 bg-red-50 text-red-700'
      : ['APPROVED', 'PROCESSING', 'REVIEW', 'SUBMITTING', 'CREATING', 'APPEALED'].includes(status)
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : 'border-slate-200 bg-slate-50 text-slate-600'
  return <span className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${tone}`}><span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />{label || labels[status] || status}</span>
}
export function FinanceCard({ title, description, action, children }: { title: string; description?: string; action?: ReactNode; children: ReactNode }) {
  return <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white"><header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 className="font-semibold text-slate-900">{title}</h2>{description && <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}</div>{action}</header>{children}</section>
}
export function FinanceEmpty({ title, description }: { title: string; description?: string }) {
  return <div className="flex flex-col items-center px-5 py-12 text-center"><span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-400"><FinanceIcon name="file" /></span><p className="text-sm font-medium text-slate-700">{title}</p>{description && <p className="mt-1 max-w-md text-sm leading-6 text-slate-400">{description}</p>}</div>
}
export function FinancePagination({ page, total, size = 10, onChange }: { page: number; total: number; size?: number; onChange: (page: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / size))
  return <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 text-xs text-slate-500"><span>{total ? `${(page - 1) * size + 1}–${Math.min(page * size, total)} / ${total} bản ghi` : '0 bản ghi'}</span><div className="flex items-center gap-2"><button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} className="rounded-md border border-slate-200 px-2.5 py-1.5 hover:bg-slate-50 disabled:opacity-35">Trước</button><span className="tabular-nums">{page} / {pages}</span><button type="button" disabled={page >= pages} onClick={() => onChange(page + 1)} className="rounded-md border border-slate-200 px-2.5 py-1.5 hover:bg-slate-50 disabled:opacity-35">Sau</button></div></div>
}
