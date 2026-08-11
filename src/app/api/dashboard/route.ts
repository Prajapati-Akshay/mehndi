import { NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';
import { hydrateBookingDoc } from '@/lib/booking-view.server';

export const dynamic = 'force-dynamic';

export async function GET() {
  await ensureSeeded();

  const snap = await db.collection('bookings').get();
  const all = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

  const totals = {
    totalBookings: all.length,
    pending: all.filter((b) => b.status === 'PENDING').length,
    confirmed: all.filter((b) => b.status === 'CONFIRMED').length,
    completed: all.filter((b) => b.status === 'COMPLETED').length,
    cancelled: all.filter((b) => b.status === 'CANCELLED').length,
    rejected: all.filter((b) => b.status === 'REJECTED').length,
  };

  const revenue = all
    .filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();

  const upcomingRaw = all
    .filter((b) => (b.status === 'PENDING' || b.status === 'CONFIRMED') && b.appointmentDate >= todayIso)
    .sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate))
    .slice(0, 5);

  const recentRaw = [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  const upcomingAppointments = (await Promise.all(upcomingRaw.map((b) => hydrateBookingDoc(b.id, b)))).filter(Boolean);
  const recentBookings = (await Promise.all(recentRaw.map((b) => hydrateBookingDoc(b.id, b)))).filter(Boolean);

  return NextResponse.json({ totals, revenue, upcomingAppointments, recentBookings });
}
