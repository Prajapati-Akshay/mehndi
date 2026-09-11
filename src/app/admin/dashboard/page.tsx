'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck, Clock, CheckCircle2, XCircle, IndianRupee, Ban,
  ArrowRight, CalendarClock, Sparkles, Users, ArrowUpRight
} from 'lucide-react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatINR } from '@/lib/utils';
import type { DashboardData } from '@/lib/types';
import { getDashboardData } from '@/domain/dashboard';

const STAT_CARDS = [
  { key: 'totalBookings', label: 'Total Bookings', icon: CalendarCheck, gradient: 'from-forest-900 to-forest-800 text-ivory' },
  { key: 'pending', label: 'Pending Action', icon: Clock, gradient: 'from-amber-500/10 to-amber-500/5 text-amber-800 border-amber-200' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2, gradient: 'from-emerald-500/10 to-emerald-500/5 text-emerald-800 border-emerald-200' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, gradient: 'from-forest-500/10 to-forest-500/5 text-forest-800 border-forest-200' },
  { key: 'cancelled', label: 'Cancelled', icon: Ban, gradient: 'from-neutral-500/10 to-neutral-500/5 text-neutral-700 border-neutral-200' },
  { key: 'rejected', label: 'Rejected', icon: XCircle, gradient: 'from-rose-500/10 to-rose-500/5 text-rose-800 border-rose-200' },
] as const;

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboardData().then(setData).catch(() => setData(null));
  }, []);

  return (
    <AdminShell>
      <div className="space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-forest-950">Studio Overview</h1>
            <p className="text-sm text-forest-800/70 mt-1">Live metrics, incoming appointments, and revenue statistics.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-2 rounded-2xl bg-forest-900 text-ivory px-4 py-2.5 text-xs font-semibold hover:bg-forest-800 transition-colors shadow-sm"
            >
              <span>Manage All Bookings</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {!data ? (
          <div className="py-20 text-center text-forest-800/50">Loading dashboard data…</div>
        ) : (
          <>
            {/* Stat Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Revenue Card Highlight */}
              <div className="rounded-3xl border border-gold-400/50 bg-gradient-to-br from-gold-500 via-gold-400 to-gold-600 p-6 text-forest-950 shadow-gold flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-950/80">Confirmed Revenue</span>
                  <div className="h-10 w-10 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center text-forest-950">
                    <IndianRupee className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-serif text-3xl font-bold tracking-tight text-forest-950">{formatINR(data.revenue)}</p>
                  <p className="text-xs text-forest-950/70 mt-1 font-medium">From active &amp; completed bookings</p>
                </div>
              </div>

              {/* Total & Status Cards */}
              {STAT_CARDS.map((card) => (
                <div
                  key={card.key}
                  className={`rounded-3xl border p-6 bg-white shadow-card flex flex-col justify-between transition-all hover:shadow-luxury hover:-translate-y-0.5 ${card.gradient}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-forest-800/70">{card.label}</span>
                    <div className="h-10 w-10 rounded-2xl bg-gold-50 border border-gold-200/80 flex items-center justify-center text-forest-900">
                      <card.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-serif text-3xl font-bold text-forest-950">{data.totals[card.key]}</p>
                    <p className="text-xs text-forest-800/60 mt-0.5">Total bookings recorded</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Sections: Upcoming Appointments & Recent Bookings */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Upcoming Appointments */}
              <div className="lg:col-span-7 rounded-3xl border border-gold-200/90 bg-white p-6 sm:p-8 shadow-card space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-forest-950">Upcoming Appointments</h2>
                    <p className="text-xs text-forest-800/60 mt-0.5">Confirmed sessions scheduled on your calendar</p>
                  </div>
                  <Link href="/admin/availability" className="text-xs font-semibold text-gold-700 hover:underline flex items-center gap-1">
                    <span>Availability</span> <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {data.upcomingAppointments.length === 0 ? (
                    <div className="py-12 text-center text-forest-800/50 bg-sand/20 rounded-2xl border border-gold-100 p-6">
                      No upcoming appointments scheduled.
                    </div>
                  ) : (
                    data.upcomingAppointments.map((b) => (
                      <div
                        key={b.id}
                        className="p-4 rounded-2xl border border-gold-100 bg-cream/30 hover:bg-cream/60 transition-colors flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <p className="font-serif font-bold text-base text-forest-950 truncate">{b.customer.fullName}</p>
                          <p className="text-xs text-forest-800/75 mt-0.5">
                            {b.service.name} · <span className="font-semibold text-gold-700">{formatDate(b.appointmentDate)}</span> at {b.appointmentTime}
                          </p>
                          <p className="text-[11px] text-forest-800/60 mt-0.5">{b.customer.phone}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge status={b.status}>{b.status}</Badge>
                          <p className="font-serif font-bold text-sm text-forest-950 mt-2">{formatINR(b.totalAmount)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="lg:col-span-5 rounded-3xl border border-gold-200/90 bg-white p-6 sm:p-8 shadow-card space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-forest-950">Recent Submissions</h2>
                    <p className="text-xs text-forest-800/60 mt-0.5">Latest customer bookings received</p>
                  </div>
                  <Link href="/admin/bookings" className="text-xs font-semibold text-gold-700 hover:underline flex items-center gap-1">
                    <span>View All</span> <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {data.recentBookings.length === 0 ? (
                    <div className="py-12 text-center text-forest-800/50 bg-sand/20 rounded-2xl border border-gold-100 p-6">
                      No bookings recorded yet.
                    </div>
                  ) : (
                    data.recentBookings.slice(0, 5).map((b) => (
                      <div
                        key={b.id}
                        className="p-3.5 rounded-2xl border border-gold-100 bg-white flex items-center justify-between gap-3 hover:border-gold-300 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-forest-950 truncate">{b.customer.fullName}</p>
                          <p className="text-xs text-forest-800/60 font-mono mt-0.5">{b.bookingNumber}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge status={b.status}>{b.status}</Badge>
                          <p className="font-serif font-bold text-xs text-forest-950 mt-1">{formatINR(b.totalAmount)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="rounded-3xl border border-gold-200/90 bg-gradient-to-r from-cream via-white to-gold-50/60 p-6 sm:p-8 shadow-card flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-forest-950">Quick Studio Controls</h3>
                <p className="text-xs text-forest-800/70 mt-0.5">Shortcuts to manage your appointments, pricing catalogs, and client directory.</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  href="/admin/availability"
                  className="inline-flex items-center gap-2 rounded-2xl border border-gold-300 bg-white px-4 py-2 text-xs font-semibold text-forest-900 hover:bg-gold-50 shadow-sm"
                >
                  <CalendarClock className="h-4 w-4 text-gold-600" />
                  <span>Update Dates</span>
                </Link>
                <Link
                  href="/admin/services"
                  className="inline-flex items-center gap-2 rounded-2xl border border-gold-300 bg-white px-4 py-2 text-xs font-semibold text-forest-900 hover:bg-gold-50 shadow-sm"
                >
                  <Sparkles className="h-4 w-4 text-gold-600" />
                  <span>Edit Services</span>
                </Link>
                <Link
                  href="/admin/customers"
                  className="inline-flex items-center gap-2 rounded-2xl border border-gold-300 bg-white px-4 py-2 text-xs font-semibold text-forest-900 hover:bg-gold-50 shadow-sm"
                >
                  <Users className="h-4 w-4 text-gold-600" />
                  <span>Customer Directory</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}

