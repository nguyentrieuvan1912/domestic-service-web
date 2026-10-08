import { servicePackages, type ServicePackage } from '../data/services'
import { money, type CatalogDetail, type CatalogService } from './catalog'

// Preserve the existing page model; API owns IDs, availability, content and prices.
export function webCatalogView(item: CatalogService, detail?: CatalogDetail): ServicePackage {
  const template = servicePackages.find(service => service.code === item.code)
  return {
    id: String(item.id), slug: String(item.id), code: item.code, name: item.name,
    description: item.description || '', active: true,
    imageUrl: item.imageUrl || '', bannerImage: item.imageUrl || '',
    suitableFor: template?.suitableFor || item.shortDescription || '',
    duration: template?.duration || `${item.estimatedDurationMinutes} phút`,
    areaRange: template?.areaRange || '', addOnIds: [],
    addOns: detail?.addOns.map(add => ({ id: String(add.id), code: String(add.id), name: add.name,
      description: add.description || '', imageUrl: add.imageUrl || '', active: true })) || [],
    benefits: detail?.benefits.map((description, index) => ({
      icon: template?.benefits[index]?.icon || '✓', title: template?.benefits[index]?.title || description, description,
    })) || [],
    scopeOfWork: template?.scopeOfWork || [],
    pricing: detail?.packages.map((pkg, index) => ({ label: pkg.name,
      area: pkg.maxArea ? `Tối đa ${pkg.maxArea} m²` : `${pkg.durationMinutes} phút`,
      price: `Từ ${money(pkg.basePrice)}`, highlights: template?.pricing[index]?.highlights || [],
      featured: template?.pricing[index]?.featured,
    })) || [],
    pricingNotes: template?.pricingNotes || [], bookingSteps: template?.bookingSteps || [],
  }
}
