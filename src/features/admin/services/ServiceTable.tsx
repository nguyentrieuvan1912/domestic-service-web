import type { Service } from '../../../data/mockAdminServices'

type ServiceTableProps = {
  services: Service[]
  packageCounts: Record<string, number>
  addOnCounts: Record<string, number>
  onEdit: (service: Service) => void
}

export default function ServiceTable({ services, packageCounts, addOnCounts, onEdit }: ServiceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-6 py-4 font-semibold">Dịch vụ</th>
            <th className="px-6 py-4 font-semibold">Danh mục</th>
            <th className="px-6 py-4 font-semibold">Trường động</th>
            <th className="px-6 py-4 font-semibold">Gói / Dịch vụ bổ sung</th>
            <th className="px-6 py-4 font-semibold">Trạng thái</th>
            <th className="px-6 py-4 text-right font-semibold">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {services.map((service) => (
            <tr key={service.id} className="transition hover:bg-slate-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-700">{service.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-900">{service.name}</p>
                    <p className="mt-1 max-w-xs truncate text-xs text-slate-500">{service.description}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-600">{service.categoryName}</td>
              <td className="px-6 py-4"><span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">{service.dynamicFields.length} trường</span></td>
              <td className="px-6 py-4 text-slate-600">{packageCounts[service.id] ?? 0} / {addOnCounts[service.id] ?? 0}</td>
              <td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${service.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{service.isActive ? 'Đang hoạt động' : 'Tạm dừng'}</span></td>
              <td className="px-6 py-4 text-right"><button type="button" onClick={() => onEdit(service)} className="font-semibold text-emerald-700 hover:text-emerald-900">Chỉnh sửa</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}