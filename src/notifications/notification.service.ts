// Centralized notification service. Appointment flows (API routes) call the functions below
// instead of talking to the email provider directly:
//
//   Appointment Service (API route) -> NotificationService -> Email Provider
//
// Every send is:
//  - idempotent: the (bookingId, eventType, channel) triple is used as a deterministic
//    Firestore document ID in `notificationEvents`, created with `.create()` (which fails
//    if the doc already exists). A duplicate call (double-click, retry, re-render) hits
//    that failure and is skipped instead of re-sending.
//  - isolated per channel: IN_APP/EMAIL are attempted independently and failures are
//    caught and recorded, never thrown, so a provider outage can never fail the booking
//    operation that triggered it.
import { db } from '@/lib/firestore';
import { nowIso } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { getEmailProvider } from './email/resend.provider';
import {
  adminNewBookingTemplate,
  customerAcceptedTemplate,
  customerCompletedTemplate,
  customerRejectedTemplate,
} from './templates/booking.templates';
import type { BookingNotificationContext } from './types';

type Channel = 'IN_APP' | 'EMAIL';
type RecipientType = 'ADMIN' | 'CUSTOMER';
type NotificationEventType = 'BOOKING_CREATED' | 'BOOKING_ACCEPTED' | 'BOOKING_REJECTED' | 'BOOKING_COMPLETED';

interface Recipient {
  type: RecipientType;
  id: string;
  email: string | null;
}

function isAlreadyExistsError(err: unknown): boolean {
  const code = (err as { code?: number | string })?.code;
  return code === 6 || code === 'already-exists';
}

async function loadBookingContext(bookingId: string): Promise<{ ctx: BookingNotificationContext; customer: Recipient } | null> {
  const bookingSnap = await db.collection('bookings').doc(bookingId).get();
  if (!bookingSnap.exists) return null;
  const booking = bookingSnap.data()!;

  const [customerSnap, serviceSnap, pricingSnap] = await Promise.all([
    db.collection('customers').doc(booking.customerId).get(),
    db.collection('services').doc(booking.serviceId).get(),
    db.collection('servicePricing').doc(booking.pricingId).get(),
  ]);
  if (!customerSnap.exists || !serviceSnap.exists || !pricingSnap.exists) return null;
  const customer = customerSnap.data()!;
  const service = serviceSnap.data()!;
  const pricing = pricingSnap.data()!;

  const categorySnap = await db.collection('serviceCategories').doc(service.categoryId).get();
  if (!categorySnap.exists) return null;
  const category = categorySnap.data()!;

  const ctx: BookingNotificationContext = {
    bookingId,
    bookingNumber: booking.bookingNumber,
    customerName: customer.fullName,
    customerPhone: customer.phone,
    customerEmail: customer.email ?? null,
    serviceName: service.name,
    categoryName: category.name,
    packageLabel: pricing.lengthLabel,
    date: formatDate(booking.appointmentDate),
    time: booking.appointmentTime,
    numberOfPeople: booking.numberOfPeople,
    totalAmount: booking.totalAmount,
  };

  return {
    ctx,
    customer: { type: 'CUSTOMER', id: customerSnap.id, email: customer.email ?? null },
  };
}

async function getAdminRecipient(): Promise<Recipient | null> {
  const snap = await db.collection('users').where('role', '==', 'ADMIN').limit(1).get();
  if (snap.empty) return null;
  const admin = snap.docs[0].data();
  return { type: 'ADMIN', id: snap.docs[0].id, email: admin.email };
}

/** Reserves the (bookingId, eventType, channel) slot. Returns null if it already exists
 *  (already sent/sending) so the caller can skip — this is the duplicate-prevention gate. */
async function reserveEvent(
  bookingId: string,
  eventType: NotificationEventType,
  channel: Channel,
  recipientType: RecipientType,
  recipient: string,
) {
  const ref = db.collection('notificationEvents').doc(`${bookingId}_${eventType}_${channel}`);
  try {
    await ref.create({
      bookingId,
      eventType,
      channel,
      recipientType,
      recipient,
      status: 'PENDING',
      providerMessageId: null,
      error: null,
      createdAt: nowIso(),
      sentAt: null,
    });
    return ref;
  } catch (err) {
    if (isAlreadyExistsError(err)) return null; // duplicate event — already handled once
    throw err;
  }
}

async function markEvent(ref: FirebaseFirestore.DocumentReference, patch: { status: 'SENT' | 'FAILED' | 'SKIPPED'; providerMessageId?: string; error?: string }) {
  await ref.update({
    status: patch.status,
    providerMessageId: patch.providerMessageId ?? null,
    error: patch.error ?? null,
    sentAt: patch.status === 'SENT' ? nowIso() : null,
  });
}

