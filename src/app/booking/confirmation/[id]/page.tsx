'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle2, Calendar, Clock, Phone, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatINR } from '@/lib/utils';
import { bookingWhatsappMessage, whatsappLink } from '@/lib/whatsapp';
import type { Booking } from '@/lib/types';
import { getBooking } from '@/services/bookings.repo';

export default function BookingConfirmationPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);

  useEffect(() => {
    getBooking(params.id).then(setBooking);
  }, [params.id]);

  if (booking === undefined) {
    return <div className="container py-20 text-center text-forest-800/60">Loading…</div>;
  }

  if (booking === null) {
    return (
      <div className="container py-20 text-center">
        <h1 className="section-heading">Booking not found</h1>
        <p className="mt-4 text-forest-800/70">We couldn&rsquo;t find that booking. It may have been removed.</p>
        <Link href="/" className="inline-block mt-6"><Button variant="outline">Back to Home</Button></Link>
      </div>
    );
  }

  const message = bookingWhatsappMessage({
    name: booking.customer.fullName,
    service: booking.service.name,
    package: booking.pricing.lengthLabel,
    date: formatDate(booking.appointmentDate),
    time: booking.appointmentTime,
    people: booking.numberOfPeople,
    pricePerPerson: booking.pricePerPerson,
    totalPrice: booking.totalAmount,
  });

  return (
    <div className="container py-16 sm:py-20 max-w-2xl">
      <div className="text-center">
        <CheckCircle2 className="h-14 w-14 text-forest-700 mx-auto" />
        <h1 className="section-heading mt-4">Booking Confirmed</h1>
        <p className="mt-3 text-forest-800/70">
          Thank you, {booking.customer.fullName}. Your booking request has been received.
        </p>
        <div className="mt-4 flex justify-center"><Badge status={booking.status}>{booking.status}</Badge></div>
      </div>

      <Card className="mt-10 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-gold-500 font-medium">Booking Number</p>
          <p className="font-serif text-lg text-forest-900">{booking.bookingNumber}</p>
        </div>

        <dl className="mt-6 divide-y divide-gold-100 text-sm">
          <div className="flex justify-between py-2.5">
            <dt className="text-forest-800/60">Service</dt>
            <dd className="font-medium text-forest-900">
              {booking.service.category.name} — {booking.service.name}
            </dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-forest-800/60">Package</dt>
            <dd className="font-medium text-forest-900">{booking.pricing.lengthLabel}</dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-forest-800/60 flex items-center gap-1"><Calendar className="h-4 w-4" /> Date</dt>
            <dd className="font-medium text-forest-900">{formatDate(booking.appointmentDate)}</dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-forest-800/60 flex items-center gap-1"><Clock className="h-4 w-4" /> Time</dt>
            <dd className="font-medium text-forest-900">{booking.appointmentTime}</dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-forest-800/60 flex items-center gap-1"><Users className="h-4 w-4" /> Number of People</dt>
            <dd className="font-medium text-forest-900">{booking.numberOfPeople}</dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-forest-800/60">Price per Person</dt>
            <dd className="font-medium text-forest-900">{formatINR(booking.pricePerPerson)}</dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-forest-800/60">Total Amount</dt>
            <dd className="font-medium text-forest-900">{formatINR(booking.totalAmount)}</dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-forest-800/60">Advance (50%)</dt>
            <dd className="font-semibold text-gold-600">{formatINR(booking.advanceAmount)}</dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-forest-800/60">Remaining</dt>
            <dd className="font-medium text-forest-900">{formatINR(booking.remainingAmount)}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="whatsapp" className="w-full"><Phone className="h-4 w-4" /> Confirm via WhatsApp</Button>
          </a>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">Back to Home</Button>
          </Link>
        </div>
      </Card>

      <p className="mt-6 text-center text-xs text-forest-800/50">
        Save your Booking Number for reference. This is a standalone local demo — no SMS/email is actually sent.
      </p>
    </div>
  );
}
