import { useEffect, useState } from 'react'
export function useAdminResource<T>(loader: () => Promise<T>, initial: T) {
  const [data, setData] = useState(initial), [loading, setLoading] = useState(true), [error, setError] = useState(''), [attempt, setAttempt] = useState(0)
  useEffect(() => { let active = true; void loader().then(value => { if (active) { setData(value); setError('') } }).catch(cause => { if (active) setError(cause instanceof Error ? cause.message : 'Chưa tải được dữ liệu.') }).finally(() => { if (active) setLoading(false) }); return () => { active = false } }, [loader, attempt])
  return { data, setData, loading, error, retry: () => { setLoading(true); setAttempt(value => value + 1) } }
}
