import type { Transaction } from '../../../data/mockAdminTransactions'
import { paymentMethodLabels } from '../../../data/mockAdminTransactions'
import { FinanceEmpty, FinanceStatus } from './FinanceUI'
import { money } from './financeStyles'
const typeLabels = { PAYMENT: 'Thanh toán dịch vụ', PAYOUT: 'Rút tiền nhân viên', REFUND: 'Hoàn tiền khách hàng' }
export default function TransactionTable({ transactions, onSelectTransaction }: { transactions: Transaction[]; onSelectTransaction: (transaction: Transaction) => void }) {
  if (!transactions.length) return <FinanceEmpty title="Không có giao dịch phù hợp" description="Thử thay đổi từ khóa hoặc bộ lọc để xem các giao dịch khác." />
  return <div className="relative overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b border-slate-100 text-xs font-medium text-slate-500"><tr><th scope="col" className="px-5 py-3.5 sm:pl-6">Giao dịch</th><th scope="col" className="px-4 py-3.5">Khách hàng / Nhân viên</th><th scope="col" className="px-4 py-3.5">Phân loại</th><th scope="col" className="px-4 py-3.5 text-right">Số tiền</th><th scope="col" className="px-4 py-3.5">Trạng thái</th><th scope="col" className="px-4 py-3.5 text-right"><span className="sr-only">Chi tiết</span></th></tr></thead><tbody className="divide-y divide-slate-100">{transactions.map(item => <tr key={item.id} className="transition hover:bg-slate-50/70">
    <td className="px-5 py-4 sm:pl-6"><button className="font-mono text-xs font-semibold text-slate-800 hover:text-emerald-700" onClick={() => onSelectTransaction(item)}>{item.id}</button><p className="mt-1.5 whitespace-nowrap text-xs text-slate-400">{item.createdAt}</p></td>
    <td className="max-w-[240px] px-4 py-4"><p className="break-words font-medium text-slate-800">{item.actorName || 'Chưa có thông tin'}</p><p className="mt-1 text-xs text-slate-400">{item.actorPhone || '—'}</p></td>
    <td className="px-4 py-4"><p className="whitespace-nowrap text-slate-600">{typeLabels[item.type]}</p><p className="mt-1 text-xs text-slate-400">{paymentMethodLabels[item.paymentMethod]}{item.bookingId ? ` · Đơn #${item.bookingId}` : ''}</p></td>
    <td className={`whitespace-nowrap px-4 py-4 text-right font-semibold tabular-nums ${item.type === 'PAYMENT' ? 'text-emerald-700' : 'text-slate-800'}`}>{item.type === 'PAYMENT' ? '+' : '−'}{money(item.amount)}</td>
    <td className="px-4 py-4"><FinanceStatus status={item.rawStatus || item.status} label={item.type === 'PAYMENT' && item.status === 'SUCCESS' ? 'Đã thanh toán' : item.type === 'REFUND' && item.status === 'SUCCESS' ? 'Đã hoàn tiền' : item.status === 'PENDING' && (!item.rawStatus || item.rawStatus === 'PENDING') ? 'Chờ xử lý' : undefined} /></td>
    <td className="px-4 py-4 text-right sm:pr-6"><button onClick={() => onSelectTransaction(item)} className="whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">Chi tiết <span aria-hidden="true">↗</span></button></td>
  </tr>)}</tbody></table></div>
}
