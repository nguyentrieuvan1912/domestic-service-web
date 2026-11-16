export const catalogGroupNames: Record<string, string> = {
  CLEANING: 'Dọn dẹp và vệ sinh nhà cửa',
  APPLIANCES: 'Vệ sinh và bảo dưỡng thiết bị',
  CARE: 'Chăm sóc gia đình và thú cưng',
  HOME_TASKS: 'Công việc gia đình và tiện ích',
  UNGROUPED: 'Chưa phân nhóm',
}
export const catalogGroupLabel = (group: string) => catalogGroupNames[group] || group
export const catalogSearchText = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim()
