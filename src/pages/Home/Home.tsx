import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePromotions } from '../../hooks/usePromotions'
import { servicePackages as templates } from '../../data/services'
import { type CatalogPage } from '../../api/catalog'
import { webCatalogView } from '../../api/catalog-view'
import { useCatalogResource } from '../../hooks/useCatalogResource'
import { blogCategories as blogCategoryLabels, publicBlog, type BlogSummary } from '../../api/blog'
import CatalogState from '../../components/common/CatalogState'

const SLIDES = [
  { id: 'section-hero', label: 'Khởi đầu' },
  { id: 'section-customer', label: 'Khách hàng' },
  { id: 'section-staff', label: 'Đối tác Staff' },
  { id: 'section-services', label: 'Dịch vụ' },
  { id: 'section-process', label: 'Quy trình' },
  { id: 'section-blog', label: 'Blog & Ưu đãi' },
  { id: 'section-download', label: 'Tải ứng dụng' },
] as const

const SLIDE_BG = {
  hero: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1800&q=80',
  customer: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=80',
  staff: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1800&q=80',
  services: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80',
  process: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80',
  blog: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1800&q=80',
  download: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80',
}

const customerFeatures = [
  { code: 'AI', title: 'Trợ lý AI Chat & Voice 24/7', desc: 'Nhắn tin hoặc nói trực tiếp để gợi ý gói theo diện tích, so sánh giá và giải đáp chính sách.' },
  { code: '⚡', title: 'Đặt lại nhanh 1 chạm', desc: 'Chọn lại dịch vụ, khung giờ và nhân viên yêu thích từ đơn cũ chỉ trong vài giây.' },
  { code: '☎', title: 'Chat & Gọi Video bảo mật', desc: 'Liên hệ nhân viên ngay trong đơn hàng qua LiveKit mà không cần lộ số điện thoại.' },
  { code: '💳', title: 'Ví CleanMaster & Voucher', desc: 'Thanh toán tiền mặt, Ví hoặc QR/payOS với mã khuyến mãi tự động kiểm tra điều kiện.' },
  { code: '📍', title: 'Sổ địa chỉ GPS & Realtime', desc: 'Lưu nhiều địa chỉ, định vị chuẩn xác và theo dõi tiến độ từng bước thực hiện.' },
  { code: '☾', title: 'Sáng / Tối & 6 màu nền', desc: 'Tùy biến giao diện dịu mắt theo sở thích ngay trong phần Tài khoản.' },
]

const staffFeatures = [
  { code: '📅', title: 'Đăng ký lịch làm việc theo tuần', desc: 'Chủ động khai báo khung giờ rảnh từng ngày để hệ thống chỉ ghép ca phù hợp.' },
  { code: '📍', title: 'Quản lý tối đa 30 khu vực TP.HCM', desc: 'Chọn phường, xã, đặc khu thuận tiện di chuyển để tối ưu thời gian mỗi ngày.' },
  { code: '⇄', title: 'Nhận ca Chế độ A & B công bằng', desc: 'Phản hồi đơn khách chọn đích danh (5 phút) hoặc lọc ca từ hệ thống điều phối.' },
  { code: '📷', title: 'Minh chứng ca làm rõ ràng', desc: 'Cập nhật trạng thái di chuyển, thực hiện và lưu ảnh minh chứng bảo vệ quyền lợi.' },
  { code: '₫', title: 'Ví thu nhập & Rút tiền payOS', desc: 'Quyết toán minh bạch sau mỗi ca, rút tiền tự động về tài khoản ngân hàng đã xác minh.' },
  { code: '★', title: 'Hồ sơ xác minh & Huy hiệu 5★', desc: 'Xác thực CCCD, tích lũy huy hiệu khen ngợi để tăng tỷ lệ được khách đặt lại.' },
]

const processSteps = [
  { number: '01', title: 'Chọn dịch vụ & diện tích', description: 'Chọn gói phù hợp hoặc nhờ Trợ lý AI gợi ý nhanh.' },
  { number: '02', title: 'Chọn giờ & địa chỉ GPS', description: 'Định vị chính xác từ sổ địa chỉ đã lưu.' },
  { number: '03', title: 'Chọn Staff hoặc ghép tự động', description: 'Nhân viên xác nhận trong 5 phút hoặc hệ thống tự ghép.' },
  { number: '04', title: 'Thanh toán & ưu đãi', description: 'Tiền mặt, Ví CleanMaster hoặc QR/payOS minh bạch.' },
  { number: '05', title: 'Theo dõi & Chat/Video', description: 'Cập nhật realtime và trao đổi an toàn trong đơn.' },
  { number: '06', title: 'Đánh giá & Đặt lại nhanh', description: 'Chấm điểm 5★ và đặt lại nhân viên ưng ý.' },
]

