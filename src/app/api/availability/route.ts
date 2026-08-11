import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';
import { jsonError } from '@/lib/api-utils';
import { nowIso } from '@/lib/utils';
import { DEFAULT_SLOTS, startOfDayIso } from '@/domain/availability';
import type { Availability } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function toView(id: string, data: any): Promise<Availability> {
  const slotsSnap = await db.collection('timeSlots').where('availabilityId', '==', id).get();
  return {
    id,
    date: data.date,
    isAvailable: data.isAvailable,
    timeSlots: slotsSnap.docs.map((s) => ({ id: s.id, startTime: s.data().startTime, endTime: s.data().endTime, isBooked: s.data().isBooked })),
  };
}

export async function GET() {
  await ensureSeeded();
  const snap = await db.collection('availability').get();
  const docs = snap.docs.sort((a, b) => (a.data().date as string).localeCompare(b.data().date as string));
  const availability = await Promise.all(docs.map((d) => toView(d.id, d.data())));
  return NextResponse.json({ availability });
}

/** ensureAvailability: returns the existing record for a date, or creates one with default slots. */
export async function POST(req: NextRequest) {
  await ensureSeeded();
  try {
    const { date } = (await req.json()) as { date: string };
    const iso = startOfDayIso(date);
    const ref = db.collection('availability').doc(iso);
    const snap = await ref.get();
    const now = nowIso();
    if (!snap.exists) {
      await ref.set({ date: iso, isAvailable: true, note: null, createdAt: now, updatedAt: now });
      for (const slot of DEFAULT_SLOTS) {
        await db.collection('timeSlots').doc().set({ availabilityId: ref.id, ...slot, isBooked: false });
      }
    }
    const finalSnap = await ref.get();
    return NextResponse.json({ availability: await toView(ref.id, finalSnap.data()) });
  } catch (err) {
    return jsonError(err);
  }
}
