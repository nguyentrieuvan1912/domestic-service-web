import AdminWorkBadge from '../../components/admin/AdminWorkBadge'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import FinanceApprovalPanel from '../../components/admin/FinanceApprovalPanel'
import StaffTopupPanel from '../../components/admin/StaffTopupPanel'
import { exportCsv, getAdminTransactions, saveTransactionNote } from '../../api/operations'
import { useAdminResource } from '../../hooks/useAdminResource'
import ResourceStatus from '../../components/admin/ResourceStatus'
import type { Transaction } from '../../data/mockAdminTransactions'
import TransactionModal from '../../features/admin/transactions/TransactionModal'
import TransactionTable from '../../features/admin/transactions/TransactionTable'
import { FinanceIcon, FinancePagination } from '../../features/admin/transactions/FinanceUI'
import { inputClass, money, secondaryButton } from '../../features/admin/transactions/financeStyles'

type Section = 'transactions' | 'withdrawals' | 'topups' | 'reconciliation' | 'settings'
const sections: { id: Section; label: string }[] = [{ id: 'transactions', label: 'Lịch sử giao dịch' }, { id: 'withdrawals', label: 'Rút tiền' }, { id: 'topups', label: 'Nạp tiền' }, { id: 'reconciliation', label: 'Đối soát & hóa đơn' }, { id: 'settings', label: 'Thiết lập' }]
export default function AdminTransactions() {
  const resource = useAdminResource(getAdminTransactions, [] as Transaction[])
  const [params, setParams] = useSearchParams()
  const requestedSection = params.get('section')
  const section: Section = sections.some(item => item.id === requestedSection) ? requestedSection as Section : 'transactions'
  const setSection = (value: Section) => setParams({ section: value }, { replace: true })
  const [selected, setSelected] = useState<Transaction | null>(null)
  const [search, setSearch] = useState(''), [type, setType] = useState('ALL'), [status, setStatus] = useState('ALL')
  const [page, setPage] = useState(1), [revision, setRevision] = useState(0)
  const transactions = resource.data
  const filtered = transactions.filter(item => {
    const query = search.trim().toLocaleLowerCase('vi-VN')
    return (type === 'ALL' || item.type === type) && (status === 'ALL' || item.status === status) && (!query || [item.id, item.bookingId, item.actorName, item.actorPhone].some(value => value.toLocaleLowerCase('vi-VN').includes(query)))
  })
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / 10)))
  const received = transactions.filter(item => item.type === 'PAYMENT' && item.status === 'SUCCESS').reduce((sum, item) => sum + item.amount, 0)
  const paid = transactions.filter(item => item.type !== 'PAYMENT' && item.status === 'SUCCESS').reduce((sum, item) => sum + item.amount, 0)
  const pending = transactions.filter(item => item.status === 'PENDING')
  const ready = !resource.loading && !resource.error
  const summary = [
    { label: 'Thanh toán đã thu', value: ready ? money(received) : '—', note: 'Từ thanh toán dịch vụ thành công', icon: 'in' as const },
    { label: 'Rút & hoàn tiền đã chi', value: ready ? money(paid) : '—', note: 'Các giao dịch đã được xác nhận', icon: 'out' as const },
    { label: 'Giao dịch chờ xử lý', value: ready ? String(pending.length) : '—', note: 'Theo danh sách giao dịch hiện tại', icon: 'clock' as const },
  ]
  const reload = () => { resource.retry(); setRevision(value => value + 1) }
  return <div className="mx-auto max-w-[1600px] space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="mb-1 text-xs font-medium text-emerald-700">Quản lý dòng tiền</p><h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Tài chính & giao dịch</h1><p className="mt-2 text-sm leading-6 text-slate-500">Theo dõi thu chi, xử lý yêu cầu và đối soát trong cùng một nơi.</p></div><button type="button" onClick={reload} disabled={resource.loading} className={secondaryButton}><FinanceIcon name="refresh" className="h-4 w-4" />Tải lại dữ liệu</button></header>
    <ResourceStatus {...resource} />
    <div className="grid gap-4 md:grid-cols-3">{summary.map(item => <div key={item.label} className="rounded-xl border border-slate-200 bg-white px-5 py-5"><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-slate-500">{item.label}</p><span className="rounded-lg bg-slate-50 p-2 text-slate-400"><FinanceIcon name={item.icon} className="h-4 w-4" /></span></div><p className={`mt-3 break-words text-2xl font-semibold tracking-tight tabular-nums ${item.label === 'Giao dịch chờ xử lý' && pending.length ? 'text-red-600' : 'text-slate-900'}`}>{item.value}</p><p className="mt-2 text-xs leading-5 text-slate-400">{item.note}</p></div>)}</div>
    <nav aria-label="Các mục tài chính" className="flex gap-5 overflow-x-auto border-b border-slate-200 sm:gap-7">{sections.map(item => <button key={item.id} type="button" aria-current={section === item.id ? 'page' : undefined} onClick={() => setSection(item.id)} className={`relative shrink-0 whitespace-nowrap border-b-2 px-0.5 py-3.5 text-sm font-medium transition ${section === item.id ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>{item.label}<AdminWorkBadge target={'/admin/transactions?section=' + item.id} /></button>)}</nav>
    {section === 'transactions' && <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 className="font-semibold text-slate-900">Sổ giao dịch</h2><p className="mt-1 text-sm text-slate-500">Thanh toán dịch vụ, rút tiền nhân viên và hoàn tiền.</p></div><button type="button" disabled={!ready || !filtered.length} className={secondaryButton} onClick={() => exportCsv('cleanmaster-giao-dich.csv', [['Mã giao dịch', 'Mã đơn', 'Đối tượng', 'Số tiền', 'Loại', 'Trạng thái', 'Thời gian'], ...filtered.map(item => [item.id, item.bookingId, item.actorName, item.amount, item.type, item.status, item.createdAt])])}><FinanceIcon name="download" className="h-4 w-4" />Xuất danh sách</button></header>
      <div className="grid gap-3 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 xl:grid-cols-[minmax(200px,1fr)_190px_180px] sm:px-6"><label className="relative block"><span className="sr-only">Tìm kiếm giao dịch</span><span className="pointer-events-none absolute left-3 top-3 text-slate-400"><FinanceIcon name="search" className="h-4 w-4" /></span><input value={search} onChange={event => { setSearch(event.target.value); setPage(1) }} placeholder="Mã giao dịch, mã đơn, tên hoặc SĐT…" className={`${inputClass} pl-9`} /></label><select aria-label="Loại giao dịch" className={inputClass} value={type} onChange={event => { setType(event.target.value); setPage(1) }}><option value="ALL">Tất cả loại giao dịch</option><option value="PAYMENT">Thanh toán dịch vụ</option><option value="PAYOUT">Rút tiền nhân viên</option><option value="REFUND">Hoàn tiền khách hàng</option></select><select aria-label="Trạng thái giao dịch" value={status} className={inputClass} onChange={event => { setStatus(event.target.value); setPage(1) }}><option value="ALL">Tất cả trạng thái</option><option value="SUCCESS">Thành công</option><option value="PENDING">Chờ xử lý</option><option value="FAILED">Thất bại</option></select></div>
      <div aria-busy={resource.loading}>{resource.loading ? <div className="px-6 py-12 text-center text-sm text-slate-400">Đang tải danh sách giao dịch…</div> : resource.error ? <div className="px-6 py-12 text-center text-sm text-slate-500">Chưa tải được giao dịch. Vui lòng tải lại dữ liệu.</div> : <TransactionTable transactions={filtered.slice((currentPage - 1) * 10, currentPage * 10)} onSelectTransaction={setSelected} />}</div><FinancePagination page={currentPage} total={filtered.length} onChange={setPage} />
    </section>}
    {section === 'topups' && <StaffTopupPanel key={revision} />}
    {['withdrawals', 'reconciliation', 'settings'].includes(section) && <FinanceApprovalPanel key={section + revision} view={section as 'withdrawals' | 'reconciliation' | 'settings'} onChange={resource.retry} />}
    {selected && <TransactionModal transaction={selected} onClose={() => setSelected(null)} onSaveTransaction={async updated => { await saveTransactionNote(updated); resource.setData(await getAdminTransactions()); setSelected(null) }} />}
    <p className="px-1 text-xs leading-5 text-slate-400">Số liệu theo dữ liệu hệ thống đã ghi nhận. Tiền nạp ví nhân viên được theo dõi riêng, không tính vào tổng thanh toán dịch vụ.</p>
  </div>
}