const benefits = [
  { mark: '✓', title: 'Staff xác minh CCCD', desc: 'Tuyển chọn kỹ lưỡng, đào tạo quy trình chuẩn trước khi cấp tài khoản.' },
  { mark: 'AI', title: 'AI tư vấn minh bạch', desc: 'Hỗ trợ chọn gói 24/7, không tự ý quyết định giá hay thanh toán thay bạn.' },
  { mark: '₫', title: 'Giá & Đối soát rõ ràng', desc: 'Bảng giá hiển thị trước khi đặt, hỗ trợ ví điện tử & payOS an toàn.' },
]

function ArrowIcon() {
  return <span aria-hidden="true" className="text-lg transition-transform duration-200 group-hover:translate-x-1">→</span>
}

function MiniQrMatrix() {
  return (
    <div className="flex h-36 w-36 flex-col items-center justify-center rounded-2xl bg-white p-3.5 shadow-2xl ring-1 ring-white/20">
      <div className="grid h-24 w-24 grid-cols-7 grid-rows-7 gap-0.5 rounded-lg bg-slate-950 p-2">
        {Array.from({ length: 49 }, (_, i) => {
          const r = Math.floor(i / 7)
          const c = i % 7
          const isCorner = (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2)
          const filled = isCorner || (i * 11 + r * 3 + c) % 3 === 0
          return <span key={i} className={`rounded-[1px] ${filled ? 'bg-white' : 'bg-slate-800'}`} />
        })}
      </div>
      <span className="mt-2 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">CleanMaster App</span>
    </div>
  )
}

function ScrollCue({
  nextLabel,
  onNext,
  dark = false,
}: {
  nextLabel: string
  onNext: () => void
  dark?: boolean
}) {
  return (
    <div className="pointer-events-auto absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 lg:block">
      <button
        type="button"
        onClick={onNext}
        className={`group flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-xs font-bold shadow-md backdrop-blur-md transition duration-200 hover:-translate-y-0.5 ${
          dark
            ? 'border-white/25 bg-slate-950/60 text-emerald-200 hover:border-emerald-300/60 hover:bg-slate-950/80'
            : 'border-emerald-200/90 bg-white/90 text-emerald-800 hover:border-emerald-400 hover:bg-white'
        }`}
      >
        {/* Animated mouse outline */}
        <span
          aria-hidden="true"
          className={`flex h-5 w-3.5 items-start justify-center rounded-full border p-[2px] ${
            dark ? 'border-emerald-300/80' : 'border-emerald-600'
          }`}
        >
          <span
            className={`cm-wheel-dot h-1.5 w-1 rounded-full ${
              dark ? 'bg-emerald-300' : 'bg-emerald-600'
            }`}
          />
        </span>
        <span>Cuộn tiếp: {nextLabel}</span>
        <span aria-hidden="true" className="flex flex-col leading-[0.55]">
          <span className="cm-chevron-1 text-[11px]">⌄</span>
          <span className="cm-chevron-2 text-[11px]">⌄</span>
        </span>
      </button>
    </div>
  )
}

interface SlideSectionProps {
  id: string
  active: boolean
  bgUrl: string
  overlayClass: string
  nextLabel?: string
  onNext?: () => void
  darkCue?: boolean
  children: ReactNode
}

function SlideSection({
  id,
  active,
  bgUrl,
  overlayClass,
  nextLabel,
  onNext,
  darkCue = false,
  children,
}: SlideSectionProps) {
  return (
    <section
      id={id}
      className={`cm-slide-stage relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden lg:h-[calc(100vh-73px)] lg:min-h-0 ${
        active ? 'cm-slide-active' : ''
      }`}
    >
      <img
        src={bgUrl}
        alt=""
        aria-hidden="true"
        className="cm-slide-bg pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 ${overlayClass}`} />
      <div className="cm-slide-shell mx-auto w-full max-w-7xl px-4 py-12 sm:px-5 sm:py-14 lg:px-8 lg:pb-14 lg:pt-8">
        {children}
      </div>
      {nextLabel && onNext && <ScrollCue nextLabel={nextLabel} onNext={onNext} dark={darkCue} />}
    </section>
  )
}

function getHeaderOffset() {
  if (typeof document === 'undefined') return 73
  const header = document.querySelector('header')
  return header ? Math.round(header.getBoundingClientRect().height) : window.innerWidth < 1024 ? 64 : 73
}
const TRANSITION_DURATION_MS = 920

