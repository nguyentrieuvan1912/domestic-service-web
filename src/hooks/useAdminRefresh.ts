import { useEffect, useRef } from 'react'

// Refresh data only; keep the page, selection and unsaved forms mounted.
export function useAdminRefresh(refresh: () => void, interval = 15000) {
  const current = useRef(refresh)
  useEffect(() => { current.current = refresh }, [refresh])
  useEffect(() => {
    let debounce: ReturnType<typeof setTimeout> | undefined
    const run = () => { if (document.visibilityState === 'visible' && navigator.onLine) current.current() }
    const changed = () => { clearTimeout(debounce); debounce = setTimeout(run, 350) }
    const timer = setInterval(run, interval)
    window.addEventListener('admin-data-changed', changed)
    window.addEventListener('online', run)
    window.addEventListener('focus', run)
    document.addEventListener('visibilitychange', run)
    return () => { clearInterval(timer); clearTimeout(debounce); window.removeEventListener('admin-data-changed', changed); window.removeEventListener('online', run); window.removeEventListener('focus', run); document.removeEventListener('visibilitychange', run) }
  }, [interval])
}
