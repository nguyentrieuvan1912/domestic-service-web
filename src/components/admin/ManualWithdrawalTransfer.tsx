import { FinanceStatus } from '../../features/admin/transactions/FinanceUI'
import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { adminRequest } from '../../api/operations'

type Transfer = {
  withdrawalId: number; status: string; payoutStatus: string; message: string; amount: number;
  accountNumber: string; accountHolder: string; bankBin: string; bankName?: string; sourceLast4: string;
  reference: string; content: string; canTransfer: boolean; canConfirm: boolean; qrCode?: string;
  initiatedBy: number; bankProofVerified: boolean; observedReference: string; checkedAt?: string;
  confirmedAt?: string; bankReference?: string; recipientNote?: string;
  confirmations?: { adminId: number; reference: string; note: string; createdAt: string }[];
}
export default function ManualWithdrawalTransfer({ id, onClose, onSaved }: { id: number; onClose: () => void; onSaved: () => void }) {
  const [transfer, setTransfer] = useState<Transfer | null>(null)
  const [qrImage, setQrImage] = useState<{ source: string; uri: string } | null>(null), [error, setError] = useState(''), [busy, setBusy] = useState(false)
  const [reference, setReference] = useState<string | null>(null), [note, setNote] = useState<string | null>(null), [checked, setChecked] = useState(false), [manual, setManual] = useState(false)
  const referenceValue = reference ?? transfer?.bankReference ?? ''
  const noteValue = note ?? transfer?.recipientNote ?? ''
  const qr = qrImage?.source === transfer?.qrCode ? qrImage?.uri : ''
  const path = '/admin/withdrawals/' + id
  const sequence = useRef(0), action = useRef(false)
  const [loadError, setLoadError] = useState('')
  useEffect(() => {
    let active = true, running = false
    const load = async () => {
      if (running || action.current) return
      running = true
      const request = ++sequence.current
      try {
        const value = await adminRequest<Transfer>('finance', path + '/manual-transfer')
        if (active && request === sequence.current) { setTransfer(value); setLoadError('') }
      } catch (cause) { if (active && request === sequence.current) setLoadError(cause instanceof Error ? cause.message : 'Chưa tải được yêu cầu.') }
      finally { running = false }
    }
    void load()
    const timer = window.setInterval(() => { if (document.visibilityState === 'visible') void load() }, 10000)
    return () => { active = false; window.clearInterval(timer) }
  }, [path])
  useEffect(() => {
    let active = true
    const source = transfer?.qrCode
    if (source) void QRCode.toDataURL(source, { width: 300, margin: 2, errorCorrectionLevel: 'M' })
      .then(value => { if (active) setQrImage({ source, uri: value }) }).catch(() => { if (active) setError('Chưa tạo được hình QR. Không chuyển lại nếu đã chuyển tiền.') })
    return () => { active = false }
  }, [transfer?.qrCode])
  const refresh = async () => {
    if (action.current) return
    action.current = true; sequence.current++
    setBusy(true); setError('')
    try {
      await adminRequest('finance', path + '/refresh', 'POST')
      setTransfer(await adminRequest<Transfer>('finance', path + '/manual-transfer')); onSaved()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa đối soát được. Không chuyển lại.') }
    finally { action.current = false; setBusy(false) }
  }
  const confirm = async () => {
    if (action.current) return
    action.current = true; sequence.current++
    setBusy(true); setError('')
    try {
      setTransfer(await adminRequest<Transfer>('finance', path + '/manual-transfer/confirm', 'POST', {
        recipientChecked: checked, useObservedReference: !manual, ...(manual ? { bankReference: referenceValue.trim() } : {}), recipientNote: noteValue.trim(),
      })); onSaved()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Chưa lưu được bằng chứng. Không chuyển lại.') }
    finally { action.current = false; setBusy(false) }
  }
  const field = 'mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm'
  return <div role="dialog" aria-modal="true" aria-labelledby="manual-transfer-title" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-3">
    <section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
      <div className="flex items-center justify-between gap-3"><h3 id="manual-transfer-title" className="font-bold">Chuyển khoản TPBank · Yêu cầu #{id}</h3><button className="rounded-lg border px-3 py-2 text-sm" onClick={onClose}>Đóng</button></div>
      <p className="my-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600">Chỉ chuyển một lần. Đóng cửa sổ không hủy yêu cầu. Nếu app ngân hàng báo đã chuyển hoặc chưa rõ kết quả, hãy đối soát; không quét chuyển thêm.</p>
      {(error || loadError) && <p role="alert" className="mb-3 text-sm text-red-700">{error || loadError}</p>}
      {!transfer && <p>Đang tải thông tin…</p>}
      {transfer && <>
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 rounded-xl bg-slate-50 p-4 text-sm">
          <dt>Trạng thái</dt><dd><FinanceStatus status={transfer.payoutStatus === 'REVIEW' ? 'REVIEW' : transfer.status} /></dd>
          <dt>Số tiền</dt><dd className="font-bold text-emerald-700">{transfer.amount.toLocaleString('vi-VN')}đ</dd>
          <dt>Nguồn chi</dt><dd>TPBank · ****{transfer.sourceLast4}</dd>
          <dt>Admin phụ trách</dt><dd>#{transfer.initiatedBy}</dd>
          <dt>Ngân hàng nhận</dt><dd>{transfer.bankName || 'Chưa xác định ngân hàng'}</dd>
          <dt>Số tài khoản</dt><dd className="break-all font-semibold select-all">{transfer.accountNumber}</dd>
          <dt>Người nhận</dt><dd className="break-words font-semibold">{transfer.accountHolder}</dd>
          <dt>Nội dung</dt><dd className="break-all font-mono select-all">{transfer.content}</dd>
        </dl>
        {qr && transfer.canTransfer && <div className="my-4 text-center"><img src={qr} alt="QR chuyển khoản tới tài khoản nhân viên" className="mx-auto h-auto w-full max-w-[300px]" /><p className="text-xs text-slate-600">Dùng app TPBank, chọn đúng tài khoản nguồn trên đây và kiểm tra tên người nhận trước khi chuyển.</p></div>}
        <p role="status" className="my-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6">{transfer.message}</p>
        {transfer.canConfirm && <form className="space-y-3" onSubmit={event => { event.preventDefault(); void confirm() }}>
          <div className={`rounded-xl border p-3 text-sm ${transfer.bankProofVerified ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-slate-50'}`}>
            <p className="font-semibold text-slate-800">{transfer.bankProofVerified ? 'Đã tìm thấy giao dịch tiền ra khớp' : 'Đang chờ SePay đồng bộ giao dịch'}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Hệ thống tự đối chiếu tài khoản nguồn, số tiền và mã riêng trong nội dung chuyển khoản khoảng 30 giây một lần.</p>
            {transfer.bankProofVerified && <p className="mt-2 break-all text-xs text-slate-700">Mã giao dịch lấy tự động: <span className="select-all font-mono font-semibold">{transfer.observedReference}</span></p>}
            {!transfer.bankProofVerified && <p className="mt-2 text-xs leading-5 text-slate-500">Bạn không cần nhập mã biên lai. Khi dữ liệu khớp, hệ thống sẽ lấy mã để hoàn tất đối soát sau khi bạn xác nhận người nhận.</p>}
          </div>
          <button type="button" disabled={busy} onClick={() => setManual(value => !value)} className="text-xs font-medium text-slate-500 underline">{manual ? 'Dùng mã tự động từ SePay' : 'Nhập mã thủ công khi cần'}</button>
          {manual && <>
            <label className="block text-sm">Mã giao dịch trên biên lai TPBank<input className={field} required minLength={3} maxLength={160} value={referenceValue} onChange={event => setReference(event.target.value)} placeholder="Mã tham chiếu ngân hàng" /></label>
            <label className="block text-sm">Ghi chú đã kiểm tra người nhận<textarea className={field} required minLength={8} maxLength={2000} value={noteValue} onChange={event => setNote(event.target.value)} placeholder="Thông tin người nhận đã đối chiếu trên TPBank" /></label>
          </>}
          <label className="flex items-start gap-2 text-sm"><input type="checkbox" required checked={checked} onChange={event => setChecked(event.target.checked)} className="mt-1" /><span>Tôi đã kiểm tra đúng ngân hàng, số tài khoản, tên thụ hưởng, số tiền và app TPBank xác nhận chuyển thành công.</span></label>
          <button disabled={busy || !checked || (!manual && !transfer.bankProofVerified)} className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-40">{busy ? 'Đang kiểm tra…' : 'Xác nhận người nhận và hoàn tất đối soát'}</button>
        </form>}
        {transfer.confirmedAt && <p className="my-3 break-words text-sm text-slate-600">Đã lưu xác nhận: {transfer.bankReference} · {transfer.recipientNote}</p>}
        {!!transfer.confirmations?.length && <details className="my-3 text-sm"><summary className="cursor-pointer font-semibold">Lịch sử đối chiếu ({transfer.confirmations.length})</summary>{transfer.confirmations.map((item, index) => <p key={index} className="mt-2 break-words rounded-lg bg-slate-50 p-2">Admin #{item.adminId} · {new Date(item.createdAt).toLocaleString('vi-VN')} · {item.reference} · {item.note}</p>)}</details>}
        {transfer.status !== 'PAID' && <button disabled={busy} onClick={() => void refresh()} className="mt-3 w-full rounded-lg border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-700 disabled:opacity-40">Kiểm tra lại giao dịch trên SePay</button>}
      </>}
    </section>
  </div>
}
