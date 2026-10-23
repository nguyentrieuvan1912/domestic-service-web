import { useEffect, useState } from 'react'
import { adminRequest, getAdminBookings } from '../../api/operations'
import { useAdminResource } from '../../hooks/useAdminResource'
import ResourceStatus from './ResourceStatus'

type Bank = { id: number; staffId: number; bankCode: string; accountNumber: string; accountHolder: string; status: string; verifiedAt?: string | null }
type Withdrawal = { id: number; staffId: number; amount: number; status: string; requestedAt: string; bankAccount: string; payoutStatus?: string; payoutMessage?: string }
type Adjustment = { id: number; kind: string; staff_id: number; amount: number; reason: string; status: string }
const loadApprovals = async () => {
  const [banks, withdrawals, adjustments, policy, invoices, bookings] = await Promise.all([
    adminRequest<Bank[]>('finance', '/admin/bank-accounts'), adminRequest<Withdrawal[]>('finance', '/admin/withdrawals'), adminRequest<Adjustment[]>('finance', '/admin/adjustments'),
    adminRequest<{ settings: { name: string; value: number }[] }>('finance', '/admin/policy'), adminRequest<{ id: number; bookingId: number; invoiceNumber: string; totalAmount: number; status: string }[]>('finance', '/invoices'), getAdminBookings(),
  ])
  return { banks, withdrawals, adjustments, policy, invoices, bookings }
}
export default function FinanceApprovalPanel() {
  const resource = useAdminResource(loadApprovals, { banks: [], withdrawals: [], adjustments: [], policy: { settings: [] }, invoices: [], bookings: [] })
  const [payoutInfo, setPayoutInfo] = useState<{ configured: boolean; message: string } | null>(null)
  const [connection, setConnection] = useState('')
  useEffect(() => { const controller = new AbortController(); void adminRequest<{ configured: boolean; message: string }>('finance', '/withdrawal-capabilities').then(result => { if (!controller.signal.aborted) setPayoutInfo(result) }).catch(() => {}); return () => controller.abort() }, [])
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState(''), [percent, setPercent] = useState('')
  useEffect(() => { const policy = resource.data.policy.settings.find(s => s.name === 'platformFeePercent'); if (policy) setPercent(String(policy.value)) }, [resource.data.policy])
  const act = async (path: string, method: string, body?: unknown) => {
    if (busy) return
    setBusy(true); setError(''); setNotice('')
    try { await adminRequest('finance', path, method, body); setNotice('Đã lưu kết quả xử lý.'); resource.retry() } catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa lưu được.') } finally { setBusy(false) }
  }
  const money = (value: number) => value.toLocaleString('vi-VN') + 'đ'
  const button = 'rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 disabled:opacity-40'
  return <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-bold text-slate-900">Đối soát thu tiền và thu nhập nhân viên</h2><ResourceStatus {...resource} />
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}{notice && <p role="status" className="text-sm text-emerald-700">{notice}</p>}
    <form className="flex flex-wrap items-end gap-3" onSubmit={event => { event.preventDefault(); void act('/admin/policy', 'PUT', { platformFeePercent: Number(percent) }) }}><label className="text-sm text-slate-600">Phí nền tảng khi quyết toán (%)<input type="number" required min={0} max={100} value={percent} onChange={e => setPercent(e.target.value)} className="ml-3 w-24 rounded-lg border border-slate-300 p-2" /></label><button disabled={busy} className={button}>Lưu chính sách</button></form>
    <div><h3 className="mb-3 text-sm font-bold">Ngân hàng chờ xác minh</h3>{resource.data.banks.filter(b => b.status === 'PENDING' || b.status === 'VERIFIED' && !b.verifiedAt).map(bank => <div key={bank.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 py-3 text-sm"><span>Staff #{bank.staffId} · {bank.bankCode} · {bank.accountNumber} · {bank.accountHolder}</span><button disabled={busy} className={button} onClick={() => { const verificationNote = window.prompt('Ghi nguồn đã đối chiếu tên chủ tài khoản và số tài khoản tại ngân hàng (ít nhất 8 ký tự). Chỉ duyệt sau khi kiểm tra thực tế.'); if (verificationNote) void act('/admin/bank-accounts/' + bank.id, 'PATCH', { status: 'VERIFIED', verificationNote }) }}>Xác nhận đã kiểm tra tài khoản</button></div>)}{!resource.data.banks.some(b => b.status === 'PENDING' || b.status === 'VERIFIED' && !b.verifiedAt) && <p className="text-sm text-slate-500">Không có tài khoản chờ xác minh.</p>}</div>
    <div className="space-y-3"><h3 className="text-sm font-bold">Kênh chi payOS · Rút tiền nhân viên</h3>
      <p className="text-sm text-slate-600">{payoutInfo?.message || 'Đang kiểm tra cấu hình Kênh chi…'}</p>
      <button disabled={busy || !payoutInfo?.configured} className={button} onClick={async () => { if (busy) return; setBusy(true); setError(''); try { const result = await adminRequest<{ balance: string; accountName: string; accountLast4: string }>('finance', '/admin/payouts/connection'); setConnection(`Đã xác minh nguồn chi: ${result.accountName} · ****${result.accountLast4} · Số dư ${money(Number(result.balance))}`) } catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa xác minh được Kênh chi.') } finally { setBusy(false) } }}>Kiểm tra kết nối và nguồn chi</button>
      {connection && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{connection}</p>}
      {resource.data.withdrawals.map(w => { let bank: { bank_code?: string; account_number?: string; account_holder?: string } = {}; try { bank = JSON.parse(w.bankAccount || '{}') } catch { /* Malformed legacy snapshots remain visible for review. */ } return <div key={w.id} className="space-y-2 rounded-lg border border-slate-200 p-4 text-sm">
        <p className="font-semibold">#{w.id} · Staff #{w.staffId} · {money(w.amount)} · {w.status}</p>
        <p className="break-words text-slate-600">Ngân hàng: {bank.bank_code || 'Chưa có'} · STK: {bank.account_number || 'Chưa có'} · Chủ TK: {bank.account_holder || 'Chưa có'}</p>
        {w.payoutStatus && <p className="text-amber-800">Kênh chi: {w.payoutStatus} · {w.payoutMessage}</p>}
        <div className="flex flex-wrap gap-2">{w.status === 'PENDING' && <><button disabled={busy} className={button} onClick={() => void act('/admin/withdrawals/' + w.id, 'PATCH', { status: 'APPROVED' })}>Duyệt yêu cầu</button><button disabled={busy} className={button} onClick={() => { const reason = window.prompt('Lý do từ chối yêu cầu rút'); if (reason) void act('/admin/withdrawals/' + w.id, 'PATCH', { status: 'REJECTED', reason }) }}>Từ chối và trả khoản giữ</button></>}
        {w.status === 'APPROVED' && <><button disabled={busy || !payoutInfo?.configured} className={button} onClick={() => { if (window.confirm(`Gửi chuyển tiền thật ${money(w.amount)} tới ${bank.account_holder} · ${bank.account_number} · ngân hàng ${bank.bank_code}?`)) void act('/admin/withdrawals/' + w.id + '/payout', 'POST', { confirmed: true }) }}>Gửi chuyển tiền qua payOS</button><button disabled={busy} className={button} onClick={() => { const reason = window.prompt('Lý do từ chối trước khi gửi chi'); if (reason) void act('/admin/withdrawals/' + w.id, 'PATCH', { status: 'REJECTED', reason }) }}>Từ chối trước khi gửi</button></>}
        {w.status === 'PROCESSING' && <button disabled={busy || !payoutInfo?.configured} className={button} onClick={() => void act('/admin/withdrawals/' + w.id + '/refresh', 'POST')}>Đối soát lệnh hiện tại</button>}</div>
      </div> })}<p className="text-xs text-slate-500">Duyệt yêu cầu chưa chuyển tiền. Khi đã gửi chi, không tạo lệnh khác để thử lại; tra cứu cùng giao dịch tới khi có kết quả xác minh.</p>
    </div>
    <div><h3 className="mb-3 text-sm font-bold">Đơn cần thu tiền mặt hoặc quyết toán</h3>{resource.data.bookings.filter(b => b.status === 'COMPLETED' || b.paymentMethod === 'CASH' && !['CANCELLED'].includes(b.status)).slice(0, 50).map(b => <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 py-3 text-sm"><span>Đơn #{b.id} · {b.serviceName} · {money(b.totalAmount)} · {b.paymentStatus}</span><div className="flex gap-2">{b.paymentMethod === 'CASH' && b.paymentStatus !== 'PAID' && <button disabled={busy} className={button} onClick={() => { if (window.confirm('Xác nhận đã thực nhận đủ tiền mặt của đơn #' + b.id + '?')) void act('/admin/bookings/' + b.id + '/cash-receipt', 'POST', { cashReceived: true }) }}>Xác nhận đã thu tiền mặt</button>}{b.status === 'COMPLETED' && <button disabled={busy} className={button} onClick={() => void act('/admin/bookings/' + b.id + '/settle', 'POST')}>Lập quyết toán và hóa đơn</button>}</div></div>)}</div>
    <div><h3 className="mb-3 text-sm font-bold">Đề xuất thưởng và phạt</h3>{resource.data.adjustments.map(a => <div key={a.kind + a.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 py-3 text-sm"><span>{a.kind} #{a.id} · Staff #{a.staff_id} · {money(a.amount)} · {a.reason} · {a.status}</span>{a.status === 'PENDING' && <button disabled={busy} className={button} onClick={() => void act('/admin/adjustments/' + a.kind + '/' + a.id + '/apply', 'POST')}>Duyệt ghi nhận vào sổ thu nhập</button>}</div>)}</div>
    <div><h3 className="mb-3 text-sm font-bold">Hóa đơn đã phát hành</h3>{resource.data.invoices.map(i => <p key={i.id} className="border-t border-slate-100 py-3 text-sm">{i.invoiceNumber} · Đơn #{i.bookingId} · {money(i.totalAmount)} · {i.status}</p>)}</div>
  </section>
}
