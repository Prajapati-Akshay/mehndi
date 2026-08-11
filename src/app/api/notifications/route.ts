import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await ensureSeeded();
  const recipientType = req.nextUrl.searchParams.get('recipientType');
  const recipientId = req.nextUrl.searchParams.get('recipientId');
  const unreadOnly = req.nextUrl.searchParams.get('unread') === 'true';

  if (!recipientType || !recipientId) {
    return NextResponse.json({ error: 'recipientType and recipientId are required' }, { status: 400 });
  }

  // Filter on recipientId (single-field index, no composite index needed) and narrow the
  // rest in memory — notification volume per recipient is small.
  const snap = await db.collection('notifications').where('recipientId', '==', recipientId).get();

  let notifications = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((n: any) => n.recipientType === recipientType);
  if (unreadOnly) notifications = notifications.filter((n: any) => !n.isRead);
  notifications.sort((a: any, b: any) => (b.createdAt as string).localeCompare(a.createdAt as string));

  return NextResponse.json({ notifications: notifications.slice(0, 50) });
}
