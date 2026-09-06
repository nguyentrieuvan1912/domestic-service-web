import { Link } from 'react-router-dom'
import { promotions } from '../../data/promotions'
import { servicePackages } from '../../data/services'

const processSteps = [
  { number: '01', title: 'Chọn dịch vụ', description: 'Chọn gói dọn dẹp phù hợp với nhu cầu của gia đình.' },
  { number: '02', title: 'Chọn thời gian & khu vực', description: 'Chia sẻ thời gian thuận tiện và địa điểm cần hỗ trợ.' },
  { number: '03', title: 'Chọn Staff hoặc để hệ thống tìm', description: 'Chọn người phù hợp hoặc để hệ thống hỗ trợ kết nối.' },
  { number: '04', title: 'Xác nhận trên Mobile App', description: 'Kiểm tra thông tin và xác nhận dịch vụ trên ứng dụng.' },
  { number: '05', title: 'Thực hiện dịch vụ', description: 'Staff được tuyển chọn đến và chăm sóc không gian của bạn.' },
  { number: '06', title: 'Đánh giá trải nghiệm', description: 'Gửi đánh giá để CleanMaster ngày càng phục vụ tốt hơn.' },
]

const benefits = [
  { mark: '✓', title: 'Staff được tuyển chọn', description: 'Quy trình tuyển chọn và đào tạo rõ ràng, đặt sự tận tâm lên trước.' },
  { mark: '₫', title: 'Giá minh bạch', description: 'Thông tin dịch vụ rõ ràng để bạn chủ động trước khi xác nhận.' },
  { mark: '↗', title: 'Đặt lịch linh hoạt', description: 'Chọn thời gian phù hợp với nhịp sống và lịch trình của gia đình.' },
  { mark: '⌁', title: 'Điều phối thông minh', description: 'Hệ thống hỗ trợ kết nối nhu cầu với Staff phù hợp.' },
  { mark: '★', title: 'Đánh giá công khai', description: 'Phản hồi của khách hàng giúp chất lượng dịch vụ luôn tiến bộ.' },
  { mark: 'AI', title: 'AI hỗ trợ tư vấn', description: 'Gợi ý lựa chọn dịch vụ, không thay thế quyết định của bạn.' },
]

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>}
    </div>
  )
}

function ArrowIcon() {
  return <span aria-hidden="true" className="text-lg transition-transform group-hover:translate-x-1">→</span>
}

