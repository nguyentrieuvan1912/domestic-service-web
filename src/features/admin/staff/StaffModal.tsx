import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Service } from '../../../data/mockAdminServices'
import type { Staff, StaffLevel, StaffStatus, StaffViolation } from '../../../data/mockAdminStaff'
import { staffLevelFees, staffLevelLabels } from '../../../data/mockAdminStaff'

type StaffModalProps = {
  staff: Staff | null
  services: Service[]
  onClose: () => void
  onSave: (staff: Staff) => void
}

type StaffTab = 'profile' | 'skills' | 'statistics' | 'violations'

const areaOptions = [
  { id: 'quan-1', name: 'Quận 1' },
  { id: 'quan-2', name: 'Quận 2' },
  { id: 'quan-3', name: 'Quận 3' },
  { id: 'quan-7', name: 'Quận 7' },
  { id: 'quan-tan-binh', name: 'Quận Tân Bình' },
  { id: 'quan-binh-thanh', name: 'Quận Bình Thạnh' },
]

const tabs: { id: StaffTab; label: string }[] = [
  { id: 'profile', label: 'Hồ sơ & Trạng thái' },
  { id: 'skills', label: 'Kỹ năng & Khu vực' },
  { id: 'statistics', label: 'Thống kê' },
  { id: 'violations', label: 'Vi phạm & Kỷ luật' },
]

const inputClassName =
  'w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 transition-colors disabled:bg-slate-100 disabled:text-slate-500'
const labelClassName = 'block mb-1.5 text-sm font-semibold text-slate-700'

const createDraft = (staff: Staff | null, services: Service[]): Staff =>
  staff
    ? { ...staff, violations: [...(staff.violations || [])] }
    : {
        id: `staff-${Date.now()}`,
        fullName: '',
        phone: '',
        identityCard: '',
        status: 'ACTIVE',
        statusNote: '',
        rank: 'INTERN',
        baseFee: staffLevelFees['INTERN'],
        joinDate: new Date().toLocaleDateString('vi-VN'),
        income: 0,
        averageRating: 5.0,
        totalTrips: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        skillIds: services.slice(0, 2).map((service) => service.id),
        areaIds: ['quan-1', 'quan-3'],
        violations: [],
      }

