import { db } from '@/lib/db';
import { uid, nowIso } from '@/lib/utils';
import type { DBServicePricing } from '@/lib/types';

export async function listPricing(): Promise<DBServicePricing[]> {
  return db.pricing.orderBy('sortOrder').toArray();
}

export async function listPricingByService(serviceId: string): Promise<DBServicePricing[]> {
  return db.pricing.where('serviceId').equals(serviceId).sortBy('sortOrder');
}

export async function createPricing(input: {
  serviceId: string;
  lengthLabel: string;
  price: number;
  whatsIncluded: string;
}): Promise<DBServicePricing> {
  const now = nowIso();
  const count = await db.pricing.where('serviceId').equals(input.serviceId).count();
  const tier: DBServicePricing = {
    id: uid(),
    serviceId: input.serviceId,
    lengthLabel: input.lengthLabel,
    price: input.price,
    whatsIncluded: input.whatsIncluded,
    sortOrder: count,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  await db.pricing.add(tier);
  return tier;
}

export async function updatePricing(id: string, patch: Partial<Omit<DBServicePricing, 'id'>>): Promise<void> {
  await db.pricing.update(id, { ...patch, updatedAt: nowIso() });
}

export async function deletePricing(id: string): Promise<void> {
  await db.pricing.delete(id);
}
