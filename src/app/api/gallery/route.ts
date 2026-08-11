import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';
import { jsonError } from '@/lib/api-utils';
import { nowIso } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await ensureSeeded();
  const all = req.nextUrl.searchParams.get('all') === 'true';
  const snap = await db.collection('galleryItems').get();
  let items = snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => a.sortOrder - b.sortOrder);
  if (!all) items = items.filter((i: any) => i.isActive);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  await ensureSeeded();
  try {
    const { imageUrl, title, category } = await req.json();
    const count = (await db.collection('galleryItems').get()).size;
    const now = nowIso();
    const ref = db.collection('galleryItems').doc();
    const data = { imageUrl, title: title ?? null, category: category ?? null, sortOrder: count, isActive: true, createdAt: now, updatedAt: now };
    await ref.set(data);
    return NextResponse.json({ item: { id: ref.id, ...data } }, { status: 201 });
  } catch (err) {
    return jsonError(err);
  }
}
