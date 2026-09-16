import { useState } from 'react'
import type { AddOn, Category, Service, ServicePackage } from '../../data/mockAdminServices'
import { mockAddOns, mockAdminServices, mockCategories, mockServicePackages } from '../../data/mockAdminServices'
import CatalogItemModal from '../../features/admin/services/CatalogItemModal'
import ServiceModal from '../../features/admin/services/ServiceModal'
import ServiceTable from '../../features/admin/services/ServiceTable'

type ServiceTab = 'categories' | 'services' | 'packages' | 'addons'
type CatalogMode = 'category' | 'package' | 'addon'
type CatalogItem = Category | ServicePackage | AddOn

const tabs: { id: ServiceTab; label: string }[] = [
  { id: 'categories', label: 'Danh mục' },
  { id: 'services', label: 'Dịch vụ' },
  { id: 'packages', label: 'Gói dịch vụ' },
  { id: 'addons', label: 'Dịch vụ bổ sung' },
]

const formatPrice = (price: number) => `${new Intl.NumberFormat('vi-VN').format(price)}đ`

export default function AdminServices() {
  const [activeTab, setActiveTab] = useState<ServiceTab>('services')
  const [services, setServices] = useState<Service[]>(mockAdminServices)
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [packages, setPackages] = useState<ServicePackage[]>(mockServicePackages)
  const [addOns, setAddOns] = useState<AddOn[]>(mockAddOns)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [catalogMode, setCatalogMode] = useState<CatalogMode | null>(null)
  const [editingCatalogItem, setEditingCatalogItem] = useState<CatalogItem | null>(null)

  const packageCounts = Object.fromEntries(packages.map((item) => [item.serviceId, packages.filter((entry) => entry.serviceId === item.serviceId).length]))
  const addOnCounts = Object.fromEntries(addOns.map((item) => [item.serviceId, addOns.filter((entry) => entry.serviceId === item.serviceId).length]))

  const openCatalogModal = (mode: CatalogMode, item: CatalogItem | null = null) => { setCatalogMode(mode); setEditingCatalogItem(item) }
  const saveCatalogItem = (item: CatalogItem) => {
    if (catalogMode === 'category') setCategories((current) => current.some((entry) => entry.id === item.id) ? current.map((entry) => entry.id === item.id ? item as Category : entry) : [...current, item as Category])
    if (catalogMode === 'package') setPackages((current) => current.some((entry) => entry.id === item.id) ? current.map((entry) => entry.id === item.id ? item as ServicePackage : entry) : [...current, item as ServicePackage])
    if (catalogMode === 'addon') setAddOns((current) => current.some((entry) => entry.id === item.id) ? current.map((entry) => entry.id === item.id ? item as AddOn : entry) : [...current, item as AddOn])
    setCatalogMode(null)
    setEditingCatalogItem(null)
  }

  const saveService = (service: Service) => setServices((current) => current.some((item) => item.id === service.id) ? current.map((item) => item.id === service.id ? service : item) : [...current, service])
  const openNewService = () => setEditingService({ id: `service-${Date.now()}`, name: '', description: '', categoryId: categories[0]?.id ?? '', categoryName: categories[0]?.name ?? '', icon: 'DV', isActive: true, dynamicFields: [] })

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-sm font-medium text-emerald-600">Danh mục dịch vụ</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Quản lý dịch vụ</h1><p className="mt-2 text-sm text-slate-500">Quản lý danh mục, dịch vụ, gói và dịch vụ bổ sung trên nền tảng.</p></div><button type="button" onClick={openNewService} className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"> Thêm dịch vụ mới</button></div>
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex gap-1 overflow-x-auto border-b border-slate-200 px-4 pt-3 sm:px-6">{tabs.map((tab) => <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${activeTab === tab.id ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>{tab.label}<span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{tab.id === 'categories' ? categories.length : tab.id === 'services' ? services.length : tab.id === 'packages' ? packages.length : addOns.length}</span></button>)}</div>
        {activeTab === 'categories' && <CategoryTable categories={categories} services={services} onAdd={() => openCatalogModal('category')} onEdit={(item) => openCatalogModal('category', item)} />}
        {activeTab === 'services' && <><div className="flex justify-end px-6 py-4"><button type="button" onClick={openNewService} className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"> Thêm dịch vụ</button></div><ServiceTable services={services} packageCounts={packageCounts} addOnCounts={addOnCounts} onEdit={setEditingService} /></>}
        {activeTab === 'packages' && <CatalogTable title="gói dịch vụ" items={packages} services={services} onAdd={() => openCatalogModal('package')} onEdit={(item) => openCatalogModal('package', item)} formatPrice={formatPrice} />}
        {activeTab === 'addons' && <CatalogTable title="dịch vụ bổ sung" items={addOns} services={services} onAdd={() => openCatalogModal('addon')} onEdit={(item) => openCatalogModal('addon', item)} formatPrice={formatPrice} />}
      </section>
      {editingService && <ServiceModal key={editingService.id} service={editingService.name ? editingService : null} categories={categories} onClose={() => setEditingService(null)} onSave={(service) => { saveService(service); setEditingService(null) }} />}
      {catalogMode && <CatalogItemModal mode={catalogMode} item={editingCatalogItem} services={services} onClose={() => { setCatalogMode(null); setEditingCatalogItem(null) }} onSave={saveCatalogItem} />}
    </div>
  )
}

