import { db } from '@/lib/db';
import { uid, nowIso } from '@/lib/utils';
import type { DBServiceCategory, ServiceCategory } from '@/lib/types';

/** Public-facing categories with nested active services + pricing tiers, mirrors GET /services/categories. */
export async function listCategoriesWithServices(includeInactive = false): Promise<ServiceCategory[]> {
  const categories = await db.categories.orderBy('sortOrder').toArray();
  const result: ServiceCategory[] = [];
  for (const cat of categories) {
    if (!includeInactive && !cat.isActive) continue;
    const services = await db.services.where('categoryId').equals(cat.id).sortBy('sortOrder');
    const svcOut = [];
    for (const svc of services) {
      if (!includeInactive && !svc.isActive) continue;
      const tiers = await db.pricing.where('serviceId').equals(svc.id).sortBy('sortOrder');
      const tiersOut = includeInactive ? tiers : tiers.filter((t) => t.isActive);
      svcOut.push({ id: svc.id, name: svc.name, description: svc.description, pricingTiers: tiersOut });
    }
    result.push({ id: cat.id, slug: cat.slug, name: cat.name, description: cat.description, services: svcOut });
  }
  return result;
}

export async function listCategories(): Promise<DBServiceCategory[]> {
  return db.categories.orderBy('sortOrder').toArray();
}

export async function createCategory(input: { slug: string; name: string; description?: string | null }): Promise<DBServiceCategory> {
  const now = nowIso();
  const count = await db.categories.count();
  const cat: DBServiceCategory = {
    id: uid(),
    slug: input.slug,
    name: input.name,
    description: input.description ?? null,
    sortOrder: count,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  await db.categories.add(cat);
  return cat;
}

export async function updateCategory(id: string, patch: Partial<Omit<DBServiceCategory, 'id'>>): Promise<void> {
  await db.categories.update(id, { ...patch, updatedAt: nowIso() });
}

export async function deleteCategory(id: string): Promise<void> {
  const services = await db.services.where('categoryId').equals(id).toArray();
  for (const svc of services) {
    await db.pricing.where('serviceId').equals(svc.id).delete();
  }
  await db.services.where('categoryId').equals(id).delete();
  await db.categories.delete(id);
}
