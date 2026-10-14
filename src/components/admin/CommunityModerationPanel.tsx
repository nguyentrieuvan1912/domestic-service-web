import { useState } from 'react'
import { adminRequest } from '../../api/operations'
import { useAdminResource } from '../../hooks/useAdminResource'
type Post={id:number;author:string;content:string;status:string}
const load=()=>adminRequest<Post[]>('identity','/admin/community/posts')
export default function CommunityModerationPanel(){
  const resource=useAdminResource(load,[]),[error,setError]=useState(''),[busy,setBusy]=useState(false),[content,setContent]=useState('')
  const moderate=async (id:number,status:string)=>{setBusy(true);setError('');try{await adminRequest('identity','/admin/community/posts/'+id,'PATCH',{status});resource.retry()}catch(cause){setError(cause instanceof Error?cause.message:'Chưa kiểm duyệt được bài.')}finally{setBusy(false)}}
  const publish=async()=>{setBusy(true);setError('');try{await adminRequest('identity','/community/posts','POST',{content});setContent('');resource.retry()}catch(cause){setError(cause instanceof Error?cause.message:'Chưa đăng được thông báo.')}finally{setBusy(false)}}
  return <section className="border border-slate-200 rounded-xl bg-white p-5 space-y-3"><h2 className="font-bold">Kiểm duyệt cộng đồng</h2>{resource.loading&&<p>Đang tải...</p>}{(error||resource.error)&&<p role="alert">{error||resource.error} <button onClick={resource.retry}>Thử lại</button></p>}
    <textarea className="w-full border rounded p-2 text-sm" value={content} onChange={e=>setContent(e.target.value)} maxLength={5000} placeholder="Thông báo từ quản trị viên"/><button className="text-emerald-700" disabled={busy||!content.trim()} onClick={()=>void publish()}>Đăng thông báo</button>
    {!resource.loading&&!resource.data.length&&<p className="text-slate-500 text-sm">Chưa có bài viết.</p>}{resource.data.map(post=><article className="border-t pt-3 text-sm" key={post.id}><p className="font-semibold">#{post.id} {post.author} • {post.status}</p><p className="whitespace-pre-wrap">{post.content}</p><div className="flex gap-3"><button disabled={busy} onClick={()=>void moderate(post.id,'PUBLISHED')}>Duyệt / Công bố</button><button disabled={busy} onClick={()=>void moderate(post.id,'HIDDEN')}>Ẩn</button></div></article>)}
  </section>
}
