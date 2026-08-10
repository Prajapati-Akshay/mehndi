// Ported from apps/api/src/bookings/bookings.service.ts. Runs entirely client-side against
// Dexie instead of Prisma; validation/conflict rules and status-transition side effects are
// kept identical.
import { db } from '@/lib/db';
import { uid, nowIso } from '@/lib/utils';
import type { BookingStatus, DBBooking } from '@/lib/types';
import { calculateBookingAmounts } from './pricing';
import { startOfDayIso, todayStartIso } from './availability';

export class BookingValidationError extends Error {}
export class BookingConflictError extends Error {}

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

function generateBookingNumber(): string {
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  const stamp = Date.now().toString(36).slice(-4).toUpperCase();
  return `MBD-${stamp}${random}`;
}

export async function createBooking(input: CreateBookingInput): Promise<DBBooking> {
  if (!input.termsAccepted) {
    throw new BookingValidationError('You must accept the booking terms and conditions');
  }
  if (input.numberOfPeople < 1) {
    throw new BookingValidationError('Number of people must be at least 1');
  }

  const appointmentDate = startOfDayIso(input.appointmentDate);
  const today = todayStartIso();
  if (appointmentDate < today) {
    throw new BookingValidationError('Appointment date cannot be in the past');
  }

  const service = await db.services.get(input.serviceId);
  if (!service || !service.isActive) {
    throw new BookingValidationError('Selected service is not available');
  }

  const pricing = await db.pricing.get(input.pricingId);
  if (!pricing || !pricing.isActive) {
    throw new BookingValidationError('Selected package is not available');
  }
  if (pricing.serviceId !== service.id) {
    throw new BookingValidationError('Selected package does not belong to the selected service');
  }

  if (input.timeSlotId) {
    const slot = await db.timeSlots.get(input.timeSlotId);
    if (!slot) throw new BookingValidationError('Selected time slot does not exist');
    const availability = await db.availability.get(slot.availabilityId);
    if (!availability || !availability.isAvailable) {
      throw new BookingValidationError('Selected date is not available for booking');
    }
    if (availability.date !== appointmentDate) {
      throw new BookingValidationError('Time slot does not match the selected date');
    }
    if (slot.isBooked) {
      throw new BookingConflictError('This appointment slot is no longer available. Please select another time.');
    }
  } else {
    const conflicting = await db.bookings
      .where('appointmentDate')
      .equals(appointmentDate)
      .and((b) => b.appointmentTime === input.appointmentTime && (b.status === 'PENDING' || b.status === 'CONFIRMED'))
      .first();
    if (conflicting) {
      throw new BookingConflictError('This appointment slot is no longer available. Please select another time.');
    }
  }

  const amounts = calculateBookingAmounts(pricing.price, input.numberOfPeople);
  const now = nowIso();

  return db.transaction('rw', [db.timeSlots, db.customers, db.bookings, db.statusHistory, db.payments], async () => {
    if (input.timeSlotId) {
      const slot = await db.timeSlots.get(input.timeSlotId);
      if (!slot || slot.isBooked) {
        throw new BookingConflictError('This appointment slot is no longer available. Please select another time.');
      }
      await db.timeSlots.update(input.timeSlotId, { isBooked: true });
    }

    let customer = await db.customers.where('phone').equals(input.phoneNumber).first();
    if (customer) {
      await db.customers.update(customer.id, {
        fullName: input.fullName,
        whatsappNumber: input.whatsappNumber,
        email: input.email ?? null,
        address: input.address ?? null,
        updatedAt: now,
      });
      customer = { ...customer, fullName: input.fullName, whatsappNumber: input.whatsappNumber, email: input.email ?? null, address: input.address ?? null };
    } else {
      customer = {
        id: uid(),
        fullName: input.fullName,
        phone: input.phoneNumber,
        whatsappNumber: input.whatsappNumber,
        email: input.email ?? null,
        address: input.address ?? null,
        createdAt: now,
        updatedAt: now,
      };
      await db.customers.add(customer);
    }

    const booking: DBBooking = {
      id: uid(),
      bookingNumber: generateBookingNumber(),
      customerId: customer.id,
      serviceId: service.id,
      pricingId: pricing.id,
      timeSlotId: input.timeSlotId ?? null,
      appointmentDate,
      appointmentTime: input.appointmentTime,
      eventType: input.eventType ?? null,
      numberOfPeople: input.numberOfPeople,
      notes: input.notes ?? null,
      pricePerPerson: amounts.pricePerPerson,
      totalAmount: amounts.totalAmount,
      advanceAmount: amounts.advanceAmount,
      remainingAmount: amounts.remainingAmount,
      status: 'PENDING',
      termsAccepted: input.termsAccepted,
      createdAt: now,
      updatedAt: now,
    };
    await db.bookings.add(booking);

    await db.statusHistory.add({
      id: uid(),
      bookingId: booking.id,
      status: 'PENDING',
      note: 'Booking submitted by customer',
      createdAt: now,
    });

    await db.payments.add({
      id: uid(),
      bookingId: booking.id,
      amount: amounts.advanceAmount,
      totalAmount: amounts.totalAmount,
      advanceAmount: amounts.advanceAmount,
      remainingAmount: amounts.remainingAmount,
      status: 'PENDING',
      method: null,
      reference: null,
      createdAt: now,
      updatedAt: now,
    });

    return booking;
  });
}

/** Status-transition side effects, ported from BookingsService.updateStatus. */
export async function updateBookingStatus(id: string, status: BookingStatus, note?: string): Promise<DBBooking> {
  const booking = await db.bookings.get(id);
  if (!booking) throw new BookingValidationError('Booking not found');
  const now = nowIso();

  return db.transaction('rw', [db.bookings, db.timeSlots, db.payments, db.statusHistory], async () => {
    if ((status === 'CANCELLED' || status === 'REJECTED') && booking.timeSlotId) {
      await db.timeSlots.update(booking.timeSlotId, { isBooked: false });
    }

    const paymentStatus = status === 'COMPLETED' ? 'PAID' : status === 'CONFIRMED' ? 'PARTIAL' : undefined;
    if (paymentStatus) {
      const payments = await db.payments.where('bookingId').equals(id).toArray();
      for (const p of payments) {
        await db.payments.update(p.id, { status: paymentStatus, updatedAt: now });
      }
    }

    await db.bookings.update(id, { status, updatedAt: now });
    await db.statusHistory.add({ id: uid(), bookingId: id, status, note: note ?? null, createdAt: now });

    const updated = await db.bookings.get(id);
    return updated!;
  });
}

export async function deleteBooking(id: string): Promise<void> {
  const booking = await db.bookings.get(id);
  if (!booking) throw new BookingValidationError('Booking not found');
  if (booking.timeSlotId) {
    await db.timeSlots.update(booking.timeSlotId, { isBooked: false });
  }
  await db.bookings.delete(id);
  await db.statusHistory.where('bookingId').equals(id).delete();
  await db.payments.where('bookingId').equals(id).delete();
}
