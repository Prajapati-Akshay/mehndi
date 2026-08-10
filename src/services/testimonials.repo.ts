import { db } from '@/lib/db';
import { uid, nowIso } from '@/lib/utils';
import type { DBTestimonial, Testimonial } from '@/lib/types';

export async function listTestimonials(activeOnly = true): Promise<Testimonial[]> {
  const rows = await db.testimonials.toArray();
  const filtered = activeOnly ? rows.filter((r) => r.isActive) : rows;
  return filtered.map((r) => ({ id: r.id, customerName: r.customerName, message: r.message, rating: r.rating }));
}

export async function listTestimonialsAdmin(): Promise<DBTestimonial[]> {
  return db.testimonials.toArray();
}

export async function createTestimonial(input: { customerName: string; message: string; rating: number }): Promise<DBTestimonial> {
  const now = nowIso();
  const item: DBTestimonial = {
    id: uid(),
    customerName: input.customerName,
    message: input.message,
    rating: input.rating,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  await db.testimonials.add(item);
  return item;
}

export async function updateTestimonial(id: string, patch: Partial<Omit<DBTestimonial, 'id'>>): Promise<void> {
  await db.testimonials.update(id, { ...patch, updatedAt: nowIso() });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await db.testimonials.delete(id);
}
