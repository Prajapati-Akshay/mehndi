import { db } from '@/lib/db';
import { uid, nowIso } from '@/lib/utils';
import type { DBGallery, GalleryItem } from '@/lib/types';

export async function listGallery(activeOnly = true): Promise<GalleryItem[]> {
  const rows = await db.gallery.orderBy('sortOrder').toArray();
  const filtered = activeOnly ? rows.filter((r) => r.isActive) : rows;
  return filtered.map((r) => ({ id: r.id, imageUrl: r.imageUrl, title: r.title, category: r.category }));
}

export async function listGalleryAdmin(): Promise<DBGallery[]> {
  return db.gallery.orderBy('sortOrder').toArray();
}

export async function createGalleryItem(input: { imageUrl: string; title?: string | null; category?: string | null }): Promise<DBGallery> {
  const now = nowIso();
  const count = await db.gallery.count();
  const item: DBGallery = {
    id: uid(),
    imageUrl: input.imageUrl,
    title: input.title ?? null,
    category: input.category ?? null,
    sortOrder: count,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  await db.gallery.add(item);
  return item;
}

export async function updateGalleryItem(id: string, patch: Partial<Omit<DBGallery, 'id'>>): Promise<void> {
  await db.gallery.update(id, { ...patch, updatedAt: nowIso() });
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await db.gallery.delete(id);
}
