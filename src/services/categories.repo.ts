import type { DBServiceCategory, ServiceCategory } from '@/lib/types';

export async function listCategoriesWithServices(includeInactive = false): Promise<ServiceCategory[]> {
  const res = await fetch(`/api/categories?withServices=true&includeInactive=${includeInactive}`, { cache: 'no-store' });
  const { categories } = await res.json();
  return categories;
}

export async function listCategories(): Promise<DBServiceCategory[]> {
  const res = await fetch('/api/categories', { cache: 'no-store' });
  const { categories } = await res.json();
  return categories;
}

export async function createCategory(input: { slug: string; name: string; description?: string | null }): Promise<DBServiceCategory> {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const { category } = await res.json();
  return category;
}

export async function updateCategory(id: string, patch: Partial<Omit<DBServiceCategory, 'id'>>): Promise<void> {
  await fetch(`/api/categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await fetch(`/api/categories/${id}`, { method: 'DELETE' });
}
