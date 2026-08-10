import { db } from '@/lib/db';
import type { Booking, DBBooking, BookingStatus } from '@/lib/types';

export async function hydrateBooking(b: DBBooking): Promise<Booking | null> {
  const [customer, service, pricing] = await Promise.all([
    db.customers.get(b.customerId),
    db.services.get(b.serviceId),
    db.pricing.get(b.pricingId),
  ]);
  if (!customer || !service || !pricing) return null;
  const category = await db.categories.get(service.categoryId);
  if (!category) return null;

  return {
    id: b.id,
    bookingNumber: b.bookingNumber,
    status: b.status,
    appointmentDate: b.appointmentDate,
    appointmentTime: b.appointmentTime,
    eventType: b.eventType,
    numberOfPeople: b.numberOfPeople,
    notes: b.notes,
    pricePerPerson: b.pricePerPerson,
    totalAmount: b.totalAmount,
    advanceAmount: b.advanceAmount,
    remainingAmount: b.remainingAmount,
    createdAt: b.createdAt,
    customer: {
      id: customer.id,
      fullName: customer.fullName,
      phone: customer.phone,
      whatsappNumber: customer.whatsappNumber,
      email: customer.email,
      address: customer.address,
    },
    pricing: {
      id: pricing.id,
      lengthLabel: pricing.lengthLabel,
      price: pricing.price,
      whatsIncluded: pricing.whatsIncluded,
      sortOrder: pricing.sortOrder,
      isActive: pricing.isActive,
    },
    service: {
      id: service.id,
      name: service.name,
      category: { id: category.id, name: category.name, slug: category.slug },
    },
  };
}

export async function listBookings(status?: BookingStatus): Promise<Booking[]> {
  const rows = status
    ? await db.bookings.where('status').equals(status).toArray()
    : await db.bookings.toArray();
  rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const out: Booking[] = [];
  for (const r of rows) {
    const hydrated = await hydrateBooking(r);
    if (hydrated) out.push(hydrated);
  }
  return out;
}

export async function getBooking(idOrNumber: string): Promise<Booking | null> {
  let row = await db.bookings.get(idOrNumber);
  if (!row) {
    row = await db.bookings.where('bookingNumber').equals(idOrNumber).first();
  }
  if (!row) return null;
  return hydrateBooking(row);
}

export async function getBookingHistory(bookingId: string) {
  return db.statusHistory.where('bookingId').equals(bookingId).sortBy('createdAt');
}

export async function listBookingsForCustomer(customerId: string): Promise<Booking[]> {
  const rows = await db.bookings.where('customerId').equals(customerId).toArray();
  const out: Booking[] = [];
  for (const r of rows) {
    const hydrated = await hydrateBooking(r);
    if (hydrated) out.push(hydrated);
  }
  return out;
}
