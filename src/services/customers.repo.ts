import type { DBCustomer } from '@/lib/types';
import { apiErrorFromCode } from '@/lib/errors';

export async function listCustomers(): Promise<DBCustomer[]> {
  const res = await fetch('/api/customers', { cache: 'no-store' });
  const { customers } = await res.json();
  return customers;
}

export async function getCustomer(id: string): Promise<DBCustomer | undefined> {
  const res = await fetch(`/api/customers/${id}`, { cache: 'no-store' });
  const { customer } = await res.json();
  return customer ?? undefined;
}

export async function deleteCustomer(id: string): Promise<void> {
  const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw apiErrorFromCode(body.code, body.error ?? 'Could not delete customer.');
  }
}
