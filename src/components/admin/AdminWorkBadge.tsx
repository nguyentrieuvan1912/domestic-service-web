import { useContext } from 'react'
import { AdminInboxContext } from './AdminInboxContext'
export default function AdminWorkBadge({ target }: { target: string }) {
  const inbox = useContext(AdminInboxContext)
  const count = inbox.pendingTargets?.[target] || 0
  return count ? <span aria-label={`${count} việc cần xử lý`} className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 align-middle text-[10px] font-bold leading-5 text-white">{count}</span> : null
}
