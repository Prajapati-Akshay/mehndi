import { NextResponse } from 'next/server';
import { ensureSeeded } from '@/lib/firestore';
import { listBookingViewsForCustomer } from '@/lib/booking-view.server';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { customerId: string } }) {
  await ensureSeeded();
  const bookings = await listBookingViewsForCustomer(params.customerId);
  return NextResponse.json({ bookings });
}
