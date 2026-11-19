import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

type LegalSection = 'terms' | 'privacy' | 'booking' | 'partner'

const legalContent: Record<
  LegalSection,
  { label: string; title: string; updatedAt: string; sections: Array<{ heading: string; paragraphs: string[] }> }
> = {
  terms: {
    label: 'Điều khoản sử dụng',
    title: 'Điều khoản sử dụng CleanMaster',
    updatedAt: 'Cập nhật lần cuối: 19/11/2026',
    sections: [
      {
        heading: '1. Phạm vi nền tảng & Website Blog',
        paragraphs: [
          'CleanMaster là nền tảng kết nối Khách hàng (Customer) với đội ngũ Đối tác Nhân viên (Staff) cung cấp dịch vụ chăm sóc và dọn dẹp gia đình. Website này hoạt động như cổng thông tin giới thiệu dịch vụ, chính sách, tuyển dụng và Blog công khai — không yêu cầu đăng nhập tài khoản.',
          'Mọi thao tác đặt lịch, sử dụng Trợ lý AI Chat & Giọng nói 24/7, trò chuyện/gọi thoại-video trong đơn, quản lý ví điện tử và nhận ca làm việc được thực hiện trực tiếp trên ứng dụng di động CleanMaster.',
        ],
      },
      {
        heading: '2. Vai trò & trách nhiệm của các bên',
        paragraphs: [
          'Khách hàng (Customer) có trách nhiệm cung cấp địa chỉ, thời gian và yêu cầu dịch vụ chính xác; phối hợp tạo điều kiện để nhân viên hoàn thành công việc an toàn và đánh giá trung thực sau khi kết thúc ca.',
          'Nhân viên (Staff) được công ty tuyển chọn, xác minh CCCD và cấp tài khoản bởi Admin; cam kết đăng ký lịch tuần, thiết lập khu vực hoạt động trung thực, thực hiện đúng quy trình và gửi minh chứng hoàn thành theo tiêu chuẩn CleanMaster.',
          'Quản trị viên (Admin) điều hành chất lượng dịch vụ, xác minh hồ sơ năng lực, kiểm duyệt cộng đồng, giải quyết sự cố/khiếu nại và vận hành đối soát tài chính.',
        ],
      },
      {
        heading: '3. Quy định sử dụng Trợ lý AI & Cộng đồng',
        paragraphs: [
          'Trợ lý AI CleanMaster (hỗ trợ văn bản và giọng nói) đóng vai trò tư vấn, gợi ý gói dịch vụ theo diện tích và giải đáp chính sách. AI không tự ý quyết định giá, thực hiện thanh toán, hoàn tiền, xác nhận đặt đơn, đình chỉ nhân viên hoặc phân phối tiền.',
          'Khi tham gia mục Cộng đồng trên ứng dụng, người dùng không đăng tải nội dung vi phạm pháp luật, thông tin sai sự thật hoặc chia sẻ thông tin cá nhân nhạy cảm của người khác. Nội dung vi phạm có thể bị ẩn hoặc gỡ bỏ bởi bộ phận kiểm duyệt.',
        ],
      },
      {
        heading: '4. Quyền sở hữu & cập nhật điều khoản',
        paragraphs: [
          'Toàn bộ nội dung, thiết kế, thương hiệu và tài liệu trên CleanMaster thuộc quyền sở hữu của nền tảng. CleanMaster có quyền cập nhật điều khoản để phù hợp với tính năng mới và quy định pháp luật hiện hành; phiên bản mới nhất luôn được công bố công khai tại trang này.',
        ],
      },
    ],
  },
  privacy: {
    label: 'Chính sách bảo mật',
    title: 'Chính sách bảo mật & Quyền riêng tư',
    updatedAt: 'Cập nhật lần cuối: 19/11/2026',
    sections: [
      {
        heading: '1. Dữ liệu chúng tôi tiếp nhận',
        paragraphs: [
          'Trên Website công khai: CleanMaster chỉ tiếp nhận thông tin khi bạn chủ động gửi biểu mẫu Liên hệ hỗ trợ hoặc đăng ký Ứng tuyển Đối tác Nhân viên. Việc đọc Blog và tra cứu dịch vụ không yêu cầu đăng nhập.',
          'Trên Mobile App: Hệ thống lưu trữ thông tin tài khoản, sổ địa chỉ phục vụ (có thể dùng vị trí GPS khi bạn cho phép), lịch sử đơn hàng, tin nhắn trong đơn, hình ảnh minh chứng ca làm và thông tin ngân hàng xác minh (đối với Staff).',
        ],
      },
      {
        heading: '2. Bảo mật giao tiếp (Chat & Gọi Video LiveKit)',
        paragraphs: [
          'Các cuộc trò chuyện và cuộc gọi thoại/video giữa Khách hàng và Nhân viên được thực hiện ngay trong phiên đơn hàng trên ứng dụng thông qua nền tảng WebRTC/LiveKit, giúp hạn chế tối đa việc phải chia sẻ số điện thoại cá nhân ra bên ngoài.',
          'Quyền truy cập micro và camera chỉ được kích hoạt khi bạn chủ động sử dụng Trợ lý AI giọng nói hoặc bật cuộc gọi trong đơn hàng.',
        ],
      },
      {
        heading: '3. Mục đích sử dụng & bảo vệ dữ liệu',
        paragraphs: [
          'Dữ liệu được sử dụng để ghép đơn đúng khu vực, hiển thị trạng thái thực hiện theo thời gian thực, xử lý thanh toán/đối soát payOS, hỗ trợ giải quyết khiếu nại và nâng cao chất lượng phục vụ. Chúng tôi không bán hoặc chia sẻ dữ liệu cá nhân cho bên thứ ba trái phép.',
          'Mật khẩu, phiên đăng nhập và tùy chọn cá nhân trên thiết bị được bảo vệ bằng cơ chế lưu trữ an toàn (SecureStore / mã hóa truyền tải).',
        ],
      },
      {
        heading: '4. Quyền của người dùng & liên hệ',
        paragraphs: [
          'Bạn có quyền xem, cập nhật thông tin liên hệ trong mục Tài khoản hoặc yêu cầu hỗ trợ về dữ liệu cá nhân qua email hello@cleanmaster.vn hoặc Hotline 1900 6868 (08:00 - 21:00 hàng ngày).',
        ],
      },
    ],
  },
  booking: {
    label: 'Đặt lịch, Hủy & Hoàn tiền',
    title: 'Chính sách Đặt lịch, Hủy lịch & Hoàn tiền',
    updatedAt: 'Cập nhật lần cuối: 19/11/2026',
    sections: [
      {
        heading: '1. Cơ chế ghép đơn & Thời hạn xác nhận 5 phút',
        paragraphs: [
          'Khách hàng có thể chọn nhân viên cụ thể (bao gồm tính năng Đặt lại nhanh với nhân viên yêu thích) hoặc để hệ thống tự động ghép nhân viên phù hợp trong khu vực.',
          'Khi chọn nhân viên đích danh, nhân viên có tối đa 5 phút để xác nhận nhận lịch. Nếu hết thời gian hoặc nhân viên bận, khách hàng có thể chọn nhân viên khác hoặc chuyển sang chế độ hệ thống tự động ghép.',
        ],
      },
      {
        heading: '2. Giá dịch vụ, Khuyến mãi & Thanh toán',
        paragraphs: [
          'Tổng chi phí được tính minh bạch theo bảng giá hiện hành của hệ thống gồm gói dịch vụ chính, dịch vụ bổ sung (Sofa, Rèm, Nệm, Thảm...) và giảm giá từ mã khuyến mãi hợp lệ.',
          'Khách hàng có thể thanh toán bằng Tiền mặt sau khi hoàn thành dịch vụ, Ví CleanMaster hoặc chuyển khoản/QR thông qua cổng thanh toán payOS khi được kích hoạt.',
        ],
      },
      {
        heading: '3. Quy định hủy lịch & Hoàn tiền',
        paragraphs: [
          'Khách hàng được hủy đơn miễn phí khi đơn chưa được nhân viên xác nhận hoặc hủy sớm trước thời điểm bắt đầu theo khung thời gian hiển thị rõ trên màn hình xác nhận của ứng dụng.',
          'Với các đơn đã thanh toán trước qua Ví/QR đủ điều kiện hoàn tiền hoặc bị hủy từ phía vận hành, khoản tiền sẽ được hoàn tự động về Ví CleanMaster của khách hàng kèm lịch sử giao dịch đối soát minh bạch.',
        ],
      },
      {
        heading: '4. Hỗ trợ sự cố & Bảo đảm chất lượng',
        paragraphs: [
          'Nếu chất lượng chưa đạt kỳ vọng hoặc phát sinh hư hại trong quá trình thực hiện, khách hàng vui lòng gửi phản ánh ngay trong chi tiết đơn hàng hoặc liên hệ Hotline 1900 6868 trong vòng 24 giờ sau khi hoàn tất để bộ phận vận hành kiểm tra minh chứng và hỗ trợ thỏa đáng.',
        ],
      },
    ],
  },
  partner: {
    label: 'Chính sách Đối tác & payOS',
    title: 'Chính sách Đối tác Nhân viên & Đối soát thu nhập',
    updatedAt: 'Cập nhật lần cuối: 19/11/2026',
    sections: [
      {
        heading: '1. Tuyển chọn & Quản lý tài khoản Staff',
        paragraphs: [
          'CleanMaster không cho phép tự đăng ký tài khoản Staff trực tiếp trên ứng dụng. Ứng viên gửi hồ sơ qua Website, trải qua vòng phỏng vấn, xác minh giấy tờ tùy thân (CCCD, lý lịch, sức khỏe) và đào tạo tiêu chuẩn trước khi Admin cấp tài khoản.',
        ],
      },
      {
        heading: '2. Lịch làm việc & Khu vực hoạt động',
        paragraphs: [
          'Trước khi nhận việc, Staff cần đăng ký lịch rảnh theo tuần và thiết lập khu vực hoạt động (tối đa 30 phường, xã hoặc đặc khu tại TP. Hồ Chí Minh). Hệ thống chỉ ưu tiên đề xuất các ca nằm đúng khung giờ và phạm vi khu vực đã đăng ký.',
        ],
      },
      {
        heading: '3. Đối soát thu nhập & Rút tiền tự động qua payOS',
        paragraphs: [
          'Thu nhập được ghi nhận vào Ví nhân viên sau khi đơn dịch vụ kết thúc và hoàn tất quyết toán. Staff cần liên kết tài khoản ngân hàng chính chủ đã được xác minh để thực hiện rút tiền.',
          'Yêu cầu rút tiền hợp lệ được hệ thống tự động tạo lệnh chi qua payOS trong hạn mức quy định. Tiền rút được giữ riêng khi xử lý và chỉ cập nhật trạng thái đã chuyển khi payOS xác nhận giao dịch thành công.',
        ],
      },
      {
        heading: '4. Tiêu chuẩn phục vụ & Kỷ luật vận hành',
        paragraphs: [
          'Staff cần đến đúng giờ, cập nhật đúng trạng thái ca, giữ thái độ chuyên nghiệp và bảo vệ tài sản của khách hàng. Các hành vi bỏ ca không lý do, gian lận thanh toán hoặc vi phạm an toàn sẽ bị xử lý theo quy chế kỷ luật của CleanMaster.',
        ],
      },
    ],
  },
}

