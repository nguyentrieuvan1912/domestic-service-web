import { useCallback, useEffect, useRef, useState } from 'react'
import { emptyInbox, getInbox, syncInbox } from '../api/adminInbox'
import type { InboxFilter } from '../api/adminInbox'
import { readSession } from '../api/identity'
import { useAdminRefresh } from './useAdminRefresh'

export function useAdminInbox() {
  const [snapshot, setSnapshot] = useState(emptyInbox), [error, setError] = useState(''), [loaded, setLoaded] = useState(false)
  const [open, setOpen] = useState(false), [filter, setFilter] = useState<InboxFilter>('unread'), [pages, setPages] = useState<number[]>([])
  const [busy, setBusy] = useState(false)
  const before = pages.at(-1)
  const reload = useRef<() => void>(() => {})
  const requestSequence = useRef(0)
  const openInbox = useCallback(() => { setPages([]); setOpen(true) }, [])
  useAdminRefresh(() => reload.current(), 10000)
  useEffect(() => {
    let active = true, running = false, queued = false
    const session = readSession('ADMIN')
    const valid = () => active && session?.accessToken === readSession('ADMIN')?.accessToken
    const load = async () => {
      if (running) { queued = true; return }
      running = true
      const sequence = ++requestSequence.current
      try {
        await syncInbox()
        const data = await getInbox(filter, before)
        if (!valid() || sequence !== requestSequence.current) return
        setSnapshot(data); setError(''); setLoaded(true)
        const reminderKey = 'cleanmaster_admin_inbox_reminder_' + session?.user.id
        if (session && sessionStorage.getItem(reminderKey) !== session.expiresAt) {
          sessionStorage.setItem(reminderKey, session.expiresAt)
          if (data.unread) setOpen(true)
        }
      } catch (cause) { if (valid()) setError(cause instanceof Error ? cause.message : 'Chưa cập nhật được thông báo.') }
      finally { running = false; if (queued && valid()) { queued = false; void load() } }
    }
    reload.current = () => { void load() }
    void load()
    return () => { active = false; reload.current = () => {} }
  }, [filter, before])
  return { snapshot, error, loaded, open, setOpen, openInbox, filter, setFilter: (value: InboxFilter) => { setPages([]); setFilter(value) }, pages, next: () => setPages(old => [...old, snapshot.nextBefore]), previous: () => setPages(old => old.slice(0, -1)), refresh: () => reload.current(), busy, setBusy }
}
