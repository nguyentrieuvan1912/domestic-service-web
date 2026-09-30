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
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50/80 text-xs uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-200">
          <tr>
            <th className="w-1/3 max-w-[300px] px-4 py-3.5 font-semibold">Dịch vụ</th>
            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Danh mục</th>
            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Trường động</th>
            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Gói / Dịch vụ bổ sung</th>
            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Trạng thái</th>
            <th className="px-4 py-3.5 text-right font-semibold whitespace-nowrap w-24">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {services.map((service) => (
            <tr key={service.id} className="transition hover:bg-slate-50/80">
              <td className="w-1/3 max-w-[300px] px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-700 leading-none">
                    {service.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 leading-tight">{service.name}</p>
                    <p className="mt-0.5 truncate text-xs text-slate-500 leading-normal">
                      {service.description}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 font-medium text-slate-700 whitespace-nowrap leading-tight">
                {service.categoryName}
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span className="inline-flex items-center rounded-full bg-violet-50 border border-violet-200 px-2.5 py-1 text-[11px] font-bold text-violet-700 leading-none">
                  {service.dynamicFields.length} trường
                </span>
              </td>
              <td className="px-4 py-3.5 font-semibold text-slate-700 whitespace-nowrap leading-tight">
                {packageCounts[service.id] ?? 0} gói / {addOnCounts[service.id] ?? 0} add-on
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span
                  className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide whitespace-nowrap text-center leading-none ${
                    service.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {service.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                </span>
              </td>
              <td className="px-4 py-3.5 text-right whitespace-nowrap w-24">
                <button
                  type="button"
                  onClick={() => onEdit(service)}
                  className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                >
                  Chỉnh sửa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}