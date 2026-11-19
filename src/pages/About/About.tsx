import { Link } from 'react-router-dom'
import Reveal from '../../components/common/Reveal'

const values = [
  { number: '01', title: 'Tận tâm với gia đình', description: 'Mỗi không gian sống đều có câu chuyện riêng và xứng đáng được chăm sóc chu đáo.' },
  { number: '02', title: 'Minh bạch trong trải nghiệm', description: 'Thông tin dịch vụ, bảng giá, quy trình đối soát payOS và vai trò của từng bên luôn rõ ràng.' },
  { number: '03', title: 'Công nghệ vì con người', description: 'AI giọng nói, Chat/Gọi Video và ghép đơn thông minh giúp phối hợp dễ dàng hơn, không thay thế quyết định của con người.' },
  { number: '04', title: 'Cùng nhau tiến bộ', description: 'Đánh giá 5★, huy hiệu khen ngợi và phản hồi từ Customer và Staff giúp dịch vụ hoàn thiện mỗi ngày.' },
]

const techPillars = [
  { number: '01', title: 'Trợ lý AI Chat & Giọng nói 24/7', description: 'Hỗ trợ tư vấn gói dịch vụ theo diện tích, ước lượng thời gian và giải đáp chính sách bằng cả văn bản lẫn giọng nói.' },
  { number: '02', title: 'Điều phối & Ghép khu vực thông minh', description: 'Đối chiếu lịch làm việc theo tuần và phạm vi tối đa 30 phường, xã tại TP.HCM để kết nối Staff phù hợp nhất.' },
  { number: '03', title: 'Chat & Gọi Video bảo mật (LiveKit)', description: 'Kết nối trực tiếp giữa Customer và Staff ngay trong đơn hàng mà không cần chia sẻ số điện thoại cá nhân.' },
  { number: '04', title: 'Giới hạn AI & Đối soát minh bạch', description: 'AI không tự quyết định giá, thanh toán, hoàn tiền, xác nhận booking hay đình chỉ Staff. Mọi quyết toán ví & payOS đều minh bạch.' },
]

const roles = [
  { label: 'Customer (Mobile App)', description: 'Chủ động đặt lịch, đặt lại nhanh, dùng AI giọng nói, thanh toán linh hoạt và tùy chỉnh giao diện Sáng/Tối.' },
  { label: 'Staff (Mobile App)', description: 'Đội ngũ xác minh CCCD, chủ động đăng ký lịch tuần, chọn khu vực hoạt động và rút thu nhập qua payOS.' },
  { label: 'Admin (Vận hành)', description: 'Quản lý tuyển dụng, năng lực, kiểm duyệt cộng đồng, blog, xử lý sự cố và minh bạch tài chính.' },
]

