'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarCheck, Clock, CheckCircle2, XCircle, IndianRupee, Ban } from 'lucide-react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatINR } from '@/lib/utils';
import type { DashboardData } from '@/lib/types';
import { getDashboardData } from '@/domain/dashboard';

const STAT_CARDS = [
  { key: 'totalBookings', label: 'Total Bookings', icon: CalendarCheck, color: 'text-forest-700 bg-forest-50' },
  { key: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-700 bg-amber-50' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-forest-700 bg-forest-50' },
  { key: 'cancelled', label: 'Cancelled', icon: Ban, color: 'text-neutral-600 bg-neutral-100' },
  { key: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-rose-700 bg-rose-50' },
] as const;

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboardData().then(setData).catch(() => setData(null));
  }, []);

  return (
    <AdminShell>
      <h1 className="font-serif text-2xl text-forest-900">Dashboard</h1>
      <p className="text-sm text-forest-800/60 mt-1">Overview of your bookings and revenue.</p>

      {!data ? (
        <p className="mt-8 text-sm text-forest-800/50">Loading…</p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {STAT_CARDS.map((card) => (
              <Card key={card.key} className="p-5 flex items-center gap-4">
                <div className={`h-11 w-11 rounded-full flex items-center justify-center ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-serif text-forest-900">{data.totals[card.key]}</p>
                  <p className="text-xs text-forest-800/60">{card.label}</p>
                </div>
              </Card>
            ))}
            <Card className="p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-full flex items-center justify-center text-gold-700 bg-gold-50">
                <IndianRupee className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-serif text-forest-900">{formatINR(data.revenue)}</p>
                <p className="text-xs text-forest-800/60">Revenue (confirmed+)</p>
              </div>
            </Card>
          </div>

          <div className="mt-10 grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="font-serif text-lg text-forest-900 mb-4">Upcoming Appointments</h2>
              <div className="space-y-3">
                {data.upcomingAppointments.length === 0 && (
                  <p className="text-sm text-forest-800/50">No upcoming appointments.</p>
                )}
                {data.upcomingAppointments.map((b) => (
                  <Card key={b.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-forest-900 truncate">{b.customer.fullName}</p>
                      <p className="text-xs text-forest-800/60">
                        {b.service.name} · {formatDate(b.appointmentDate)} · {b.appointmentTime}
                      </p>
                    </div>
                    <Badge status={b.status}>{b.status}</Badge>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-serif text-lg text-forest-900 mb-4">Recent Bookings</h2>
              <div className="space-y-3">
                {data.recentBookings.map((b) => (
                  <Card key={b.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-forest-900 truncate">{b.customer.fullName}</p>
                      <p className="text-xs text-forest-800/60">{b.bookingNumber} · {formatINR(b.totalAmount)}</p>
                    </div>
                    <Badge status={b.status}>{b.status}</Badge>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/admin/bookings" className="text-sm text-gold-600 underline">
              View and manage all bookings →
            </Link>
          </div>
        </>
      )}
    </AdminShell>
  );
}
