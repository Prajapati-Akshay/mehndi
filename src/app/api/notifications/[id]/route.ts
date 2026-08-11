import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';
import { jsonError } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();
  try {
    const { isRead } = await req.json();
    const ref = db.collection('notifications').doc(params.id);
    await ref.update({ isRead: Boolean(isRead) });
    const snap = await ref.get();
    return NextResponse.json({ notification: { id: snap.id, ...snap.data() } });
  } catch (err) {
    return jsonError(err);
  }
}
