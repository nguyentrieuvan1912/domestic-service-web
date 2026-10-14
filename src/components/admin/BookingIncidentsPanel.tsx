import { useState } from 'react'
import { adminRequest } from '../../api/operations'
import { useAdminResource } from '../../hooks/useAdminResource'
type Incident={id:number;bookingCode:string;reporterRole:string;reason:string;status:string}
const load=()=>adminRequest<Incident[]>('booking','/admin/incidents')
export default function BookingIncidentsPanel(){
  const resource=useAdminResource(load,[]),[busy,setBusy]=useState(false),[error,setError]=useState('')
  const resolve=async(item:Incident)=>{setBusy(true);setError('');try{await adminRequest('booking','/admin/incidents/'+item.id,'PATCH',{status:item.status==='OPEN'?'RESOLVED':'OPEN'});resource.retry()}catch(cause){setError(cause instanceof Error?cause.message:'Chưa cập nhật được sự cố.')}finally{setBusy(false)}}
  return <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-3"><h2 className="font-bold">Báo cáo sự cố trong ca làm</h2>{resource.loading&&<p>Đang tải...</p>}{(error||resource.error)&&<p role="alert">{error||resource.error} <button onClick={resource.retry}>Thử lại</button></p>}{!resource.loading&&!resource.data.length&&<p className="text-sm text-slate-500">Chưa có báo cáo sự cố.</p>}{resource.data.map(item=><article key={item.id} className="border-t pt-3 text-sm"><p className="font-semibold">{item.bookingCode} • {item.reporterRole} • {item.status}</p><p className="whitespace-pre-wrap">{item.reason}</p><button className="text-emerald-700" disabled={busy} onClick={()=>void resolve(item)}>{item.status==='OPEN'?'Xác nhận đã xử lý':'Mở lại báo cáo'}</button></article>)}</section>
}
