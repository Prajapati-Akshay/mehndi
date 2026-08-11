'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, ChevronLeft, ChevronRight, Loader2, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatINR } from '@/lib/utils';
import type { Availability, ServiceCategory, PricingTier, Service } from '@/lib/types';
import { listAvailability } from '@/services/availability.repo';
import { createBooking, BookingConflictError, BookingValidationError } from '@/services/bookings.repo';
import { calculateBookingAmounts } from '@/domain/pricing';

const STEPS = ['Service', 'Package', 'People', 'Date & Time', 'Your Details', 'Summary'];
const DEFAULT_SLOTS = ['10:00-11:00', '11:30-12:30', '14:00-15:00', '15:30-16:30', '17:00-18:00'];

interface CustomerForm {
  fullName: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  eventType: string;
  notes: string;
}

export function BookingWizard({ categories }: { categories: ServiceCategory[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [pricingId, setPricingId] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [timeSlotId, setTimeSlotId] = useState<string | undefined>(undefined);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [customer, setCustomer] = useState<CustomerForm>({
    fullName: '', phone: '', whatsappNumber: '', email: '', address: '', eventType: '', notes: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const pricingParam = searchParams.get('pricing');
    const categoryParam = searchParams.get('category');
    if (pricingParam) {
      for (const cat of categories) {
        for (const svc of cat.services) {
          if (svc.pricingTiers.some((t) => t.id === pricingParam)) {
            setCategoryId(cat.id);
            setServiceId(svc.id);
            setPricingId(pricingParam);
          }
        }
      }
    } else if (categoryParam) {
      const cat = categories.find((c) => c.slug === categoryParam);
      if (cat) setCategoryId(cat.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadAvailability() {
    listAvailability()
      .then(setAvailability)
      .catch(() => setAvailability([]));
  }

  useEffect(() => {
    loadAvailability();
  }, []);

  const category = categories.find((c) => c.id === categoryId);
  const service: Service | undefined = category?.services.find((s) => s.id === serviceId);
  const pricing: PricingTier | undefined = service?.pricingTiers.find((t) => t.id === pricingId);

  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  const matchedAvailability = availability.find(
    (a) => new Date(a.date).toISOString().split('T')[0] === date,
  );
  const isDateBlocked = matchedAvailability ? !matchedAvailability.isAvailable : false;
  const slotsForDate = matchedAvailability?.timeSlots.filter((s) => !s.isBooked) ?? [];

  const amounts = pricing ? calculateBookingAmounts(pricing.price, numberOfPeople) : null;

  function selectSlot(slotLabel: string, id?: string) {
    setTime(slotLabel);
    setTimeSlotId(id);
  }

  function adjustPeople(delta: number) {
    setNumberOfPeople((n) => Math.max(1, n + delta));
  }

  const canProceed = [
    !!serviceId,
    !!pricingId,
    numberOfPeople >= 1,
    !!date && !!time && !isDateBlocked,
    !!customer.fullName && !!customer.phone && (sameAsPhone || !!customer.whatsappNumber),
    termsAccepted,
  ];

  async function handleSubmit() {
    if (!pricing || !service || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const booking = await createBooking({
        serviceId: service.id,
        pricingId: pricing.id,
        timeSlotId,
        numberOfPeople,
        appointmentDate: date,
        appointmentTime: time,
        fullName: customer.fullName,
        phoneNumber: customer.phone,
        whatsappNumber: sameAsPhone ? customer.phone : customer.whatsappNumber,
        email: customer.email || undefined,
        address: customer.address || undefined,
        eventType: customer.eventType || undefined,
        notes: customer.notes || undefined,
        termsAccepted,
      });
      router.push(`/booking/confirmation/${booking.id}`);
    } catch (err) {
      if (err instanceof BookingConflictError) {
        setError(err.message);
        setTime('');
        setTimeSlotId(undefined);
        loadAvailability();
        setStep(3);
      } else if (err instanceof BookingValidationError) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-14 max-w-3xl mx-auto">
      <ol className="flex items-center justify-between mb-10 gap-1">
        {STEPS.map((label, i) => (
          <li key={label} className="flex-1 flex flex-col items-center text-center">
            <div
              className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium border-2 ${
                i < step
                  ? 'bg-forest-800 border-forest-800 text-ivory'
                  : i === step
                  ? 'border-gold-500 text-gold-600'
                  : 'border-gold-200 text-forest-800/40'
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className="mt-2 text-[10px] sm:text-xs text-forest-800/60 hidden sm:block">{label}</span>
          </li>
        ))}
      </ol>

      <Card className="p-6 sm:p-8">
        {step === 0 && (
          <div>
            <h2 className="font-serif text-xl text-forest-900 mb-6">Choose a Service Category</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategoryId(cat.id);
                    setServiceId(cat.services[0]?.id ?? '');
                    setPricingId('');
                  }}
                  className={`text-left p-4 rounded-xl border-2 transition-colors ${
                    categoryId === cat.id ? 'border-gold-500 bg-gold-50' : 'border-gold-100 hover:border-gold-300'
                  }`}
                >
                  <p className="font-medium text-forest-900">{cat.name}</p>
                  <p className="text-xs text-forest-800/60 mt-1">{cat.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && service && (
          <div>
            <h2 className="font-serif text-xl text-forest-900 mb-6">Choose Length &amp; Package</h2>
            <div className="space-y-3">
              {service.pricingTiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setPricingId(tier.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 flex items-center justify-between gap-4 transition-colors ${
                    pricingId === tier.id ? 'border-gold-500 bg-gold-50' : 'border-gold-100 hover:border-gold-300'
                  }`}
                >
                  <div>
                    <p className="font-medium text-forest-900">{tier.lengthLabel}</p>
                    <p className="text-xs text-forest-800/60 mt-1">{tier.whatsIncluded}</p>
                  </div>
                  <span className="text-gold-600 font-semibold whitespace-nowrap">{formatINR(tier.price)}/person</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && pricing && amounts && (
          <div>
            <h2 className="font-serif text-xl text-forest-900 mb-6">Number of People</h2>
            <p className="text-sm text-forest-800/70 mb-2">Price per Person</p>
            <p className="text-2xl font-serif text-forest-900">{formatINR(pricing.price)}</p>

            <div className="mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={() => adjustPeople(-1)}
                disabled={numberOfPeople <= 1}
                aria-label="Decrease number of people"
                className="h-11 w-11 rounded-full border-2 border-gold-300 flex items-center justify-center text-forest-800 disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min={1}
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(Math.max(1, Number(e.target.value) || 1))}
                className="w-20 text-center rounded-xl border border-gold-200 px-3 py-2.5 text-lg font-medium"
              />
              <button
                type="button"
                onClick={() => adjustPeople(1)}
                aria-label="Increase number of people"
                className="h-11 w-11 rounded-full border-2 border-gold-300 flex items-center justify-center text-forest-800"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-8 rounded-xl bg-cream p-5 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-forest-800/60">Price per Person</span><span className="font-medium text-forest-900">{formatINR(pricing.price)}</span></div>
              <div className="flex justify-between"><span className="text-forest-800/60">Number of People</span><span className="font-medium text-forest-900">{numberOfPeople}</span></div>
              <div className="flex justify-between border-t border-gold-200 pt-2"><span className="text-forest-800/60">Total</span><span className="font-semibold text-forest-900">{formatINR(amounts.totalAmount)}</span></div>
              <div className="flex justify-between"><span className="text-forest-800/60">50% Advance</span><span className="font-semibold text-gold-600">{formatINR(amounts.advanceAmount)}</span></div>
              <div className="flex justify-between"><span className="text-forest-800/60">Remaining</span><span className="font-medium text-forest-900">{formatINR(amounts.remainingAmount)}</span></div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-serif text-xl text-forest-900 mb-6">Select Date &amp; Time</h2>
            <label className="text-sm font-medium text-forest-900">Appointment Date</label>
            <input
              type="date"
              min={minDate}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime('');
                setTimeSlotId(undefined);
              }}
              className="mt-1 w-full rounded-xl border border-gold-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-300"
            />
            {isDateBlocked && (
              <p className="mt-2 text-sm text-rose-600">This date is unavailable. Please choose another date.</p>
            )}
            {date && !isDateBlocked && (
              <div className="mt-6">
                <p className="text-sm font-medium text-forest-900 mb-3">Available Time Slots</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(matchedAvailability ? slotsForDate.map((s) => `${s.startTime}-${s.endTime}`) : DEFAULT_SLOTS).map(
                    (label) => {
                      const slot = matchedAvailability?.timeSlots.find((s) => `${s.startTime}-${s.endTime}` === label);
                      return (
                        <button
                          key={label}
                          onClick={() => selectSlot(label, slot?.id)}
                          className={`p-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                            time === label ? 'border-gold-500 bg-gold-50 text-forest-900' : 'border-gold-100 hover:border-gold-300 text-forest-800/80'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    },
                  )}
                </div>
                {matchedAvailability && slotsForDate.length === 0 && (
                  <p className="mt-3 text-sm text-rose-600">All slots are booked for this date. Please pick another date.</p>
                )}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="font-serif text-xl text-forest-900 mb-6">Your Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-forest-900">Full Name</label>
                <input
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gold-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-forest-900">Phone Number</label>
                <input
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="mt-1 w-full rounded-xl border border-gold-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-forest-900">Email (optional)</label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gold-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-300"
                />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <input
                  id="sameAsPhone"
                  type="checkbox"
                  checked={sameAsPhone}
                  onChange={(e) => setSameAsPhone(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="sameAsPhone" className="text-sm text-forest-800/80">
                  WhatsApp number is the same as phone number
                </label>
              </div>
              {!sameAsPhone && (
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-forest-900">WhatsApp Number</label>
                  <input
                    value={customer.whatsappNumber}
                    onChange={(e) => setCustomer({ ...customer, whatsappNumber: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gold-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-300"
                  />
                </div>
              )}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-forest-900">Address (optional)</label>
                <input
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gold-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-300"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-forest-900">Event Type</label>
                <input
                  value={customer.eventType}
                  onChange={(e) => setCustomer({ ...customer, eventType: e.target.value })}
                  placeholder="Wedding, Engagement, Party…"
                  className="mt-1 w-full rounded-xl border border-gold-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-300"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-forest-900">Notes / Special Requirements</label>
                <textarea
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-gold-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-300"
                />
              </div>
            </div>
          </div>
        )}

        {step === 5 && pricing && service && category && amounts && (
          <div>
            <h2 className="font-serif text-xl text-forest-900 mb-6">Booking Summary</h2>
            <dl className="divide-y divide-gold-100 text-sm">
              {[
                ['Service', `${category.name} — ${service.name}`],
                ['Package', pricing.lengthLabel],
                ['Date', date],
                ['Time', time],
                ['Name', customer.fullName],
                ['Phone', customer.phone],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2.5">
                  <dt className="text-forest-800/60">{label}</dt>
                  <dd className="font-medium text-forest-900">{value}</dd>
                </div>
              ))}
              <div className="flex justify-between py-2.5">
                <dt className="text-forest-800/60">Price per Person</dt>
                <dd className="font-medium text-forest-900">{formatINR(pricing.price)}</dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-forest-800/60">Number of People</dt>
                <dd className="font-medium text-forest-900">{numberOfPeople}</dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-forest-800/60">Total Amount</dt>
                <dd className="font-medium text-forest-900">{formatINR(amounts.totalAmount)}</dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-forest-800/60">50% Advance (payable to confirm)</dt>
                <dd className="font-semibold text-gold-600">{formatINR(amounts.advanceAmount)}</dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-forest-800/60">Remaining (on appointment day)</dt>
                <dd className="font-medium text-forest-900">{formatINR(amounts.remainingAmount)}</dd>
              </div>
            </dl>

            <div className="mt-6 rounded-xl bg-cream p-4 text-xs text-forest-800/70 space-y-1">
              <p>Travel charges are additional. Booking confirmed only after 50% advance payment.</p>
              <p>Please complete waxing/skincare at least 2 days before your appointment.</p>
              <p>Changes after confirmation may incur additional charges.</p>
            </div>

            <label className="mt-6 flex items-start gap-3">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <span className="text-sm text-forest-800/80">
                I have read and accept the{' '}
                <a href="/terms" target="_blank" className="text-gold-600 underline">
                  Booking Terms &amp; Conditions
                </a>
                .
              </span>
            </label>

            {error && (
              <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3">
                <p className="text-sm text-rose-700">{error}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || submitting}
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed[step]}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canProceed[5] || submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Confirming Booking…
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" /> Confirm Booking
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
