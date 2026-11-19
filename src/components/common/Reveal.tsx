import { type ReactNode, useEffect, useRef, useState } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  delayMs?: number
}

export default function Reveal({ children, className = '', delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={`cm-reveal ${visible ? 'cm-reveal-visible' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
