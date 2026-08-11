import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';
import { jsonError } from '@/lib/api-utils';
import { BookingValidationError } from '@/lib/errors';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();
  const snap = await db.collection('customers').doc(params.id).get();
  const customer = snap.exists ? { id: snap.id, ...snap.data() } : null;
  return NextResponse.json({ customer });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();
  try {
    const bookingsSnap = await db.collection('bookings').where('customerId', '==', params.id).limit(1).get();
    if (!bookingsSnap.empty) {
      throw new BookingValidationError('Cannot delete a customer that has bookings. Delete their bookings first.');
    }
    await db.collection('customers').doc(params.id).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return jsonError(err);
  }
}
