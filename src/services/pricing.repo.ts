import type { DBServicePricing } from '@/lib/types';

export async function listPricing(): Promise<DBServicePricing[]> {
  const res = await fetch('/api/pricing', { cache: 'no-store' });
  const { pricing } = await res.json();
  return pricing;
}

export async function listPricingByService(serviceId: string): Promise<DBServicePricing[]> {
  const res = await fetch(`/api/pricing?serviceId=${serviceId}`, { cache: 'no-store' });
  const { pricing } = await res.json();
  return pricing;
}

export async function createPricing(input: {
  serviceId: string;
  lengthLabel: string;
  price: number;
  whatsIncluded: string;
}): Promise<DBServicePricing> {
  const res = await fetch('/api/pricing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const { pricing } = await res.json();
  return pricing;
}

export async function updatePricing(id: string, patch: Partial<Omit<DBServicePricing, 'id'>>): Promise<void> {
  await fetch(`/api/pricing/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
}

export async function deletePricing(id: string): Promise<void> {
  await fetch(`/api/pricing/${id}`, { method: 'DELETE' });
}
