import { db } from '@/lib/db';
import { uid, nowIso } from '@/lib/utils';
import type { DBService } from '@/lib/types';

export async function listServices(): Promise<DBService[]> {
  return db.services.orderBy('sortOrder').toArray();
}

export async function listServicesByCategory(categoryId: string): Promise<DBService[]> {
  return db.services.where('categoryId').equals(categoryId).sortBy('sortOrder');
}

export async function createService(input: { categoryId: string; name: string; description?: string | null }): Promise<DBService> {
  const now = nowIso();
  const count = await db.services.where('categoryId').equals(input.categoryId).count();
  const svc: DBService = {
    id: uid(),
    categoryId: input.categoryId,
    name: input.name,
    description: input.description ?? null,
    isActive: true,
    sortOrder: count,
    createdAt: now,
    updatedAt: now,
  };
  await db.services.add(svc);
  return svc;
}

export async function updateService(id: string, patch: Partial<Omit<DBService, 'id'>>): Promise<void> {
  await db.services.update(id, { ...patch, updatedAt: nowIso() });
}

export async function deleteService(id: string): Promise<void> {
  await db.pricing.where('serviceId').equals(id).delete();
  await db.services.delete(id);
}