const sectionOrder: LegalSection[] = ['terms', 'privacy', 'booking', 'partner']

export default function Terms() {
  const location = useLocation()
  const [activeSection, setActiveSection] = useState<LegalSection>(
    location.pathname === '/privacy' ? 'privacy' : 'terms',
  )

  useEffect(() => {
    if (location.pathname === '/privacy') setActiveSection('privacy')
  }, [location.pathname])

  const content = legalContent[activeSection]

  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-[#f3faf7] px-5 py-16 sm:py-20 lg:px-8">
        <div className="cm-blob-drift pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Pháp lý & Minh bạch</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Chính sách & Điều khoản CleanMaster
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Tổng hợp đầy đủ quy định sử dụng, bảo mật dữ liệu, chính sách đặt/hủy lịch và cơ chế đối soát thu nhập cho cả Khách hàng và Đối tác Nhân viên.
          </p>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:py-20 lg:grid-cols-[270px_1fr] lg:px-8">
        <aside className="h-fit rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-28">
          {sectionOrder.map((key) => {
            const active = activeSection === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveSection(key)}
                className={`mt-1 w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition first:mt-0 ${
                  active
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {legalContent[key].label}
              </button>
            )
          })}
        </aside>

        <article key={activeSection} className="cm-fade-up rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <p className="text-sm font-bold text-emerald-700">{content.updatedAt}</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">{content.title}</h2>
          <div className="mt-10 space-y-8 text-[15px] leading-8 text-slate-600">
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h3 className="text-lg font-black text-slate-900">{section.heading}</h3>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-3">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </main>
    </div>
  )
}
