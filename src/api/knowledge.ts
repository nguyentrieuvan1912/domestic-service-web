import { adminRequest } from './operations'

export interface KnowledgeDocument {
  id: number
  title: string
  sourceUri: string | null
  content: string
  version: number
  status: 'ACTIVE' | 'INACTIVE'
  approvalStatus: 'DRAFT' | 'APPROVED'
  indexStatus: 'PENDING' | 'INDEXING' | 'READY' | 'FAILED'
  indexedModel: string | null
  indexError: string | null
  updatedAt: string
  indexedAt: string | null
  chunkCount?: number
}
export type KnowledgeEdit = Pick<KnowledgeDocument, 'title' | 'content' | 'sourceUri'> & { id?: number; version: number | null }
export interface KnowledgeRevision {
  version: number; title: string; sourceUri: string | null; content: string
  status: string; approvalStatus: string; actorId: number | null; createdAt: string
}
export interface KnowledgeSearch {
  mode: 'HYBRID' | 'KEYWORD' | 'KEYWORD_FALLBACK'
  embeddingModel: string
  articles: { documentId: number; version: number; title: string; content: string; sourceUri: string | null; score: number; similarity: number }[]
}
const root = '/admin/knowledge'
export const loadKnowledge = () => adminRequest<KnowledgeDocument[]>('ai-assistant', root)
export const readKnowledge = (id: number) => adminRequest<KnowledgeDocument>('ai-assistant', root + '/' + id)
export const knowledgeHistory = (id: number) => adminRequest<KnowledgeRevision[]>('ai-assistant', root + '/' + id + '/history')
export const saveKnowledge = ({ id, ...body }: KnowledgeEdit) => adminRequest<KnowledgeDocument>(
  'ai-assistant', root + (id ? '/' + id : ''), id ? 'PUT' : 'POST', body)
export const changeKnowledge = (document: KnowledgeDocument, action: 'approve' | 'hide' | 'reindex') =>
  adminRequest<KnowledgeDocument>('ai-assistant', root + '/' + document.id + '/' + action, 'POST', { version: document.version })
export const searchKnowledge = (query: string) => adminRequest<KnowledgeSearch>('ai-assistant', root + '/search', 'POST', { query })
