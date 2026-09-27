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
        <thead className="bg-slate-50/80 text-xs uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3.5 whitespace-nowrap min-w-[200px]">Họ và tên / SĐT</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Cấp bậc</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Đánh giá</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Tổng chuyến</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Thu nhập tạm tính</th>
            <th className="px-4 py-3.5 text-right whitespace-nowrap w-24">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {staff.map((member) => {
            const isTopStaff = member.income > 20000000 || member.averageRating >= 4.9

            return (
              <tr key={member.id} className="transition hover:bg-slate-50/80">
                <td className="px-4 py-3.5 whitespace-nowrap min-w-[200px]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-sm leading-none">
                      {member.fullName
                        .split(' ')
                        .map((part) => part[0])
                        .slice(-2)
                        .join('')}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-slate-800 leading-tight">
                          {member.fullName}
                        </p>
                        {isTopStaff && (
                          <span
                            title="Nhân viên xuất sắc (Thu nhập > 20tr hoặc Rating >= 4.9)"
                            className="inline-flex items-center gap-0.5 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 shadow-2xs"
                          >
                            🏆 Top Staff
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs font-medium text-slate-500 leading-none">
                        {member.phone}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide leading-none ${
                      rankStyles[member.rank]
                    }`}
                  >
                    {staffLevelLabels[member.rank]}
                  </span>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1 font-semibold text-slate-800 leading-tight">
                    <span className="text-amber-500">★</span>
                    <span>{member.averageRating.toFixed(1)}</span>
                    <span className="text-xs text-slate-400 font-normal">/ 5</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-700 whitespace-nowrap leading-tight">
                  {member.totalTrips} chuyến
                </td>
                <td className="px-4 py-3.5 font-bold text-emerald-700 whitespace-nowrap leading-tight">
                  {new Intl.NumberFormat('vi-VN').format(member.income)}đ
                </td>
                <td className="px-4 py-3.5 text-right whitespace-nowrap w-24">
                  <button
                    type="button"
                    onClick={() => onEdit(member)}
                    className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                  >
                    Hồ sơ
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {staff.length === 0 && (
        <div className="px-4 py-10 text-center text-sm text-slate-500">
          Chưa có nhân viên nào phù hợp với bộ lọc.
        </div>
      )}
    </div>
  )
}

