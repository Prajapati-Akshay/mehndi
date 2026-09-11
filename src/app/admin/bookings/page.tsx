'use client';

import { useEffect, useState } from 'react';
import {
  Calendar, Clock, User, Phone, Mail, MapPin, Tag,
  CheckCircle2, XCircle, Trash2, Ban, MessageSquare, IndianRupee, Sparkles, Filter
} from 'lucide-react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatINR } from '@/lib/utils';
import type { Booking, BookingStatus } from '@/lib/types';
import { listBookings, updateBookingStatus, deleteBooking } from '@/services/bookings.repo';
import { whatsappLink } from '@/lib/whatsapp';

const STATUSES = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED'] as const;

const TRANSITIONS: Record<string, BookingStatus[]> = {
  PENDING: ['CONFIRMED', 'REJECTED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  REJECTED: [],
  CANCELLED: [],
  COMPLETED: [],
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>('ALL');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  async function load() {
    setLoading(true);
    try {
      const data = await listBookings(filter === 'ALL' ? undefined : filter);
      setBookings(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function updateStatus(id: string, status: BookingStatus, note?: string) {
    setBusyId(id);
    try {
      await updateBookingStatus(id, status, note);
      setRejectingId(null);
      setRejectReason('');
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm('Permanently delete this booking record? This cannot be undone.')) return;
    setBusyId(id);
    try {
      await deleteBooking(id);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-forest-950">Bookings Management</h1>
            <p className="text-sm text-forest-800/70 mt-1">Review, approve, reschedule, or cancel client appointments.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-2xl bg-white border border-gold-200 px-4 py-2 text-xs font-semibold text-forest-900 shadow-sm">
              {bookings.length} Bookings Shown
            </span>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {STATUSES.map((s) => {
            const isActive = filter === s;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`whitespace-nowrap rounded-2xl px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-forest-900 text-ivory shadow-forest-glow border border-gold-400/40'
                    : 'bg-white text-forest-800 border border-gold-200 hover:border-gold-400 hover:bg-gold-50/50'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>

        {/* Booking Cards List */}
        <div className="space-y-4">
          {loading && (
            <div className="py-20 text-center text-forest-800/50 bg-white rounded-3xl border border-gold-200 p-8">
              Loading booking records…
            </div>
          )}

          {!loading && bookings.length === 0 && (
            <div className="py-20 text-center bg-white rounded-3xl border border-gold-200 p-8 space-y-3">
              <Filter className="h-10 w-10 text-gold-400 mx-auto opacity-60" />
              <p className="font-serif text-xl font-bold text-forest-950">No Bookings Found</p>
              <p className="text-xs text-forest-800/60 max-w-sm mx-auto">
                There are no bookings matching status &ldquo;{filter}&rdquo;. Try selecting &ldquo;ALL&rdquo; or create a test booking.
              </p>
              <button
                onClick={() => setFilter('ALL')}
                className="mt-2 text-xs font-semibold text-gold-700 hover:underline"
              >
                Show All Bookings
              </button>
            </div>
          )}

          {bookings.map((b) => (
            <div
              key={b.id}
              className="rounded-3xl border border-gold-200/90 bg-white p-6 sm:p-7 shadow-card hover:border-gold-400 transition-all duration-300 space-y-5"
            >
              {/* Header Info: Client Name, Booking #, Status */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-gold-100">
                <div className="flex items-start gap-3.5">
                  <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-gold-100 to-gold-200/60 border border-gold-300 flex items-center justify-center font-serif font-bold text-base text-forest-950">
                    {b.customer.fullName[0]?.toUpperCase() || 'C'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-forest-950">{b.customer.fullName}</h3>
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-sand/50 text-forest-800/80 border border-gold-200">
                        {b.bookingNumber}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gold-700 mt-1">
                      {b.service.category.name} — {b.service.name} ({b.pricing.lengthLabel})
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5">
                  <Badge status={b.status}>{b.status}</Badge>
                  <div className="text-left sm:text-right">
                    <span className="font-serif text-lg font-bold text-forest-950">{formatINR(b.totalAmount)}</span>
                    <span className="text-[11px] text-forest-800/60 block">50% Advance: {formatINR(b.advanceAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Booking & Client Details Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-cream/40 border border-gold-100/80 flex items-center gap-2.5 text-forest-900">
                  <Calendar className="h-4 w-4 text-gold-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-forest-800/50 uppercase font-semibold">Appointment Date</p>
                    <p className="font-medium mt-0.5">{formatDate(b.appointmentDate)}</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-cream/40 border border-gold-100/80 flex items-center gap-2.5 text-forest-900">
                  <Clock className="h-4 w-4 text-gold-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-forest-800/50 uppercase font-semibold">Time &amp; Guests</p>
                    <p className="font-medium mt-0.5">{b.appointmentTime} ({b.numberOfPeople} person{b.numberOfPeople > 1 ? 's' : ''})</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-cream/40 border border-gold-100/80 flex items-center gap-2.5 text-forest-900">
                  <Phone className="h-4 w-4 text-gold-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-forest-800/50 uppercase font-semibold">Phone Contact</p>
                    <p className="font-medium mt-0.5">{b.customer.phone}</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-cream/40 border border-gold-100/80 flex items-center justify-between gap-2 text-forest-900">
                  <div className="min-w-0">
                    <p className="text-[10px] text-forest-800/50 uppercase font-semibold">WhatsApp Chat</p>
                    <p className="font-medium mt-0.5 truncate">{b.customer.whatsappNumber || b.customer.phone}</p>
                  </div>
                  <a
                    href={whatsappLink(`Hi ${b.customer.fullName}! Mehndi By Dhara is reaching out regarding your booking #${b.bookingNumber}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 px-2.5 rounded-xl bg-[#25D366] text-white flex items-center gap-1 text-[11px] font-semibold hover:bg-[#1fb855] transition-colors shrink-0"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Chat</span>
                  </a>
                </div>
              </div>

              {/* Extra notes / event address if provided */}
              {(b.customer.address || b.notes) && (
                <div className="p-3.5 rounded-2xl bg-sand/30 border border-gold-200/60 text-xs text-forest-800/80 space-y-1">
                  {b.customer.address && (
                    <p><strong>Venue / Address:</strong> {b.customer.address}</p>
                  )}
                  {b.notes && (
                    <p><strong>Client Notes:</strong> {b.notes}</p>
                  )}
                </div>
              )}

              {/* Status Rejection Form Drawer */}
              {rejectingId === b.id ? (
                <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 space-y-3">
                  <label className="text-xs font-semibold text-rose-900">Reason for Rejection (optional notification note)</label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-rose-300 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                    placeholder="e.g. Schedule conflict, fully booked for this time slot"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-rose-400 text-rose-700 hover:bg-rose-600 hover:text-white"
                      disabled={busyId === b.id}
                      onClick={() => updateStatus(b.id, 'REJECTED', rejectReason || undefined)}
                    >
                      Confirm Rejection
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busyId === b.id}
                      onClick={() => {
                        setRejectingId(null);
                        setRejectReason('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                /* Action Buttons */
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {TRANSITIONS[b.status]?.map((next) => (
                      <Button
                        key={next}
                        size="sm"
                        variant={next === 'CONFIRMED' || next === 'COMPLETED' ? 'luxury' : 'outline'}
                        disabled={busyId === b.id}
                        onClick={() => (next === 'REJECTED' ? setRejectingId(b.id) : updateStatus(b.id, next))}
                        className="text-xs"
                      >
                        {next === 'CONFIRMED' && <CheckCircle2 className="h-3.5 w-3.5 mr-1" />}
                        {next === 'COMPLETED' && <CheckCircle2 className="h-3.5 w-3.5 mr-1" />}
                        {next === 'REJECTED' && <XCircle className="h-3.5 w-3.5 mr-1" />}
                        {next === 'CANCELLED' && <Ban className="h-3.5 w-3.5 mr-1" />}
                        <span>Mark {next.charAt(0) + next.slice(1).toLowerCase()}</span>
                      </Button>
                    ))}
                  </div>

                  <button
                    disabled={busyId === b.id}
                    onClick={() => remove(b.id)}
                    className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1.5 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Record</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

