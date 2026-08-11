import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';
import { jsonError } from '@/lib/api-utils';
import { nowIso } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await ensureSeeded();
  const categoryId = req.nextUrl.searchParams.get('categoryId');
  const query = categoryId ? db.collection('services').where('categoryId', '==', categoryId) : db.collection('services');
  const snap = await query.get();
  const services = snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => a.sortOrder - b.sortOrder);
  return NextResponse.json({ services });
}

export async function POST(req: NextRequest) {
  await ensureSeeded();
  try {
    const { categoryId, name, description } = await req.json();
    const count = (await db.collection('services').where('categoryId', '==', categoryId).get()).size;
    const now = nowIso();
    const ref = db.collection('services').doc();
    const data = { categoryId, name, description: description ?? null, isActive: true, sortOrder: count, createdAt: now, updatedAt: now };
    await ref.set(data);
    return NextResponse.json({ service: { id: ref.id, ...data } }, { status: 201 });
  } catch (err) {
    return jsonError(err);
  }
}
