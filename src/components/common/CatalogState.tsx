export default function CatalogState({ loading, error, onRetry }: { loading?: boolean; error?: string; onRetry?: () => void }) {
  return <div role={error ? 'alert' : 'status'} className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
    <p>{loading ? 'Đang tải dịch vụ...' : error || 'Chưa có dịch vụ phù hợp.'}</p>
    {error && onRetry && <button type="button" onClick={onRetry} className="mt-4 rounded-full bg-emerald-600 px-5 py-2 font-bold text-white">Thử lại</button>}
  </div>
}
