import { useEffect, useRef, useState } from 'react'
import { readSession } from '../api/identity'
import { useAdminRefresh } from './useAdminRefresh'

export function useAdminResource<T>(loader: () => Promise<T>, initial: T) {
  const [data, setData] = useState(initial), [loading, setLoading] = useState(true), [error, setError] = useState(''), [attempt, setAttempt] = useState(0)
  const refresh = useRef<() => void>(() => {})
  useAdminRefresh(() => refresh.current())
  useEffect(() => {
    let active = true, running = false, queued = false
    const owner = readSession('ADMIN')?.accessToken
    const valid = () => active && owner === readSession('ADMIN')?.accessToken
    const run = async () => {
      if (running) { queued = true; return }
      running = true
      try { const value = await loader(); if (valid()) { setData(value); setError('') } }
      catch (cause) { if (valid()) setError(cause instanceof Error ? cause.message : 'Chưa tải được dữ liệu.') }
      finally { running = false; if (valid()) { setLoading(false); if (queued) { queued = false; void run() } } }
    }
    refresh.current = () => { void run() }
    void run()
    return () => { active = false; refresh.current = () => {} }
  }, [loader, attempt])
  return { data, setData, loading, error, retry: () => { setLoading(true); setAttempt(value => value + 1) } }
}
