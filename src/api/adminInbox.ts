import { adminRequest } from './operations'
export type InboxFilter = 'all' | 'unread' | 'pending'
export type AdminNotice = { id: number; sourceKey: string; section: string; target: string; title: string; summary: string; active: boolean; readAt: string | null; createdAt: string }
export type InboxSnapshot = { items: AdminNotice[]; unread: number; totalPending: number; pending: Record<string, number>; pendingTargets: Record<string, number>; hasMore: boolean; nextBefore: number; unavailableSources: string[]; syncedAt: string | null }
export const emptyInbox: InboxSnapshot = { items: [], unread: 0, totalPending: 0, pending: {}, pendingTargets: {}, hasMore: false, nextBefore: 0, unavailableSources: [], syncedAt: null }
export const syncInbox = () => adminRequest<InboxSnapshot>('identity', '/admin/inbox/sync', 'POST')
export const getInbox = (filter: InboxFilter, before?: number) => adminRequest<InboxSnapshot>('identity', '/admin/inbox?filter=' + filter + (before ? '&before=' + before : ''))
export const readNotice = (id: number) => adminRequest<InboxSnapshot>('identity', `/admin/inbox/${id}/read`, 'PATCH')
export const readAllNotices = (throughId: number) => adminRequest<InboxSnapshot>('identity', '/admin/inbox/read-all', 'PATCH', { throughId })
