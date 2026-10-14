export default function ResourceStatus({ loading, error, retry }: { loading: boolean; error: string; retry: () => void }) {
  return <>{loading && <p role="status" className="text-sm text-slate-500">Đang tải dữ liệu…</p>}{error && <p role="alert" className="text-sm text-red-600">{error} <button type="button" className="underline" onClick={retry}>Thử lại</button></p>}</>
}
