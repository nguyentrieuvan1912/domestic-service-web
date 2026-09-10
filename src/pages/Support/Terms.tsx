import { useState } from 'react'
import { useLocation } from 'react-router-dom'

type LegalSection = 'terms' | 'privacy'

const legalContent: Record<LegalSection, { label: string; title: string; updatedAt: string; sections: Array<{ heading: string; paragraphs: string[] }> }> = {
  terms: {
    label: 'Điều khoản sử dụng',
    title: 'Điều khoản sử dụng CleanMaster',
    updatedAt: 'Cập nhật lần cuối: 08/09/2026',
    sections: [
      { heading: '1. Phạm vi dịch vụ', paragraphs: ['CleanMaster là nền tảng giới thiệu và kết nối Customer với Staff cung cấp dịch vụ dọn dẹp gia đình. Website cung cấp thông tin tham khảo; việc chọn lịch và xác nhận dịch vụ được thực hiện trên Mobile App.', 'Các dịch vụ hiện gồm dọn dẹp theo ca, dọn dẹp định kỳ, tổng vệ sinh và các add-on như sofa, rèm, nệm, thảm.'] },
      { heading: '2. Vai trò của các bên', paragraphs: ['Customer chủ động cung cấp thông tin nhu cầu và kiểm tra nội dung trước khi xác nhận trên ứng dụng. Staff thực hiện công việc theo quy trình và tiêu chuẩn được hướng dẫn. Admin quản lý vận hành, chất lượng và chính sách của nền tảng.'] },
      { heading: '3. Thông tin và trách nhiệm', paragraphs: ['Người dùng cần cung cấp thông tin trung thực, không sử dụng nền tảng cho mục đích trái pháp luật và không chia sẻ thông tin tài khoản cho người khác. Chính sách giá, thanh toán, hủy lịch và các điều kiện liên quan được hiển thị tại kênh chính thức khi sử dụng dịch vụ.'] },
      { heading: '4. Vai trò của AI', paragraphs: ['AI chỉ hỗ trợ tư vấn và gợi ý lựa chọn dịch vụ. AI không tự quyết định giá, thanh toán, hoàn tiền, xác nhận booking, đình chỉ Staff hoặc phân phối tiền.'] },
    ],
  },
  privacy: {
    label: 'Chính sách bảo mật',
    title: 'Chính sách bảo mật CleanMaster',
    updatedAt: 'Cập nhật lần cuối: 08/09/2026',
    sections: [
      { heading: '1. Thông tin chúng tôi tiếp nhận', paragraphs: ['Tùy vào chức năng, CleanMaster có thể tiếp nhận thông tin liên hệ, nội dung yêu cầu hỗ trợ, thông tin tuyển dụng và dữ liệu cần thiết để tư vấn dịch vụ. Website giai đoạn này sử dụng dữ liệu mẫu và chưa gọi API thật.'] },
      { heading: '2. Mục đích sử dụng', paragraphs: ['Thông tin được sử dụng để phản hồi yêu cầu, cải thiện trải nghiệm, hỗ trợ quy trình tuyển dụng Staff và cung cấp thông tin phù hợp về dịch vụ. Chúng tôi không sử dụng dữ liệu cho các mục đích ngoài phạm vi đã thông báo.'] },
      { heading: '3. Bảo vệ thông tin', paragraphs: ['CleanMaster áp dụng các biện pháp phù hợp để hạn chế truy cập, sử dụng hoặc tiết lộ thông tin không đúng mục đích. Người dùng nên kiểm tra kỹ đường dẫn và chỉ cung cấp thông tin qua các kênh chính thức.'] },
      { heading: '4. Liên hệ về quyền riêng tư', paragraphs: ['Nếu có câu hỏi về dữ liệu hoặc chính sách bảo mật, vui lòng liên hệ hello@cleanmaster.vn hoặc sử dụng biểu mẫu tại trang Liên hệ.'] },
    ],
  },
}

export default function Terms() {
  const location = useLocation()
  const [activeSection, setActiveSection] = useState<LegalSection>(location.pathname === '/privacy' ? 'privacy' : 'terms')
  const content = legalContent[activeSection]

  return <div className="bg-slate-50"><section className="bg-[#f3faf7] px-5 py-16 sm:py-20 lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Pháp lý & minh bạch</p><h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Thông tin chính sách</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Các nguyên tắc giúp bạn hiểu rõ cách CleanMaster hoạt động và bảo vệ thông tin trong quá trình sử dụng.</p></div></section><main className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:py-20 lg:grid-cols-[260px_1fr] lg:px-8"><aside className="h-fit rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-28"><button type="button" onClick={() => setActiveSection('terms')} className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition ${activeSection === 'terms' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>Điều khoản sử dụng</button><button type="button" onClick={() => setActiveSection('privacy')} className={`mt-1 w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition ${activeSection === 'privacy' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>Chính sách bảo mật</button></aside><article className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-10"><p className="text-sm font-bold text-emerald-700">{content.updatedAt}</p><h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">{content.title}</h2><div className="mt-10 space-y-8 text-[15px] leading-8 text-slate-600">{content.sections.map((section) => <section key={section.heading}><h3 className="text-lg font-black text-slate-900">{section.heading}</h3>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-3">{paragraph}</p>)}</section>)}</div></article></main></div>
}
