import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';
import { jsonError } from '@/lib/api-utils';
import { nowIso } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  await ensureSeeded();
  const snap = await db.collection('contactMessages').get();
  const messages = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a: any, b: any) => (b.createdAt as string).localeCompare(a.createdAt as string));
  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest) {
  await ensureSeeded();
  try {
    const { name, email, phone, message } = await req.json();
    const ref = db.collection('contactMessages').doc();
    const data = { name, email: email ?? null, phone: phone ?? null, message, isRead: false, createdAt: nowIso() };
    await ref.set(data);
    return NextResponse.json({ message: { id: ref.id, ...data } }, { status: 201 });
  } catch (err) {
    return jsonError(err);
  }
}
