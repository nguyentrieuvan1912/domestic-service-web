export interface MonthlyData {
  month: string
  revenue: number
  payout: number
  platformFee: number
}

export interface ServiceShareData {
  name: string
  value: number
  amount: string
  color: string
}

export interface DistrictBookingData {
  district: string
  bookings: number
}

export interface AnalyticsKpi {
  id: string
  title: string
  value: string
  change: string
  isPositive: boolean
  subtext: string
}

export const mockAnalyticsKpis: AnalyticsKpi[] = [
  {
    id: 'kpi-total-revenue',
    title: 'Tổng doanh thu lũy kế',
    value: '1.245.000.000đ',
    change: '+18.4%',
    isPositive: true,
    subtext: 'so với cùng kỳ năm ngoái',
  },
  {
    id: 'kpi-net-profit',
    title: 'Lợi nhuận ròng (Phí hệ thống)',
    value: '186.750.000đ',
    change: '+15.2%',
    isPositive: true,
    subtext: 'chiếm ~15% doanh thu',
  },
  {
    id: 'kpi-completion-rate',
    title: 'Tỷ lệ hoàn thành đơn',
    value: '96.2%',
    change: '+2.1%',
    isPositive: true,
    subtext: 'tỷ lệ hủy đơn chỉ 3.8%',
  },
  {
    id: 'kpi-new-staff',
    title: 'Staff tuyển mới & Đào tạo',
    value: '68 nhân viên',
    change: '+12.0%',
    isPositive: true,
    subtext: 'đã hoàn tất Onboarding',
  },
]

export const mockMonthlyData: MonthlyData[] = [
  { month: 'Thg 1', revenue: 78000000, payout: 55000000, platformFee: 11700000 },
  { month: 'Thg 2', revenue: 82000000, payout: 58000000, platformFee: 12300000 },
  { month: 'Thg 3', revenue: 95000000, payout: 67000000, platformFee: 14250000 },
  { month: 'Thg 4', revenue: 89000000, payout: 63000000, platformFee: 13350000 },
  { month: 'Thg 5', revenue: 104000000, payout: 74000000, platformFee: 15600000 },
  { month: 'Thg 6', revenue: 112000000, payout: 79000000, platformFee: 16800000 },
  { month: 'Thg 7', revenue: 118000000, payout: 83000000, platformFee: 17700000 },
  { month: 'Thg 8', revenue: 122000000, payout: 86000000, platformFee: 18300000 },
  { month: 'Thg 9', revenue: 125500000, payout: 88500000, platformFee: 18825000 },
  { month: 'Thg 10', revenue: 130000000, payout: 92000000, platformFee: 19500000 },
  { month: 'Thg 11', revenue: 138000000, payout: 97000000, platformFee: 20700000 },
  { month: 'Thg 12', revenue: 149000000, payout: 105000000, platformFee: 22350000 },
]

export const mockServiceShareData: ServiceShareData[] = [
  { name: 'Vệ sinh nhà cửa', value: 45, amount: '56.475.000đ', color: '#10b981' },
  { name: 'Vệ sinh điện lạnh', value: 25, amount: '31.375.000đ', color: '#3b82f6' },
  { name: 'Chăm sóc trẻ em', value: 18, amount: '22.590.000đ', color: '#8b5cf6' },
  { name: 'Chăm sóc người già', value: 8, amount: '10.040.000đ', color: '#f59e0b' },
  { name: 'Giặt ủi & Khác', value: 4, amount: '5.020.000đ', color: '#ec4899' },
]

export const mockTopDistrictsData: DistrictBookingData[] = [
  { district: 'Quận 7', bookings: 142 },
  { district: 'Quận 3', bookings: 118 },
  { district: 'Bình Thạnh', bookings: 96 },
  { district: 'Quận 1', bookings: 84 },
  { district: 'Tân Bình', bookings: 62 },
]
