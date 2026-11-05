import { useState } from 'react'
import type { AddOn, Category, Service, ServicePackage } from '../../data/mockAdminServices'
import { getAdminCatalog, saveCatalogItem as persistCatalog } from '../../api/operations'
import { useAdminResource } from '../../hooks/useAdminResource'
import ResourceStatus from '../../components/admin/ResourceStatus'
import CatalogItemModal from '../../features/admin/services/CatalogItemModal'
import ServiceModal from '../../features/admin/services/ServiceModal'
import ServiceTable from '../../features/admin/services/ServiceTable'
import { catalogGroupLabel, catalogSearchText } from '../../features/admin/services/catalogGroups'

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
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [catalogMode, setCatalogMode] = useState<CatalogMode | null>(null)
  const [editingCatalogItem, setEditingCatalogItem] = useState<CatalogItem | null>(null)

  const resource = useAdminResource(getAdminCatalog, { categories: [], services: [], packages: [], addOns: [] })
  const { categories, services, packages, addOns } = resource.data
  const applyCatalog = resource.setData
  const [groupFilter, setGroupFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const query = catalogSearchText(search)
  const groupFor = (categoryId: string) => categories.find(category => category.id === categoryId)?.group || 'UNGROUPED'
  const groups = [...new Set(categories.map(category => category.group || 'UNGROUPED'))]
    .sort((a, b) => catalogGroupLabel(a).localeCompare(catalogGroupLabel(b), 'vi'))
  const categoryOptions = categories.filter(category => groupFilter === 'ALL' || groupFor(category.id) === groupFilter)
    .sort((a, b) => a.name.localeCompare(b.name, 'vi'))
  const inScope = (categoryId: string) => (groupFilter === 'ALL' || groupFor(categoryId) === groupFilter) && (categoryFilter === 'ALL' || categoryId === categoryFilter)
  const matches = (...values: string[]) => catalogSearchText(values.join(' ')).includes(query)
  const visibleCategories = categoryOptions.filter(category => inScope(category.id) && matches(category.name, category.description, catalogGroupLabel(groupFor(category.id))))
  const visibleServices = services.filter(service => inScope(service.categoryId) && matches(service.name, service.description, service.categoryName, catalogGroupLabel(groupFor(service.categoryId))))
    .sort((a, b) => a.categoryName.localeCompare(b.categoryName, 'vi') || a.name.localeCompare(b.name, 'vi'))
  const filterItems = <T extends ServicePackage | AddOn,>(items: T[]) => items.filter(item => {
    const service = services.find(service => service.id === item.serviceId)
    return !!service && inScope(service.categoryId) && matches(item.name, item.description, service.name, service.categoryName, catalogGroupLabel(groupFor(service.categoryId)))
  }).sort((a, b) => a.serviceId.localeCompare(b.serviceId) || a.name.localeCompare(b.name, 'vi'))
  const visiblePackages = filterItems(packages)
  const visibleAddOns = filterItems(addOns)
  const resultCount = activeTab === 'categories' ? visibleCategories.length : activeTab === 'services' ? visibleServices.length : activeTab === 'packages' ? visiblePackages.length : visibleAddOns.length
  const scopedServices = services.filter(service => inScope(service.categoryId))
  const initialCategoryId = categoryFilter !== 'ALL' ? categoryFilter : categoryOptions[0]?.id
  const clearFilters = () => { setGroupFilter('ALL'); setCategoryFilter('ALL'); setSearch('') }
  const filterClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'

  const packageCounts = Object.fromEntries(
    packages.map((item) => [item.serviceId, packages.filter((entry) => entry.serviceId === item.serviceId).length])
  )
  const addOnCounts = Object.fromEntries(
    addOns.map((item) => [item.serviceId, addOns.filter((entry) => entry.serviceId === item.serviceId).length])
  )

  const openCatalogModal = (mode: CatalogMode, item: CatalogItem | null = null) => {
    setCatalogMode(mode)
    setEditingCatalogItem(item)
  }

  const saveCatalogItem = async (item: CatalogItem) => {
    if (!catalogMode) return
    await persistCatalog(catalogMode === 'category' ? 'categories' : catalogMode === 'package' ? 'packages' : 'addons', item)
    applyCatalog(await getAdminCatalog()); setCatalogMode(null); setEditingCatalogItem(null)
  }
  const saveService = async (service: Service) => { await persistCatalog('services', service); applyCatalog(await getAdminCatalog()); setEditingService(null) }
  const openNewService = () => setEditingService({ id: `service-${Date.now()}`, name: '', description: '', categoryId: categories[0]?.id ?? '', categoryName: categories[0]?.name ?? '', icon: 'DV', isActive: true, dynamicFields: [] })

  return (
    <div className="space-y-8">
      <ResourceStatus {...resource} />
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-sm font-medium text-emerald-600">Danh mục dịch vụ</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Quản lý dịch vụ</h1><p className="mt-2 text-sm text-slate-500">Quản lý danh mục, dịch vụ, gói và dịch vụ bổ sung trên nền tảng.</p></div><button type="button" onClick={openNewService} className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"> Thêm dịch vụ mới</button></div>
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex gap-1 overflow-x-auto border-b border-slate-200 px-4 pt-3 sm:px-6">{tabs.map((tab) => <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${activeTab === tab.id ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>{tab.label}<span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{tab.id === 'categories' ? categories.length : tab.id === 'services' ? services.length : tab.id === 'packages' ? packages.length : addOns.length}</span></button>)}</div>
        <div className="space-y-3 border-b border-slate-200 bg-slate-50/70 p-4 sm:px-6">
          <div className="grid gap-3 md:grid-cols-3">
            <label className="space-y-1.5 text-xs font-semibold text-slate-600">Nhóm dịch vụ<select value={groupFilter} onChange={event => { setGroupFilter(event.target.value); setCategoryFilter('ALL') }} className={filterClass}><option value="ALL">Tất cả nhóm dịch vụ</option>{groups.map(group => <option key={group} value={group}>{catalogGroupLabel(group)}</option>)}</select></label>
            <label className="space-y-1.5 text-xs font-semibold text-slate-600">Danh mục<select value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)} className={filterClass}><option value="ALL">Tất cả danh mục</option>{categoryOptions.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            <label className="space-y-1.5 text-xs font-semibold text-slate-600">Tìm kiếm<input value={search} onChange={event => setSearch(event.target.value)} placeholder="Nhập tên hoặc mô tả cần tìm…" className={filterClass} /></label>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2"><p role="status" className="text-xs text-slate-500">{resource.loading ? 'Đang tải danh mục…' : `${resultCount} kết quả trong mục ${tabs.find(tab => tab.id === activeTab)?.label}`}</p>{(groupFilter !== 'ALL' || categoryFilter !== 'ALL' || search) && <button type="button" onClick={clearFilters} className="text-xs font-semibold text-emerald-700 hover:underline">Xóa bộ lọc</button>}</div>
        </div>
        {activeTab === 'categories' && <CategoryTable categories={visibleCategories} services={services} onAdd={() => openCatalogModal('category')} onEdit={(item) => openCatalogModal('category', item)} />}
        {activeTab === 'services' && <><div className="flex justify-end px-6 py-4"><button type="button" onClick={openNewService} className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"> Thêm dịch vụ</button></div><div className="space-y-5 px-4 pb-5 sm:px-6">{groups.map(group => {
          const items = visibleServices.filter(service => groupFor(service.categoryId) === group)
          return items.length > 0 && <section key={group} className="overflow-hidden rounded-xl border border-slate-200"><header className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 bg-emerald-50/60 px-4 py-3"><h2 className="font-bold text-emerald-900">{catalogGroupLabel(group)}</h2><span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-emerald-700">{items.length} dịch vụ</span></header><ServiceTable services={items} packageCounts={packageCounts} addOnCounts={addOnCounts} onEdit={setEditingService} /></section>
        })}</div></>}
        {activeTab === 'packages' && <CatalogTable title="gói dịch vụ" items={visiblePackages} services={services} onAdd={() => openCatalogModal('package')} onEdit={(item) => openCatalogModal('package', item)} formatPrice={formatPrice} />}
        {activeTab === 'addons' && <CatalogTable title="dịch vụ bổ sung" items={visibleAddOns} services={services} onAdd={() => openCatalogModal('addon')} onEdit={(item) => openCatalogModal('addon', item)} formatPrice={formatPrice} />}
        {!resource.loading && !resource.error && resultCount === 0 && <div className="px-6 py-12 text-center"><p className="font-semibold text-slate-700">Không có dữ liệu phù hợp</p><p className="mt-2 text-sm text-slate-500">Thử đổi nhóm, danh mục hoặc từ khóa tìm kiếm.</p><button type="button" onClick={clearFilters} className="mt-3 text-sm font-semibold text-emerald-700">Xóa bộ lọc</button></div>}
      </section>
      {editingService && <ServiceModal key={editingService.id} service={editingService.name ? editingService : null} categories={categories} initialCategoryId={initialCategoryId} onClose={() => setEditingService(null)} onSave={saveService} />}
      {catalogMode && <CatalogItemModal mode={catalogMode} item={editingCatalogItem} services={editingCatalogItem ? services : scopedServices} onClose={() => { setCatalogMode(null); setEditingCatalogItem(null) }} onSave={saveCatalogItem} />}
    </div>
  )
}

