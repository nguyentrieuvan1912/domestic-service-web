import { useState } from 'react'
import { faqItems, type FAQItem } from '../../data/faq'

function FAQGroup({ title, items }: { title: string; items: FAQItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section className="mt-12 first:mt-0"><h2 className="text-2xl font-black tracking-tight text-slate-900">{title}</h2><div className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">{items.map((item) => { const isOpen = item.id === openId; return <div key={item.id}><button type="button" aria-expanded={isOpen} onClick={() => setOpenId(isOpen ? null : item.id)} className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left font-bold text-slate-900 transition hover:bg-emerald-50/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 sm:px-6"><span>{item.question}</span><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald-200 text-lg font-normal text-emerald-700 transition-transform ${isOpen ? 'rotate-45' : ''}`} aria-hidden="true">+</span></button>{isOpen && <div className="px-5 pb-5 text-sm leading-7 text-slate-600 sm:px-6">{item.answer}</div>}</div> })}</div></section>
  )
}

export default function FAQ() {
  const customerFAQs = faqItems.filter((item) => item.audience === 'CUSTOMER').sort((first, second) => first.order - second.order)
  const staffFAQs = faqItems.filter((item) => item.audience === 'STAFF').sort((first, second) => first.order - second.order)

  return <div className="bg-slate-50"><section className="bg-[#f3faf7] px-5 py-16 sm:py-20 lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Trung tâm hỗ trợ</p><h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Câu hỏi thường gặp</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Tìm câu trả lời nhanh cho những thắc mắc phổ biến về dịch vụ và cơ hội trở thành Staff.</p></div></section><main className="mx-auto max-w-4xl px-5 py-14 sm:py-20 lg:px-8"><FAQGroup title="Dành cho Khách hàng" items={customerFAQs} /><FAQGroup title="Dành cho Staff" items={staffFAQs} /></main></div>
}
