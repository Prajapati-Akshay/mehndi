import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';
import { jsonError } from '@/lib/api-utils';
import { nowIso } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await ensureSeeded();
  const serviceId = req.nextUrl.searchParams.get('serviceId');
  const query = serviceId ? db.collection('servicePricing').where('serviceId', '==', serviceId) : db.collection('servicePricing');
  const snap = await query.get();
  const pricing = snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => a.sortOrder - b.sortOrder);
  return NextResponse.json({ pricing });
}

export async function POST(req: NextRequest) {
  await ensureSeeded();
  try {
    const { serviceId, lengthLabel, price, whatsIncluded } = await req.json();
    const count = (await db.collection('servicePricing').where('serviceId', '==', serviceId).get()).size;
    const now = nowIso();
    const ref = db.collection('servicePricing').doc();
    const data = { serviceId, lengthLabel, price: Number(price), whatsIncluded, sortOrder: count, isActive: true, createdAt: now, updatedAt: now };
    await ref.set(data);
    return NextResponse.json({ pricing: { id: ref.id, ...data } }, { status: 201 });
  } catch (err) {
    return jsonError(err);
  }
}