export default function Home() {
  return (
    <div className="overflow-hidden bg-white">
      <section className="relative isolate bg-[#f3faf7]">
        <div className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Giúp việc gia đình thông minh
            </p>
            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Nhà sạch hơn,<br /><span className="text-emerald-600">sống nhẹ nhàng hơn.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
              CleanMaster kết nối bạn với đội ngũ Staff được tuyển chọn, giúp việc nhà trở nên minh bạch, linh hoạt và dễ dàng hơn mỗi ngày.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/download" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
                Đặt dịch vụ <ArrowIcon />
              </Link>
              <Link to="/download" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-800 transition hover:border-emerald-500 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
                Tải ứng dụng
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-slate-600">
              <span>✓ Staff được tuyển chọn</span><span>✓ Giá minh bạch</span><span>✓ Hỗ trợ tận tâm</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -bottom-5 -left-4 z-10 rounded-2xl bg-white p-4 shadow-xl shadow-slate-900/10 sm:-left-8">
              <p className="text-xs font-semibold text-slate-500">Khách hàng hài lòng</p>
              <p className="mt-1 text-2xl font-black text-slate-900">98%</p>
            </div>
            <div className="overflow-hidden rounded-[2rem] rounded-bl-[5rem] border-8 border-white shadow-2xl shadow-emerald-950/10">
              <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85" alt="Không gian bếp sạch sẽ và sáng thoáng" className="aspect-[4/4.2] w-full object-cover sm:aspect-[4/3.5]" />
            </div>
            <div className="absolute -right-2 -top-5 rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-xl sm:-right-5">
              <p className="text-xs text-slate-400">Điều phối thông minh</p><p className="mt-1 font-bold">Đúng người, đúng nhu cầu</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Nền tảng kết nối</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Chăm sóc tổ ấm,<br />theo cách của bạn.</h2>
          <p className="mt-5 leading-7 text-slate-600">Từ lần đầu tìm hiểu đến khi hoàn tất dịch vụ, CleanMaster giúp bạn có một hành trình đơn giản và đáng tin cậy.</p>
          <Link to="/about" className="group mt-7 inline-flex items-center gap-2 font-bold text-emerald-700 hover:text-emerald-800">Tìm hiểu về nền tảng <ArrowIcon /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ['01', 'Kết nối Customer với Staff', 'Đội ngũ được tuyển chọn để bạn an tâm trao gửi không gian sống.'],
            ['02', 'Đặt dịch vụ qua Mobile App', 'Chủ động theo dõi thông tin và sắp xếp lịch trình thuận tiện.'],
            ['03', 'Hệ thống hỗ trợ điều phối', 'Nhu cầu của bạn được kết nối với lựa chọn phù hợp hơn.'],
            ['04', 'AI hỗ trợ tư vấn', 'Nhận gợi ý dịch vụ dễ hiểu, quyết định cuối cùng vẫn thuộc về bạn.'],
          ].map(([number, title, description]) => (
            <div key={number} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5">
              <span className="text-sm font-black text-emerald-600">{number}</span><h3 className="mt-4 font-bold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-20 sm:py-24 lg:px-8">
        <SectionHeading eyebrow="Dịch vụ nổi bật" title="Chọn cách chăm sóc nhà phù hợp" description="Các gói dịch vụ được thiết kế cho những nhu cầu phổ biến của gia đình hiện đại." />
        <div className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-3">
          {servicePackages.map((service) => (
            <article key={service.id} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
              <div className="relative overflow-hidden"><img src={service.imageUrl} alt={service.name} className="aspect-[1.65/1] w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-emerald-700">CleanMaster</span></div>
              <div className="p-6"><h3 className="text-xl font-black text-slate-900">{service.name}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p><div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-500"><span className="rounded-full bg-slate-100 px-3 py-1.5">{service.duration}</span><span className="rounded-full bg-slate-100 px-3 py-1.5">{service.areaRange}</span></div><Link to="/services" className="group mt-6 inline-flex items-center gap-2 font-bold text-emerald-700">Xem chi tiết <ArrowIcon /></Link></div>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-6 flex max-w-7xl flex-wrap items-center justify-center gap-3 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/60 px-6 py-5 text-sm font-semibold text-emerald-800"><span className="font-black">Dịch vụ bổ sung:</span> Sofa <span>•</span> Rèm <span>•</span> Nệm <span>•</span> Thảm <Link to="/services" className="ml-1 underline underline-offset-4">Khám phá thêm</Link></div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8">
        <SectionHeading eyebrow="Quy trình đơn giản" title="Mọi thứ bắt đầu từ một lựa chọn" description="Bạn chủ động ở từng bước, CleanMaster hỗ trợ để hành trình diễn ra nhẹ nhàng." />
        <div className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          {processSteps.map((step) => <div key={step.number} className="relative text-center lg:text-left"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-black text-emerald-700 lg:mx-0">{step.number}</span><h3 className="mt-4 font-bold text-slate-900">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p></div>)}
        </div>
      </section>

      <section className="bg-[#f3faf7] px-5 py-20 sm:py-24 lg:px-8">
        <SectionHeading eyebrow="Lý do chọn CleanMaster" title="An tâm hơn trong từng lựa chọn" />
        <div className="mx-auto mt-12 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3">{benefits.map((benefit) => <div key={benefit.title} className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-emerald-900/5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-black text-emerald-700">{benefit.mark}</span><div><h3 className="font-bold text-slate-900">{benefit.title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{benefit.description}</p></div></div>)}</div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Ưu đãi nổi bật</p><h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Bắt đầu thật dễ dàng</h2></div><Link to="/promotions" className="font-bold text-emerald-700 hover:text-emerald-800">Xem tất cả ưu đãi →</Link></div><div className="mt-10 grid gap-5 md:grid-cols-2">{promotions.map((promotion) => <article key={promotion.id} className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${promotion.tone} p-7 text-white sm:p-9`}><span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold">Đến {new Date(promotion.endsAt).toLocaleDateString('vi-VN')}</span><p className="mt-7 text-4xl font-black tracking-tight">{promotion.discountLabel}</p><h3 className="mt-2 text-xl font-bold">{promotion.title}</h3><p className="mt-3 max-w-sm text-sm leading-6 text-white/75">{promotion.description}</p><Link to="/download" className="mt-7 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-emerald-50">Dùng ưu đãi</Link></article>)}</div></section>

      <section className="bg-slate-950 px-5 py-20 text-white sm:py-24 lg:px-8"><div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr]"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">Ứng dụng CleanMaster</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Đặt lịch chăm sóc nhà ngay trong lòng bàn tay.</h2><p className="mt-5 max-w-lg leading-7 text-slate-400">Tải ứng dụng để xem dịch vụ, chọn lịch thuận tiện và quản lý trải nghiệm của bạn ở một nơi.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/download" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-50">App Store</Link><Link to="/download" className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-white hover:border-emerald-400">Google Play</Link></div></div><div className="flex items-center justify-center gap-6 sm:justify-end"><div className="flex h-36 w-36 items-center justify-center rounded-2xl bg-white p-3 text-center text-sm font-black text-slate-950 shadow-2xl">QR<br />PLACEHOLDER</div><div className="hidden max-w-[150px] text-sm leading-6 text-slate-400 sm:block">Quét mã để tải ứng dụng CleanMaster</div></div></div></section>

      <section className="px-5 py-20 sm:py-24 lg:px-8"><div className="mx-auto max-w-4xl rounded-[2rem] bg-emerald-600 px-6 py-12 text-center text-white shadow-2xl shadow-emerald-900/15 sm:px-12"><p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-100">Không gian sạch, tâm trí nhẹ</p><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Cần giúp việc? Đặt dịch vụ ngay.</h2><p className="mx-auto mt-4 max-w-xl leading-7 text-emerald-50">Chọn dịch vụ phù hợp và để CleanMaster đồng hành cùng bạn trong việc chăm sóc tổ ấm.</p><Link to="/download" className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 font-bold text-emerald-700 transition hover:bg-emerald-50">Bắt đầu trên Mobile App →</Link></div></section>
    </div>
  )
}
