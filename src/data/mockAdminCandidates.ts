import { mockAdminServices } from './mockAdminServices'

export type CandidateStatus = 'PENDING' | 'ONBOARDING' | 'TRAINING' | 'EVALUATION'
export type CandidateGender = 'Nam' | 'Nữ' | 'Khác'
export type CandidateSource = 'Website' | 'Google Forms' | 'Zalo' | 'Walk-in'

export interface Candidate {
  id: string
  fullName: string
  phone: string
  email: string
  cccd: string
  birthYear: number
  gender: CandidateGender
  area: string
  source: CandidateSource
  services: string[]
  registeredAt: string
  status: CandidateStatus
  subStatus: string
  note: string
  documentChecklist?: string[]
  onboardingNote?: string
  trainingScore?: number
  trainingNotes?: string
  rank?: string
  appliedFee?: string
}

export const candidateStatuses: { id: CandidateStatus; label: string; shortLabel: string }[] = [
  { id: 'PENDING', label: 'Chờ duyệt', shortLabel: 'Chờ duyệt' },
  { id: 'ONBOARDING', label: 'Đang tiếp nhận', shortLabel: 'Tiếp nhận' },
  { id: 'TRAINING', label: 'Đào tạo', shortLabel: 'Đào tạo' },
  { id: 'EVALUATION', label: 'Đánh giá', shortLabel: 'Đánh giá' },
]

const services = (ids: string[]) => ids.map((id) => mockAdminServices.find((service) => service.id === id)?.name ?? 'Dịch vụ chưa xác định')

export const mockAdminCandidates: Candidate[] = [
  { id: 'candidate-001', fullName: 'Đỗ Minh Anh', phone: '0908 123 456', email: 'minhanh@example.vn', cccd: '079204001122', birthYear: 1998, gender: 'Nữ', area: 'Quận 3', source: 'Website', services: services(['service-home-cleaning']), registeredAt: '16/09/2026', status: 'ONBOARDING', subStatus: 'Đang xác minh hồ sơ', note: 'Có kinh nghiệm dọn dẹp căn hộ và nhà phố.' },
  { id: 'candidate-002', fullName: 'Nguyễn Quốc Toàn', phone: '0914 222 333', email: 'quoctoan@example.vn', cccd: '079201003344', birthYear: 1995, gender: 'Nam', area: 'Quận Tân Bình', source: 'Google Forms', services: services(['service-air-conditioner', 'service-home-cleaning']), registeredAt: '15/09/2026', status: 'PENDING', subStatus: 'Chờ duyệt', note: 'Đã có kinh nghiệm sửa chữa thiết bị điện lạnh.' },
  { id: 'candidate-003', fullName: 'Trần Ngọc Mai', phone: '0981 456 789', email: 'ngocmai@example.vn', cccd: '079202005566', birthYear: 1997, gender: 'Nữ', area: 'Quận Bình Thạnh', source: 'Google Forms', services: services(['service-childcare']), registeredAt: '12/09/2026', status: 'PENDING', subStatus: 'Chờ duyệt', note: 'Có chứng chỉ sơ cấp chăm sóc trẻ em.' },
  { id: 'candidate-004', fullName: 'Lê Hoàng Nam', phone: '0935 777 888', email: 'hoangnam@example.vn', cccd: '079198007788', birthYear: 1994, gender: 'Nam', area: 'Quận 7', source: 'Zalo', services: services(['service-home-cleaning']), registeredAt: '08/09/2026', status: 'TRAINING', subStatus: 'Đang học việc', trainingScore: 82, trainingNotes: 'Thực hiện tốt quy trình, cần cải thiện tốc độ.', note: 'Đang tham gia khóa đào tạo quy trình dịch vụ.' },
  { id: 'candidate-005', fullName: 'Phạm Thùy Dương', phone: '0976 321 654', email: 'thuyduong@example.vn', cccd: '079200009900', birthYear: 1999, gender: 'Nữ', area: 'Quận 2', source: 'Website', services: services(['service-childcare']), registeredAt: '05/09/2026', status: 'EVALUATION', subStatus: 'Chờ xếp hạng', trainingScore: 91, trainingNotes: 'Nắm vững quy trình chăm sóc và giao tiếp với gia đình.', note: 'Đã hoàn thành chương trình đào tạo chăm sóc trẻ.' },
  { id: 'candidate-006', fullName: 'Võ Thanh Tùng', phone: '0922 654 321', email: 'thanhtung@example.vn', cccd: '079199001010', birthYear: 1993, gender: 'Nam', area: 'Quận 1', source: 'Walk-in', services: services(['service-air-conditioner']), registeredAt: '28/08/2026', status: 'EVALUATION', subStatus: 'Chờ xếp hạng', trainingScore: 88, trainingNotes: 'Đạt yêu cầu kỹ thuật và an toàn lao động.', note: 'Đã hoàn thành giai đoạn học việc, chờ chuyển chính thức.' },
]
