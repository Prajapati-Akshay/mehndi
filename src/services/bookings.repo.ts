import type { Booking, BookingStatus } from '@/lib/types';
import { apiErrorFromCode, BookingConflictError, BookingValidationError } from '@/lib/errors';

export { BookingConflictError, BookingValidationError };

async function parseOrThrow(res: Response) {
  if (res.ok) return res.json();
  const body = await res.json().catch(() => ({}));
  throw apiErrorFromCode(body.code, body.error ?? 'Something went wrong');
}

export async function listBookings(status?: BookingStatus): Promise<Booking[]> {
  const qs = status ? `?status=${status}` : '';
  const res = await fetch(`/api/bookings${qs}`, { cache: 'no-store' });
  const { bookings } = await parseOrThrow(res);
  return bookings;
}

export async function getBooking(idOrNumber: string): Promise<Booking | null> {
  const res = await fetch(`/api/bookings/${idOrNumber}`, { cache: 'no-store' });
  const { booking } = await parseOrThrow(res);
  return booking;
}

export async function getBookingHistory(bookingId: string) {
  const res = await fetch(`/api/bookings/${bookingId}/history`, { cache: 'no-store' });
  const { history } = await parseOrThrow(res);
  return history;
}

export async function listBookingsForCustomer(customerId: string): Promise<Booking[]> {
  const res = await fetch(`/api/bookings/customer/${customerId}`, { cache: 'no-store' });
  const { bookings } = await parseOrThrow(res);
  return bookings;
}

export interface CreateBookingInput {
  fullName: string;
  phoneNumber: string;
  whatsappNumber: string;
  email?: string | null;
  address?: string | null;
  serviceId: string;
  pricingId: string;
  timeSlotId?: string | null;
  appointmentDate: string;
  appointmentTime: string;
  eventType?: string | null;
  numberOfPeople: number;
  notes?: string | null;
  termsAccepted: boolean;
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const { booking } = await parseOrThrow(res);
  return booking;
}

export async function updateBookingStatus(id: string, status: BookingStatus, note?: string | null): Promise<Booking> {
  const res = await fetch(`/api/bookings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, note }),
  });
  const { booking } = await parseOrThrow(res);
  return booking;
}

export async function deleteBooking(id: string): Promise<void> {
  const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
  await parseOrThrow(res);
}
