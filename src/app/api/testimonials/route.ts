import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';
import { jsonError } from '@/lib/api-utils';
import { nowIso } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await ensureSeeded();
  const all = req.nextUrl.searchParams.get('all') === 'true';
  const snap = await db.collection('testimonials').get();
  let testimonials = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  if (!all) testimonials = testimonials.filter((t: any) => t.isActive);
  return NextResponse.json({ testimonials });
}

export async function POST(req: NextRequest) {
  await ensureSeeded();
  try {
    const { customerName, message, rating } = await req.json();
    const now = nowIso();
    const ref = db.collection('testimonials').doc();
    const data = { customerName, message, rating: Number(rating), isActive: true, createdAt: now, updatedAt: now };
    await ref.set(data);
    return NextResponse.json({ testimonial: { id: ref.id, ...data } }, { status: 201 });
  } catch (err) {
    return jsonError(err);
  }
}
