// Ported from apps/api/src/availability/availability.service.ts, plus the
// "no configured slots -> DEFAULT_SLOTS fallback" behavior used by the booking wizard.
export const DEFAULT_SLOTS = [
  { startTime: '10:00', endTime: '11:00' },
  { startTime: '11:30', endTime: '12:30' },
  { startTime: '14:00', endTime: '15:00' },
  { startTime: '15:30', endTime: '16:30' },
  { startTime: '17:00', endTime: '18:00' },
];

export function startOfDayIso(dateStr: string): string {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function todayStartIso(): string {
  return startOfDayIso(new Date().toISOString());
}
