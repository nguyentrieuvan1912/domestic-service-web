import { Link } from 'react-router-dom'
import Reveal from '../../components/common/Reveal'

const guideSteps = [
  {
    step: '01',
    title: 'Nhận tài khoản & Xác minh hồ sơ',
    badge: 'Bắt đầu',
    summary: 'Sau khi hoàn tất phỏng vấn và đào tạo tại CleanMaster, Admin sẽ cấp tài khoản Đối tác Nhân viên (Staff) cho bạn.',
    details: [
      'Đăng nhập bằng số điện thoại/email đã đăng ký trên ứng dụng CleanMaster (chọn vai trò Nhân viên).',
      'Kiểm tra thông tin đã xác thực (Họ tên, mã nhân viên, CCCD, năm kinh nghiệm) trong mục Tài khoản → Thông tin cá nhân.',
      'Bổ sung mô tả ngắn về bản thân để tăng mức độ tin cậy khi khách hàng xem hồ sơ.',
    ],
  },
  {
    step: '02',
    title: 'Đăng ký lịch làm việc theo tuần',
    badge: 'Bắt buộc trước khi nhận ca',
    summary: 'Lịch rảnh giúp hệ thống điều phối ghép đúng khung giờ bạn có thể làm việc.',
    details: [
      'Vào Tài khoản → Đăng ký lịch làm việc (Bước 1 trước khi nhận việc).',
      'Chọn các ngày và khung giờ rảnh trong tuần, sau đó bấm Lưu lịch làm việc.',
      'Bạn có thể chủ động cập nhật lịch bất cứ lúc nào khi thay đổi kế hoạch cá nhân.',
    ],
  },
  {
    step: '03',
    title: 'Thiết lập Khu vực hoạt động (TP. Hồ Chí Minh)',
    badge: 'Tối đa 30 phường/xã',
    summary: 'Chỉ nhận các đơn dịch vụ nằm trong phạm vi di chuyển thuận tiện của bạn.',
    details: [
      'Vào Tài khoản → Quản lý khu vực hoạt động → bấm Thêm khu vực.',
      'Tìm kiếm và lọc theo Phường, Xã hoặc Đặc khu tại TP. Hồ Chí Minh (tối đa 30 khu vực).',
      'Kiểm tra lại danh sách và bấm Xác nhận lưu khu vực để áp dụng ngay cho hệ thống ghép đơn.',
    ],
  },
  {
    step: '04',
    title: 'Bật Online & Nhận ca làm việc',
    badge: 'Chế độ A & Chế độ B',
    summary: 'Theo dõi các ca việc phù hợp ngay trên Trang chủ hoặc tab Ca làm việc.',
    details: [
      'Gạt công tắc Trực tuyến (Online) trên Trang chủ để sẵn sàng nhận đề xuất ca mới.',
      'Chế độ A (Khách chọn đích danh): Bạn có tối đa 5 phút để xác nhận nhận ca trước khi đơn chuyển sang ghép tự động.',
      'Chế độ B (Hệ thống ghép): Lọc nhanh theo khu vực, dịch vụ hoặc ngày làm việc để chọn ca phù hợp.',
    ],
  },
  {
    step: '05',
    title: 'Thực hiện dịch vụ, Chat/Gọi & Minh chứng',
    badge: 'Quy trình chuẩn',
    summary: 'Cập nhật đúng trạng thái ca và trao đổi an toàn ngay trong ứng dụng.',
    details: [
      'Cập nhật tuần tự: Đã nhận ca → Đang di chuyển → Đang thực hiện → Hoàn thành.',
      'Liên hệ khách hàng qua Chat hoặc Gọi thoại/Video tích hợp (LiveKit) mà không cần lộ số điện thoại cá nhân.',
      'Chụp ảnh minh chứng trước/sau khi hoàn thành theo hướng dẫn dịch vụ để bảo vệ quyền lợi hai bên.',
    ],
  },
  {
    step: '06',
    title: 'Ví thu nhập & Rút tiền tự động qua payOS',
    badge: 'Minh bạch tài chính',
    summary: 'Thu nhập được quyết toán tự động ngay sau khi đơn hàng hoàn tất.',
    details: [
      'Vào tab Thu nhập để xem số dư khả dụng và chi tiết từng giao dịch (Thu nhập, Thưởng, Nạp ví, Rút tiền).',
      'Liên kết tài khoản ngân hàng chính chủ đã xác minh trước khi gửi yêu cầu rút tiền.',
      'Yêu cầu rút tiền hợp lệ được hệ thống tự động tạo lệnh chi qua payOS; trạng thái chỉ báo đã chuyển khi ngân hàng xác nhận thành công.',
    ],
  },
]

const tips = [
  { title: 'Giao diện Sáng / Tối & Màu nền', desc: 'Bạn có thể vào Tài khoản → Giao diện & Màu nền để chuyển sang chế độ Tối dịu mắt khi xem lịch vào ban đêm.' },
  { title: 'Theo dõi Huy hiệu & Đánh giá', desc: 'Duy trì tỷ lệ hoàn thành cao và đánh giá 5★ để tăng ưu tiên hiển thị khi khách hàng đặt lại nhanh (Quick Rebook).' },
  { title: 'Hỗ trợ vận hành 24/7', desc: 'Nếu gặp sự cố tại địa điểm làm việc, hãy sử dụng mục báo cáo sự cố trong chi tiết ca hoặc gọi Hotline 1900 6868.' },
]

export default function EmployeeGuideline() {
  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-[#f3faf7] px-5 py-16 sm:py-20 lg:px-8">
        <div className="cm-blob-drift pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 shadow-sm">
            Cẩm nang Đối tác CleanMaster
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
            Hướng dẫn nhân viên sử dụng ứng dụng CleanMaster.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Quy trình 6 bước chuẩn giúp Đối tác Nhân viên làm chủ ứng dụng từ thiết lập lịch làm việc, quản lý khu vực hoạt động đến nhận ca và rút thu nhập qua payOS.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/download" className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700">
              Tải ứng dụng CleanMaster
            </Link>
            <Link to="/cooperation/staff" className="rounded-full border border-emerald-200 bg-white px-6 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">
              Chưa có tài khoản? Ứng tuyển ngay
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-5 py-14 sm:py-20 lg:px-8">
        <div className="space-y-6">
          {guideSteps.map((item, index) => (
            <Reveal key={item.step} delayMs={index * 60}>
              <article className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-sm font-black text-white shadow-sm">
                    {item.step}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black text-slate-900">{item.title}</h2>
                      <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200/70">
                        {item.badge}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{item.summary}</p>
                  </div>
                </div>
                <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-700">
                  {item.details.map((line) => (
                    <li key={line} className="flex items-start gap-2.5">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
                        ✓
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12">
          <section className="rounded-3xl bg-slate-950 p-7 text-white sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Mẹo sử dụng hiệu quả</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Tối ưu trải nghiệm mỗi ngày trên App</h2>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {tips.map((tip) => (
                <div key={tip.title} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                  <h3 className="font-bold text-emerald-300">{tip.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{tip.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-6">
              <p className="text-sm text-slate-400">Cần hỗ trợ thêm về quy định đối tác và đối soát?</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/terms" className="rounded-full border border-slate-700 px-5 py-2.5 text-sm font-bold text-white transition hover:border-emerald-400 hover:text-emerald-300">
                  Xem chính sách Đối tác
                </Link>
                <Link to="/faq" className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500">
                  Xem FAQ →
                </Link>
              </div>
            </div>
          </section>
        </Reveal>
      </main>
    </div>
  )
}