async function sendInApp(
  bookingId: string,
  eventType: NotificationEventType,
  recipient: Recipient,
  title: string,
  message: string,
  url: string,
) {
  const event = await reserveEvent(bookingId, eventType, 'IN_APP', recipient.type, recipient.id);
  if (!event) return;
  try {
    await db.collection('notifications').doc().set({
      recipientType: recipient.type,
      recipientId: recipient.id,
      bookingId,
      title,
      message,
      url,
      isRead: false,
      createdAt: nowIso(),
    });
    await markEvent(event, { status: 'SENT' });
  } catch (err) {
    await markEvent(event, { status: 'FAILED', error: err instanceof Error ? err.message : 'Unknown error' });
  }
}

async function sendEmail(
  bookingId: string,
  eventType: NotificationEventType,
  recipient: Recipient,
  subject: string,
  text: string,
  html: string,
  replyTo?: string | null,
) {
  const email = recipient.email?.trim();
  const event = await reserveEvent(bookingId, eventType, 'EMAIL', recipient.type, email || 'missing');
  if (!event) return;
  if (!email) {
    await markEvent(event, { status: 'SKIPPED', error: 'Email address unavailable' });
    return;
  }
  const provider = getEmailProvider();
  if (!provider) {
    await markEvent(event, { status: 'SKIPPED', error: 'Email provider not configured' });
    return;
  }
  try {
    const { providerMessageId } = await provider.send({ to: email, subject, text, html, replyTo: replyTo ?? undefined });
    await markEvent(event, { status: 'SENT', providerMessageId });
  } catch (err) {
    console.error('[notifications] Email send failed', err);
    await markEvent(event, { status: 'FAILED', error: err instanceof Error ? err.message : 'Unknown error' });
  }
}

async function safe(label: string, fn: () => Promise<void>) {
  try {
    await fn();
  } catch (err) {
    // Notification failures must never break the appointment operation that triggered them.
    console.error(`[notifications] ${label} failed`, err);
  }
}

export const NotificationService = {
  async notifyAppointmentCreated(bookingId: string): Promise<void> {
    const loaded = await loadBookingContext(bookingId);
    if (!loaded) return;
    const admin = await getAdminRecipient();
    if (!admin) return;
    const { ctx, customer } = loaded;
    const t = adminNewBookingTemplate(ctx);
    const url = '/admin/bookings';

    await Promise.all([
      safe('admin in-app (created)', () => sendInApp(bookingId, 'BOOKING_CREATED', admin, t.subject, t.inApp, url)),
      // reply-to the customer's own email so replying to this notification goes straight to them
      safe('admin email (created)', () => sendEmail(bookingId, 'BOOKING_CREATED', admin, t.subject, t.text, t.html, customer.email)),
    ]);
  },

  async notifyAppointmentAccepted(bookingId: string): Promise<void> {
    const loaded = await loadBookingContext(bookingId);
    if (!loaded) return;
    const { ctx, customer } = loaded;
    const t = customerAcceptedTemplate(ctx);
    const url = `/booking/confirmation/${bookingId}`;

    await Promise.all([
      safe('customer in-app (accepted)', () => sendInApp(bookingId, 'BOOKING_ACCEPTED', customer, t.subject, t.inApp, url)),
      safe('customer email (accepted)', () => sendEmail(bookingId, 'BOOKING_ACCEPTED', customer, t.subject, t.text, t.html)),
    ]);
  },

  async notifyAppointmentRejected(bookingId: string, reason?: string | null): Promise<void> {
    const loaded = await loadBookingContext(bookingId);
    if (!loaded) return;
    const { ctx, customer } = loaded;
    const t = customerRejectedTemplate({ ...ctx, reason });
    const url = `/booking/confirmation/${bookingId}`;

    await Promise.all([
      safe('customer in-app (rejected)', () => sendInApp(bookingId, 'BOOKING_REJECTED', customer, t.subject, t.inApp, url)),
      safe('customer email (rejected)', () => sendEmail(bookingId, 'BOOKING_REJECTED', customer, t.subject, t.text, t.html)),
    ]);
  },

  async notifyAppointmentCompleted(bookingId: string): Promise<void> {
    const loaded = await loadBookingContext(bookingId);
    if (!loaded) return;
    const { ctx, customer } = loaded;
    const t = customerCompletedTemplate(ctx);
    const url = `/booking/confirmation/${bookingId}`;

    await Promise.all([
      safe('customer in-app (completed)', () => sendInApp(bookingId, 'BOOKING_COMPLETED', customer, t.subject, t.inApp, url)),
      safe('customer email (completed)', () => sendEmail(bookingId, 'BOOKING_COMPLETED', customer, t.subject, t.text, t.html)),
    ]);
  },
};
