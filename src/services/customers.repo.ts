import { db } from '@/lib/db';
import type { DBCustomer } from '@/lib/types';

export async function listCustomers(): Promise<DBCustomer[]> {
  return db.customers.orderBy('fullName').toArray();
}

export async function getCustomer(id: string): Promise<DBCustomer | undefined> {
  return db.customers.get(id);
}

export async function deleteCustomer(id: string): Promise<void> {
  const hasBookings = await db.bookings.where('customerId').equals(id).count();
  if (hasBookings > 0) {
    throw new Error('Cannot delete a customer that has bookings. Delete their bookings first.');
  }
  await db.customers.delete(id);
}
