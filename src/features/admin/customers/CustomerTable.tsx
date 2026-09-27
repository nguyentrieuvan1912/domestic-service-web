import type { Customer } from '../../../data/mockAdminCustomers'
import {
  customerStatusLabels,
  customerStatusStyles,
} from '../../../data/mockAdminCustomers'

type CustomerTableProps = {
  customers: Customer[]
  onSelectCustomer: (customer: Customer) => void
}

export default function CustomerTable({
  customers,
  onSelectCustomer,
}: CustomerTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50/80 text-xs uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3.5 whitespace-nowrap min-w-[200px]">Họ tên / SĐT</th>
            <th className="px-4 py-3.5">Email / Địa chỉ</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Tổng đơn</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Tổng chi tiêu</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Trạng thái</th>
            <th className="px-4 py-3.5 text-right whitespace-nowrap w-24">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {customers.map((customer) => (
            <tr key={customer.id} className="transition hover:bg-slate-50/80">
              {/* Họ tên & SĐT */}
              <td className="px-4 py-3.5 whitespace-nowrap min-w-[200px]">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-sm leading-none">
                    {customer.fullName
                      .split(' ')
                      .map((part) => part[0])
                      .slice(-2)
                      .join('')}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800 leading-tight">{customer.fullName}</p>
                    <p className="mt-0.5 text-xs font-medium text-slate-500 leading-none">{customer.phone}</p>
                  </div>
                </div>
              </td>

              {/* Email & Địa chỉ */}
              <td className="px-4 py-3.5">
                <div>
                  <p className="font-medium text-slate-700 text-xs leading-tight">{customer.email}</p>
                  <p className="mt-0.5 text-xs text-slate-400 font-medium leading-normal line-clamp-1 max-w-xs">
                    {customer.address}
                  </p>
                </div>
              </td>

              {/* Tổng đơn */}
              <td className="px-4 py-3.5 font-medium text-slate-700 whitespace-nowrap leading-tight">
                {customer.totalBookings} đơn
              </td>

              {/* Tổng chi tiêu */}
              <td className="px-4 py-3.5 font-extrabold text-emerald-700 whitespace-nowrap leading-tight">
                {new Intl.NumberFormat('vi-VN').format(customer.totalSpent)}đ
              </td>

              {/* Trạng thái */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide leading-none ${
                    customerStatusStyles[customer.status]
                  }`}
                >
                  {customerStatusLabels[customer.status]}
                </span>
              </td>

              {/* Thao tác */}
              <td className="px-4 py-3.5 text-right whitespace-nowrap w-24">
                <button
                  type="button"
                  onClick={() => onSelectCustomer(customer)}
                  className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {customers.length === 0 && (
        <div className="px-4 py-10 text-center text-sm text-slate-500">
          Chưa có khách hàng nào trong danh sách này.
        </div>
      )}
    </div>
  )
}
