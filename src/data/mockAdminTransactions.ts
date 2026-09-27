export type TransactionType = 'PAYMENT' | 'PAYOUT' | 'REFUND'
export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED'
export type PaymentMethod = 'CASH' | 'VNPAY' | 'MOMO' | 'BANK_TRANSFER'

export interface TransactionBreakdown {
  serviceFee: number
  platformFee: number
  staffEarning: number
}

export interface Transaction {
  id: string
  bookingId: string
  actorName: string
  actorPhone: string
  amount: number
  type: TransactionType
  status: TransactionStatus
  paymentMethod: PaymentMethod
  platformFee: number
  createdAt: string
  description?: string
  breakdown?: TransactionBreakdown
}

export const transactionTypeLabels: Record<TransactionType, string> = {
  PAYMENT: 'Dòng tiền Thu',
  PAYOUT: 'Dòng tiền Chi (Payout)',
  REFUND: 'Dòng tiền Chi (Hoàn tiền)',
}

export const transactionTypeStyles: Record<TransactionType, string> = {
  PAYMENT: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  PAYOUT: 'bg-blue-50 text-blue-800 border-blue-200',
  REFUND: 'bg-purple-50 text-purple-800 border-purple-200',
}

export const transactionStatusLabels: Record<TransactionStatus, string> = {
  SUCCESS: 'Thành công',
  PENDING: 'Chờ xử lý',
  FAILED: 'Thất bại',
}

export const transactionStatusStyles: Record<TransactionStatus, string> = {
  SUCCESS: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  FAILED: 'bg-rose-50 text-rose-700 border-rose-200',
}

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  CASH: 'Tiền mặt (COD)',
  VNPAY: 'Cổng VNPAY',
  MOMO: 'Ví MoMo',
  BANK_TRANSFER: 'Chuyển khoản Ngân hàng',
}

export const mockAdminTransactions: Transaction[] = [
  {
    id: 'TRX-9901',
    bookingId: 'BK-88201',
    actorName: 'Nguyễn Văn An (Khách hàng)',
    actorPhone: '0908 112 233',
    amount: 380000,
    type: 'PAYMENT',
    status: 'SUCCESS',
    paymentMethod: 'MOMO',
    platformFee: 30000,
    createdAt: '16/09/2026 13:15',
    description: 'Khách hàng thanh toán đơn vệ sinh máy lạnh BK-88201',
    breakdown: {
      serviceFee: 400000,
      platformFee: 30000,
      staffEarning: 350000,
    },
  },
  {
    id: 'TRX-9902',
    bookingId: 'BK-88202',
    actorName: 'Lê Thị Thu Hà (Khách hàng)',
    actorPhone: '0918 334 556',
    amount: 490000,
    type: 'PAYMENT',
    status: 'SUCCESS',
    paymentMethod: 'VNPAY',
    platformFee: 40000,
    createdAt: '16/09/2026 10:00',
    description: 'Thanh toán đơn chăm sóc trẻ em BK-88202 qua VNPAY',
    breakdown: {
      serviceFee: 450000,
      platformFee: 40000,
      staffEarning: 410000,
    },
  },
  {
    id: 'TRX-9903',
    bookingId: 'BK-88150',
    actorName: 'Nguyễn Thị Lan (Staff)',
    actorPhone: '0901 234 567',
    amount: 2480000,
    type: 'PAYOUT',
    status: 'SUCCESS',
    paymentMethod: 'BANK_TRANSFER',
    platformFee: 0,
    createdAt: '16/09/2026 10:30',
    description: 'Duyệt lệnh rút tiền thu nhập tuần cho Staff Nguyễn Thị Lan',
    breakdown: {
      serviceFee: 2480000,
      platformFee: 0,
      staffEarning: 2480000,
    },
  },
  {
    id: 'TRX-9904',
    bookingId: 'BK-88205',
    actorName: 'Hoàng Quốc Việt (Khách hàng)',
    actorPhone: '0966 778 899',
    amount: 380000,
    type: 'REFUND',
    status: 'SUCCESS',
    paymentMethod: 'MOMO',
    platformFee: 0,
    createdAt: '14/09/2026 08:30',
    description: 'Hoàn tiền 100% qua Ví MoMo do hủy đơn BK-88205',
    breakdown: {
      serviceFee: 380000,
      platformFee: 0,
      staffEarning: 0,
    },
  },
  {
    id: 'TRX-9905',
    bookingId: 'BK-88188',
    actorName: 'Trần Văn Minh (Staff)',
    actorPhone: '0912 345 678',
    amount: 1940000,
    type: 'PAYOUT',
    status: 'PENDING',
    paymentMethod: 'BANK_TRANSFER',
    platformFee: 0,
    createdAt: '16/09/2026 15:45',
    description: 'Yêu cầu rút thu nhập tích lũy đang chờ Admin đối soát duyệt lệnh',
    breakdown: {
      serviceFee: 1940000,
      platformFee: 0,
      staffEarning: 1940000,
    },
  },
  {
    id: 'TRX-9906',
    bookingId: 'BK-88203',
    actorName: 'Phạm Minh Tuấn (Khách hàng)',
    actorPhone: '0937 889 900',
    amount: 360000,
    type: 'PAYMENT',
    status: 'SUCCESS',
    paymentMethod: 'CASH',
    platformFee: 30000,
    createdAt: '16/09/2026 08:00',
    description: 'Thanh toán tiền mặt cho Staff sau khi hoàn thành đơn BK-88203',
    breakdown: {
      serviceFee: 360000,
      platformFee: 30000,
      staffEarning: 330000,
    },
  },
  {
    id: 'TRX-9907',
    bookingId: 'BK-88120',
    actorName: 'Vũ Hoàng Nam (Khách hàng)',
    actorPhone: '0903 998 776',
    amount: 250000,
    type: 'REFUND',
    status: 'PENDING',
    paymentMethod: 'BANK_TRANSFER',
    platformFee: 0,
    createdAt: '15/09/2026 14:20',
    description: 'Yêu cầu hoàn tiền đơn hủy đang chờ xác minh giao dịch ngân hàng',
    breakdown: {
      serviceFee: 250000,
      platformFee: 0,
      staffEarning: 0,
    },
  },
]
