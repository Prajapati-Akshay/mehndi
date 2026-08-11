import type { DBTestimonial, Testimonial } from '@/lib/types';

export async function listTestimonials(activeOnly = true): Promise<Testimonial[]> {
  const res = await fetch(`/api/testimonials?all=${!activeOnly}`, { cache: 'no-store' });
  const { testimonials } = await res.json();
  return testimonials.map((r: DBTestimonial) => ({ id: r.id, customerName: r.customerName, message: r.message, rating: r.rating }));
}

export async function listTestimonialsAdmin(): Promise<DBTestimonial[]> {
  const res = await fetch('/api/testimonials?all=true', { cache: 'no-store' });
  const { testimonials } = await res.json();
  return testimonials;
}

export async function createTestimonial(input: { customerName: string; message: string; rating: number }): Promise<DBTestimonial> {
  const res = await fetch('/api/testimonials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const { testimonial } = await res.json();
  return testimonial;
}

export async function updateTestimonial(id: string, patch: Partial<Omit<DBTestimonial, 'id'>>): Promise<void> {
  await fetch(`/api/testimonials/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
}
