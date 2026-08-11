import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';
import { jsonError } from '@/lib/api-utils';
import { nowIso } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();
  try {
    const patch = await req.json();
    const ref = db.collection('serviceCategories').doc(params.id);
    await ref.update({ ...patch, updatedAt: nowIso() });
    const snap = await ref.get();
    return NextResponse.json({ category: { id: snap.id, ...snap.data() } });
  } catch (err) {
    return jsonError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();
  try {
    const batch = db.batch();
    const svcSnap = await db.collection('services').where('categoryId', '==', params.id).get();
    for (const svcDoc of svcSnap.docs) {
      const pricingSnap = await db.collection('servicePricing').where('serviceId', '==', svcDoc.id).get();
      for (const p of pricingSnap.docs) batch.delete(p.ref);
      batch.delete(svcDoc.ref);
    }
    batch.delete(db.collection('serviceCategories').doc(params.id));
    await batch.commit();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return jsonError(err);
  }
}
