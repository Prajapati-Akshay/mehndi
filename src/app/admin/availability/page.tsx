'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Availability } from '@/lib/types';
import {
  listAvailability,
  ensureAvailability,
  setAvailabilityOpen,
  deleteAvailability,
  addTimeSlot,
} from '@/services/availability.repo';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  CalendarCheck,
} from 'lucide-react';

const PRESET_SLOTS = [
  { label: 'Standard 5 Slots', value: '10:00-11:00, 11:30-12:30, 14:00-15:00, 15:30-16:30, 17:00-18:00' },
  { label: 'Morning Only', value: '09:30-11:00, 11:30-13:00' },
  { label: 'Bridal Extended (3hr)', value: '10:00-13:00, 14:30-17:30' },
];

export default function AdminAvailabilityPage() {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'blocked'>('all');
  const [form, setForm] = useState({
    date: '',
    timeSlots: '10:00-11:00, 11:30-12:30, 14:00-15:00, 15:30-16:30, 17:00-18:00',
  });
  const [creating, setCreating] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function load() {
    setLoading(true);
    try {
      setAvailability(await listAvailability());
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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date) return;
    setCreating(true);
    try {
      const record = await ensureAvailability(form.date);
      const existingLabels = new Set(record.timeSlots.map((s) => `${s.startTime}-${s.endTime}`));
      const wanted = form.timeSlots.split(',').map((s) => s.trim()).filter(Boolean);
      let addedCount = 0;
      for (const label of wanted) {
        if (existingLabels.has(label)) continue;
        const [startTime, endTime] = label.split('-');
        if (startTime && endTime) {
          await addTimeSlot(record.id, startTime.trim(), endTime.trim());
          addedCount++;
        }
      }
      setForm({ ...form, date: '' });
      await load();
      showNotice('success', `Schedule saved for ${formatDate(record.date)} with ${addedCount} new slots.`);
    } catch {
      showNotice('error', 'Failed to save availability. Please check the date format.');
    } finally {
      setCreating(false);
    }
  }

  async function toggleAvailable(id: string, isAvailable: boolean) {
    try {
      await setAvailabilityOpen(id, !isAvailable);
      await load();
      showNotice('success', `Date marked as ${!isAvailable ? 'Open for bookings' : 'Blocked'}.`);
    } catch {
      showNotice('error', 'Could not update date status.');
    }
  }

  async function remove(id: string, dateStr: string) {
    if (!confirm(`Delete all slots for ${formatDate(dateStr)}? Existing bookings for this date might be affected.`)) return;
    try {
      await deleteAvailability(id);
      await load();
      showNotice('success', 'Date and slots deleted.');
    } catch {
      showNotice('error', 'Could not delete date.');
    }
  }

  const filteredAvailability = availability.filter((a) => {
    if (filter === 'open') return a.isAvailable;
    if (filter === 'blocked') return !a.isAvailable;
    return true;
  });

  const totalDates = availability.length;
  const openDates = availability.filter((a) => a.isAvailable).length;
  const totalSlots = availability.reduce((sum, a) => sum + a.timeSlots.length, 0);
  const totalBookedSlots = availability.reduce(
    (sum, a) => sum + a.timeSlots.filter((s) => s.isBooked).length,
    0
  );

  return (
    <AdminShell>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-700">Studio Calendar</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-forest-900 mt-1">Studio Availability</h1>
          <p className="text-sm text-forest-800/70 mt-0.5">
            Configure open dates, consultation time slots, and block dates for bridal appointments.
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xl border border-gold-200/80 bg-white/80 px-3.5 py-2 shadow-sm text-center">
            <p className="text-[11px] uppercase font-semibold text-forest-800/60">Open Dates</p>
            <p className="font-serif text-lg font-bold text-emerald-700">{openDates} / {totalDates}</p>
          </div>
          <div className="rounded-xl border border-gold-200/80 bg-white/80 px-3.5 py-2 shadow-sm text-center">
            <p className="text-[11px] uppercase font-semibold text-forest-800/60">Slots Booked</p>
            <p className="font-serif text-lg font-bold text-gold-700">{totalBookedSlots} / {totalSlots}</p>
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

      {/* Add / Update Date Card */}
      <Card className="mt-6 border-gold-200/80 bg-gradient-to-br from-white via-white to-gold-50/20 p-6 shadow-sm overflow-hidden relative">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-900 text-gold-400">
            <Plus className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-forest-900">Add or Update Schedule Date</h2>
            <p className="text-xs text-forest-800/60">Select a date and customize the appointment time slots.</p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                Target Date *
              </label>
              <div className="relative">
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full rounded-xl border border-gold-200/90 bg-white px-3.5 py-2.5 text-sm text-forest-900 shadow-sm focus:border-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800/10"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800">
                  Time Slots (comma-separated 24h intervals)
                </label>
                <span className="text-[11px] text-forest-800/60">Format: HH:MM-HH:MM</span>
              </div>
              <input
                value={form.timeSlots}
                onChange={(e) => setForm({ ...form, timeSlots: e.target.value })}
                placeholder="10:00-11:00, 11:30-12:30, 14:00-15:00"
                className="w-full rounded-xl border border-gold-200/90 bg-white px-3.5 py-2.5 text-sm text-forest-900 shadow-sm focus:border-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800/10"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-medium text-forest-800/60 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-gold-600" /> Presets:
            </span>
            {PRESET_SLOTS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setForm({ ...form, timeSlots: p.value })}
                className="rounded-lg border border-gold-200 bg-gold-50/60 hover:bg-gold-100/80 px-2.5 py-1 text-xs font-medium text-forest-900 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={creating}
              className="bg-forest-900 text-ivory hover:bg-forest-800 border border-gold-500/30 px-6 py-2.5 rounded-xl text-sm font-medium shadow-sm transition-all"
            >
              {creating ? 'Saving Schedule…' : 'Save Date Schedule'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Filter Tabs & Header */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-bold text-forest-900">Configured Dates ({filteredAvailability.length})</h2>
          <p className="text-xs text-forest-800/60">Overview of active booking schedules and client reservations.</p>
        </div>

        <div className="flex items-center rounded-xl bg-forest-900/5 p-1 border border-gold-200/50">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-white text-forest-900 shadow-sm font-semibold'
                : 'text-forest-800/70 hover:text-forest-900'
            }`}
          >
            All ({totalDates})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              filter === 'open'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-forest-800/70 hover:text-forest-900'
            }`}
          >
            Open ({openDates})
          </button>
          <button
            onClick={() => setFilter('blocked')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              filter === 'blocked'
                ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                : 'text-forest-800/70 hover:text-forest-900'
            }`}
          >
            Blocked ({totalDates - openDates})
          </button>
        </div>
      </div>

      {/* Date Cards Grid */}
      <div className="mt-4 space-y-3.5">
        {loading && (
          <div className="rounded-2xl border border-gold-200/60 bg-white p-10 text-center text-forest-800/60">
            <CalendarIcon className="mx-auto h-8 w-8 animate-spin text-gold-600 mb-2" />
            <p className="text-sm">Loading studio schedule…</p>
          </div>
        )}

        {!loading && filteredAvailability.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gold-300 bg-white p-10 text-center">
            <CalendarCheck className="mx-auto h-10 w-10 text-gold-500 mb-2 opacity-70" />
            <p className="font-serif text-lg font-bold text-forest-900">No dates found</p>
            <p className="text-sm text-forest-800/60 mt-1">
              {filter === 'all'
                ? 'No availability has been added yet. Use the form above to add dates.'
                : `No dates matching the "${filter}" filter.`}
            </p>
          </div>
        )}

        {filteredAvailability.map((a) => {
          const bookedCount = a.timeSlots.filter((s) => s.isBooked).length;
          const totalSlotCount = a.timeSlots.length;
          const isFullyBooked = totalSlotCount > 0 && bookedCount === totalSlotCount;

          return (
            <Card
              key={a.id}
              className={`p-5 transition-all hover:shadow-md border ${
                a.isAvailable
                  ? 'border-gold-200/80 bg-white'
                  : 'border-neutral-200 bg-neutral-50/70'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Date and Status Info */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border text-center font-serif ${
                      a.isAvailable
                        ? 'border-gold-300/80 bg-gold-50 text-forest-900'
                        : 'border-neutral-300 bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-sans tracking-wider font-semibold opacity-70">
                      {new Date(a.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-base font-bold leading-none">
                      {new Date(a.date).getDate()}
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-base font-bold text-forest-900">
                        {formatDate(a.date)}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          a.isAvailable
                            ? isFullyBooked
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-neutral-200 text-neutral-700 border border-neutral-300'
                        }`}
                      >
                        {a.isAvailable ? (
                          isFullyBooked ? (
                            <>Full (All Booked)</>
                          ) : (
                            <>
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> Open
                            </>
                          )
                        ) : (
                          <>
                            <Lock className="h-3 w-3" /> Blocked
                          </>
                        )}
                      </span>
                    </div>

                    <p className="text-xs text-forest-800/70 mt-1 flex items-center gap-2">
                      <span>{totalSlotCount} total slots</span>
                      <span>•</span>
                      <span className={bookedCount > 0 ? 'font-semibold text-gold-800' : ''}>
                        {bookedCount} booked
                      </span>
                      <span>•</span>
                      <span>{totalSlotCount - bookedCount} open</span>
                    </p>
                  </div>
                </div>

                {/* Slots preview */}
                <div className="flex-1 max-w-xl">
                  <div className="flex flex-wrap gap-1.5">
                    {a.timeSlots.map((s) => (
                      <span
                        key={s.id}
                        className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs ${
                          s.isBooked
                            ? 'bg-gold-100/90 text-gold-950 font-semibold border border-gold-300/80 line-through opacity-70'
                            : a.isAvailable
                            ? 'bg-forest-900/5 text-forest-900 border border-gold-200/60'
                            : 'bg-neutral-200/70 text-neutral-600'
                        }`}
                      >
                        <Clock className="h-3 w-3 text-gold-600" />
                        {s.startTime} - {s.endTime}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gold-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleAvailable(a.id, a.isAvailable)}
                    className={`gap-1.5 text-xs rounded-xl ${
                      a.isAvailable
                        ? 'border-gold-300 text-forest-900 hover:bg-gold-50'
                        : 'border-emerald-300 text-emerald-800 hover:bg-emerald-50'
                    }`}
                  >
                    {a.isAvailable ? (
                      <>
                        <Lock className="h-3.5 w-3.5 text-forest-700" /> Block Date
                      </>
                    ) : (
                      <>
                        <Unlock className="h-3.5 w-3.5 text-emerald-600" /> Open Date
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => remove(a.id, a.date)}
                    className="text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </AdminShell>
  );
}
