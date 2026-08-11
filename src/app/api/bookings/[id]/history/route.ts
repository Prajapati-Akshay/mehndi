import { NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  await ensureSeeded();
  const snap = await db.collection('bookingStatusHistory').where('bookingId', '==', params.id).get();
  const history = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a: any, b: any) => (a.createdAt as string).localeCompare(b.createdAt as string));
  return NextResponse.json({ history });
}
