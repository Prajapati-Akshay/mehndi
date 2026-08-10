'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Availability } from '@/lib/types';
import {
  listAvailability, ensureAvailability, setAvailabilityOpen, deleteAvailability, addTimeSlot,
} from '@/services/availability.repo';

export default function AdminAvailabilityPage() {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: '', timeSlots: '10:00-11:00, 11:30-12:30, 14:00-15:00, 15:30-16:30, 17:00-18:00' });
  const [creating, setCreating] = useState(false);

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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const record = await ensureAvailability(form.date);
      const existingLabels = new Set(record.timeSlots.map((s) => `${s.startTime}-${s.endTime}`));
      const wanted = form.timeSlots.split(',').map((s) => s.trim()).filter(Boolean);
      for (const label of wanted) {
        if (existingLabels.has(label)) continue;
        const [startTime, endTime] = label.split('-');
        if (startTime && endTime) await addTimeSlot(record.id, startTime, endTime);
      }
      setForm({ ...form, date: '' });
      await load();
    } finally {
      setCreating(false);
    }
  }

  async function toggleAvailable(id: string, isAvailable: boolean) {
    await setAvailabilityOpen(id, !isAvailable);
    await load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this date and all of its time slots?')) return;
    await deleteAvailability(id);
    await load();
  }

  return (
    <AdminShell>
      <h1 className="font-serif text-2xl text-forest-900">Availability</h1>
      <p className="text-sm text-forest-800/60 mt-1">Control which dates and time slots are open for booking.</p>

      <Card className="mt-6 p-6">
        <h2 className="font-medium text-forest-900 mb-4">Add / Update a Date</h2>
        <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-3">
          <input
            required
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="rounded-xl border border-gold-200 px-3 py-2 text-sm"
          />
          <input
            value={form.timeSlots}
            onChange={(e) => setForm({ ...form, timeSlots: e.target.value })}
            placeholder="10:00-11:00, 11:30-12:30"
            className="rounded-xl border border-gold-200 px-3 py-2 text-sm"
          />
          <Button type="submit" disabled={creating} className="sm:col-span-2 justify-self-start">
            {creating ? 'Saving…' : 'Save Availability'}
          </Button>
        </form>
      </Card>

      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm text-forest-800/50">Loading…</p>}
        {availability.map((a) => (
          <Card key={a.id} className="p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium text-forest-900">{formatDate(a.date)}</p>
              <p className="text-xs text-forest-800/60 mt-1">
                {a.timeSlots.length} slots · {a.timeSlots.filter((s) => s.isBooked).length} booked
              </p>
            </div>
            <div className="flex gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${a.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'}`}>
                {a.isAvailable ? 'Open' : 'Blocked'}
              </span>
              <Button size="sm" variant="outline" onClick={() => toggleAvailable(a.id, a.isAvailable)}>
                {a.isAvailable ? 'Block Date' : 'Open Date'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => remove(a.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
