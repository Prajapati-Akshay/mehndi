import type { Availability } from '@/lib/types';

export async function listAvailability(): Promise<Availability[]> {
  const res = await fetch('/api/availability', { cache: 'no-store' });
  const { availability } = await res.json();
  return availability;
}

export async function getAvailabilityByDate(date: string): Promise<Availability | null> {
  const all = await listAvailability();
  return all.find((a) => new Date(a.date).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]) ?? null;
}

export async function ensureAvailability(date: string): Promise<Availability> {
  const res = await fetch('/api/availability', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date }),
  });
  const { availability } = await res.json();
  return availability;
}

export async function setAvailabilityOpen(id: string, isAvailable: boolean, note?: string | null): Promise<void> {
  await fetch(`/api/availability/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isAvailable, note: note ?? null }),
  });
}

export async function addTimeSlot(availabilityId: string, startTime: string, endTime: string): Promise<void> {
  await fetch(`/api/availability/${availabilityId}/slots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ startTime, endTime }),
  });
}

export async function updateTimeSlot(id: string, patch: { startTime?: string; endTime?: string }): Promise<void> {
  await fetch(`/api/timeslots/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
}

export async function toggleTimeSlotBooked(id: string, isBooked: boolean): Promise<void> {
  await fetch(`/api/timeslots/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isBooked }),
  });
}

export async function deleteTimeSlot(id: string): Promise<void> {
  await fetch(`/api/timeslots/${id}`, { method: 'DELETE' });
}

export async function deleteAvailability(id: string): Promise<void> {
  await fetch(`/api/availability/${id}`, { method: 'DELETE' });
}
