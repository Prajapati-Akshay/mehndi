import type { DBGallery, GalleryItem } from '@/lib/types';

export async function listGallery(activeOnly = true): Promise<GalleryItem[]> {
  const res = await fetch(`/api/gallery?all=${!activeOnly}`, { cache: 'no-store' });
  const { items } = await res.json();
  return items.map((r: DBGallery) => ({ id: r.id, imageUrl: r.imageUrl, title: r.title, category: r.category }));
}

export async function listGalleryAdmin(): Promise<DBGallery[]> {
  const res = await fetch('/api/gallery?all=true', { cache: 'no-store' });
  const { items } = await res.json();
  return items;
}

export async function createGalleryItem(input: { imageUrl: string; title?: string | null; category?: string | null }): Promise<DBGallery> {
  const res = await fetch('/api/gallery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const { item } = await res.json();
  return item;
}

export async function updateGalleryItem(id: string, patch: Partial<Omit<DBGallery, 'id'>>): Promise<void> {
  await fetch(`/api/gallery/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
}
