import { useAdminRefresh } from '../../hooks/useAdminRefresh'
import { useEffect, useState } from 'react'
import type { Candidate, CandidateStatus } from '../../data/mockAdminCandidates'
import { candidateStatuses } from '../../data/mockAdminCandidates'
import { catalogGet } from '../../api/catalog'
import type { CatalogPage, CatalogService } from '../../api/catalog'
import {
  getAdminCandidates,
  advanceCandidate,
  createCandidate,
  provisionStaff,
} from '../../services/candidate.service'
import CandidateModal from '../../features/admin/candidates/CandidateModal'
import { NewCandidateForm } from '../../features/admin/candidates/CandidateForms'

const columnStyles: Record<CandidateStatus, string> = {
  PENDING: 'border-slate-200 bg-slate-50',
  ONBOARDING: 'border-blue-200 bg-blue-50/50',
  TRAINING: 'border-indigo-200 bg-indigo-50/50',
  EVALUATION: 'border-orange-200 bg-orange-50/50',
}
const badgeStyles: Record<CandidateStatus, string> = {
  PENDING: 'bg-slate-200 text-slate-700',
  ONBOARDING: 'bg-blue-100 text-blue-700',
  TRAINING: 'bg-indigo-100 text-indigo-700',
  EVALUATION: 'bg-orange-100 text-orange-700',
}

