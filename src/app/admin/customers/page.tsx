'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { listCustomers, deleteCustomer } from '@/services/customers.repo';
import { listBookingsForCustomer } from '@/services/bookings.repo';
import type { DBCustomer } from '@/lib/types';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  CalendarCheck,
  Trash2,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';

interface CustomerRow extends DBCustomer {
  bookingCount: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'repeat' | 'single'>('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const base = await listCustomers();
      const withCounts = await Promise.all(
        base.map(async (c) => ({ ...c, bookingCount: (await listBookingsForCustomer(c.id)).length }))
      );
      setCustomers(withCounts);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function showNotice(type: 'success' | 'error', text: string) {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Delete client record for "${name}"? This is only allowed if they have no active bookings.`)) return;
    try {
      await deleteCustomer(id);
      await load();
      showNotice('success', `Removed client "${name}".`);
    } catch (err) {
      showNotice('error', err instanceof Error ? err.message : 'Could not delete customer.');
    }
  }

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.address ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'repeat' && c.bookingCount > 1) ||
      (filter === 'single' && c.bookingCount === 1);
    return matchesSearch && matchesFilter;
  });

  const totalClients = customers.length;
  const repeatClients = customers.filter((c) => c.bookingCount > 1).length;
  const totalBookings = customers.reduce((sum, c) => sum + c.bookingCount, 0);

  return (
    <AdminShell>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-700">Client Directory</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-forest-900 mt-1">Customer Profiles</h1>
          <p className="text-sm text-forest-800/70 mt-0.5">
            View client contact details, booking history counts, and venue locations.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xl border border-gold-200/80 bg-white/80 px-3.5 py-2 shadow-sm text-center">
            <p className="text-[11px] uppercase font-semibold text-forest-800/60">Total Clients</p>
            <p className="font-serif text-lg font-bold text-forest-900">{totalClients}</p>
          </div>
          <div className="rounded-xl border border-gold-200/80 bg-white/80 px-3.5 py-2 shadow-sm text-center">
            <p className="text-[11px] uppercase font-semibold text-forest-800/60">Repeat Brides</p>
            <p className="font-serif text-lg font-bold text-gold-700">{repeatClients}</p>
          </div>
          <div className="rounded-xl border border-gold-200/80 bg-white/80 px-3.5 py-2 shadow-sm text-center">
            <p className="text-[11px] uppercase font-semibold text-forest-800/60">Total Bookings</p>
            <p className="font-serif text-lg font-bold text-emerald-700">{totalBookings}</p>
          </div>
        </div>
      </div>

      {notification && (
        <div
          className={`mt-4 rounded-xl p-3.5 flex items-center gap-2.5 text-sm transition-all shadow-sm ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-forest-800/40" />
          <input
            type="text"
            placeholder="Search by name, phone, email or address…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gold-200/80 bg-white text-sm text-forest-900 shadow-sm focus:border-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800/10"
          />
        </div>

        <div className="flex items-center rounded-xl bg-forest-900/5 p-1 border border-gold-200/50">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-white text-forest-900 shadow-sm font-semibold'
                : 'text-forest-800/70 hover:text-forest-900'
            }`}
          >
            All Clients ({totalClients})
          </button>
          <button
            onClick={() => setFilter('repeat')}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
              filter === 'repeat'
                ? 'bg-forest-900 text-ivory shadow-sm font-semibold'
                : 'text-forest-800/70 hover:text-forest-900'
            }`}
          >
            Repeat Clients ({repeatClients})
          </button>
          <button
            onClick={() => setFilter('single')}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
              filter === 'single'
                ? 'bg-forest-900 text-ivory shadow-sm font-semibold'
                : 'text-forest-800/70 hover:text-forest-900'
            }`}
          >
            First-time ({totalClients - repeatClients})
          </button>
        </div>
      </div>

      {/* Customers Table Card */}
      <Card className="mt-4 border-gold-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-forest-900 text-ivory text-left text-xs uppercase tracking-wider font-sans border-b border-gold-600/30">
                <th className="px-5 py-3.5 font-semibold">Client Name</th>
                <th className="px-5 py-3.5 font-semibold">Phone / WhatsApp</th>
                <th className="px-5 py-3.5 font-semibold">Email</th>
                <th className="px-5 py-3.5 font-semibold">Location / Address</th>
                <th className="px-5 py-3.5 font-semibold">Bookings</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-100">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-forest-800/50">
                    <Users className="mx-auto h-6 w-6 animate-pulse text-gold-600 mb-2" />
                    Loading client directory…
                  </td>
                </tr>
              )}
              {!loading && filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-forest-800/60">
                    <Users className="mx-auto h-8 w-8 text-gold-400 mb-2 opacity-70" />
                    <p className="font-serif text-base font-bold text-forest-900">No clients found</p>
                    <p className="text-xs text-forest-800/60 mt-0.5">
                      New customers are automatically saved whenever a booking request is made.
                    </p>
                  </td>
                </tr>
              )}
              {filteredCustomers.map((c) => {
                const initials = c.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);
                const cleanPhone = c.phone.replace(/\D/g, '');

                return (
                  <tr key={c.id} className="hover:bg-cream/40 transition-colors group">
                    {/* Client Name with Avatar */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-gold-700 text-white font-serif text-xs font-bold shadow-sm">
                          {initials}
                        </div>
                        <div>
                          <p className="font-serif text-base font-bold text-forest-900 leading-tight">
                            {c.fullName}
                          </p>
                          <span className="text-[11px] text-forest-800/50">
                            Client ID: {c.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Phone / WhatsApp */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${c.phone}`}
                          className="inline-flex items-center gap-1 text-forest-900 font-medium hover:text-gold-700 transition-colors"
                        >
                          <Phone className="h-3.5 w-3.5 text-forest-700" />
                          {c.phone}
                        </a>
                        <a
                          href={`https://wa.me/91${cleanPhone.slice(-10)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Chat on WhatsApp"
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors"
                        >
                          <MessageCircle className="h-3 w-3" />
                        </a>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {c.email ? (
                        <a
                          href={`mailto:${c.email}`}
                          className="inline-flex items-center gap-1.5 text-xs text-forest-800/80 hover:text-gold-700 transition-colors"
                        >
                          <Mail className="h-3 w-3 text-gold-700" />
                          {c.email}
                        </a>
                      ) : (
                        <span className="text-forest-800/40 text-xs italic">—</span>
                      )}
                    </td>

                    {/* Address */}
                    <td className="px-5 py-3.5 text-xs text-forest-800/80 max-w-xs truncate">
                      {c.address ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-700" />
                          {c.address}
                        </span>
                      ) : (
                        <span className="text-forest-800/40 italic">—</span>
                      )}
                    </td>

                    {/* Bookings Count */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          c.bookingCount > 1
                            ? 'bg-gold-100 text-gold-950 border border-gold-300'
                            : 'bg-forest-900/5 text-forest-900 border border-gold-200/50'
                        }`}
                      >
                        <CalendarCheck className="h-3 w-3 text-gold-700" />
                        {c.bookingCount} {c.bookingCount === 1 ? 'Booking' : 'Bookings'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => remove(c.id, c.fullName)}
                        className="text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl h-8 w-8 p-0"
                        title="Delete client record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminShell>
  );
}
