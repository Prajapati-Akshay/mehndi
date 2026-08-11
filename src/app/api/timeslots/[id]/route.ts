import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';
import { jsonError } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();
  try {
    const patch = await req.json();
    const ref = db.collection('timeSlots').doc(params.id);
    await ref.update(patch);
    const snap = await ref.get();
    return NextResponse.json({ timeSlot: { id: snap.id, ...snap.data() } });
  } catch (err) {
    return jsonError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();
  try {
    await db.collection('timeSlots').doc(params.id).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return jsonError(err);
  }
}
