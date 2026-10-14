import { useState } from 'react'
import { adminRequest } from '../../api/operations'
import { useAdminResource } from '../../hooks/useAdminResource'
type Request = { id:number; name:string; email:string; subject:string; message:string; status:string; adminNote:string }
const load = () => adminRequest<Request[]>('identity','/admin/support-requests')
export default function SupportRequestsPanel() {
  const resource=useAdminResource(load,[]), [error,setError]=useState(''), [busy,setBusy]=useState<number|null>(null)
  const update=async (item:Request,status:string) => { const note=window.prompt('Ghi chú xử lý',item.adminNote || ''); if(note===null)return;setBusy(item.id);setError('');try{await adminRequest('identity','/admin/support-requests/'+item.id,'PATCH',{status,adminNote:note});resource.retry()}catch(cause){setError(cause instanceof Error?cause.message:'Chưa lưu được yêu cầu.')}finally{setBusy(null)} }
  return <section className="border border-slate-200 rounded-xl bg-white p-5 space-y-3"><h2 className="font-bold">Yêu cầu hỗ trợ từ khách hàng</h2>
    {resource.loading && <p>Đang tải...</p>}{(error||resource.error) && <p role="alert">{error||resource.error} <button onClick={resource.retry}>Thử lại</button></p>}
    {!resource.loading && !resource.data.length && <p className="text-slate-500 text-sm">Chưa có yêu cầu hỗ trợ.</p>}
    {resource.data.map(item=><article key={item.id} className="border-t pt-3"><p className="font-semibold">#{item.id} {item.subject} • {item.name}</p><p className="text-sm">{item.message}</p><p className="text-sm text-slate-500">{item.email} • {item.status} • {item.adminNote}</p><div className="flex gap-3 text-sm"><button disabled={busy!==null} onClick={()=>void update(item,'IN_PROGRESS')}>Tiếp nhận xử lý</button><button disabled={busy!==null} onClick={()=>void update(item,'RESOLVED')}>Đã xử lý</button></div></article>)}
  </section>
}
