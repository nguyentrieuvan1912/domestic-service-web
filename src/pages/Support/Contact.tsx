import { type FormEvent, useState } from 'react'

const contactFields = [
  { label: 'Họ và tên', name: 'name', type: 'text', placeholder: 'Nhập họ và tên' },
  { label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com' },
  { label: 'Tiêu đề', name: 'subject', type: 'text', placeholder: 'Bạn cần CleanMaster hỗ trợ điều gì?' },
]

export default function Contact() {
  const [isSent, setIsSent] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSent(true)
    event.currentTarget.reset()
    window.setTimeout(() => setIsSent(false), 4500)
  }

  return <div className="bg-slate-50"><section className="bg-[#f3faf7] px-5 py-16 sm:py-20 lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Kết nối với CleanMaster</p><h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Chúng tôi sẵn sàng lắng nghe.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Gửi câu hỏi hoặc lời nhắn, đội ngũ CleanMaster sẽ tiếp nhận và phản hồi trong giờ làm việc.</p></div></section><main className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8"><aside className="rounded-3xl bg-slate-950 p-7 text-white sm:p-9"><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-300">Thông tin liên hệ</p><h2 className="mt-4 text-2xl font-black">Hãy để chúng tôi đồng hành cùng bạn.</h2><div className="mt-10 space-y-7"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Địa chỉ</p><p className="mt-2 leading-6 text-slate-200">123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Hotline</p><p className="mt-2 font-bold text-emerald-300">1900 0000</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</p><p className="mt-2 text-slate-200">hello@cleanmaster.vn</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Giờ làm việc</p><p className="mt-2 leading-6 text-slate-200">Thứ 2 - Thứ 7<br />08:00 - 18:00</p></div></div></aside><section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-9"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Gửi lời nhắn</p><h2 className="mt-3 text-2xl font-black text-slate-900">Bạn cần hỗ trợ điều gì?</h2></div><form onSubmit={handleSubmit} className="mt-8 space-y-5">{contactFields.map((field) => <label key={field.name} className="block text-sm font-bold text-slate-800">{field.label}<input required name={field.name} type={field.type} placeholder={field.placeholder} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>)}<label className="block text-sm font-bold text-slate-800">Lời nhắn<textarea required name="message" rows={5} placeholder="Viết lời nhắn của bạn" className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label><button type="submit" className="w-full rounded-full bg-emerald-600 px-6 py-3.5 font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">Gửi lời nhắn</button></form></section></main>{isSent && <div role="status" className="fixed bottom-6 right-5 z-50 rounded-xl bg-slate-950 px-5 py-4 text-sm font-bold text-white shadow-2xl sm:right-8">Gửi thành công. Cảm ơn bạn đã liên hệ!</div>}</div>
}
