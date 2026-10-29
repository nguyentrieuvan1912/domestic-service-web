import { useState } from 'react'
import type { FormEvent } from 'react'
import { submitApplication } from '../../../services/candidate.service'
import type { CandidateSource, CandidateGender } from '../../../data/mockAdminCandidates'

const areaOptions = ['Quận 1', 'Quận 3', 'Quận 7', 'Bình Thạnh', 'Tân Bình', 'Khác']
const sourceOptions: CandidateSource[] = ['Website CleanMaster', 'Facebook', 'Người quen giới thiệu', 'Khác']
const serviceOptions = ['Vệ sinh máy lạnh', 'Dọn dẹp nhà cửa', 'Nấu ăn', 'Chăm sóc trẻ em/người gia']
const yearOptions = Array.from({ length: 36 }, (_, i) => 2005 - i)

export default function PartnerApplicationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    identityCard: '',
    birthYear: 2000,
    gender: 'Nam' as CandidateGender,
    area: 'Quận 1',
    source: 'Website CleanMaster' as CandidateSource,
    services: [] as string[],
  })

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    identityCard: '',
    services: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const validate = () => {
    let isValid = true
    const newErrors = { fullName: '', email: '', phone: '', identityCard: '', services: '' }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên'
      isValid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
      isValid = false
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại'
      isValid = false
    }

    if (!formData.identityCard.trim()) {
      newErrors.identityCard = 'Vui lòng nhập số CCCD/CMND'
      isValid = false
    } else if (formData.identityCard.trim().length !== 12) {
      newErrors.identityCard = 'Số CCCD phải bao gồm đúng 12 chữ số'
      isValid = false
    }

    if (formData.services.length === 0) {
      newErrors.services = 'Vui lòng chọn ít nhất một dịch vụ'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleToggleService = (serviceName: string) => {
    setFormData((prev) => {
      const isSelected = prev.services.includes(serviceName)
      if (isSelected) {
        return { ...prev, services: prev.services.filter((s) => s !== serviceName) }
      }
      return { ...prev, services: [...prev.services, serviceName] }
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSuccessMessage('')

    if (!validate()) return

    setIsLoading(true)
    try {
      const response = await submitApplication(formData)
      if (response.success) {
        setSuccessMessage(response.message)
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          identityCard: '',
          birthYear: 2000,
          gender: 'Nam',
          area: 'Quận 1',
          source: 'Website CleanMaster',
          services: [],
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const inputClassName =
    'w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 transition-colors bg-white text-slate-900 disabled:bg-slate-50 disabled:text-slate-500'
  const labelClassName = 'block mb-1.5 text-sm font-semibold text-slate-700'

  return (
    <div className="w-full">
      {successMessage && (
        <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm font-semibold text-emerald-800 animate-fade-in">
          🎉 {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelClassName}>Họ và tên *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={inputClassName}
              placeholder="Nhập họ và tên đầy đủ"
              disabled={isLoading}
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.fullName}</p>}
          </div>

          <div>
            <label className={labelClassName}>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputClassName}
              placeholder="quoctoan@example.vn"
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>}
          </div>

          <div>
            <label className={labelClassName}>Số điện thoại *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={inputClassName}
              placeholder="0914 222 333"
              disabled={isLoading}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone}</p>}
          </div>

          <div className="md:col-span-2">
            <label className={labelClassName}>Số CCCD/CMND *</label>
            <input
              type="text"
              value={formData.identityCard}
              onChange={(e) => setFormData({ ...formData, identityCard: e.target.value })}
              className={inputClassName}
              placeholder="Gồm 12 chữ số"
              maxLength={12}
              disabled={isLoading}
            />
            {errors.identityCard && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.identityCard}</p>}
          </div>

          <div>
            <label className={labelClassName}>Năm sinh</label>
            <select
              value={formData.birthYear}
              onChange={(e) => setFormData({ ...formData, birthYear: parseInt(e.target.value) })}
              className={inputClassName}
              disabled={isLoading}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClassName}>Giới tính</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Nam' | 'Nữ' | 'Khác' })}
              className={inputClassName}
              disabled={isLoading}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div>
            <label className={labelClassName}>Khu vực hoạt động</label>
            <select
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className={inputClassName}
              disabled={isLoading}
            >
              {areaOptions.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClassName}>Nguồn biết đến</label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value as CandidateSource })}
              className={inputClassName}
              disabled={isLoading}
            >
              {sourceOptions.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClassName}>Dịch vụ đăng ký *</label>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {serviceOptions.map((service) => (
              <label
                key={service}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 hover:border-slate-300 transition"
              >
                <input
                  type="checkbox"
                  checked={formData.services.includes(service)}
                  onChange={() => handleToggleService(service)}
                  disabled={isLoading}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-slate-900"
                />
                <span className="text-sm font-medium text-slate-800">{service}</span>
              </label>
            ))}
          </div>
          {errors.services && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.services}</p>}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-slate-900 text-white py-3.5 text-sm font-bold shadow-md transition hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang xử lý...</span>
              </>
            ) : (
              'Gửi Hồ Sơ Đăng Ký'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
