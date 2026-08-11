import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await ensureSeeded();
  const recipientType = req.nextUrl.searchParams.get('recipientType');
  const recipientId = req.nextUrl.searchParams.get('recipientId');
  if (!recipientType || !recipientId) {
    return NextResponse.json({ error: 'recipientType and recipientId are required' }, { status: 400 });
  }
  const snap = await db.collection('notifications').where('recipientId', '==', recipientId).get();
  const count = snap.docs.filter((d) => {
    const n = d.data();
    return n.recipientType === recipientType && !n.isRead;
  }).length;
  return NextResponse.json({ count });
}
