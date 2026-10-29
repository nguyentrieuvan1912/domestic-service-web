import PartnerApplicationForm from '../../features/guest/partner/PartnerApplicationForm'

export default function BecomePartner() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 lg:py-20 font-sans text-slate-900">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-start">
          {/* Cột Trái: Hero & Benefits */}
          <div className="mb-12 lg:mb-0 lg:sticky lg:top-24">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-950">
              Trở thành Đối tác CleanMaster
              <br />
              <span className="text-emerald-600 mt-2 block">Thu nhập hấp dẫn, thời gian linh hoạt</span>
            </h1>
            
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Gia nhập cộng đồng đối tác dịch vụ gia đình hàng đầu. Tự do sắp xếp lịch trình, gia tăng thu nhập và nhận hỗ trợ 24/7 từ hệ thống CleanMaster.
            </p>

            <div className="mt-10 space-y-8">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 text-xl">
                  💰
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Thu nhập tốt & Ổn định</h3>
                  <p className="mt-1 text-slate-600">Mức lương cạnh tranh theo giờ. Hệ thống đối soát thanh toán minh bạch, chi trả đều đặn.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 text-xl">
                  🗓️
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Chủ động lịch trình</h3>
                  <p className="mt-1 text-slate-600">Bạn tự quyết định thời gian và khu vực làm việc phù hợp với lịch trình cá nhân.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 text-xl">
                  🎧
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Hỗ trợ đối tác 24/7</h3>
                  <p className="mt-1 text-slate-600">Đội ngũ điều phối viên chuyên nghiệp luôn sẵn sàng hỗ trợ bạn giải quyết mọi vấn đề phát sinh.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cột Phải: Form Card */}
          <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-slate-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Đăng ký ngay</h2>
              <p className="text-sm text-slate-500 mt-1">Điền thông tin bên dưới để bắt đầu quy trình xét duyệt hồ sơ trực tuyến.</p>
            </div>
            
            <PartnerApplicationForm />
          </div>
        </div>
      </div>
    </div>
  )
}
