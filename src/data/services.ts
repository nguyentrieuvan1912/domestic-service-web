export interface AddOn {
  id: string
  code: string
  name: string
  description: string
  imageUrl: string
  active: boolean
}

export interface ServicePackage {
  id: string
  code: string
  name: string
  description: string
  suitableFor: string
  duration: string
  areaRange: string
  imageUrl: string
  active: boolean
  addOnIds: string[]
  addOns?: AddOn[]
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
  {
    id: 'addon-sofa',
    code: 'SOFA_CLEANING',
    name: 'Vệ sinh sofa',
    description: 'Làm sạch bụi bẩn và vết bám trên bề mặt sofa.',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85',
    active: true,
  },
  {
    id: 'addon-curtain',
    code: 'CURTAIN_CLEANING',
    name: 'Vệ sinh rèm',
    description: 'Làm sạch rèm cửa, giúp không gian thoáng và sáng hơn.',
    imageUrl: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85',
    active: true,
  },
  {
    id: 'addon-mattress',
    code: 'MATTRESS_CLEANING',
    name: 'Vệ sinh nệm',
    description: 'Hỗ trợ làm sạch và chăm sóc nệm tại nhà.',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85',
    active: true,
  },
  {
    id: 'addon-carpet',
    code: 'CARPET_CLEANING',
    name: 'Vệ sinh thảm',
    description: 'Làm sạch thảm và xử lý bụi bẩn tích tụ.',
    imageUrl: 'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=900&q=85',
    active: true,
  },
]

const addOnById = new Map(addOns.map((addOn) => [addOn.id, addOn]))

const packageDefinitions: Array<Omit<ServicePackage, 'addOns'> & { serviceCode: string }> = [
  {
    id: 'package-one-off',
    code: 'ONE_OFF_STANDARD',
    serviceCode: 'ONE_OFF_CLEANING',
    name: 'Dọn dẹp theo ca',
    description: 'Linh hoạt theo nhu cầu, phù hợp cho những ngày cần nhà cửa gọn gàng thật nhanh.',
    suitableFor: 'Gia đình cần hỗ trợ dọn dẹp theo từng lần',
    duration: '2 - 4 giờ',
    areaRange: 'Căn hộ, nhà phố dưới 150 m²',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=85',
    active: true,
    addOnIds: ['addon-sofa', 'addon-curtain', 'addon-mattress', 'addon-carpet'],
  },
  {
    id: 'package-recurring',
    code: 'RECURRING_STANDARD',
    serviceCode: 'RECURRING_CLEANING',
    name: 'Dọn dẹp định kỳ',
    description: 'Giữ không gian luôn sạch sẽ với lịch dọn dẹp đều đặn, dễ dàng điều chỉnh.',
    suitableFor: 'Gia đình muốn duy trì không gian sạch mỗi tuần',
    duration: 'Theo lịch hẹn',
    areaRange: 'Căn hộ, nhà phố dưới 200 m²',
    imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=85',
    active: true,
    addOnIds: ['addon-sofa', 'addon-curtain', 'addon-mattress'],
  },
  {
    id: 'package-deep-cleaning',
    code: 'DEEP_CLEANING_STANDARD',
    serviceCode: 'DEEP_CLEANING',
    name: 'Tổng vệ sinh',
    description: 'Làm sạch kỹ các khu vực cần chăm chút, lý tưởng trước và sau những dịp đặc biệt.',
    suitableFor: 'Nhà cần tổng vệ sinh hoặc làm sạch chuyên sâu',
    duration: '4 - 8 giờ',
    areaRange: 'Nhà ở, văn phòng nhỏ dưới 300 m²',
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=900&q=85',
    active: true,
    addOnIds: ['addon-sofa', 'addon-curtain', 'addon-mattress', 'addon-carpet'],
  },
]

export const servicePackages: ServicePackage[] = packageDefinitions.map((servicePackage) => ({
  ...servicePackage,
  addOns: servicePackage.addOnIds.map((addOnId) => addOnById.get(addOnId)).filter((addOn): addOn is AddOn => Boolean(addOn)),
}))

export const services: Service[] = [
  {
    id: 'service-cleaning',
    code: 'HOME_CLEANING',
    name: 'Dọn dẹp nhà ở',
    description: 'Các gói dọn dẹp linh hoạt cho không gian sống của gia đình.',
    category: 'CLEANING',
    active: true,
    packages: servicePackages,
  },
]
