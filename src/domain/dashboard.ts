// Ported from apps/api/src/admin/admin.service.ts dashboard aggregation.
import { db } from '@/lib/db';
import type { DashboardData, Booking } from '@/lib/types';
import { hydrateBooking } from '@/services/bookings.repo';

export async function getDashboardData(): Promise<DashboardData> {
  const all = await db.bookings.toArray();

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

  const upcomingAppointments: Booking[] = [];
  for (const b of upcomingRaw) {
    const hydrated = await hydrateBooking(b);
    if (hydrated) upcomingAppointments.push(hydrated);
  }
  const recentBookings: Booking[] = [];
  for (const b of recentRaw) {
    const hydrated = await hydrateBooking(b);
    if (hydrated) recentBookings.push(hydrated);
  }

  return { totals, revenue, upcomingAppointments, recentBookings };
}
