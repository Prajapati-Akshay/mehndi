import { db } from '@/lib/db';
import { uid, nowIso } from '@/lib/utils';
import type { Availability, DBAvailability } from '@/lib/types';
import { DEFAULT_SLOTS, startOfDayIso } from '@/domain/availability';

async function hydrate(a: DBAvailability): Promise<Availability> {
  const slots = await db.timeSlots.where('availabilityId').equals(a.id).toArray();
  return {
    id: a.id,
    date: a.date,
    isAvailable: a.isAvailable,
    timeSlots: slots.map((s) => ({ id: s.id, startTime: s.startTime, endTime: s.endTime, isBooked: s.isBooked })),
  };
}

export async function listAvailability(): Promise<Availability[]> {
  const rows = await db.availability.orderBy('date').toArray();
  return Promise.all(rows.map(hydrate));
}

export async function getAvailabilityByDate(date: string): Promise<Availability | null> {
  const iso = startOfDayIso(date);
  const row = await db.availability.where('date').equals(iso).first();
  if (!row) return null;
  return hydrate(row);
}

export async function ensureAvailability(date: string): Promise<Availability> {
  const iso = startOfDayIso(date);
  let row = await db.availability.where('date').equals(iso).first();
  const now = nowIso();
  if (!row) {
    row = { id: uid(), date: iso, isAvailable: true, note: null, createdAt: now, updatedAt: now };
    await db.availability.add(row);
    for (const slot of DEFAULT_SLOTS) {
      await db.timeSlots.add({ id: uid(), availabilityId: row.id, ...slot, isBooked: false });
    }
  }
  return hydrate(row);
}

export async function setAvailabilityOpen(id: string, isAvailable: boolean, note?: string | null): Promise<void> {
  await db.availability.update(id, { isAvailable, note: note ?? null, updatedAt: nowIso() });
}

export async function addTimeSlot(availabilityId: string, startTime: string, endTime: string): Promise<void> {
  await db.timeSlots.add({ id: uid(), availabilityId, startTime, endTime, isBooked: false });
}

export async function updateTimeSlot(id: string, patch: { startTime?: string; endTime?: string }): Promise<void> {
  await db.timeSlots.update(id, patch);
}

export async function toggleTimeSlotBooked(id: string, isBooked: boolean): Promise<void> {
  await db.timeSlots.update(id, { isBooked });
}

export async function deleteTimeSlot(id: string): Promise<void> {
  await db.timeSlots.delete(id);
}

export async function deleteAvailability(id: string): Promise<void> {
  await db.timeSlots.where('availabilityId').equals(id).delete();
  await db.availability.delete(id);
}