function CategoryTable({ categories, services, onAdd, onEdit }: { categories: Category[]; services: Service[]; onAdd: () => void; onEdit: (item: Category) => void }) {
  return <div className="overflow-x-auto"><div className="flex justify-end px-6 py-4"><button type="button" onClick={onAdd} className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"> Thêm danh mục</button></div><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-4">Tên danh mục</th><th className="px-6 py-4">Mô tả</th><th className="px-6 py-4">Số dịch vụ con</th><th className="px-6 py-4 text-right">Thao tác</th></tr></thead><tbody className="divide-y divide-slate-100">{categories.map((category) => <tr key={category.id}><td className="px-6 py-4 font-semibold text-slate-900">{category.name}</td><td className="px-6 py-4 text-slate-600">{category.description}</td><td className="px-6 py-4 text-slate-600">{services.filter((service) => service.categoryId === category.id).length}</td><td className="px-6 py-4 text-right"><button type="button" onClick={() => onEdit(category)} className="font-semibold text-emerald-700 hover:text-emerald-900">Chỉnh sửa</button></td></tr>)}</tbody></table></div>
}

function CatalogTable({ title, items, services, onAdd, onEdit, formatPrice }: { title: string; items: (ServicePackage | AddOn)[]; services: Service[]; onAdd: () => void; onEdit: (item: ServicePackage | AddOn) => void; formatPrice: (price: number) => string }) {
  return <div className="overflow-x-auto"><div className="flex justify-end px-6 py-4"><button type="button" onClick={onAdd} className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"> Thêm {title}</button></div><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-4">Tên</th><th className="px-6 py-4">Mô tả</th><th className="px-6 py-4">Dịch vụ áp dụng</th><th className="px-6 py-4">Thời lượng</th><th className="px-6 py-4 text-right">Giá</th><th className="px-6 py-4 text-right">Thao tác</th></tr></thead><tbody className="divide-y divide-slate-100">{items.map((item) => <tr key={item.id}><td className="px-6 py-4 font-semibold text-slate-900">{item.name}</td><td className="max-w-xs px-6 py-4 text-slate-600">{item.description}</td><td className="px-6 py-4 text-slate-600">{services.find((service) => service.id === item.serviceId)?.name ?? 'Không xác định'}</td><td className="px-6 py-4 text-slate-600">{item.duration}</td><td className="px-6 py-4 text-right font-semibold text-slate-900">{formatPrice(item.price)}</td><td className="px-6 py-4 text-right"><button type="button" onClick={() => onEdit(item)} className="font-semibold text-emerald-700 hover:text-emerald-900">Chỉnh sửa</button></td></tr>)}</tbody></table></div>
}
