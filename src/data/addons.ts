export type AddOnSlug = 'sofa' | 'curtain' | 'mattress' | 'carpet'

export interface AddOnPrice {
  label: string
  price: string
  note: string
}

export interface AddOnService {
  id: string
  slug: AddOnSlug
  name: string
  shortName: string
  description: string
  imageUrl: string
  benefits: string[]
  process: string[]
  pricingType: string
  pricing: AddOnPrice[]
}

export const addOnPricingNote = 'Mức phí mang tính chất tham khảo, có thể thay đổi tùy khu vực và giờ cao điểm.'

export const addOnServices: AddOnService[] = [
  {
    id: 'addon-service-sofa',
    slug: 'sofa',
    name: 'Vệ sinh Sofa',
    shortName: 'Sofa',
    description: 'Làm sạch sâu sofa tại nhà, hỗ trợ loại bỏ bụi bẩn, mùi và các vết bám thông thường trên nhiều chất liệu.',
    imageUrl: '/image/sofa.jpg',
    benefits: ['Làm sạch bụi và cặn bám sâu', 'Hỗ trợ khử mùi trên bề mặt', 'Phù hợp sofa nỉ, vải và da'],
    process: ['Khảo sát chất liệu và tình trạng sofa', 'Hút bụi toàn bộ bề mặt và khe', 'Phun dung dịch làm sạch phù hợp', 'Chà nhẹ các vùng có vết bám', 'Hút sạch dung dịch và chất bẩn', 'Làm sạch các góc, đường may', 'Sấy khô bề mặt', 'Xịt dưỡng và bàn giao kiểm tra'],
    pricingType: 'Theo chất liệu và số lượng ghế',
    pricing: [
      { label: 'Sofa đơn - Nỉ / vải', price: 'Từ 120.000 VNĐ', note: '1 ghế đơn' },
      { label: 'Sofa 2 chỗ - Nỉ / vải', price: 'Từ 180.000 VNĐ', note: 'Băng sofa 2 chỗ' },
      { label: 'Sofa 3 chỗ - Nỉ / vải', price: 'Từ 240.000 VNĐ', note: 'Băng sofa 3 chỗ' },
      { label: 'Sofa đơn / 2 / 3 chỗ - Da', price: 'Từ 150.000 VNĐ', note: 'Tùy kích thước và tình trạng da' },
    ],
  },
  {
    id: 'addon-service-curtain',
    slug: 'curtain',
    name: 'Vệ sinh Rèm',
    shortName: 'Rèm',
    description: 'Chăm sóc rèm cửa đúng phương pháp để không gian sạch thoáng mà vẫn giữ được phom và chất liệu.',
    imageUrl: '/image/rem.jpg',
    benefits: ['Có lựa chọn giặt khô hoặc giặt nước', 'Hạn chế co rút và phai màu', 'Tư vấn theo chất liệu rèm'],
    process: ['Phân loại chất liệu và kiểm tra nhãn', 'Tháo rèm, đánh dấu vị trí', 'Xử lý bụi bề mặt', 'Chọn phương pháp giặt phù hợp', 'Làm sạch và xử lý mùi', 'Sấy hoặc hong theo chất liệu', 'Kiểm tra phom và lắp lại'],
    pricingType: 'Theo loại giặt và khối lượng',
    pricing: [
      { label: 'Giặt khô rèm đơn', price: 'Từ 180.000 VNĐ', note: 'Một bộ rèm đơn' },
      { label: 'Giặt khô rèm đôi', price: 'Từ 320.000 VNĐ', note: 'Một bộ rèm đôi' },
      { label: 'Giặt nước', price: 'Từ 35.000 VNĐ / kg', note: 'Tối thiểu theo quy định trên app' },
    ],
  },
  {
    id: 'addon-service-mattress',
    slug: 'mattress',
    name: 'Vệ sinh Nệm',
    shortName: 'Nệm',
    description: 'Làm sạch bề mặt nệm và hỗ trợ giảm bụi tích tụ để khu vực nghỉ ngơi dễ chịu hơn.',
    imageUrl: '/image/giuong.jpg',
    benefits: ['Hút bụi kỹ bề mặt nệm', 'Xử lý điểm bám bẩn thông thường', 'Hỗ trợ khử mùi và làm khô'],
    process: ['Kiểm tra kích thước và chất liệu nệm', 'Hút bụi toàn bộ bề mặt', 'Xử lý điểm bẩn phù hợp', 'Phun dung dịch chuyên dụng', 'Chà và hút sạch', 'Sấy khô, kiểm tra trước khi bàn giao'],
    pricingType: 'Theo kích thước nệm',
    pricing: [
      { label: 'Nệm dưới 1.5 m', price: 'Từ 180.000 VNĐ', note: 'Nệm đơn' },
      { label: 'Nệm 1.5 m - 1.8 m', price: 'Từ 240.000 VNĐ', note: 'Nệm đôi tiêu chuẩn' },
      { label: 'Nệm trên 2 m', price: 'Từ 320.000 VNĐ', note: 'Nệm kích thước lớn' },
    ],
  },
  {
    id: 'addon-service-carpet',
    slug: 'carpet',
    name: 'Vệ sinh Thảm',
    shortName: 'Thảm',
    description: 'Làm sạch thảm theo kích thước, hỗ trợ loại bỏ bụi và vết bẩn trong sinh hoạt hàng ngày.',
    imageUrl: '/image/tham.jpg',
    benefits: ['Phân loại theo size rõ ràng', 'Làm sạch bụi và cặn bám', 'Hỗ trợ làm khô và khử mùi'],
    process: ['Đo và xác nhận kích thước thảm', 'Hút bụi hai mặt nếu phù hợp', 'Xử lý điểm bẩn', 'Phun dung dịch làm sạch', 'Chà và hút nước bẩn', 'Sấy hoặc hong khô, kiểm tra bàn giao'],
    pricingType: 'Theo kích thước S, M, L, XL',
    pricing: [
      { label: 'Size S', price: 'Từ 120.000 VNĐ', note: 'Dưới 2 m²' },
      { label: 'Size M', price: 'Từ 180.000 VNĐ', note: 'Từ 2 - 5 m²' },
      { label: 'Size L', price: 'Từ 260.000 VNĐ', note: 'Từ 5 - 10 m²' },
      { label: 'Size XL', price: 'Từ 380.000 VNĐ', note: 'Trên 10 m²' },
    ],
  },
]