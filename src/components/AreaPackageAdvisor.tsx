import { useEffect, useState } from 'react'
import { catalogGet, money } from '../api/catalog'
import type { CatalogDetail } from '../api/catalog'

interface Recommendation {
  status: string; message: string; unconfiguredPackageIds: number[]
  options: { packageId: number; packageName: string; requiredStaffCount: number; quantity: number; baseAmount: number; durationMinutes: number; coveredAreaM2: number }[]
}
export function AreaPackageAdvisor({ detail }: { detail: CatalogDetail }) {
  const field=detail.requirements.find(item=>item.fieldKey==='areaM2'&&item.fieldType==='NUMBER')
  const [input,setInput]=useState(''),[attempt,setAttempt]=useState(0)
  const [state,setState]=useState<{key:string;data?:Recommendation;loading:boolean;error:string}>({key:'',loading:false,error:''})
  const area=Number(input),min=Number(field?.validationRules.min??1),max=Number(field?.validationRules.max??2000)
  const valid=!!field&&input.trim()!==''&&Number.isFinite(area)&&area>=min&&area<=max&&(!field.validationRules.integer||Number.isInteger(area))
  const key=`${detail.service.id}:${area}`
  useEffect(()=>{
    if(!valid)return
    const controller=new AbortController();let active=true
    setState({key,loading:true,error:''})
    const deadline=setTimeout(()=>controller.abort(),15000)
    const debounce=setTimeout(()=>{
      void catalogGet<Recommendation>(`/services/${detail.service.id}/recommendation?areaM2=${area}`,controller.signal)
        .then(data=>{if(active)setState({key,data,loading:false,error:''})})
        .catch(()=>{if(active)setState({key,loading:false,error:'Chưa lấy được đề xuất. Vui lòng thử lại.'})})
        .finally(()=>clearTimeout(deadline))
    },350)
    return()=>{active=false;clearTimeout(deadline);clearTimeout(debounce);controller.abort()}
  },[key,valid,attempt,area,detail.service.id])
  if(!field)return null
  const current=valid&&state.key===key?state:undefined,option=current?.data?.options[0]
  return <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8"><div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-9">
    <h2 className="text-2xl font-black text-slate-900">Chọn gói tiết kiệm theo diện tích</h2>
    <p className="mt-3 text-slate-600">Nhập tổng diện tích cần làm để so sánh gói và số nhân viên theo bảng giá hiện tại.</p>
    <label className="mt-5 block max-w-sm font-semibold text-slate-800">{field.label}<input type="number" min={min} max={max} step={field.validationRules.integer?1:'any'} value={input} onChange={event=>setInput(event.target.value)} placeholder="Ví dụ: 80" className="mt-2 block w-full rounded-xl border border-emerald-200 bg-white p-3"/></label>
    {!!input&&!valid&&<p role="alert" className="mt-3 text-amber-800">Nhập diện tích từ {min} đến {max} m²{field.validationRules.integer?' bằng số nguyên':''}.</p>}
    {valid&&(!current||current.loading)&&<p aria-live="polite" className="mt-4 text-emerald-800">Đang so sánh các gói…</p>}
    {current?.error&&<div className="mt-4"><p role="alert">{current.error}</p><button onClick={()=>setAttempt(value=>value+1)} className="mt-2 font-bold text-emerald-700">Thử lại</button></div>}
    {option&&<div className="mt-6 space-y-3"><h3 className="text-xl font-bold text-emerald-900">Đề xuất: {option.packageName}</h3><p className="font-semibold">{option.requiredStaffCount} nhân viên · {option.quantity} gói · {option.durationMinutes} phút · {money(option.baseAmount)}</p><p>Định mức tối đa {option.coveredAreaM2} m².</p><p className="text-sm text-slate-600">{current!.data!.message}</p><p className="text-sm text-slate-600">Đặt trên ứng dụng để áp dụng đề xuất và chọn lịch phù hợp.</p></div>}
    {current?.data&&!option&&<p className="mt-4 text-amber-800">{current.data.message}</p>}
    {!!current?.data?.unconfiguredPackageIds.length&&<p className="mt-3 text-xs text-slate-500">Các gói chưa có định mức diện tích không được dùng để so sánh.</p>}
  </div></section>
}
