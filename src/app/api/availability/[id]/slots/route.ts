import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';
import { jsonError } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();
  try {
    const { startTime, endTime } = await req.json();
    const ref = db.collection('timeSlots').doc();
    const data = { availabilityId: params.id, startTime, endTime, isBooked: false };
    await ref.set(data);
    return NextResponse.json({ timeSlot: { id: ref.id, ...data } }, { status: 201 });
  } catch (err) {
    return jsonError(err);
  }
}