function CategoryTable({ categories, services, onAdd, onEdit }: { categories: Category[]; services: Service[]; onAdd: () => void; onEdit: (item: Category) => void }) {
  return <div className="overflow-x-auto"><div className="flex justify-end px-6 py-4"><button type="button" onClick={onAdd} className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"> Thêm danh mục</button></div><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-4">Tên danh mục</th><th className="px-6 py-4">Nhóm dịch vụ</th><th className="px-6 py-4">Mô tả</th><th className="px-6 py-4">Số dịch vụ con</th><th className="px-6 py-4 text-right">Thao tác</th></tr></thead><tbody className="divide-y divide-slate-100">{categories.map((category) => <tr key={category.id}><td className="px-6 py-4 font-semibold text-slate-900">{category.name}</td><td className="px-6 py-4 text-emerald-700">{catalogGroupLabel(category.group || 'UNGROUPED')}</td><td className="px-6 py-4 text-slate-600">{category.description}</td><td className="px-6 py-4 text-slate-600">{services.filter((service) => service.categoryId === category.id).length}</td><td className="px-6 py-4 text-right"><button type="button" onClick={() => onEdit(category)} className="font-semibold text-emerald-700 hover:text-emerald-900">Chỉnh sửa</button></td></tr>)}</tbody></table></div>
}

