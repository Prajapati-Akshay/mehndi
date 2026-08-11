// Server-side mapping from flat Firestore booking docs to the `Booking` view shape the UI
// already expects (src/lib/types.ts). Firestore has no joins, so this hydrates customer/
// service/category/pricing with a few extra reads per booking — same approach the original
// Dexie-based hydrateBooking() used.
import { db } from './firestore';
import type { Booking, BookingStatus } from './types';

interface RawBooking {
  bookingNumber: string;
  customerId: string;
  serviceId: string;
  pricingId: string;
  timeSlotId: string | null;
  appointmentDate: string;
  appointmentTime: string;
  eventType: string | null;
  numberOfPeople: number;
  notes: string | null;
  pricePerPerson: number;
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  status: BookingStatus;
  createdAt: string;
}

export async function hydrateBookingDoc(id: string, b: RawBooking): Promise<Booking | null> {
  const [customerSnap, serviceSnap, pricingSnap] = await Promise.all([
    db.collection('customers').doc(b.customerId).get(),
    db.collection('services').doc(b.serviceId).get(),
    db.collection('servicePricing').doc(b.pricingId).get(),
  ]);
  if (!customerSnap.exists || !serviceSnap.exists || !pricingSnap.exists) return null;

  const customer = customerSnap.data()!;
  const service = serviceSnap.data()!;
  const pricing = pricingSnap.data()!;

  const categorySnap = await db.collection('serviceCategories').doc(service.categoryId).get();
  if (!categorySnap.exists) return null;
  const category = categorySnap.data()!;

  return {
    id,
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
      id: customerSnap.id,
      fullName: customer.fullName,
      phone: customer.phone,
      whatsappNumber: customer.whatsappNumber,
      email: customer.email ?? null,
      address: customer.address ?? null,
    },
    pricing: {
      id: pricingSnap.id,
      lengthLabel: pricing.lengthLabel,
      price: pricing.price,
      whatsIncluded: pricing.whatsIncluded,
      sortOrder: pricing.sortOrder,
      isActive: pricing.isActive,
    },
    service: {
      id: serviceSnap.id,
      name: service.name,
      category: { id: categorySnap.id, name: category.name, slug: category.slug },
    },
  };
}

export async function findBookingView(idOrNumber: string): Promise<Booking | null> {
  let snap = await db.collection('bookings').doc(idOrNumber).get();
  if (!snap.exists) {
    const query = await db.collection('bookings').where('bookingNumber', '==', idOrNumber).limit(1).get();
    if (query.empty) return null;
    snap = query.docs[0];
  }
  return hydrateBookingDoc(snap.id, snap.data() as RawBooking);
}

// Sorted in memory (rather than an orderBy chained after where) so listing bookings never
// depends on a Firestore composite index being created first.
export async function listBookingViews(status?: BookingStatus): Promise<Booking[]> {
  const query = status ? db.collection('bookings').where('status', '==', status) : db.collection('bookings');
  const snap = await query.get();
  const docs = [...snap.docs].sort((a, b) => (b.data().createdAt as string).localeCompare(a.data().createdAt as string));
  const out: Booking[] = [];
  for (const doc of docs) {
    const hydrated = await hydrateBookingDoc(doc.id, doc.data() as RawBooking);
    if (hydrated) out.push(hydrated);
  }
  return out;
}

export async function listBookingViewsForCustomer(customerId: string): Promise<Booking[]> {
  const snap = await db.collection('bookings').where('customerId', '==', customerId).get();
  const docs = [...snap.docs].sort((a, b) => (b.data().createdAt as string).localeCompare(a.data().createdAt as string));
  const out: Booking[] = [];
  for (const doc of docs) {
    const hydrated = await hydrateBookingDoc(doc.id, doc.data() as RawBooking);
    if (hydrated) out.push(hydrated);
  }
  return out;
}
