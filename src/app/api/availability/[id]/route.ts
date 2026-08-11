import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';
import { jsonError } from '@/lib/api-utils';
import { nowIso } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();
  try {
    const { isAvailable, note } = await req.json();
    const ref = db.collection('availability').doc(params.id);
    await ref.update({ isAvailable, note: note ?? null, updatedAt: nowIso() });
    const snap = await ref.get();
    return NextResponse.json({ availability: { id: snap.id, ...snap.data() } });
  } catch (err) {
    return jsonError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();
  try {
    const batch = db.batch();
    const slotsSnap = await db.collection('timeSlots').where('availabilityId', '==', params.id).get();
    for (const s of slotsSnap.docs) batch.delete(s.ref);
    batch.delete(db.collection('availability').doc(params.id));
    await batch.commit();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return jsonError(err);
  }
}
