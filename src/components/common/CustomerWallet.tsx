import { useCallback, useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { API_BASE_URL } from '../../api/catalog'
import { readSession } from '../../api/identity'
type Entry = { id: number; type: string; direction: string; amount: number; bookingId: number | null; createdAt: string }
type Wallet = { available: number; transactions: Entry[] }
type Topup = { id: number; bookingId: number | null; requestKey: string; amount: number; amountReceived: number; status: string; qrCode: string | null; accountName: string | null; accountNumber: string | null; description: string; expiresAt: string }
const transactionFilters = [{id:'ALL',label:'Tất cả'},{id:'TOP_UP',label:'Nạp tiền'},{id:'PAYMENT',label:'Thanh toán'},{id:'REFUND',label:'Hoàn tiền'}]
const money = (n: number) => n.toLocaleString('vi-VN') + 'đ'
export default function CustomerWallet() {
 const [wallet, setWallet] = useState<Wallet | null>(null), [items, setItems] = useState<Topup[]>([]), [selected, setSelected] = useState<Topup | null>(null)
 const [amount, setAmount] = useState('100000'), [error, setError] = useState(''), [busy, setBusy] = useState(false), [qr, setQr] = useState('')
 const [filter, setFilter] = useState('ALL'), [refreshing, setRefreshing] = useState(false)
 const owner = useRef(readSession('CUSTOMER')?.accessToken), mounted = useRef(true), locked = useRef(false), request = useRef({ amount: 0, key: crypto.randomUUID() })
 const current = useCallback(() => mounted.current && owner.current === readSession('CUSTOMER')?.accessToken, [])
 const api = useCallback(async <T,>(path: string, method = 'GET', body?: unknown): Promise<T> => {
  if (!current()) throw new Error('Phiên đăng nhập đã thay đổi.')
  const response = await fetch(`${API_BASE_URL}/api/v1/finance${path}`, { method, headers: { Authorization: `Bearer ${owner.current}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(20000), ...(body ? { body: JSON.stringify(body) } : {}) })
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || 'Chưa xử lý được ví.')
  if (!current()) throw new Error('Phiên đăng nhập đã thay đổi.')
  return data as T
 }, [current])
 const load = useCallback(async () => {
  const [balance, fetched] = await Promise.all([api<Wallet>('/customer/me/wallet'), api<Topup[]>('/customer/me/topups')])
  const topups = fetched.filter(item => item.bookingId == null)
  if (current()) { setWallet(balance); setItems(topups); setSelected(old => old ? topups.find(t => t.id === old.id) || old : null) }
 }, [api, current])
 useEffect(() => { mounted.current = true; let running = false
  const refresh = async () => { if (running || document.hidden) return; running = true; try { await load() } catch (e) { if (current()) setError(e instanceof Error ? e.message : 'Chưa tải được ví.') } finally { running = false } }
  void refresh(); const timer = setInterval(() => void refresh(), 10000); document.addEventListener('visibilitychange', refresh)
  return () => { mounted.current = false; clearInterval(timer); document.removeEventListener('visibilitychange', refresh) }
 }, [load, current])
 useEffect(() => { let active = true; setQr(''); if (selected?.qrCode && Date.parse(selected.expiresAt) > Date.now()) void QRCode.toDataURL(selected.qrCode, { width: 300, margin: 4 }).then(value => { if (active) setQr(value) }); return () => { active = false } }, [selected])
 const execute = async (work: () => Promise<Topup>) => {
  if (locked.current) return; locked.current = true; setBusy(true); setError('')
  try { const result = await work(); if (current()) setSelected(result); await load() } catch (e) { if (current()) setError(e instanceof Error ? e.message : 'Chưa xử lý được.') } finally { locked.current = false; if (current()) setBusy(false) }
 }
 const create = () => {
  const value = Number(amount)
  if (!Number.isSafeInteger(value) || value < 2000 || value > 1000000) { setError('Nhập số tiền từ 2.000đ đến 1.000.000đ.'); return }
  if (request.current.amount !== value || items.some(t => t.requestKey === request.current.key && ['PAID','EXPIRED','CANCELLED'].includes(t.status))) request.current = { amount: value, key: crypto.randomUUID() }
  void execute(() => api<Topup>('/customer/me/topups', 'POST', { amount: value, requestKey: request.current.key }))
 }
 const refreshWallet = async () => { if (refreshing) return; setRefreshing(true); try { await load(); if(current()) setError('') } catch(e) { if(current()) setError(e instanceof Error ? e.message : 'Chưa tải được ví.') } finally { if(current()) setRefreshing(false) } }
 const transactions = wallet?.transactions.filter(t => filter === 'ALL' || t.type === filter) || []
 return <section className="my-8 space-y-5 border-t border-slate-200 pt-7">
  <div className="flex items-center justify-between gap-4"><div><h2 className="text-2xl font-bold text-slate-900">Ví của tôi</h2><p className="mt-1 text-xs text-slate-500">Quản lý thanh toán dịch vụ</p></div><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="6" width="18" height="15" rx="3"/><path d="m4 6 13-3v3M21 11h-7v6h7m-4-3h.1"/></svg></span></div>
  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-600 p-6 text-white"><div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-16 h-64 w-64 rounded-full border-[36px] border-white/5"/><div className="relative"><div className="flex items-center justify-between"><span className="text-[10px] font-bold tracking-[0.18em] text-emerald-200">VÍ KHÁCH HÀNG</span><span className="rounded-lg border border-white/20 bg-white/5 px-2.5 py-1 text-[10px] font-bold tracking-wider">VND</span></div><p className="mt-6 text-sm text-emerald-100">Số dư khả dụng</p><p className="mt-1 break-all text-4xl font-extrabold tracking-tight">{wallet ? money(wallet.available) : 'Đang tải…'}</p><p className="mt-5 flex items-center gap-2 text-xs text-emerald-100"><span className="h-1.5 w-1.5 rounded-full bg-emerald-200"/>Dùng để thanh toán dịch vụ</p></div></div>
  <div className="flex gap-3"><a href="#wallet-topup" className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"><span className="text-xl leading-none">+</span> Nạp tiền</a><button disabled={refreshing} onClick={() => void refreshWallet()} className="min-h-12 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-slate-50 disabled:opacity-50">{refreshing ? 'Đang cập nhật…' : 'Làm mới số dư'}</button></div>
  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4"><p className="text-xs font-bold text-emerald-900">Thanh toán tiện lợi, hoàn tiền về ví</p><p className="mt-1 text-xs leading-5 text-emerald-800/65">Nạp bằng QR payOS. Tiền đã thanh toán được hoàn về ví khi đơn hủy hoặc không kết nối đủ nhân viên.</p></div>
  {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
  <div id="wallet-topup" className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5"><div><h3 className="font-bold text-slate-900">Nạp tiền vào ví</h3><p className="mt-1 text-xs text-slate-500">Chuyển khoản bằng mã QR payOS</p></div><label className="block text-xs font-semibold text-slate-600" htmlFor="wallet-topup-amount">Số tiền cần nạp (VND)</label><div className="flex flex-wrap gap-3"><input id="wallet-topup-amount" inputMode="numeric" type="number" min="2000" max="1000000" step="1" value={amount} onChange={e => setAmount(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-3 font-semibold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /><button disabled={busy} onClick={create} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50">{busy ? 'Đang xử lý…' : 'Tạo mã QR'}</button></div><div className="flex flex-wrap gap-2">{[50000,100000,200000].map(value=><button key={value} onClick={()=>setAmount(String(value))} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${Number(amount)===value?'border-emerald-200 bg-emerald-50 text-emerald-700':'border-slate-200 bg-white text-slate-500 hover:border-emerald-200'}`}>{money(value)}</button>)}</div></div>
  {selected && <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
   <p className="font-bold">{money(selected.amount)} · {selected.status === 'PAID' ? 'Đã nhận tiền' : selected.status === 'EXPIRED' ? 'Đã hết hạn' : selected.status === 'REVIEW' ? 'Đang đối soát' : 'Chờ chuyển khoản'}</p>
   {qr && <img src={qr} alt="Mã QR chuyển khoản payOS" className="mx-auto w-full max-w-[300px]" />}
   <p>{selected.accountName} · {selected.accountNumber}</p><p>Nội dung: <strong>{selected.description}</strong></p><p className="text-sm">Đã ghi nhận {money(selected.amountReceived)} · Hạn QR {new Date(selected.expiresAt).toLocaleString('vi-VN')}</p>
   {selected.status !== 'PAID' && <button disabled={busy} onClick={() => void execute(() => api<Topup>(`/customer/me/topups/${selected.id}/refresh`, 'POST'))} className="rounded-lg bg-emerald-700 px-4 py-2 text-white">Kiểm tra giao dịch</button>}
   <button onClick={() => setSelected(null)} className="block w-full text-sm text-slate-600">Đóng chi tiết</button>
  </div>}
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="p-5 pb-4"><div className="flex items-center gap-2"><h3 className="text-lg font-bold text-slate-900">Lịch sử giao dịch</h3>{wallet&&<span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">{wallet.transactions.length}</span>}</div><p className="mt-1 text-xs text-slate-400">Theo dõi các khoản thu, chi trong ví</p></div><div className="flex gap-2 overflow-x-auto px-5 pb-4">{transactionFilters.map(item=><button key={item.id} aria-pressed={filter===item.id} onClick={()=>setFilter(item.id)} className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold transition ${filter===item.id?'border-emerald-200 bg-emerald-50 text-emerald-700':'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>{item.label}</button>)}</div>
  {!wallet?<p className="border-t border-slate-100 p-10 text-center text-sm text-slate-400">{error?'Nhấn Làm mới để tải lại lịch sử.':'Đang tải giao dịch…'}</p>:!transactions.length?<div className="flex flex-col items-center gap-3 border-t border-slate-100 px-6 py-8 text-center"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50/50"><svg className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-emerald-700" width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 3h14v19l-3-2-4 2-4-2-3 2Z"/><path d="M8 7h8M8 11h8m-8 4h5"/></svg></div><p className="text-sm font-bold text-slate-700">{filter==='ALL'?'Ví của bạn đã sẵn sàng':'Chưa có giao dịch phù hợp'}</p><p className="max-w-64 text-xs leading-5 text-slate-400">Các khoản nạp, thanh toán và hoàn tiền sẽ được hiển thị tại đây.</p>{filter==='ALL'&&<a href="#wallet-topup" className="mt-1 rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-2.5 text-xs font-bold text-emerald-700">Nạp tiền đầu tiên →</a>}</div>:<div className="divide-y divide-slate-100 border-t border-slate-100 px-5">{transactions.map(t=><div key={t.id} className="flex items-center gap-3 py-4"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${t.direction==='CREDIT'?'bg-emerald-50 text-emerald-700':'bg-slate-100 text-slate-500'}`}>{t.type==='TOP_UP'?'+':t.type==='REFUND'?'↩':'−'}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap justify-between gap-1"><p className="text-xs font-bold text-slate-700">{t.type==='TOP_UP'?'Nạp tiền vào ví':t.type==='REFUND'?'Hoàn tiền dịch vụ':'Thanh toán dịch vụ'}</p><p className={`text-sm font-bold ${t.direction==='CREDIT'?'text-emerald-700':'text-slate-600'}`}>{t.direction==='CREDIT'?'+':'−'}{money(t.amount)}</p></div><p className="mt-1.5 text-[10px] text-slate-400">{t.bookingId?`Đơn #${t.bookingId} · `:''}{new Date(t.createdAt).toLocaleString('vi-VN')}</p></div></div>)}</div>}
  </div>
  {!!items.length && <details><summary className="cursor-pointer font-semibold text-emerald-700">Các yêu cầu nạp tiền</summary>{items.map(t => <button key={t.id} onClick={() => setSelected(t)} className="block w-full border-b border-slate-100 py-3 text-left text-sm">#{t.id} · {money(t.amount)} · {t.status}</button>)}</details>}
 </section>
}