export default function About() {
  return (
    <div className="overflow-hidden bg-white">
      <section className="relative bg-slate-950 px-5 py-20 text-white sm:py-28 lg:px-8">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-emerald-600/10 [clip-path:polygon(35%_0,100%_0,100%_100%,0_100%)]" />
        <div className="cm-fade-up relative mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">Về CleanMaster</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            Để việc nhà không còn là một nỗi lo thường trực.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            CleanMaster được xây dựng để kết nối nhu cầu chăm sóc tổ ấm với đội ngũ nhân viên tận tâm, quy trình chuẩn hóa và công nghệ hỗ trợ hiện đại.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Câu chuyện thương hiệu</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Một ngôi nhà sạch mở ra nhiều thời gian hơn cho điều quan trọng.
          </h2>
        </Reveal>
        <Reveal delayMs={100} className="space-y-5 text-base leading-8 text-slate-600">
          <p>Nhịp sống hiện đại khiến việc giữ nhà cửa gọn gàng trở thành một bài toán khó: thiếu thời gian, khó tìm người phù hợp và không phải lúc nào cũng biết bắt đầu từ đâu.</p>
          <p>CleanMaster ra đời từ mong muốn giải quyết nỗi lo đó bằng một hệ sinh thái trọn vẹn: Website Blog mở công khai để bạn tìm hiểu dịch vụ & mẹo hay, kết hợp cùng Mobile App tích hợp AI, Chat/Gọi Video và quản lý khu vực theo chuẩn hành chính TP. Hồ Chí Minh.</p>
          <p>Đằng sau giao diện thân thiện là một hệ thống điều phối và đối soát minh bạch giúp Khách hàng và Đối tác Nhân viên phối hợp hiệu quả, nhưng quyết định cuối cùng vẫn luôn thuộc về con người.</p>
        </Reveal>
      </section>

      <section className="bg-[#f3faf7] px-5 py-20 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <article className="h-full rounded-3xl bg-white p-8 shadow-sm ring-1 ring-emerald-900/5 sm:p-10">
                <span className="text-sm font-black uppercase tracking-[0.16em] text-emerald-700">Tầm nhìn</span>
                <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900">
                  Trở thành nền tảng chăm sóc nhà được tin chọn.
                </h2>
                <p className="mt-5 leading-7 text-slate-600">
                  CleanMaster hướng tới một hệ sinh thái nơi Customer dễ dàng đặt dịch vụ phù hợp, Staff có cơ hội phát triển thu nhập bền vững và Admin vận hành bằng dữ liệu minh bạch.
                </p>
              </article>
            </Reveal>
            <Reveal delayMs={100}>
              <article className="h-full rounded-3xl bg-emerald-600 p-8 text-white shadow-sm sm:p-10">
                <span className="text-sm font-black uppercase tracking-[0.16em] text-emerald-100">Sứ mệnh</span>
                <h2 className="mt-5 text-3xl font-black tracking-tight">
                  Biến chăm sóc tổ ấm thành trải nghiệm nhẹ nhàng hơn.
                </h2>
                <p className="mt-5 leading-7 text-emerald-50">
                  Chúng tôi kết hợp dịch vụ chuẩn hóa, đội ngũ xác minh kỹ lưỡng và công nghệ hỗ trợ để tạo ra giá trị thiết thực trong đời sống hàng ngày của mỗi gia đình.
                </p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Giá trị cốt lõi</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Điều chúng tôi giữ vững trong mỗi quyết định.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <Reveal key={value.number} delayMs={index * 70}>
              <article className="h-full border-t-2 border-emerald-500 pt-5">
                <span className="text-sm font-black text-emerald-700">{value.number}</span>
                <h3 className="mt-5 text-xl font-black text-slate-900">{value.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{value.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-20 text-white sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">Công nghệ khác biệt</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                AI hỗ trợ thông minh, con người giữ quyền quyết định.
              </h2>
              <p className="mt-5 leading-7 text-slate-400">
                Lớp công nghệ giúp CleanMaster thấu hiểu nhu cầu nhanh hơn, bảo mật giao tiếp tốt hơn và vận hành minh bạch hơn.
              </p>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {techPillars.map((pillar, index) => (
                <Reveal key={pillar.number} delayMs={index * 70}>
                  <article
                    className={`h-full rounded-2xl border p-6 transition hover:-translate-y-0.5 ${
                      index === 3
                        ? 'border-emerald-700 bg-emerald-950/50'
                        : 'border-slate-800 bg-slate-900'
                    }`}
                  >
                    <span className="text-2xl font-black text-emerald-300">{pillar.number}</span>
                    <h3 className={`mt-4 font-bold ${index === 3 ? 'text-emerald-100' : ''}`}>{pillar.title}</h3>
                    <p className={`mt-2 text-sm leading-6 ${index === 3 ? 'text-emerald-200/80' : 'text-slate-400'}`}>
                      {pillar.description}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-4 border-t border-slate-800 pt-8 sm:grid-cols-3">
            {roles.map((role) => (
              <div key={role.label}>
                <p className="font-black text-emerald-300">{role.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:py-24 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-4xl rounded-[2rem] bg-emerald-600 px-6 py-12 text-center text-white shadow-2xl shadow-emerald-900/15 sm:px-12">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-100">Bắt đầu nhẹ nhàng hơn</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Tải CleanMaster và chăm sóc tổ ấm theo cách của bạn.
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-emerald-50">
              Khám phá dịch vụ, chọn lịch thuận tiện và kết nối với Staff trên Mobile App.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/download" className="inline-flex rounded-full bg-white px-7 py-3.5 font-bold text-emerald-700 transition hover:bg-emerald-50">
                Tải ứng dụng →
              </Link>
              <Link to="/blog" className="inline-flex rounded-full border border-emerald-300/60 bg-emerald-700/40 px-7 py-3.5 font-bold text-white transition hover:bg-emerald-700">
                Đọc Blog CleanMaster
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
