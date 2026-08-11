import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';
import { jsonError } from '@/lib/api-utils';
import { nowIso } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();
  try {
    const patch = await req.json();
    const ref = db.collection('servicePricing').doc(params.id);
    await ref.update({ ...patch, updatedAt: nowIso() });
    const snap = await ref.get();
    return NextResponse.json({ pricing: { id: snap.id, ...snap.data() } });
  } catch (err) {
    return jsonError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();
  try {
    await db.collection('servicePricing').doc(params.id).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return jsonError(err);
  }
}
