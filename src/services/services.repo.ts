import type { DBService } from '@/lib/types';

export async function listServices(): Promise<DBService[]> {
  const res = await fetch('/api/services', { cache: 'no-store' });
  const { services } = await res.json();
  return services;
}

export async function listServicesByCategory(categoryId: string): Promise<DBService[]> {
  const res = await fetch(`/api/services?categoryId=${categoryId}`, { cache: 'no-store' });
  const { services } = await res.json();
  return services;
}

export async function createService(input: { categoryId: string; name: string; description?: string | null }): Promise<DBService> {
  const res = await fetch('/api/services', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const { service } = await res.json();
  return service;
}

export async function updateService(id: string, patch: Partial<Omit<DBService, 'id'>>): Promise<void> {
  await fetch(`/api/services/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
}

export async function deleteService(id: string): Promise<void> {
  await fetch(`/api/services/${id}`, { method: 'DELETE' });
}