export default function StaffModal({
  staff,
  services,
  onClose,
  onSave,
}: StaffModalProps) {
  const isNew = !staff
  const [draft, setDraft] = useState<Staff>(() => createDraft(staff, services))
  const [activeTab, setActiveTab] = useState<StaffTab>('profile')

  // Form states for new violation
  const [violationReason, setViolationReason] = useState('Hủy lịch phút chót')
  const [violationPenalty, setViolationPenalty] = useState('')

  const toggleSkill = (serviceId: string) => {
    setDraft((prev) => ({
      ...prev,
      skillIds: prev.skillIds.includes(serviceId)
        ? prev.skillIds.filter((id) => id !== serviceId)
        : [...prev.skillIds, serviceId],
    }))
  }

  const toggleArea = (areaId: string) => {
    setDraft((prev) => ({
      ...prev,
      areaIds: prev.areaIds.includes(areaId)
        ? prev.areaIds.filter((id) => id !== areaId)
        : [...prev.areaIds, areaId],
    }))
  }

  const updateRank = (rank: StaffLevel) => {
    setDraft((prev) => ({
      ...prev,
      rank,
      baseFee: staffLevelFees[rank],
    }))
  }

  const updateStatus = (status: StaffStatus) => {
    setDraft((prev) => ({
      ...prev,
      status,
      statusNote: status === 'ACTIVE' ? '' : prev.statusNote,
    }))
  }

  const handleAddViolation = (e: FormEvent) => {
    e.preventDefault()
    if (!violationPenalty.trim()) return

    const newViolation: StaffViolation = {
      id: `v-${Date.now()}`,
      date: new Date().toLocaleDateString('vi-VN'),
      reason: violationReason,
      penalty: violationPenalty.trim(),
    }

    setDraft((prev) => ({
      ...prev,
      violations: [newViolation, ...prev.violations],
    }))
    setViolationPenalty('')
  }

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    onSave(draft)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        role="presentation"
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      />

      {/* Slide-over Panel */}
      <section
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-white shadow-2xl h-screen"
        role="dialog"
        aria-modal="true"
        aria-labelledby="staff-modal-title"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Hồ sơ nhân viên chính thức
            </p>
            <h2 id="staff-modal-title" className="mt-1 text-xl font-bold text-slate-950">
              {isNew ? 'Thêm nhân viên mới' : draft.fullName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition"
          >
            ×
          </button>
        </header>

        {/* 4 Internal Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-white px-6 pt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
              {tab.id === 'violations' && draft.violations.length > 0 && (
                <span className="ml-1.5 rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-700 font-bold">
                  {draft.violations.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Form & Tab Content Body */}
        <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* TAB 1: Hồ sơ & Trạng thái */}
            {activeTab === 'profile' && (
              <section className="space-y-5">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Thông tin cá nhân & Trạng thái hoạt động
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelClassName}>Họ và tên</label>
                    <input
                      required
                      value={draft.fullName}
                      onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
                      className={inputClassName}
                      placeholder="Nhập họ và tên đầy đủ"
                    />
                  </div>

                  <div>
                    <label className={labelClassName}>Số điện thoại</label>
                    <input
                      required
                      value={draft.phone}
                      onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                      className={inputClassName}
                      placeholder="09xx xxx xxx"
                    />
                  </div>

                  <div>
                    <label className={labelClassName}>Số CCCD / Định danh</label>
                    <input
                      required
                      value={draft.identityCard}
                      onChange={(e) => setDraft({ ...draft, identityCard: e.target.value })}
                      className={inputClassName}
                      placeholder="079xxx..."
                    />
                  </div>

                  <div>
                    <label className={labelClassName}>Cấp bậc (Rank)</label>
                    {isNew ? (
                      <select
                        value={draft.rank}
                        onChange={(e) => updateRank(e.target.value as StaffLevel)}
                        className={inputClassName}
                      >
                        <option value="INTERN">Thực tập sinh</option>
                        <option value="STANDARD">Tiêu chuẩn</option>
                        <option value="PROFESSIONAL">Chuyên nghiệp</option>
                      </select>
                    ) : (
                      <input
                        readOnly
                        value={staffLevelLabels[draft.rank]}
                        className={`${inputClassName} bg-slate-50 font-semibold`}
                      />
                    )}
                  </div>

                  <div>
                    <label className={labelClassName}>Mức phí cơ bản (Base Fee)</label>
                    <input
                      readOnly
                      value={`${new Intl.NumberFormat('vi-VN').format(draft.baseFee)} VNĐ/giờ`}
                      className={`${inputClassName} bg-slate-50 font-semibold text-emerald-700`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClassName}>Ngày tham gia hệ thống</label>
                    <input
                      readOnly
                      value={draft.joinDate}
                      className={`${inputClassName} bg-slate-50`}
                    />
                  </div>

                  {/* Form Select thay đổi Trạng thái */}
                  <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                    <label className={labelClassName}>Trạng thái hoạt động</label>
                    <select
                      value={draft.status}
                      onChange={(e) => updateStatus(e.target.value as StaffStatus)}
                      className={`${inputClassName} font-semibold`}
                    >
                      <option value="ACTIVE">🟢 ACTIVE - Đang hoạt động</option>
                      <option value="INACTIVE">🟡 INACTIVE - Tạm ngưng</option>
                      <option value="LOCKED">🔴 LOCKED - Bị khóa / Hạn chế</option>
                    </select>
                  </div>

                  {draft.status !== 'ACTIVE' && (
                    <div className="sm:col-span-2">
                      <label className={labelClassName}>Ghi chú lý do trạng thái</label>
                      <textarea
                        required
                        value={draft.statusNote}
                        onChange={(e) => setDraft({ ...draft, statusNote: e.target.value })}
                        rows={3}
                        className={`${inputClassName} resize-none`}
                        placeholder="Nhập lý do tạm ngưng hoặc hình thức khóa tài khoản..."
                      />
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* TAB 2: Kỹ năng & Khu vực */}
            {activeTab === 'skills' && (
              <section className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Dịch vụ được cấp quyền làm việc
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Tích chọn các dịch vụ nhân viên đã hoàn thành đào tạo và đủ điều kiện thực hiện.
                  </p>

                  <div className="mt-4 space-y-2.5">
                    {services.map((service) => {
                      const isChecked = draft.skillIds.includes(service.id)
                      return (
                        <label
                          key={service.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition ${
                            isChecked
                              ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSkill(service.id)}
                            className="mt-1 h-4 w-4 rounded accent-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="block font-semibold text-slate-900 text-sm">
                              {service.name}
                            </span>
                            <span className="block text-xs text-slate-500 mt-0.5">
                              {service.categoryName}
                            </span>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-5">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Khu vực hoạt động
                  </h3>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {areaOptions.map((area) => {
                      const isChecked = draft.areaIds.includes(area.id)
                      return (
                        <label
                          key={area.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm font-medium transition ${
                            isChecked
                              ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900'
                              : 'border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleArea(area.id)}
                            className="h-4 w-4 rounded accent-emerald-600"
                          />
                          {area.name}
                        </label>
                      )
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* TAB 3: Thống kê */}
            {activeTab === 'statistics' && (
              <section className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Chỉ số hiệu suất & Thu nhập
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-emerald-50/50 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                      Thu nhập tạm tính
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-emerald-800">
                      {new Intl.NumberFormat('vi-VN').format(draft.income)}đ
                    </p>
                    <p className="mt-1 text-xs text-emerald-600">Ánh xạ từ cấp bậc & đơn giá</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-amber-50/50 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                      Đánh giá trung bình
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-amber-800">
                      ★ {draft.averageRating.toFixed(1)} / 5.0
                    </p>
                    <p className="mt-1 text-xs text-amber-600">Dựa trên phản hồi người dùng</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Chuyến hoàn thành
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {draft.completedBookings}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Tổng chuyến đi hoàn tất</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Tổng số chuyến đã nhận
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{draft.totalTrips}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Hủy: {draft.cancelledBookings} chuyến
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* TAB 4: Vi phạm & Kỷ luật */}
            {activeTab === 'violations' && (
              <section className="space-y-6">
                {/* Form Ghi nhận vi phạm mới */}
                <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-4 shadow-sm">
                  <h4 className="text-sm font-bold text-rose-800 flex items-center gap-1.5">
                    <span>⚠️</span> Ghi nhận vi phạm mới
                  </h4>

                  <div className="mt-3 space-y-3">
                    <div>
                      <label className={labelClassName}>Lý do vi phạm</label>
                      <select
                        value={violationReason}
                        onChange={(e) => setViolationReason(e.target.value)}
                        className={inputClassName}
                      >
                        <option>Hủy lịch phút chót</option>
                        <option>Khách phàn nàn về thái độ</option>
                        <option>Vắng mặt không báo trước</option>
                        <option>Vi phạm quy trình an toàn</option>
                        <option>Đi trễ trên 30 phút</option>
                        <option>Lý do khác</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClassName}>Hình thức xử lý / Chế tài</label>
                      <input
                        required
                        value={violationPenalty}
                        onChange={(e) => setViolationPenalty(e.target.value)}
                        className={inputClassName}
                        placeholder="Ví dụ: Cảnh cáo bằng văn bản, Trừ 200.000 VNĐ..."
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddViolation}
                      disabled={!violationPenalty.trim()}
                      className="w-full rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
                    >
                      + Ghi nhận vi phạm
                    </button>
                  </div>
                </div>

                {/* Danh sách vi phạm đã có */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Lịch sử vi phạm ({draft.violations.length})
                  </h3>

                  <div className="mt-4 space-y-3">
                    {draft.violations.length === 0 ? (
                      <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">
                        Chưa có lịch sử vi phạm nào được ghi nhận.
                      </p>
                    ) : (
                      draft.violations.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-rose-700 text-sm">
                              {item.reason}
                            </span>
                            <span className="text-xs text-slate-400">{item.date}</span>
                          </div>
                          <p className="mt-2 text-xs text-slate-600">
                            <strong className="text-slate-700">Hình thức xử lý:</strong>{' '}
                            {item.penalty}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Footer (Sticky bottom) */}
          <footer className="sticky bottom-0 z-10 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              Lưu thay đổi
            </button>
          </footer>
        </form>
      </section>
    </>
  )
}