export default function AdminCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [services, setServices] = useState<CatalogService[]>([])
  const [catalogError, setCatalogError] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [attempt, setAttempt] = useState(0)

  useAdminRefresh(() => setAttempt((value) => value + 1))

  useEffect(() => {
    let active = true
    setLoading(true)
    void getAdminCandidates()
      .then((data) => {
        if (active) {
          setCandidates(data)
          setError('')
        }
      })
      .catch((cause) => {
        if (active) setError(cause?.message || 'Không thể tải danh sách ứng viên.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [attempt])

  const filteredCandidates = candidates.filter((candidate) =>
    `${candidate.fullName} ${candidate.phone} ${candidate.area || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const updateCandidate = async (draft: Candidate) => {
    const candidate = await advanceCandidate(draft)
    setCandidates((current) => current.map((item) => (item.id === candidate.id ? candidate : item)))
    setSelectedCandidate((current) => (current && current.id === candidate.id ? candidate : current))
    setAttempt((value) => value + 1)
  }

  const addCandidate = async (draft: Candidate) => {
    const candidate = await createCandidate(draft)
    setCandidates((current) => [...current, candidate])
    setIsCreateOpen(false)
    setAttempt((value) => value + 1)
  }

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      const result: CatalogService[] = []
      let page = 0
      let totalPages: number
      do {
        const data = await catalogGet<CatalogPage>(`/services?page=${page}&size=100`, controller.signal)
        result.push(...data.items)
        totalPages = data.totalPages
        page++
      } while (page < totalPages)
      if (!controller.signal.aborted) {
        setServices(result)
        setCatalogError('')
      }
    }
    void load().catch((cause) => {
      if (!controller.signal.aborted) setCatalogError(cause.message)
    })
    return () => controller.abort()
  }, [attempt])

  const createStaffAccount = async (password: string, rank: string, avatar: string) => {
    if (!selectedCandidate) return
    const saved = await provisionStaff(selectedCandidate.id, password, rank, avatar)
    setCandidates((current) => current.map((item) => (item.id === saved.id ? saved : item)))
    setSelectedCandidate(saved)
    setAttempt((value) => value + 1)
  }

  return (
    <div className="space-y-8">
      {catalogError && (
        <div role="alert" className="text-red-600">
          {catalogError}{' '}
          <button className="underline" onClick={() => setAttempt((value) => value + 1)}>
            Tải lại danh mục
          </button>
        </div>
      )}
      {loading && <p role="status">Đang tải ứng viên từ cơ sở dữ liệu...</p>}
      {error && (
        <div role="alert" className="text-red-600">
          {error}{' '}
          <button
            className="underline"
            onClick={() => {
              setLoading(true)
              setAttempt((value) => value + 1)
            }}
          >
            Thử lại
          </button>
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-emerald-600">Tuyển dụng và đào tạo</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Quản lý ứng viên</h1>
          <p className="mt-2 text-sm text-slate-500">
            Theo dõi ứng viên qua bốn giai đoạn chính của quy trình (Dữ liệu thời gian thực).
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative">
            <span className="sr-only">Tìm kiếm ứng viên</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-64"
              placeholder="Tìm theo tên, SĐT hoặc khu vực"
            />
          </label>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Thêm ứng viên mới
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-4">
        {candidateStatuses.map((status, index) => {
          const columnCandidates = filteredCandidates.filter((candidate) => {
            if (status.id === 'PENDING') {
              return candidate.status === 'PENDING' || (candidate.status as string) === 'APPLIED'
            }
            return candidate.status === status.id
          })

          return (
            <section key={status.id} className={`min-h-[420px] rounded-xl border p-4 ${columnStyles[status.id]}`}>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Giai đoạn {index + 1}
                  </p>
                  <h2 className="mt-1 text-lg font-bold uppercase text-slate-900">{status.label}</h2>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeStyles[status.id]}`}>
                  {columnCandidates.length}
                </span>
              </div>

              <div className="space-y-3">
                {columnCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    onClick={() => setSelectedCandidate(candidate)}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                        {candidate.fullName.split(' ').map((part) => part[0]).slice(-2).join('')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-900">{candidate.fullName}</p>
                        <p className="mt-1 line-clamp-2 text-xs font-medium text-emerald-700">
                          {candidate.services.length > 0 ? candidate.services.join(', ') : 'Chưa chọn dịch vụ'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{candidate.phone}</span>
                      {candidate.area && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                          📍 {candidate.area}
                        </span>
                      )}
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-600">
                        {candidate.subStatus || (candidate.status === 'PENDING' ? 'Chờ duyệt' : candidate.status)}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      Đăng ký: {candidate.registeredAt || 'Vừa xong'}
                    </p>

                    {/* Quick stage transition actions for Stage 1 */}
                    {status.id === 'PENDING' && (
                      <div
                        className="mt-3 flex gap-2 border-t border-slate-100 pt-2.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation()
                            await updateCandidate({
                              ...candidate,
                              status: 'ONBOARDING',
                              subStatus: 'Hẹn phỏng vấn',
                            })
                          }}
                          className="flex-1 rounded-md border border-blue-600 bg-blue-50 py-1.5 text-center text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          📅 Phỏng vấn
                        </button>
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation()
                            await updateCandidate({
                              ...candidate,
                              status: 'ONBOARDING',
                              subStatus: 'Đã duyệt hồ sơ',
                            })
                          }}
                          className="flex-1 rounded-md bg-emerald-600 py-1.5 text-center text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                        >
                          ✓ Duyệt hồ sơ
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {columnCandidates.length === 0 && (
                <p className="mt-4 rounded-lg border border-dashed border-slate-300 px-3 py-6 text-center text-xs text-slate-500">
                  Chưa có ứng viên
                </p>
              )}
            </section>
          )
        })}
      </div>

      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onUpdate={updateCandidate}
          onProvision={createStaffAccount}
        />
      )}

      {isCreateOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
            role="presentation"
            onMouseDown={(event) => event.target === event.currentTarget && setIsCreateOpen(false)}
          />
          <section
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-candidate-title"
          >
            <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                  Hồ sơ ban đầu
                </p>
                <h2 id="new-candidate-title" className="mt-1 text-xl font-bold text-slate-950">
                  Thêm ứng viên mới
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                aria-label="Đóng cửa sổ"
                className="flex h-9 w-9 items-center justify-center text-2xl text-slate-400 hover:bg-slate-200 hover:text-slate-900"
              >
                ×
              </button>
            </header>
            <NewCandidateForm
              services={services}
              onSave={addCandidate}
              onCancel={() => setIsCreateOpen(false)}
            />
          </section>
        </>
      )}
    </div>
  )
}
