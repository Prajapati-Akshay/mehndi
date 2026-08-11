import { NextRequest, NextResponse } from 'next/server';
import { ensureSeeded } from '@/lib/firestore';
import { jsonError } from '@/lib/api-utils';
import { updateBookingStatus, deleteBooking } from '@/domain/booking';
import { findBookingView } from '@/lib/booking-view.server';
import { NotificationService } from '@/notifications/notification.service';
import type { BookingStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();
  const booking = await findBookingView(params.id);
  return NextResponse.json({ booking });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();
  try {
    const { status, note } = (await req.json()) as { status: BookingStatus; note?: string | null };
    await updateBookingStatus(params.id, status, note ?? null);

    // Notification delivery is best-effort; the status change above has already been
    // committed and must remain successful even if email fails here.
    if (status === 'CONFIRMED') {
      await NotificationService.notifyAppointmentAccepted(params.id);
    } else if (status === 'REJECTED') {
      await NotificationService.notifyAppointmentRejected(params.id, note ?? null);
    } else if (status === 'COMPLETED') {
      await NotificationService.notifyAppointmentCompleted(params.id);
    }

    const view = await findBookingView(params.id);
    return NextResponse.json({ booking: view });
  } catch (err) {
    return jsonError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await ensureSeeded();
  try {
    await deleteBooking(params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return jsonError(err);
  }
}
