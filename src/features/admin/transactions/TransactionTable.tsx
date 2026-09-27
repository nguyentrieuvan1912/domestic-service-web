import type { Transaction } from '../../../data/mockAdminTransactions'
import {
  paymentMethodLabels,
  transactionStatusLabels,
  transactionStatusStyles,
  transactionTypeLabels,
  transactionTypeStyles,
} from '../../../data/mockAdminTransactions'

type TransactionTableProps = {
  transactions: Transaction[]
  onSelectTransaction: (transaction: Transaction) => void
}

export default function TransactionTable({
  transactions,
  onSelectTransaction,
}: TransactionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50/80 text-xs uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3.5 whitespace-nowrap">Mã GD / Mã Đơn</th>
            <th className="px-4 py-3.5 min-w-[180px]">Đối tượng thực hiện</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Phân loại</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Phương thức</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Số tiền</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Trạng thái</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Ngày giờ</th>
            <th className="px-4 py-3.5 text-right whitespace-nowrap w-24">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transactions.map((item) => (
            <tr key={item.id} className="transition hover:bg-slate-50/80">
              {/* Mã GD / Mã Đơn */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <p className="font-extrabold text-slate-800 font-mono text-xs leading-tight">{item.id}</p>
                <p className="text-[11px] font-bold text-emerald-700 font-mono mt-0.5 leading-none">
                  {item.bookingId}
                </p>
              </td>

              {/* Đối tượng */}
              <td className="px-4 py-3.5 min-w-[180px]">
                <div>
                  <p className="font-semibold text-slate-800 leading-tight">{item.actorName}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5 leading-none">{item.actorPhone}</p>
                </div>
              </td>

              {/* Phân loại (Thu/Chi) */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span
                  className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide leading-none ${
                    transactionTypeStyles[item.type]
                  }`}
                >
                  {transactionTypeLabels[item.type]}
                </span>
              </td>

              {/* Phương thức */}
              <td className="px-4 py-3.5 text-xs font-medium text-slate-600 whitespace-nowrap leading-tight">
                {paymentMethodLabels[item.paymentMethod]}
              </td>

              {/* Số tiền */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span
                  className={`font-extrabold text-sm leading-tight ${
                    item.type === 'PAYMENT' ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {item.type === 'PAYMENT' ? '+' : '-'}
                  {new Intl.NumberFormat('vi-VN').format(item.amount)}đ
                </span>
              </td>

              {/* Trạng thái */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide leading-none ${
                    transactionStatusStyles[item.status]
                  }`}
                >
                  {transactionStatusLabels[item.status]}
                </span>
              </td>

              {/* Ngày giờ */}
              <td className="px-4 py-3.5 text-xs font-medium text-slate-500 whitespace-nowrap leading-tight">
                {item.createdAt}
              </td>

              {/* Thao tác */}
              <td className="px-4 py-3.5 text-right whitespace-nowrap w-24">
                <button
                  type="button"
                  onClick={() => onSelectTransaction(item)}
                  className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {transactions.length === 0 && (
        <div className="px-4 py-10 text-center text-sm text-slate-500">
          Không tìm thấy giao dịch nào phù hợp với bộ lọc.
        </div>
      )}
    </div>
  )
}
