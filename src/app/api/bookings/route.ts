import { NextRequest, NextResponse } from 'next/server';
import { ensureSeeded } from '@/lib/firestore';
import { jsonError } from '@/lib/api-utils';
import { createBooking } from '@/domain/booking';
import { listBookingViews } from '@/lib/booking-view.server';
import { findBookingView } from '@/lib/booking-view.server';
import type { BookingStatus } from '@/lib/types';
import { NotificationService } from '@/notifications/notification.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await ensureSeeded();
  const status = req.nextUrl.searchParams.get('status') as BookingStatus | null;
  const bookings = await listBookingViews(status ?? undefined);
  return NextResponse.json({ bookings });
}

export async function POST(req: NextRequest) {
  await ensureSeeded();
  try {
    const input = await req.json();
    const booking = await createBooking(input);

    // Appointment creation is the source of truth; notification delivery is best-effort and
    // must never roll back or fail the booking response even if the email provider errors.
    await NotificationService.notifyAppointmentCreated(booking.id);

    const view = await findBookingView(booking.id);
    return NextResponse.json({ booking: view }, { status: 201 });
  } catch (err) {
    return jsonError(err);
  }
}