function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
}

export default function Home() {
  const [activeSlide, setActiveSlide] = useState<string>(SLIDES[0].id)
  const animFrameRef = useRef<number | null>(null)
  const isAnimatingRef = useRef(false)
  const wheelLockUntilRef = useRef(0)

  const promotionResult = usePromotions()
  const { promotions } = promotionResult
  const result = useCatalogResource<CatalogPage>('/services?size=100')
  const servicePackages = templates.flatMap((template) => {
    const item = result.data?.items.find((service) => service.code === template.code)
    return item ? [webCatalogView(item)] : []
  })

  const [latestPosts, setLatestPosts] = useState<BlogSummary[]>([])
  useEffect(() => {
    const controller = new AbortController()
    void publicBlog<BlogSummary[]>('', controller.signal)
      .then((data) => setLatestPosts(data.slice(0, 3)))
      .catch(() => undefined)
    return () => controller.abort()
  }, [])

  const smoothScrollToY = useCallback((targetY: number, duration = TRANSITION_DURATION_MS) => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const clampedTarget = Math.min(maxScroll, Math.max(0, targetY))
    const startY = window.scrollY
    const distance = clampedTarget - startY

    if (Math.abs(distance) < 2) {
      isAnimatingRef.current = false
      return
    }

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      window.scrollTo(0, clampedTarget)
      isAnimatingRef.current = false
      return
    }

    isAnimatingRef.current = true
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / duration)
      const eased = easeInOutQuart(progress)
      window.scrollTo(0, startY + distance * eased)
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step)
      } else {
        animFrameRef.current = null
        isAnimatingRef.current = false
      }
    }

    animFrameRef.current = requestAnimationFrame(step)
  }, [])

  const scrollToSlide = useCallback(
    (id: string) => {
      const target = document.getElementById(id)
      if (!target) return
      setActiveSlide(id)
      const targetY = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset()
      wheelLockUntilRef.current = performance.now() + TRANSITION_DURATION_MS + 120
      smoothScrollToY(targetY)
    },
    [smoothScrollToY],
  )

  // Silky full-page wheel & keyboard slide navigation on desktop
  useEffect(() => {
    const getStopPositions = () => {
      const headerOffset = getHeaderOffset()
      const stops: Array<{ id: string; y: number }> = []
      SLIDES.forEach((slide) => {
        const el = document.getElementById(slide.id)
        if (el) {
          stops.push({
            id: slide.id,
            y: Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - headerOffset)),
          })
        }
      })
      const footer = document.querySelector('footer')
      if (footer) {
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
        stops.push({ id: '__footer__', y: maxScroll })
      }
      return stops
    }

    const findNearestStopIndex = (stops: Array<{ id: string; y: number }>) => {
      const currentY = window.scrollY
      let bestIdx = 0
      let bestDiff = Infinity
      stops.forEach((stop, idx) => {
        const diff = Math.abs(stop.y - currentY)
        if (diff < bestDiff) {
          bestDiff = diff
          bestIdx = idx
        }
      })
      return bestIdx
    }

    const navigateByDelta = (direction: 1 | -1) => {
      const now = performance.now()
      if (isAnimatingRef.current || now < wheelLockUntilRef.current) return
      const stops = getStopPositions()
      if (stops.length === 0) return
      const currentIdx = findNearestStopIndex(stops)
      const nextIdx = Math.min(stops.length - 1, Math.max(0, currentIdx + direction))
      if (nextIdx === currentIdx) return

      const nextStop = stops[nextIdx]
      wheelLockUntilRef.current = now + TRANSITION_DURATION_MS + 160
      if (nextStop.id !== '__footer__') {
        setActiveSlide(nextStop.id)
      }
      smoothScrollToY(nextStop.y)
    }

    const onWheel = (event: WheelEvent) => {
      if (window.innerWidth < 1024) return
      if (event.ctrlKey || event.metaKey) return
      if (Math.abs(event.deltaY) < 8) return
      event.preventDefault()
      navigateByDelta(event.deltaY > 0 ? 1 : -1)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (window.innerWidth < 1024) return
      const tag = (event.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        event.preventDefault()
        navigateByDelta(1)
      } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault()
        navigateByDelta(-1)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current)
    }
  }, [smoothScrollToY])

  // Track the active full-screen section so animations replay crisply on every transition
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const sections = SLIDES.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => Boolean(el))
    const observer = new IntersectionObserver(
      (entries) => {
        let bestId = ''
        let bestRatio = 0
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio
            bestId = entry.target.id
          }
        })
        const minRatio = window.innerWidth < 1024 ? 0.15 : 0.45
        if (bestId && bestRatio >= minRatio) {
          setActiveSlide(bestId)
        }
      },
      { threshold: [0.15, 0.3, 0.45, 0.65] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const activeIndex = Math.max(
    0,
    SLIDES.findIndex((s) => s.id === activeSlide),
  )
  const progressPercent = ((activeIndex + 1) / SLIDES.length) * 100

  return (
    <div className="relative bg-white">
      {/* TOP STORY PROGRESS BAR */}
      <div aria-hidden="true" className="fixed left-0 right-0 top-16 z-40 h-1 bg-slate-200/40 lg:top-[73px]">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-[width] duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* FLOATING RIGHT-SIDE SECTION NAVIGATOR (DESKTOP) */}
      <nav
        aria-label="Điều hướng các phần trang chủ"
        className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2.5 lg:flex"
      >
        <div className="flex flex-col items-center gap-2 rounded-full border border-emerald-200/70 bg-white/85 px-2 py-3 shadow-lg shadow-slate-900/10 backdrop-blur-md">
          {SLIDES.map((slide) => {
            const isCurrent = activeSlide === slide.id
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => scrollToSlide(slide.id)}
                aria-label={`Chuyển đến phần ${slide.label}`}
                aria-current={isCurrent ? 'step' : undefined}
                className="group relative flex h-5 w-5 items-center justify-center focus:outline-none"
              >
                <span className="pointer-events-none absolute right-8 whitespace-nowrap rounded-full bg-slate-950/90 px-3 py-1 text-xs font-bold text-white opacity-0 shadow-md transition duration-200 group-hover:opacity-100">
                  {slide.label}
                </span>
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'h-5 w-2 bg-emerald-600 shadow-sm shadow-emerald-600/40'
                      : 'h-2 w-2 bg-slate-300 group-hover:bg-emerald-400'
                  }`}
                />
              </button>
            )
          })}
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            disabled={activeIndex <= 0}
            onClick={() => activeIndex > 0 && scrollToSlide(SLIDES[activeIndex - 1].id)}
            aria-label="Phần trước"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/85 text-xs font-black text-slate-700 shadow backdrop-blur transition hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-35"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={activeIndex >= SLIDES.length - 1}
            onClick={() => activeIndex < SLIDES.length - 1 && scrollToSlide(SLIDES[activeIndex + 1].id)}
            aria-label="Phần tiếp theo"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/85 text-xs font-black text-slate-700 shadow backdrop-blur transition hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-35"
          >
            ↓
          </button>
        </div>
      </nav>

      {/* ===================================================================== */}
      {/* PHẦN 1: HERO — KHỞI ĐẦU                                               */}
      {/* ===================================================================== */}
      <SlideSection
        id="section-hero"
        active={activeSlide === 'section-hero'}
        bgUrl={SLIDE_BG.hero}
        overlayClass="bg-gradient-to-r from-[#f3faf7]/96 via-[#f3faf7]/90 to-[#f3faf7]/72"
        nextLabel="Trải nghiệm Khách hàng"
        onNext={() => scrollToSlide('section-customer')}
      >
        <div className="grid items-center gap-10 lg:grid-cols-[1.06fr_0.94fr]">
          <div className="cm-enter-left max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/95 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Nền tảng chăm sóc tổ ấm thông minh
            </p>
            <h1 className="mt-4 text-3xl font-black leading-[1.1] tracking-tight text-slate-950 sm:mt-5 sm:text-5xl lg:text-6xl">
              Nhà sạch hơn,
              <br />
              <span className="text-emerald-600">sống nhẹ nhàng hơn.</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-700 sm:mt-5 sm:text-lg sm:leading-8">
              CleanMaster kết nối gia đình với đội ngũ nhân viên xác minh danh tính, tích hợp Trợ lý AI giọng nói 24/7, Chat/Gọi Video bảo mật và đối soát payOS minh bạch trên Mobile App.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row">
              <Link
                to="/download"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 sm:text-base"
              >
                Tải ứng dụng ngay <ArrowIcon />
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/95 px-6 py-3.5 text-sm font-bold text-slate-800 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-700 sm:text-base"
              >
                Đọc Blog & Mẹo hay
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-700 sm:mt-7 sm:gap-x-6 sm:text-sm">
              <span>✓ Staff xác minh CCCD</span>
              <span>✓ AI Chat & Voice 24/7</span>
              <span>✓ Web Blog mở không cần đăng nhập</span>
            </div>
          </div>

          <div className="cm-enter-right relative mx-auto w-full max-w-lg lg:ml-auto" style={{ transitionDelay: '120ms' }}>
            <div className="cm-float-delayed absolute bottom-2 left-2 z-10 rounded-2xl border border-emerald-100 bg-white/95 px-3.5 py-2.5 shadow-xl shadow-slate-900/10 backdrop-blur sm:-bottom-5 sm:-left-8 sm:p-4">
              <p className="text-[11px] font-semibold text-slate-500 sm:text-xs">Khách hàng hài lòng</p>
              <p className="mt-0.5 text-xl font-black text-slate-900 sm:mt-1 sm:text-2xl">
                98% <span className="text-xs font-bold text-amber-500 sm:text-sm">★ 4.9</span>
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl rounded-bl-[3.5rem] border-4 border-white shadow-2xl shadow-emerald-950/15 sm:rounded-[2rem] sm:rounded-bl-[5rem] sm:border-8">
              <img
                src={SLIDE_BG.hero}
                alt="Không gian bếp sạch sẽ và sáng thoáng"
                className="aspect-[4/3.4] w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>
            <div className="cm-float-slow absolute right-2 top-2 rounded-2xl bg-slate-950/95 px-3.5 py-2.5 text-white shadow-xl sm:-right-5 sm:-top-5 sm:px-4 sm:py-3">
              <p className="text-[11px] text-emerald-300 sm:text-xs">Trợ lý AI & Điều phối</p>
              <p className="mt-0.5 text-xs font-bold sm:mt-1 sm:text-sm">Đúng người, đúng khu vực</p>
            </div>
          </div>
        </div>
      </SlideSection>

      {/* ===================================================================== */}
      {/* PHẦN 2: DÀNH RIÊNG CHO KHÁCH HÀNG (EMERALD GLASS & WARM HOME)         */}
      {/* ===================================================================== */}
      <SlideSection
        id="section-customer"
        active={activeSlide === 'section-customer'}
        bgUrl={SLIDE_BG.customer}
        overlayClass="bg-gradient-to-br from-emerald-950/82 via-emerald-900/74 to-teal-950/84"
        nextLabel="Đối tác Nhân viên"
        onNext={() => scrollToSlide('section-staff')}
        darkCue
      >
        <div className="grid items-center gap-8 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="cm-enter-left text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-400/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-200 backdrop-blur">
              Trải nghiệm Khách hàng
            </span>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-[2.5rem]">
              Chăm sóc tổ ấm nhẹ tênh,
              <br />
              <span className="text-emerald-300">an tâm từng khoảnh khắc.</span>
            </h2>
            <p className="mt-3.5 text-sm leading-6 text-emerald-50/85 sm:text-base sm:leading-7">
              Giao diện Khách hàng trên Mobile App được thiết kế ấm áp, trực quan giúp bạn đặt dịch vụ, nói chuyện với Trợ lý AI và theo dõi tiến độ dọn nhà chỉ bằng vài chạm.
            </p>

            <div className="mt-6 rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md sm:p-5">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400 text-sm font-black text-emerald-950">
                    KH
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-white">Không gian Khách hàng</p>
                    <p className="text-xs text-emerald-200">Đặt lịch • AI Voice • Chat & Video</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-200">
                  Mobile App
                </span>
              </div>
              <div className="mt-3.5 grid grid-cols-3 gap-2.5 text-center">
                <div className="rounded-2xl bg-white/10 p-2.5">
                  <p className="text-base font-black text-emerald-300 sm:text-lg">24/7</p>
                  <p className="mt-0.5 text-[11px] text-emerald-50/80">AI Giọng nói</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-2.5">
                  <p className="text-base font-black text-emerald-300 sm:text-lg">5 phút</p>
                  <p className="mt-0.5 text-[11px] text-emerald-50/80">Xác nhận Staff</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-2.5">
                  <p className="text-base font-black text-emerald-300 sm:text-lg">1 chạm</p>
                  <p className="mt-0.5 text-[11px] text-emerald-50/80">Đặt lại nhanh</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/download"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-emerald-800 shadow-lg transition hover:bg-emerald-50"
              >
                Trải nghiệm App Khách hàng <ArrowIcon />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Xem bảng dịch vụ
              </Link>
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            {customerFeatures.map((item, idx) => (
              <article
                key={item.title}
                style={{ transitionDelay: `${90 + idx * 65}ms` }}
                className="cm-enter-zoom group rounded-2xl border border-white/25 bg-white/95 p-4 shadow-lg shadow-emerald-950/20 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:bg-white sm:p-5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-sm font-black text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                  {item.code}
                </span>
                <h3 className="mt-3 text-sm font-extrabold text-slate-900 sm:text-base">{item.title}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </SlideSection>

      {/* ===================================================================== */}
      {/* PHẦN 3: DÀNH RIÊNG CHO ĐỐI TÁC STAFF (DARK SLATE PRO WORKSPACE)       */}
      {/* ===================================================================== */}
      <SlideSection
        id="section-staff"
        active={activeSlide === 'section-staff'}
        bgUrl={SLIDE_BG.staff}
        overlayClass="bg-gradient-to-br from-slate-950/92 via-slate-900/86 to-emerald-950/88"
        nextLabel="Dịch vụ nổi bật"
        onNext={() => scrollToSlide('section-services')}
        darkCue
      >
        <div className="grid items-center gap-8 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="order-2 grid gap-3.5 sm:grid-cols-2 lg:order-1">
            {staffFeatures.map((item, idx) => (
              <article
                key={item.title}
                style={{ transitionDelay: `${90 + idx * 65}ms` }}
                className="cm-enter-zoom group rounded-2xl border border-slate-700/80 bg-slate-900/80 p-4 shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-emerald-400/60 hover:bg-slate-900 sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-sm font-black text-emerald-300 ring-1 ring-emerald-400/30 transition group-hover:bg-emerald-500 group-hover:text-slate-950">
                    {item.code}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300/80">Staff Pro</span>
                </div>
                <h3 className="mt-3 text-sm font-extrabold text-white sm:text-base">{item.title}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-300 sm:text-sm sm:leading-6">{item.desc}</p>
              </article>
            ))}
          </div>

          <div className="cm-enter-right order-1 text-white lg:order-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-amber-200 backdrop-blur">
              Không gian Đối tác Nhân viên
            </span>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-[2.5rem]">
              Chủ động lịch làm,
              <br />
              <span className="text-amber-300">minh bạch từng khoản thu nhập.</span>
            </h2>
            <p className="mt-3.5 text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
              Không gian dành riêng cho Đội ngũ Staff CleanMaster giúp bạn tự chủ lịch tuần, giới hạn phạm vi hoạt động tại TP.HCM và rút thu nhập tự động qua payOS.
            </p>

            <div className="mt-6 rounded-3xl border border-emerald-500/30 bg-slate-900/85 p-4 shadow-2xl backdrop-blur-md sm:p-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400 text-sm font-black text-slate-950">
                    NV
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-white">Đối tác đã xác minh CCCD</p>
                    <p className="text-xs text-emerald-300">● Đang trực tuyến nhận ca</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                  payOS Auto
                </span>
              </div>
              <div className="mt-3.5 grid grid-cols-3 gap-2.5 text-center">
                <div className="rounded-2xl bg-slate-800/80 p-2.5">
                  <p className="text-base font-black text-amber-300 sm:text-lg">30</p>
                  <p className="mt-0.5 text-[11px] text-slate-300">Phường/Xã HCM</p>
                </div>
                <div className="rounded-2xl bg-slate-800/80 p-2.5">
                  <p className="text-base font-black text-emerald-300 sm:text-lg">A & B</p>
                  <p className="mt-0.5 text-[11px] text-slate-300">Chế độ nhận ca</p>
                </div>
                <div className="rounded-2xl bg-slate-800/80 p-2.5">
                  <p className="text-base font-black text-emerald-300 sm:text-lg">100%</p>
                  <p className="mt-0.5 text-[11px] text-slate-300">Đối soát ví</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/cooperation/staff"
                className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg transition hover:bg-emerald-400"
              >
                Ứng tuyển Đối tác ngay <ArrowIcon />
              </Link>
              <Link
                to="/employee-guideline"
                className="inline-flex items-center rounded-full border border-slate-600 bg-slate-800/80 px-5 py-3 text-sm font-bold text-white transition hover:border-emerald-400 hover:text-emerald-300"
              >
                Xem hướng dẫn App Staff
              </Link>
            </div>
          </div>
        </div>
      </SlideSection>

      {/* ===================================================================== */}
      {/* PHẦN 4: DỊCH VỤ NỔI BẬT                                               */}
      {/* ===================================================================== */}
      <SlideSection
        id="section-services"
        active={activeSlide === 'section-services'}
        bgUrl={SLIDE_BG.services}
        overlayClass="bg-white/90 backdrop-blur-[2px]"
        nextLabel="Quy trình 6 bước"
        onNext={() => scrollToSlide('section-process')}
      >
        <div className="cm-enter-zoom mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Dịch vụ nổi bật</p>
          <h2 className="mt-2.5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Chọn cách chăm sóc nhà phù hợp
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Các gói dịch vụ chuẩn hóa đồng bộ trực tiếp từ hệ thống CleanMaster cho gia đình hiện đại.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {(result.loading || result.error) && <CatalogState loading={result.loading} error={result.error} onRetry={result.retry} />}
          {servicePackages.map((service, idx) => (
            <article
              key={service.id}
              style={{ transitionDelay: `${100 + idx * 95}ms` }}
              className="cm-enter-zoom group flex flex-col overflow-hidden rounded-3xl bg-white/95 shadow-md ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-950/10"
            >
              <div className="relative overflow-hidden">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="aspect-[1.8/1] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm">
                  CleanMaster
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-black text-slate-900 sm:text-xl">{service.name}</h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-slate-600">{service.description}</p>
                <div className="mt-3.5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">{service.duration}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{service.areaRange}</span>
                </div>
                <Link to={`/services/${service.slug}`} className="group mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
                  Xem chi tiết <ArrowIcon />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="cm-enter-zoom mt-5 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-dashed border-emerald-400 bg-emerald-50/90 px-6 py-3.5 text-sm font-semibold text-emerald-900 shadow-sm backdrop-blur" style={{ transitionDelay: '340ms' }}>
          <span className="font-black">Dịch vụ bổ sung:</span> Sofa <span>•</span> Rèm <span>•</span> Nệm <span>•</span> Thảm
          <Link to="/services/add-ons" className="ml-1 font-bold underline underline-offset-4 hover:text-emerald-700">
            Khám phá thêm →
          </Link>
        </div>
      </SlideSection>

      {/* ===================================================================== */}
      {/* PHẦN 5: QUY TRÌNH 6 BƯỚC & CAM KẾT CHẤT LƯỢNG                         */}
      {/* ===================================================================== */}
      <SlideSection
        id="section-process"
        active={activeSlide === 'section-process'}
        bgUrl={SLIDE_BG.process}
        overlayClass="bg-gradient-to-b from-[#f3faf7]/94 via-[#f3faf7]/90 to-white/94"
        nextLabel="Blog & Ưu đãi"
        onNext={() => scrollToSlide('section-blog')}
      >
        <div className="cm-enter-zoom mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Quy trình & Cam kết</p>
          <h2 className="mt-2.5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            6 bước nhẹ nhàng để ngôi nhà luôn tinh tươm
          </h2>
          <p className="mt-2.5 text-sm leading-6 text-slate-600 sm:text-base">
            Mọi bước đều rõ ràng, minh bạch và chủ động ngay trên ứng dụng CleanMaster.
          </p>
        </div>

        <div className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step, idx) => (
            <div
              key={step.number}
              style={{ transitionDelay: `${70 + idx * 60}ms` }}
              className="cm-enter-zoom group rounded-2xl border border-emerald-100 bg-white/95 p-4 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md sm:p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-black text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                  {step.number}
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 sm:text-base">{step.title}</h3>
              </div>
              <p className="mt-2.5 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-3.5 md:grid-cols-3">
          {benefits.map((b, idx) => (
            <div
              key={b.title}
              style={{ transitionDelay: `${340 + idx * 70}ms` }}
              className="cm-enter-left flex items-start gap-3.5 rounded-2xl bg-emerald-950 px-5 py-3.5 text-white shadow-md"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-sm font-black text-emerald-300">
                {b.mark}
              </span>
              <div>
                <h4 className="text-sm font-extrabold text-emerald-200">{b.title}</h4>
                <p className="mt-0.5 text-xs leading-5 text-slate-300">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SlideSection>

      {/* ===================================================================== */}
      {/* PHẦN 6: BLOG MỚI NHẤT & ƯU ĐÃI                                        */}
      {/* ===================================================================== */}
      <SlideSection
        id="section-blog"
        active={activeSlide === 'section-blog'}
        bgUrl={SLIDE_BG.blog}
        overlayClass="bg-white/92 backdrop-blur-[2px]"
        nextLabel="Tải ứng dụng"
        onNext={() => scrollToSlide('section-download')}
      >
        <div className="cm-enter-left flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Blog & Ưu đãi</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Cẩm nang gia đình & Khuyến mãi mới
            </h2>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-bold">
            <Link to="/blog" className="text-emerald-700 hover:underline">Tất cả bài viết →</Link>
            <Link to="/promotions" className="text-slate-600 hover:text-emerald-700">Xem ưu đãi →</Link>
          </div>
        </div>

        {latestPosts.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {latestPosts.map((post, idx) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                style={{ transitionDelay: `${90 + idx * 80}ms` }}
                className="cm-enter-zoom group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-900/10"
              >
                <div className="overflow-hidden">
                  <img
                    src={post.coverUrl}
                    alt={post.title}
                    className="aspect-[1.8/1] w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5">{blogCategoryLabels[post.category]}</span>
                    <time dateTime={post.publishedAt || post.updatedAt} className="text-slate-400">
                      {new Date(post.publishedAt || post.updatedAt).toLocaleDateString('vi-VN')}
                    </time>
                  </div>
                  <h3 className="mt-2.5 line-clamp-2 text-base font-black leading-snug text-slate-900 transition group-hover:text-emerald-700 sm:text-lg">
                    {post.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-5 text-slate-600 sm:text-sm">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="cm-enter-zoom mt-6 rounded-3xl border border-dashed border-emerald-200 bg-[#f3faf7]/80 p-6 text-center">
            <p className="font-bold text-slate-800">Khám phá mẹo dọn nhà & kiến thức gia đình trên Blog CleanMaster</p>
            <Link to="/blog" className="mt-3.5 inline-flex rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-700">
              Vào trang Blog →
            </Link>
          </div>
        )}

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {(promotionResult.loading || promotionResult.error) && (
            <CatalogState loading={promotionResult.loading} error={promotionResult.error} onRetry={promotionResult.retry} />
          )}
          {promotions.slice(0, 2).map((promotion, idx) => (
            <article
              key={promotion.id}
              style={{ transitionDelay: `${260 + idx * 80}ms` }}
              className={`cm-enter-right flex flex-col justify-between gap-4 rounded-3xl bg-gradient-to-br ${promotion.tone} p-5 text-white shadow-md sm:flex-row sm:items-center`}
            >
              <div>
                <span className="inline-flex rounded-full bg-white/15 px-3 py-0.5 text-xs font-bold">
                  Đến {new Date(promotion.endsAt).toLocaleDateString('vi-VN')}
                </span>
                <p className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{promotion.discountLabel}</p>
                <h3 className="mt-0.5 text-sm font-bold sm:text-base">{promotion.title}</h3>
              </div>
              <Link
                to="/download"
                className="inline-flex shrink-0 self-start rounded-full bg-white px-5 py-2.5 text-xs font-bold text-slate-900 transition hover:bg-emerald-50 sm:self-center"
              >
                Dùng trên App →
              </Link>
            </article>
          ))}
        </div>
      </SlideSection>

      {/* ===================================================================== */}
      {/* PHẦN 7: TẢI ỨNG DỤNG & KÊU GỌI HÀNH ĐỘNG                              */}
      {/* ===================================================================== */}
      <SlideSection
        id="section-download"
        active={activeSlide === 'section-download'}
        bgUrl={SLIDE_BG.download}
        overlayClass="bg-gradient-to-br from-slate-950/92 via-emerald-950/88 to-slate-950/92"
      >
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="cm-enter-left text-white">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">Ứng dụng CleanMaster</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              Không gian sạch,
              <br />
              <span className="text-emerald-400">tâm trí nhẹ mỗi ngày.</span>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
              Website là cổng thông tin & Blog mở công khai không cần đăng nhập. Tải ngay ứng dụng CleanMaster để đặt dịch vụ, trò chuyện cùng Trợ lý AI giọng nói hoặc bắt đầu nhận ca làm việc.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/download"
                className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
              >
                Tải trên App Store / Google Play <ArrowIcon />
              </Link>
              <Link
                to="/cooperation/staff"
                className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:border-emerald-400 hover:text-emerald-300"
              >
                Đăng ký Đối tác Staff
              </Link>
            </div>
          </div>

          <div
            style={{ transitionDelay: '140ms' }}
            className="cm-enter-right flex flex-col items-center justify-center gap-6 rounded-3xl border border-white/15 bg-white/10 p-8 text-center text-white backdrop-blur-md sm:flex-row sm:text-left"
          >
            <MiniQrMatrix />
            <div className="max-w-[220px]">
              <p className="text-sm font-black text-emerald-300">Quét mã tải ứng dụng</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Hỗ trợ đầy đủ iOS & Android cho cả Khách hàng và Đối tác Nhân viên.
              </p>
              <button
                type="button"
                onClick={() => scrollToSlide('section-hero')}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:underline"
              >
                ↑ Quay lại đầu trang
              </button>
            </div>
          </div>
        </div>
      </SlideSection>
    </div>
  )
}
