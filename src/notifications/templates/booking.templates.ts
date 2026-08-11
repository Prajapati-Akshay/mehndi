import { formatINR } from '@/lib/utils';
import type { BookingNotificationContext } from '../types';

function wrapHtml(title: string, bodyLines: string[]): string {
  const rows = bodyLines.map((line) => `<p style="margin:0 0 10px;color:#3f3a33;font-size:14px;line-height:1.5;">${line}</p>`).join('');
  return `
    <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fffaf0;border:1px solid #f0ddb0;border-radius:16px;">
      <h1 style="margin:0 0 16px;color:#5c4a1e;font-size:20px;">${title}</h1>
      ${rows}
      <p style="margin:24px 0 0;color:#a6935f;font-size:12px;">Mehndi By Dhara</p>
    </div>`;
}

export function adminNewBookingTemplate(ctx: BookingNotificationContext) {
  const subject = `New Appointment Booking — ${ctx.customerName}`;
  const text = [
    'New Appointment Booking',
    '',
    `Customer: ${ctx.customerName}`,
    `Service: ${ctx.categoryName} — ${ctx.serviceName} (${ctx.packageLabel})`,
    `Date: ${ctx.date}`,
    `Time: ${ctx.time}`,
    `People: ${ctx.numberOfPeople}`,
    `Booking ID: ${ctx.bookingNumber}`,
    `Amount: ${formatINR(ctx.totalAmount)}`,
  ].join('\n');
  const html = wrapHtml('New Appointment Booking', [
    `<strong>Customer:</strong> ${ctx.customerName}`,
    `<strong>Service:</strong> ${ctx.categoryName} — ${ctx.serviceName} (${ctx.packageLabel})`,
    `<strong>Date:</strong> ${ctx.date}`,
    `<strong>Time:</strong> ${ctx.time}`,
    `<strong>People:</strong> ${ctx.numberOfPeople}`,
    `<strong>Booking ID:</strong> ${ctx.bookingNumber}`,
    `<strong>Amount:</strong> ${formatINR(ctx.totalAmount)}`,
  ]);
  const inApp = `New appointment booked by ${ctx.customerName} for ${ctx.serviceName} on ${ctx.date} at ${ctx.time}.`;
  return { subject, text, html, inApp };
}

export function customerAcceptedTemplate(ctx: BookingNotificationContext) {
  const subject = 'Your appointment has been accepted';
  const text = [
    'Appointment Accepted',
    '',
    `Your appointment for ${ctx.serviceName} has been accepted.`,
    '',
    `Date: ${ctx.date}`,
    `Time: ${ctx.time}`,
    `Booking ID: ${ctx.bookingNumber}`,
  ].join('\n');
  const html = wrapHtml('Appointment Accepted', [
    `Your appointment for <strong>${ctx.serviceName}</strong> has been accepted.`,
    `<strong>Date:</strong> ${ctx.date}`,
    `<strong>Time:</strong> ${ctx.time}`,
    `<strong>Booking ID:</strong> ${ctx.bookingNumber}`,
  ]);
  const inApp = `Your appointment for ${ctx.serviceName} on ${ctx.date} at ${ctx.time} has been accepted.`;
  return { subject, text, html, inApp };
}

export function customerRejectedTemplate(ctx: BookingNotificationContext) {
  const reason = ctx.reason?.trim() || 'Not specified';
  const subject = 'Your appointment has been rejected';
  const text = [
    'Appointment Rejected',
    '',
    `Unfortunately, your appointment for ${ctx.serviceName} on ${ctx.date} at ${ctx.time} has been rejected.`,
    '',
    `Reason: ${reason}`,
    `Booking ID: ${ctx.bookingNumber}`,
  ].join('\n');
  const html = wrapHtml('Appointment Rejected', [
    `Unfortunately, your appointment for <strong>${ctx.serviceName}</strong> on ${ctx.date} at ${ctx.time} has been rejected.`,
    `<strong>Reason:</strong> ${reason}`,
    `<strong>Booking ID:</strong> ${ctx.bookingNumber}`,
  ]);
  const inApp = `Your appointment for ${ctx.serviceName} on ${ctx.date} at ${ctx.time} was rejected. Reason: ${reason}.`;
  return { subject, text, html, inApp };
}

export function customerCompletedTemplate(ctx: BookingNotificationContext) {
  const subject = 'Your appointment has been completed';
  const text = [
    'Appointment Completed',
    '',
    `Your appointment for ${ctx.serviceName} on ${ctx.date} has been marked as completed.`,
    '',
    'Thank you for booking with us.',
    `Booking ID: ${ctx.bookingNumber}`,
  ].join('\n');
  const html = wrapHtml('Appointment Completed', [
    `Your appointment for <strong>${ctx.serviceName}</strong> on ${ctx.date} has been marked as completed.`,
    'Thank you for booking with us.',
    `<strong>Booking ID:</strong> ${ctx.bookingNumber}`,
  ]);
  const inApp = `Your appointment for ${ctx.serviceName} on ${ctx.date} has been marked as completed. Thank you!`;
  return { subject, text, html, inApp };
}
