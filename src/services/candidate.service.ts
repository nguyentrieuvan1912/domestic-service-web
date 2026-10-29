import { mockAdminCandidates, type Candidate, type CandidateGender, type CandidateSource } from '../data/mockAdminCandidates'

export interface ApplicationData {
  fullName: string
  email: string
  phone: string
  identityCard: string
  birthYear: number
  gender: CandidateGender
  area: string
  source: CandidateSource
  services: string[]
}

export const submitApplication = async (data: ApplicationData): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCandidate: Candidate = {
        id: `candidate-${Date.now()}`,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        cccd: data.identityCard,
        birthYear: data.birthYear,
        gender: data.gender,
        area: data.area,
        source: data.source,
        services: data.services,
        registeredAt: new Date().toLocaleDateString('vi-VN'),
        status: 'PENDING',
        subStatus: 'Chờ duyệt',
        note: 'Đăng ký qua form ứng tuyển trực tuyến mới trên website.',
      }
      
      mockAdminCandidates.unshift(newCandidate)
      
      resolve({
        success: true,
        message: 'Đăng ký thành công! CleanMaster sẽ liên hệ với bạn trong vòng 24h để hẹn lịch phỏng vấn.',
      })
    }, 1500)
  })
}