function CatalogTable({ title, items, services, onAdd, onEdit, formatPrice }: { title: string; items: (ServicePackage | AddOn)[]; services: Service[]; onAdd: () => void; onEdit: (item: ServicePackage | AddOn) => void; formatPrice: (price: number) => string }) {
  return <div className="overflow-x-auto"><div className="flex justify-end px-6 py-4"><button type="button" onClick={onAdd} className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"> Thêm {title}</button></div><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-4">Tên</th><th className="px-6 py-4">Mô tả</th><th className="px-6 py-4">Dịch vụ áp dụng</th><th className="px-6 py-4">Thời lượng</th><th className="px-6 py-4 text-right">Giá</th><th className="px-6 py-4 text-right">Thao tác</th></tr></thead><tbody className="divide-y divide-slate-100">{items.map((item) => <tr key={item.id}><td className="px-6 py-4 font-semibold text-slate-900">{item.name}</td><td className="max-w-xs px-6 py-4 text-slate-600">{item.description}</td><td className="px-6 py-4 text-slate-600">{services.find((service) => service.id === item.serviceId)?.name ?? 'Không xác định'}</td><td className="px-6 py-4 text-slate-600">{item.duration}</td><td className="px-6 py-4 text-right font-semibold text-slate-900">{formatPrice(item.price)}</td><td className="px-6 py-4 text-right"><button type="button" onClick={() => onEdit(item)} className="font-semibold text-emerald-700 hover:text-emerald-900">Chỉnh sửa</button></td></tr>)}</tbody></table></div>
}
