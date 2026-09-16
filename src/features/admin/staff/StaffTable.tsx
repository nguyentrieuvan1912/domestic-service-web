import type { Service } from '../../../data/mockAdminServices'
import type { Staff, StaffLevel } from '../../../data/mockAdminStaff'
import { staffLevelLabels } from '../../../data/mockAdminStaff'

type StaffTableProps = {
  staff: Staff[]
  services?: Service[]
  onEdit: (staff: Staff) => void
}

const rankStyles: Record<StaffLevel, string> = {
  INTERN: 'bg-slate-100 text-slate-700 border-slate-200',
  STANDARD: 'bg-blue-50 text-blue-700 border-blue-200',
  PROFESSIONAL: 'bg-purple-50 text-purple-700 border-purple-200',
}

export default function StaffTable({ staff, onEdit }: StaffTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 font-semibold">Họ và tên / SĐT</th>
            <th className="px-6 py-4 font-semibold whitespace-nowrap">Cấp bậc</th>
            <th className="px-6 py-4 font-semibold whitespace-nowrap">Đánh giá</th>
            <th className="px-6 py-4 font-semibold whitespace-nowrap">Tổng chuyến</th>
            <th className="px-6 py-4 font-semibold whitespace-nowrap">Thu nhập</th>
            <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {staff.map((member) => (
            <tr key={member.id} className="transition hover:bg-slate-50/80">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-sm">
                    {member.fullName
                      .split(' ')
                      .map((part) => part[0])
                      .slice(-2)
                      .join('')}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{member.fullName}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{member.phone}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    rankStyles[member.rank]
                  }`}
                >
                  {staffLevelLabels[member.rank]}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1 font-semibold text-slate-900">
                  <span className="text-amber-500">★</span>
                  <span>{member.averageRating.toFixed(1)}</span>
                  <span className="text-xs text-slate-400 font-normal">/ 5</span>
                </div>
              </td>
              <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">
                {member.totalTrips} chuyến
              </td>
              <td className="px-6 py-4 font-semibold text-emerald-700 whitespace-nowrap">
                {new Intl.NumberFormat('vi-VN').format(member.income)}đ
              </td>
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => onEdit(member)}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                >
                  Hồ sơ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {staff.length === 0 && (
        <div className="px-6 py-12 text-center text-sm text-slate-500">
          Chưa có nhân viên nào trong danh sách này.
        </div>
      )}
    </div>
  )
}
