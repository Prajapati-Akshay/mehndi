// Server-only booking domain logic (runs against Firestore). Called exclusively from API
// routes (src/app/api/bookings/**) — never import this from client components; use
// src/services/bookings.repo.ts there instead, which calls these same operations over HTTP.
import { db } from '@/lib/firestore';
import { nowIso } from '@/lib/utils';
import { BookingConflictError, BookingValidationError, NotFoundError } from '@/lib/errors';
import type { BookingStatus } from '@/lib/types';
import { calculateBookingAmounts } from './pricing';
import { startOfDayIso, todayStartIso } from './availability';

export { BookingConflictError, BookingValidationError };

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

export interface BookingRecord {
  id: string;
  bookingNumber: string;
  status: BookingStatus;
}

function generateBookingNumber(): string {
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  const stamp = Date.now().toString(36).slice(-4).toUpperCase();
  return `MBD-${stamp}${random}`;
}

export async function createBooking(input: CreateBookingInput): Promise<BookingRecord> {
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

  const serviceSnap = await db.collection('services').doc(input.serviceId).get();
  const service = serviceSnap.data();
  if (!serviceSnap.exists || !service?.isActive) {
    throw new BookingValidationError('Selected service is not available');
  }

  const pricingSnap = await db.collection('servicePricing').doc(input.pricingId).get();
  const pricing = pricingSnap.data();
  if (!pricingSnap.exists || !pricing?.isActive) {
    throw new BookingValidationError('Selected package is not available');
  }
  if (pricing.serviceId !== input.serviceId) {
    throw new BookingValidationError('Selected package does not belong to the selected service');
  }

  if (input.timeSlotId) {
    const slotSnap = await db.collection('timeSlots').doc(input.timeSlotId).get();
    const slot = slotSnap.data();
    if (!slotSnap.exists || !slot) throw new BookingValidationError('Selected time slot does not exist');
    const availabilitySnap = await db.collection('availability').doc(slot.availabilityId).get();
    const availability = availabilitySnap.data();
    if (!availabilitySnap.exists || !availability?.isAvailable) {
      throw new BookingValidationError('Selected date is not available for booking');
    }
    if (availability.date !== appointmentDate) {
      throw new BookingValidationError('Time slot does not match the selected date');
    }
    if (slot.isBooked) {
      throw new BookingConflictError('This appointment slot is no longer available. Please select another time.');
    }
  }

  const amounts = calculateBookingAmounts(pricing.price, input.numberOfPeople);
  const now = nowIso();

  return db.runTransaction(async (tx) => {
    const timeSlotRef = input.timeSlotId ? db.collection('timeSlots').doc(input.timeSlotId) : null;
    const timeSlotSnap = timeSlotRef ? await tx.get(timeSlotRef) : null;

    // Same-slot conflicts are already covered by the isBooked re-check below. For bookings
    // made without a specific timeSlot, guard against double-booking the same date+time.
    let conflictDocs: FirebaseFirestore.QueryDocumentSnapshot[] = [];
    if (!input.timeSlotId) {
      const sameDateSnap = await tx.get(db.collection('bookings').where('appointmentDate', '==', appointmentDate));
      conflictDocs = sameDateSnap.docs.filter((d) => {
        const b = d.data();
        return b.appointmentTime === input.appointmentTime && (b.status === 'PENDING' || b.status === 'CONFIRMED');
      });
    }

    const customerRef = db.collection('customers').doc(input.phoneNumber);
    const customerSnap = await tx.get(customerRef);

    if (timeSlotRef && (!timeSlotSnap?.exists || timeSlotSnap.data()?.isBooked)) {
      throw new BookingConflictError('This appointment slot is no longer available. Please select another time.');
    }
    if (conflictDocs.length > 0) {
      throw new BookingConflictError('This appointment slot is no longer available. Please select another time.');
    }

    if (timeSlotRef) tx.update(timeSlotRef, { isBooked: true });

    if (customerSnap.exists) {
      tx.update(customerRef, {
        fullName: input.fullName,
        whatsappNumber: input.whatsappNumber,
        email: input.email ?? null,
        address: input.address ?? null,
        updatedAt: now,
      });
    } else {
      tx.set(customerRef, {
        fullName: input.fullName,
        phone: input.phoneNumber,
        whatsappNumber: input.whatsappNumber,
        email: input.email ?? null,
        address: input.address ?? null,
        createdAt: now,
        updatedAt: now,
      });
    }

    const bookingRef = db.collection('bookings').doc();
    const bookingNumber = generateBookingNumber();
    tx.set(bookingRef, {
      bookingNumber,
      customerId: input.phoneNumber,
      serviceId: input.serviceId,
      pricingId: input.pricingId,
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
    });

    tx.set(db.collection('bookingStatusHistory').doc(), {
      bookingId: bookingRef.id,
      status: 'PENDING',
      note: 'Booking submitted by customer',
      createdAt: now,
    });

    tx.set(db.collection('payments').doc(), {
      bookingId: bookingRef.id,
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

    return { id: bookingRef.id, bookingNumber, status: 'PENDING' as BookingStatus };
  });
}

/** Status-transition side effects, ported from the original Dexie implementation. */
export async function updateBookingStatus(id: string, status: BookingStatus, note?: string | null): Promise<void> {
  const bookingRef = db.collection('bookings').doc(id);
  const bookingSnap = await bookingRef.get();
  if (!bookingSnap.exists) throw new NotFoundError('Booking not found');
  const booking = bookingSnap.data()!;
  const now = nowIso();

  await db.runTransaction(async (tx) => {
    if ((status === 'CANCELLED' || status === 'REJECTED') && booking.timeSlotId) {
      tx.update(db.collection('timeSlots').doc(booking.timeSlotId), { isBooked: false });
    }

    const paymentStatus = status === 'COMPLETED' ? 'PAID' : status === 'CONFIRMED' ? 'PARTIAL' : undefined;
    if (paymentStatus) {
      const paymentsSnap = await tx.get(db.collection('payments').where('bookingId', '==', id));
      for (const doc of paymentsSnap.docs) {
        tx.update(doc.ref, { status: paymentStatus, updatedAt: now });
      }
    }

    tx.update(bookingRef, { status, updatedAt: now });
    tx.set(db.collection('bookingStatusHistory').doc(), { bookingId: id, status, note: note ?? null, createdAt: now });
  });
}

export async function deleteBooking(id: string): Promise<void> {
  const bookingRef = db.collection('bookings').doc(id);
  const bookingSnap = await bookingRef.get();
  if (!bookingSnap.exists) throw new NotFoundError('Booking not found');
  const booking = bookingSnap.data()!;

  const batch = db.batch();
  if (booking.timeSlotId) {
    batch.update(db.collection('timeSlots').doc(booking.timeSlotId), { isBooked: false });
  }
  batch.delete(bookingRef);

  const [historySnap, paymentsSnap, notificationsSnap, notificationEventsSnap] = await Promise.all([
    db.collection('bookingStatusHistory').where('bookingId', '==', id).get(),
    db.collection('payments').where('bookingId', '==', id).get(),
    db.collection('notifications').where('bookingId', '==', id).get(),
    db.collection('notificationEvents').where('bookingId', '==', id).get(),
  ]);
  for (const doc of [...historySnap.docs, ...paymentsSnap.docs, ...notificationsSnap.docs, ...notificationEventsSnap.docs]) {
    batch.delete(doc.ref);
  }

  await batch.commit();
}
