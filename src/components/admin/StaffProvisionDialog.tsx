import { useState, type FormEvent } from 'react'
import { adminRequest } from '../../api/operations'
export default function StaffProvisionDialog({ close, saved }: { close: () => void; saved: () => void }) {
  const [error,setError] = useState(''), [busy,setBusy] = useState(false)
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if(busy)return
    const values = Object.fromEntries(new FormData(event.currentTarget)); setBusy(true); setError('')
    try { await adminRequest('identity','/admin/staff','POST',{...values,experienceYears:Number(values.experienceYears||0)}); saved(); close() }
    catch(cause) { setError(cause instanceof Error ? cause.message : 'Chưa cấp được tài khoản.') }
    finally { setBusy(false) }
  }
  return <div className="fixed inset-0 z-50 bg-slate-950/40 flex items-center justify-center p-4"><form className="bg-white rounded-xl p-6 max-w-lg w-full space-y-3 max-h-[90vh] overflow-y-auto" onSubmit={submit}>
    <h2 className="font-bold text-xl">Cấp tài khoản sau tuyển dụng trực tiếp</h2>
    <p className="text-sm text-slate-500">Tài khoản Staff được lưu trên hệ thống. Kỹ năng được Admin xác nhận trong hồ sơ sau khi cấp.</p>
    {error && <p role="alert" className="text-red-600">{error}</p>}
    {[['fullName','Họ tên','text'],['phone','Số điện thoại','tel'],['email','Email','email'],['identityCard','CCCD','text'],['dateOfBirth','Ngày sinh','date'],['password','Mật khẩu ban đầu (tối thiểu 8 ký tự)','password']].map(([name,label,type]) => <label className="block text-sm" key={name}>{label}<input className="border rounded p-2 w-full" name={name} type={type} required minLength={name==='password'?8:undefined} maxLength={name==='password'?72:160} autoComplete="off" /></label>)}
    <label className="block text-sm">Giới tính<select name="gender" className="border rounded p-2 w-full"><option value="FEMALE">Nữ</option><option value="MALE">Nam</option><option value="OTHER">Khác</option></select></label>
    <label className="block text-sm">Số năm kinh nghiệm<input name="experienceYears" type="number" min="0" max="80" step="0.5" defaultValue="0" className="border rounded p-2 w-full"/></label>
    <label className="block text-sm">Giới thiệu<textarea name="bio" maxLength={2000} className="border rounded p-2 w-full"/></label>
    <label className="block text-sm">Cấp bậc<select className="border rounded p-2 w-full" name="rank"><option value="INTERN">Thực tập sinh</option><option value="STANDARD">Tiêu chuẩn</option><option value="PROFESSIONAL">Chuyên nghiệp</option></select></label>
    <div className="flex justify-end gap-3"><button type="button" disabled={busy} onClick={close}>Đóng</button><button className="bg-emerald-600 text-white rounded px-4 py-2" disabled={busy}>{busy?'Đang lưu...':'Cấp tài khoản'}</button></div>
  </form></div>
}
