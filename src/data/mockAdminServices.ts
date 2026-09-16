export type DynamicFieldType = 'number' | 'text' | 'select'

export interface Category {
  id: string
  name: string
  serviceCount: number
  description: string
}

export interface DynamicField {
  id: string
  fieldName: string
  fieldType: DynamicFieldType
  isRequired: boolean
  options?: string[]
}

export interface Service {
  id: string
  name: string
  description: string
  categoryId: string
  categoryName: string
  icon: string
  isActive: boolean
  dynamicFields: DynamicField[]
}

export interface ServicePackage {
  id: string
  serviceId: string
  name: string
  description: string
  price: number
  duration: string
  isActive: boolean
}

export interface AddOn {
  id: string
  serviceId: string
  name: string
  description: string
  price: number
  duration: string
  isActive: boolean
}

export const mockCategories: Category[] = [
  { id: 'home-cleaning', name: 'Vệ sinh nhà', serviceCount: 2, description: 'Dọn dẹp định kỳ và tổng vệ sinh không gian sống.' },
  { id: 'appliance-cleaning', name: 'Vệ sinh thiết bị', serviceCount: 4, description: 'Vệ sinh, bảo dưỡng các thiết bị gia dụng.' },
  { id: 'childcare', name: 'Chăm sóc trẻ em', serviceCount: 1, description: 'Đồng hành cùng gia đình trong việc chăm sóc trẻ.' },
  { id: 'elderly-care', name: 'Chăm sóc người cao tuổi', serviceCount: 1, description: 'Dịch vụ hỗ trợ sinh hoạt và chăm sóc người cao tuổi.' },
]

export const mockAdminServices: Service[] = [
  {
    id: 'service-home-cleaning',
    name: 'Dọn nhà theo giờ',
    description: 'Làm sạch các khu vực chính trong nhà theo thời lượng khách chọn.',
    categoryId: 'home-cleaning',
    categoryName: 'Vệ sinh nhà',
    icon: 'NH',
    isActive: true,
    dynamicFields: [
      { id: 'field-home-area', fieldName: 'Diện tích căn hộ (m²)', fieldType: 'number', isRequired: true },
      { id: 'field-home-room', fieldName: 'Số phòng cần dọn', fieldType: 'number', isRequired: true },
      { id: 'field-home-note', fieldName: 'Ghi chú đặc biệt', fieldType: 'text', isRequired: false },
    ],
  },
  {
    id: 'service-air-conditioner',
    name: 'Vệ sinh máy lạnh',
    description: 'Vệ sinh chuyên sâu và kiểm tra hoạt động cho máy lạnh tại nhà.',
    categoryId: 'appliance-cleaning',
    categoryName: 'Vệ sinh thiết bị',
    icon: 'AC',
    isActive: true,
    dynamicFields: [
      { id: 'field-ac-count', fieldName: 'Số lượng máy lạnh', fieldType: 'number', isRequired: true },
      { id: 'field-ac-horsepower', fieldName: 'Số lượng ngựa', fieldType: 'select', isRequired: true, options: ['1 HP', '1.5 HP', '2 HP', 'Trên 2 HP'] },
      { id: 'field-ac-condition', fieldName: 'Tình trạng thiết bị', fieldType: 'select', isRequired: true, options: ['Hoạt động bình thường', 'Chảy nước', 'Không lạnh', 'Cần kiểm tra'] },
    ],
  },
  {
    id: 'service-childcare',
    name: 'Trông trẻ tại nhà',
    description: 'Chăm sóc và hỗ trợ sinh hoạt cho bé theo ca linh hoạt.',
    categoryId: 'childcare',
    categoryName: 'Chăm sóc trẻ em',
    icon: 'TE',
    isActive: true,
    dynamicFields: [
      { id: 'field-child-age', fieldName: 'Độ tuổi của bé', fieldType: 'select', isRequired: true, options: ['Dưới 1 tuổi', '1 - 3 tuổi', '4 - 6 tuổi', 'Trên 6 tuổi'] },
      { id: 'field-child-count', fieldName: 'Số lượng bé', fieldType: 'number', isRequired: true },
      { id: 'field-child-request', fieldName: 'Yêu cầu chăm sóc', fieldType: 'text', isRequired: false },
    ],
  },
]

export const mockServicePackages: ServicePackage[] = [
  { id: 'package-home-2h', serviceId: 'service-home-cleaning', name: 'Gói tiêu chuẩn 2 giờ', description: 'Dọn dẹp các khu vực chính trong căn hộ.', price: 280000, duration: '2 giờ', isActive: true },
  { id: 'package-ac-basic', serviceId: 'service-air-conditioner', name: 'Vệ sinh 1 máy', description: 'Vệ sinh dàn lạnh và kiểm tra hoạt động cơ bản.', price: 150000, duration: '60 phút', isActive: true },
  { id: 'package-childcare-day', serviceId: 'service-childcare', name: 'Chăm bé theo ngày', description: 'Chăm sóc bé trong một ngày làm việc.', price: 680000, duration: '8 giờ', isActive: true },
]

export const mockAddOns: AddOn[] = [
  { id: 'addon-home-kitchen', serviceId: 'service-home-cleaning', name: 'Vệ sinh tủ bếp', description: 'Làm sạch sâu khu vực tủ và mặt bếp.', price: 80000, duration: '30 phút', isActive: true },
  { id: 'addon-ac-spray', serviceId: 'service-air-conditioner', name: 'Xịt khử khuẩn', description: 'Bổ sung bước khử khuẩn sau khi vệ sinh.', price: 50000, duration: '15 phút', isActive: true },
  { id: 'addon-child-meal', serviceId: 'service-childcare', name: 'Chuẩn bị bữa ăn cho bé', description: 'Hỗ trợ chuẩn bị bữa ăn theo hướng dẫn của gia đình.', price: 70000, duration: '45 phút', isActive: true },
]