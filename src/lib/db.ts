import Dexie, { type Table } from 'dexie';
import type {
  DBUser, DBCustomer, DBServiceCategory, DBService, DBServicePricing,
  DBAvailability, DBTimeSlot, DBBooking, DBBookingStatusHistory, DBPayment,
  DBGallery, DBTestimonial, DBContactMessage,
} from './types';

export interface DBMeta {
  key: string;
  value: string;
}

export class MehndiDB extends Dexie {
  users!: Table<DBUser, string>;
  customers!: Table<DBCustomer, string>;
  categories!: Table<DBServiceCategory, string>;
  services!: Table<DBService, string>;
  pricing!: Table<DBServicePricing, string>;
  availability!: Table<DBAvailability, string>;
  timeSlots!: Table<DBTimeSlot, string>;
  bookings!: Table<DBBooking, string>;
  statusHistory!: Table<DBBookingStatusHistory, string>;
  payments!: Table<DBPayment, string>;
  gallery!: Table<DBGallery, string>;
  testimonials!: Table<DBTestimonial, string>;
  contactMessages!: Table<DBContactMessage, string>;
  meta!: Table<DBMeta, string>;

  constructor() {
    super('mehndi-by-dhara-standalone');
    this.version(1).stores({
      users: 'id, email',
      customers: 'id, phone',
      categories: 'id, slug, sortOrder',
      services: 'id, categoryId, sortOrder',
      pricing: 'id, serviceId, sortOrder',
      availability: 'id, date',
      timeSlots: 'id, availabilityId, startTime',
      bookings: 'id, bookingNumber, status, appointmentDate, customerId, serviceId, pricingId, timeSlotId, createdAt',
      statusHistory: 'id, bookingId, createdAt',
      payments: 'id, bookingId',
      gallery: 'id, sortOrder, category',
      testimonials: 'id',
      contactMessages: 'id, createdAt',
      meta: 'key',
    });
  }
}

export const db = new MehndiDB();

/** All table names, used by export/import/reset tooling. */
export const ALL_TABLES = [
  'users', 'customers', 'categories', 'services', 'pricing', 'availability',
  'timeSlots', 'bookings', 'statusHistory', 'payments', 'gallery', 'testimonials',
  'contactMessages',
] as const;
