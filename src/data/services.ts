export interface AddOn {
  id: string
  code: string
  name: string
  description: string
  imageUrl: string
  active: boolean
}

export interface ServiceBenefit {
  icon: string
  title: string
  description: string
}

export interface ServiceArea {
  area: string
  tasks: string[]
}

export interface ServicePrice {
  label: string
  area: string
  price: string
  highlights: string[]
  featured?: boolean
}

export interface BookingStep {
  title: string
  description: string
}

export interface ServicePackage {
  id: string
  slug: string
  code: string
  name: string
  description: string
  suitableFor: string
  duration: string
  areaRange: string
  imageUrl: string
  bannerImage: string
  active: boolean
  addOnIds: string[]
  addOns?: AddOn[]
  benefits: ServiceBenefit[]
  scopeOfWork: ServiceArea[]
  pricing: ServicePrice[]
  pricingNotes: string[]
  bookingSteps: BookingStep[]
}

export interface Service {
  id: string
  code: string
  name: string
  description: string
  category: 'CLEANING' | 'ADD_ON'
  active: boolean
  packages: ServicePackage[]
}

export const addOns: AddOn[] = [
  { id: 'addon-sofa', code: 'SOFA_CLEANING', name: 'Vệ sinh sofa', description: 'Làm sạch bụi bẩn và vết bám trên bề mặt sofa.', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85', active: true },
  { id: 'addon-curtain', code: 'CURTAIN_CLEANING', name: 'Vệ sinh rèm', description: 'Làm sạch rèm cửa, giúp không gian thoáng và sáng hơn.', imageUrl: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85', active: true },
  { id: 'addon-mattress', code: 'MATTRESS_CLEANING', name: 'Vệ sinh nệm', description: 'Hỗ trợ làm sạch và chăm sóc nệm tại nhà.', imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85', active: true },
  { id: 'addon-carpet', code: 'CARPET_CLEANING', name: 'Vệ sinh thảm', description: 'Làm sạch thảm và xử lý bụi bẩn tích tụ.', imageUrl: 'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=900&q=85', active: true },
]

const commonBenefits = [
  { icon: '◷', title: 'Tiết kiệm thời gian', description: 'Giải phóng những giờ dọn dẹp để bạn tập trung cho gia đình và công việc.' },
  { icon: '✓', title: 'Staff chuyên nghiệp', description: 'Đội ngũ được tuyển chọn và hướng dẫn theo tiêu chuẩn CleanMaster.' },
  { icon: '✦', title: 'Trải nghiệm minh bạch', description: 'Thông tin gói dịch vụ và phạm vi công việc được hiển thị rõ ràng.' },
  { icon: '⊞', title: 'Linh hoạt theo nhu cầu', description: 'Chọn thời lượng, khu vực và add-on phù hợp trên Mobile App.' },
]

const commonAreas = [
  { area: 'Phòng khách', tasks: ['Quét và hút bụi sàn', 'Lau sàn, vệ sinh bề mặt bàn kệ', 'Sắp xếp vật dụng theo hướng dẫn'] },
  { area: 'Phòng bếp', tasks: ['Lau mặt bếp và bồn rửa', 'Vệ sinh mặt bàn, khu vực dễ bám bẩn', 'Thu gom rác sinh hoạt'] },
  { area: 'Phòng ngủ', tasks: ['Quét bụi và lau sàn', 'Gấp chăn, sắp xếp bề mặt', 'Lau các khu vực dễ bám bụi'] },
  { area: 'Phòng tắm', tasks: ['Vệ sinh lavabo và gương', 'Cọ rửa khu vực sàn', 'Lau các bề mặt trong tầm với'] },
]

function bookingSteps(serviceName: string): BookingStep[] {
  return [
    { title: 'Chọn dịch vụ', description: `Chọn ${serviceName} trên Mobile App.` },
    { title: 'Nhập chi tiết', description: 'Cung cấp khu vực, diện tích và yêu cầu cần lưu ý.' },
    { title: 'Chọn thời gian', description: 'Chọn ngày và khung giờ phù hợp với lịch trình.' },
    { title: 'Xác nhận', description: 'Kiểm tra thông tin và xác nhận trên ứng dụng.' },
  ]
}

const packageDefinitions: ServicePackage[] = [
  {
    id: 'package-one-off', slug: 'one-off', code: 'ONE_OFF_STANDARD', name: 'Dọn dẹp theo ca',
    description: 'Linh hoạt theo nhu cầu, phù hợp cho những ngày cần nhà cửa gọn gàng thật nhanh.', suitableFor: 'Gia đình cần hỗ trợ dọn dẹp theo từng lần', duration: '2 - 4 giờ', areaRange: 'Căn hộ, nhà phố dưới 150 m²',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=85', bannerImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1800&q=85', active: true, addOnIds: addOns.map((addOn) => addOn.id), benefits: commonBenefits, scopeOfWork: commonAreas,
    pricing: [
      { label: 'Gói 2 giờ', area: 'Tối đa 55 m²', price: 'Từ 150.000 VNĐ', highlights: ['Phù hợp căn hộ nhỏ', 'Tập trung khu vực ưu tiên'] },
      { label: 'Gói 3 giờ', area: 'Tối đa 85 m²', price: 'Từ 210.000 VNĐ', highlights: ['Cân bằng nhiều khu vực', 'Lựa chọn phổ biến'], featured: true },
      { label: 'Gói 4 giờ', area: 'Tối đa 120 m²', price: 'Từ 280.000 VNĐ', highlights: ['Phù hợp nhà rộng hơn', 'Có thêm thời gian chăm chút'] },
    ],
    pricingNotes: ['Mức giá là tham khảo và có thể thay đổi theo khu vực, thời điểm và yêu cầu thực tế.', 'Add-on được lựa chọn riêng trên Mobile App.', 'Giá cuối cùng được hiển thị trước khi Customer xác nhận.'], bookingSteps: bookingSteps('Dọn dẹp theo ca'),
  },
  {
    id: 'package-recurring', slug: 'recurring', code: 'RECURRING_STANDARD', name: 'Dọn dẹp định kỳ',
    description: 'Giữ không gian luôn sạch sẽ với lịch dọn dẹp đều đặn, dễ dàng điều chỉnh.', suitableFor: 'Gia đình muốn duy trì không gian sạch mỗi tuần', duration: 'Theo lịch hẹn', areaRange: 'Căn hộ, nhà phố dưới 200 m²',
    imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=85', bannerImage: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1800&q=85', active: true, addOnIds: ['addon-sofa', 'addon-curtain', 'addon-mattress'], benefits: [{ ...commonBenefits[0], title: 'Nhà luôn trong trạng thái tốt' }, { ...commonBenefits[1], title: 'Lịch trình chủ động' }, { ...commonBenefits[2], title: 'Ưu đãi dài hạn' }, { ...commonBenefits[3], title: 'Dễ dàng điều chỉnh' }], scopeOfWork: commonAreas,
    pricing: [
      { label: 'Gói 2 giờ', area: 'Tối đa 55 m²', price: 'Từ 140.000 VNĐ', highlights: ['Lịch hàng tuần', 'Duy trì khu vực chính'] },
      { label: 'Gói 3 giờ', area: 'Tối đa 85 m²', price: 'Từ 195.000 VNĐ', highlights: ['Lịch linh hoạt', 'Phù hợp gia đình bận rộn'], featured: true },
      { label: 'Gói 4 giờ', area: 'Tối đa 120 m²', price: 'Từ 260.000 VNĐ', highlights: ['Chăm sóc nhiều khu vực', 'Có thể thêm add-on'] },
    ],
    pricingNotes: ['Giá tham khảo áp dụng cho lịch định kỳ theo chính sách trên Mobile App.', 'Lịch định kỳ có thể được điều chỉnh theo nhu cầu và khu vực phục vụ.', 'Mọi thông tin giá được hiển thị minh bạch trước khi xác nhận.'], bookingSteps: bookingSteps('Dọn dẹp định kỳ'),
  },
  {
    id: 'package-deep-cleaning', slug: 'deep-cleaning', code: 'DEEP_CLEANING_STANDARD', name: 'Tổng vệ sinh',
    description: 'Làm sạch kỹ các khu vực cần chăm chút, lý tưởng trước và sau những dịp đặc biệt.', suitableFor: 'Nhà cần tổng vệ sinh hoặc làm sạch chuyên sâu', duration: '4 - 8 giờ', areaRange: 'Nhà ở, văn phòng nhỏ dưới 300 m²',
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=900&q=85', bannerImage: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=1800&q=85', active: true, addOnIds: addOns.map((addOn) => addOn.id), benefits: [{ ...commonBenefits[0], title: 'Làm sạch chuyên sâu' }, { ...commonBenefits[1], title: 'Phù hợp dịp đặc biệt' }, { ...commonBenefits[2], title: 'Quy trình rõ ràng' }, { ...commonBenefits[3], title: 'Hỗ trợ add-on' }], scopeOfWork: commonAreas,
    pricing: [
      { label: 'Gói 2 giờ', area: 'Khu vực ưu tiên', price: 'Từ 220.000 VNĐ', highlights: ['Tập trung điểm cần làm sạch', 'Phù hợp không gian nhỏ'] },
      { label: 'Gói 3 giờ', area: 'Tối đa 85 m²', price: 'Từ 320.000 VNĐ', highlights: ['Làm sạch nhiều khu vực', 'Cân bằng thời gian và phạm vi'], featured: true },
      { label: 'Gói 4 giờ', area: 'Tối đa 150 m²', price: 'Từ 430.000 VNĐ', highlights: ['Tổng vệ sinh toàn diện', 'Có thể kết hợp add-on'] },
    ],
    pricingNotes: ['Mức giá phụ thuộc vào hiện trạng, diện tích và phạm vi cần xử lý.', 'Các hạng mục ngoài phạm vi sẽ được tư vấn riêng trên Mobile App.', 'Customer cần cung cấp thông tin chính xác để hệ thống gợi ý thời lượng phù hợp.'], bookingSteps: bookingSteps('Tổng vệ sinh'),
  },
]

export const servicePackages: ServicePackage[] = packageDefinitions.map((servicePackage) => ({ ...servicePackage, addOns: servicePackage.addOnIds.map((id) => addOns.find((addOn) => addOn.id === id)).filter((addOn): addOn is AddOn => Boolean(addOn)) }))

export const services: Service[] = [{ id: 'service-cleaning', code: 'HOME_CLEANING', name: 'Dọn dẹp nhà ở', description: 'Các gói dọn dẹp linh hoạt cho không gian sống của gia đình.', category: 'CLEANING', active: true, packages: servicePackages }]
