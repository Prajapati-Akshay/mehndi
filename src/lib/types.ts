// Domain model shapes, ported from apps/web/src/lib/types.ts and apps/api/prisma/schema.prisma.
// This is a standalone app: nothing here is imported from apps/web or apps/api.

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'REFUNDED';

export interface DBUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface DBCustomer {
  id: string;
  fullName: string;
  phone: string;
  whatsappNumber: string;
  email: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DBServiceCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DBService {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DBServicePricing {
  id: string;
  serviceId: string;
  lengthLabel: string;
  price: number;
  whatsIncluded: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DBAvailability {
  id: string;
  date: string; // ISO date (yyyy-mm-dd start of day)
  isAvailable: boolean;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DBTimeSlot {
  id: string;
  availabilityId: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface DBBooking {
  id: string;
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
  termsAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DBBookingStatusHistory {
  id: string;
  bookingId: string;
  status: BookingStatus;
  note: string | null;
  createdAt: string;
}

export interface DBPayment {
  id: string;
  bookingId: string;
  amount: number;
  totalAmount: number | null;
  advanceAmount: number | null;
  remainingAmount: number | null;
  status: PaymentStatus;
  method: string | null;
  reference: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DBGallery {
  id: string;
  imageUrl: string;
  title: string | null;
  category: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DBTestimonial {
  id: string;
  customerName: string;
  message: string;
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DBContactMessage {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ---- Composed / view shapes used by the UI (mirrors apps/web/src/lib/types.ts) ----

export interface PricingTier {
  id: string;
  lengthLabel: string;
  price: number;
  whatsIncluded: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  pricingTiers: PricingTier[];
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  services: Service[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Availability {
  id: string;
  date: string;
  isAvailable: boolean;
  timeSlots: TimeSlot[];
}

export interface Booking {
  id: string;
  bookingNumber: string;
  status: BookingStatus;
  appointmentDate: string;
  appointmentTime: string;
  eventType: string | null;
  numberOfPeople: number;
  notes: string | null;
  pricePerPerson: number;
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  createdAt: string;
  customer: {
    id: string;
    fullName: string;
    phone: string;
    whatsappNumber: string;
    email: string | null;
    address: string | null;
  };
  pricing: PricingTier;
  service: {
    id: string;
    name: string;
    category: { id: string; name: string; slug: string };
  };
}

export interface CreateBookingResult {
  bookingId: string;
  bookingNumber: string;
  status: Booking['status'];
  pricePerPerson: number;
  numberOfPeople: number;
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  appointmentDate: string;
  appointmentTime: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  message: string;
  rating: number;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string | null;
  category: string | null;
}

export interface DashboardData {
  totals: {
    totalBookings: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    rejected: number;
  };
  revenue: number;
  upcomingAppointments: Booking[];
  recentBookings: Booking[];
}
