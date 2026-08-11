import { NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  await ensureSeeded();
  const snap = await db.collection('customers').get();
  const customers = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a: any, b: any) => (a.fullName as string).localeCompare(b.fullName as string));
  return NextResponse.json({ customers });
}
