import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { getActiveCatalogServices, getPartnerCaptcha, submitApplication } from '../../../services/candidate.service'
import type { PartnerCaptcha, PartnerCatalogService } from '../../../services/candidate.service'
import type { CandidateSource, CandidateGender } from '../../../data/mockAdminCandidates'

const areaOptions = ['Quận 1', 'Quận 3', 'Quận 7', 'Bình Thạnh', 'Tân Bình', 'Khác']
const sourceOptions: CandidateSource[] = ['Website CleanMaster', 'Facebook', 'Người quen giới thiệu', 'Khác']
const yearOptions = Array.from({ length: 36 }, (_, i) => 2005 - i)
const groupNames: Record<string, string> = {
  CLEANING: 'Dọn dẹp và vệ sinh nhà cửa',
  APPLIANCES: 'Vệ sinh và bảo dưỡng thiết bị',
  CARE: 'Chăm sóc gia đình và thú cưng',
  HOME_TASKS: 'Công việc gia đình và tiện ích',
}

export default function PartnerApplicationForm() {
  const [dynamicServices, setDynamicServices] = useState<PartnerCatalogService[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [servicesError, setServicesError] = useState('')
  const [servicesAttempt, setServicesAttempt] = useState(0)
  const [captcha, setCaptcha] = useState<PartnerCaptcha | null>(null)
  const [captchaCode, setCaptchaCode] = useState('')
  const [captchaLoading, setCaptchaLoading] = useState(true)
  const [captchaError, setCaptchaError] = useState('')
  const captchaSequence = useRef(0)
  const submitting = useRef(false)
  const refreshCaptcha = useCallback(async () => {
    const sequence = ++captchaSequence.current
    setCaptchaLoading(true)
    setCaptcha(null)
    setCaptchaCode('')
    setCaptchaError('')
    try {
      const challenge = await getPartnerCaptcha()
      if (sequence === captchaSequence.current) setCaptcha(challenge)
    } catch (cause) {
      if (sequence === captchaSequence.current) setCaptchaError(cause instanceof Error ? cause.message : 'Không thể tải CAPTCHA.')
    } finally {
      if (sequence === captchaSequence.current) setCaptchaLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    void getPartnerCaptcha().then(challenge => {
      if (active) setCaptcha(challenge)
    }).catch(cause => {
      if (active) setCaptchaError(cause instanceof Error ? cause.message : 'Không thể tải CAPTCHA.')
    }).finally(() => {
      if (active) setCaptchaLoading(false)
    })
    return () => { active = false }
  }, [])

  const groupKey = (service: PartnerCatalogService) => service.categoryGroup || service.categoryName
  const serviceGroups = Array.from(new Set(dynamicServices.map(groupKey)))
    .map(key => ({
      id: key,
      name: groupNames[key] || key,
      services: dynamicServices.filter(service => groupKey(service) === key)
        .sort((a, b) => a.categoryName.localeCompare(b.categoryName, 'vi') || a.name.localeCompare(b.name, 'vi')),
    })).sort((a, b) => a.name.localeCompare(b.name, 'vi'))

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
  const [errorMessage, setErrorMessage] = useState('')

  // 1. Fetch danh sách dịch vụ động từ catalog-service
  useEffect(() => {
    let active = true
    void getActiveCatalogServices()
      .then((services) => {
        if (active) {
          setDynamicServices(services)
          setServicesError('')
          setServicesLoading(false)
        }
      })
      .catch((cause) => {
        if (active) {
          setServicesLoading(false)
          setServicesError(cause instanceof Error ? cause.message : 'Không thể tải dịch vụ.')
        }
      })
    return () => {
      active = false
    }
  }, [servicesAttempt])

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
    if (submitting.current) return
    setSuccessMessage('')
    setErrorMessage('')

    if (!validate()) return
    if (!captcha || Date.parse(captcha.expiresAt) <= Date.now()) {
      setCaptchaError('CAPTCHA đã hết hạn hoặc chưa tải được. Vui lòng lấy mã mới.')
      return
    }
    if (!/^[a-zA-Z0-9]{6}$/.test(captchaCode.trim())) {
      setCaptchaError('Vui lòng nhập đủ 6 ký tự trong ảnh.')
      return
    }

    submitting.current = true
    setIsLoading(true)
    try {
      const response = await submitApplication({ ...formData, captchaId: captcha.id, captchaCode: captchaCode.trim() })
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
      setErrorMessage(error instanceof Error ? error.message : 'Đã có lỗi xảy ra khi nộp hồ sơ.')
    } finally {
      await refreshCaptcha()
      submitting.current = false
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

      {errorMessage && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm font-semibold text-red-800 animate-fade-in">
          ⚠️ {errorMessage}
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
          {servicesLoading ? (
            <div className="py-4 text-xs text-slate-500 flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Đang tải danh mục dịch vụ từ hệ thống...</span>
            </div>
          ) : servicesError ? (
            <p role="alert" className="text-sm text-red-600">{servicesError} <button type="button" onClick={() => { setServicesLoading(true); setServicesAttempt(value => value + 1) }} className="underline">Tải lại dịch vụ</button></p>
          ) : dynamicServices.length === 0 ? (
            <p className="text-sm text-slate-500">Hiện chưa có dịch vụ đang nhận đăng ký.</p>
          ) : (
            <div className="mt-2 space-y-4">
              {serviceGroups.map(group => <fieldset key={group.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <legend className="px-2 text-sm font-bold text-emerald-800">{group.name}</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {group.services.map((service) => (
                <label
                  key={service.id}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 hover:border-slate-300 transition"
                >
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service.name)}
                    onChange={() => handleToggleService(service.name)}
                    disabled={isLoading}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-slate-900"
                  />
                  <span className="text-sm font-medium text-slate-800">{service.name}</span>
                </label>
              ))}
                </div>
              </fieldset>)}
            </div>
          )}
          {errors.services && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.services}</p>}
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <label htmlFor="partner-captcha" className={labelClassName}>Mã xác nhận CAPTCHA *</label>
          <p id="captcha-help" className="text-xs text-slate-500">Nhập 6 ký tự trong ảnh, không phân biệt chữ hoa và chữ thường. Mã có hiệu lực 5 phút.</p>
          <div className="flex flex-wrap items-center gap-3">
            {captchaLoading ? <p role="status" className="text-sm text-slate-500">Đang tải mã xác nhận...</p> : captcha && <img src={captcha.image} alt="Ảnh mã CAPTCHA gồm 6 ký tự cần nhập bên dưới" width={240} height={80} className="rounded-lg border border-slate-200" />}
            <button type="button" disabled={isLoading || captchaLoading} onClick={() => void refreshCaptcha()} className="text-sm font-semibold text-emerald-700 underline disabled:opacity-50">Lấy mã mới</button>
          </div>
          <input id="partner-captcha" aria-describedby="captcha-help" aria-invalid={!!captchaError} required maxLength={6} autoComplete="off" autoCapitalize="characters" spellCheck={false} value={captchaCode} onChange={event => { setCaptchaCode(event.target.value); setCaptchaError('') }} disabled={isLoading || captchaLoading || !captcha} className={`${inputClassName} uppercase tracking-widest`} placeholder="Nhập mã trong ảnh" />
          {captchaError && <p role="alert" className="text-sm text-red-600">{captchaError}</p>}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || captchaLoading || !captcha || servicesLoading || !!servicesError || dynamicServices.length === 0}
            className="w-full rounded-xl bg-slate-900 text-white py-3.5 text-sm font-bold shadow-md transition hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang gửi hồ sơ...</span>
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
