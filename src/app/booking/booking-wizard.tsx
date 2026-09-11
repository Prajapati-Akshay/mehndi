'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Check, ChevronLeft, ChevronRight, Loader2, Minus, Plus,
  Sparkles, Calendar, Clock, User, FileText, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatINR } from '@/lib/utils';
import type { Availability, ServiceCategory, PricingTier, Service } from '@/lib/types';
import { listAvailability } from '@/services/availability.repo';
import { createBooking, BookingConflictError, BookingValidationError } from '@/services/bookings.repo';
import { calculateBookingAmounts } from '@/domain/pricing';

const STEPS = [
  { label: 'Style', icon: Sparkles },
  { label: 'Package', icon: FileText },
  { label: 'Guests', icon: User },
  { label: 'Date & Time', icon: Calendar },
  { label: 'Details', icon: User },
  { label: 'Summary', icon: CheckCircle2 },
];

const DEFAULT_SLOTS = ['10:00-11:00', '11:30-12:30', '14:00-15:00', '15:30-16:30', '17:00-18:00', '18:30-19:30'];

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
            setStep(2); // Jump to guests step if pricing tier is pre-selected
          }
        }
      }
    } else if (categoryParam) {
      const cat = categories.find((c) => c.slug === categoryParam);
      if (cat) {
        setCategoryId(cat.id);
        setServiceId(cat.services[0]?.id ?? '');
        setStep(1);
      }
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
    !!categoryId,
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
    <div className="mt-10 max-w-3xl mx-auto">
      {/* Sleek Step Progress Header */}
      <div className="mb-10 rounded-2xl bg-white/80 p-4 border border-gold-200/80 shadow-sm backdrop-blur-md">
        <ol className="flex items-center justify-between gap-1">
          {STEPS.map((s, i) => (
            <li key={s.label} className="flex-1 flex flex-col items-center text-center relative">
              <div
                className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                  i < step
                    ? 'bg-forest-900 text-ivory shadow-sm'
                    : i === step
                    ? 'bg-gold-400 text-forest-950 ring-4 ring-gold-200 shadow-gold'
                    : 'bg-gold-50 text-forest-800/40 border border-gold-200'
                }`}
              >
                {i < step ? <Check className="h-4 w-4 text-gold-300 stroke-[3]" /> : i + 1}
              </div>
              <span className={`mt-2 text-[10px] sm:text-xs font-medium hidden sm:block ${
                i === step ? 'text-forest-950 font-bold' : 'text-forest-800/60'
              }`}>
                {s.label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-3xl border border-gold-300/80 bg-white/95 p-6 sm:p-10 shadow-luxury backdrop-blur-md">
        {/* STEP 0: CHOOSE CATEGORY */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold-600">Step 1</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mt-1">Select a Mehndi Style</h2>
              <p className="text-sm text-forest-800/70 mt-1">Choose the primary aesthetic for your appointment.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {categories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategoryId(cat.id);
                      setServiceId(cat.services[0]?.id ?? '');
                      setPricingId('');
                    }}
                    className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'border-gold-500 bg-gold-50/70 shadow-gold'
                        : 'border-gold-100 hover:border-gold-300 hover:bg-gold-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-serif text-lg font-bold text-forest-950">{cat.name}</p>
                      {isSelected && <CheckCircle2 className="h-5 w-5 text-gold-600" />}
                    </div>
                    <p className="text-xs text-forest-800/70 mt-2 leading-relaxed">{cat.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1: CHOOSE PACKAGE / LENGTH */}
        {step === 1 && service && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold-600">Step 2</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mt-1">Select Length &amp; Coverage</h2>
              <p className="text-sm text-forest-800/70 mt-1">Choose the hand or feet coverage package you prefer.</p>
            </div>

            <div className="space-y-3.5">
              {service.pricingTiers.map((tier) => {
                const isSelected = pricingId === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setPricingId(tier.id)}
                    className={`w-full text-left p-5 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'border-gold-500 bg-gold-50/70 shadow-gold'
                        : 'border-gold-100 hover:border-gold-300 hover:bg-gold-50/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-serif text-base font-bold text-forest-950">{tier.lengthLabel}</p>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-gold-600" />}
                      </div>
                      <p className="text-xs text-forest-800/70 mt-1">{tier.whatsIncluded}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="font-serif text-xl font-bold text-gold-600">{formatINR(tier.price)}</span>
                      <span className="text-[11px] text-forest-700/60 block">per person</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: NUMBER OF GUESTS */}
        {step === 2 && pricing && amounts && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold-600">Step 3</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mt-1">Number of People</h2>
              <p className="text-sm text-forest-800/70 mt-1">How many people will be getting this mehndi package?</p>
            </div>

            <div className="flex items-center gap-5 pt-2">
              <button
                type="button"
                onClick={() => adjustPeople(-1)}
                disabled={numberOfPeople <= 1}
                aria-label="Decrease number of people"
                className="h-12 w-12 rounded-full border-2 border-gold-300 flex items-center justify-center text-forest-900 bg-white hover:bg-gold-50 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="w-16 text-center font-serif text-3xl font-bold text-forest-950">
                {numberOfPeople}
              </span>
              <button
                type="button"
                onClick={() => adjustPeople(1)}
                aria-label="Increase number of people"
                className="h-12 w-12 rounded-full border-2 border-gold-300 flex items-center justify-center text-forest-900 bg-white hover:bg-gold-50 transition-colors cursor-pointer"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {/* Live Pricing Breakdown */}
            <div className="mt-8 rounded-2xl bg-gradient-to-tr from-cream via-ivory to-gold-50/70 p-6 border border-gold-200/90 space-y-3 text-sm">
              <div className="flex justify-between text-forest-800/80">
                <span>Selected Package ({pricing.lengthLabel})</span>
                <span className="font-medium text-forest-950">{formatINR(pricing.price)} × {numberOfPeople}</span>
              </div>
              <div className="flex justify-between border-t border-gold-200/80 pt-3 text-base">
                <span className="font-semibold text-forest-950">Total Amount</span>
                <span className="font-serif font-bold text-forest-950">{formatINR(amounts.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm text-gold-700 bg-gold-100/60 p-2.5 rounded-xl border border-gold-300/40">
                <span className="font-semibold">50% Advance (to confirm slot)</span>
                <span className="font-serif font-bold text-base">{formatINR(amounts.advanceAmount)}</span>
              </div>
              <div className="flex justify-between text-xs text-forest-800/70 pt-1">
                <span>Remaining on appointment day</span>
                <span className="font-medium text-forest-950">{formatINR(amounts.remainingAmount)}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DATE & TIME */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold-600">Step 4</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mt-1">Select Date &amp; Time Slot</h2>
              <p className="text-sm text-forest-800/70 mt-1">Choose when you would like Dhara to apply your mehndi.</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-forest-950">Appointment Date</label>
              <input
                type="date"
                min={minDate}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTime('');
                  setTimeSlotId(undefined);
                }}
                className="mt-2 w-full rounded-2xl border border-gold-300 bg-white px-4 py-3.5 text-sm font-medium text-forest-950 shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            {isDateBlocked && (
              <p className="text-sm font-medium text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                This date is fully booked or unavailable. Please choose another date.
              </p>
            )}

            {date && !isDateBlocked && (
              <div className="pt-2">
                <p className="text-sm font-semibold text-forest-950 mb-3">Available Time Slots</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(matchedAvailability ? slotsForDate.map((s) => `${s.startTime}-${s.endTime}`) : DEFAULT_SLOTS).map(
                    (label) => {
                      const slot = matchedAvailability?.timeSlots.find((s) => `${s.startTime}-${s.endTime}` === label);
                      const isSelected = time === label;
                      return (
                        <button
                          key={label}
                          onClick={() => selectSlot(label, slot?.id)}
                          className={`p-3.5 rounded-2xl border-2 text-sm font-medium transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? 'border-gold-500 bg-gold-400 text-forest-950 font-bold shadow-gold'
                              : 'border-gold-100 bg-white hover:border-gold-300 hover:bg-gold-50/40 text-forest-800'
                          }`}
                        >
                          <Clock className="h-3.5 w-3.5 inline mr-1.5 opacity-60" />
                          {label}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: CUSTOMER DETAILS */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold-600">Step 5</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mt-1">Contact &amp; Event Details</h2>
              <p className="text-sm text-forest-800/70 mt-1">Please provide your details for appointment coordination.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-forest-900">Full Name *</label>
                <input
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  placeholder="e.g. Ananya Patel"
                  className="mt-1.5 w-full rounded-2xl border border-gold-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-forest-900">Phone Number *</label>
                <input
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="mt-1.5 w-full rounded-2xl border border-gold-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-forest-900">Email (Optional)</label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  placeholder="name@example.com"
                  className="mt-1.5 w-full rounded-2xl border border-gold-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-2.5 py-1">
                <input
                  id="sameAsPhone"
                  type="checkbox"
                  checked={sameAsPhone}
                  onChange={(e) => setSameAsPhone(e.target.checked)}
                  className="h-4 w-4 rounded text-gold-600 focus:ring-gold-400 cursor-pointer"
                />
                <label htmlFor="sameAsPhone" className="text-sm text-forest-800/90 cursor-pointer">
                  WhatsApp number is identical to Phone Number
                </label>
              </div>

              {!sameAsPhone && (
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-forest-900">WhatsApp Number *</label>
                  <input
                    value={customer.whatsappNumber}
                    onChange={(e) => setCustomer({ ...customer, whatsappNumber: e.target.value })}
                    placeholder="WhatsApp contact number"
                    className="mt-1.5 w-full rounded-2xl border border-gold-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-forest-900">Event Type (Optional)</label>
                <input
                  value={customer.eventType}
                  onChange={(e) => setCustomer({ ...customer, eventType: e.target.value })}
                  placeholder="Wedding, Engagement, Sangeet, Festival, Party…"
                  className="mt-1.5 w-full rounded-2xl border border-gold-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-forest-900">Event Address / Venue (Optional)</label>
                <input
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  placeholder="Home address or venue location"
                  className="mt-1.5 w-full rounded-2xl border border-gold-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-forest-900">Special Notes / Custom Motifs</label>
                <textarea
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  rows={3}
                  placeholder="E.g. want bride & groom portrait, peacock motifs, specific hashtag…"
                  className="mt-1.5 w-full rounded-2xl border border-gold-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & SUMMARY */}
        {step === 5 && pricing && service && category && amounts && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold-600">Step 6</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mt-1">Review &amp; Confirm</h2>
              <p className="text-sm text-forest-800/70 mt-1">Please verify all appointment details before finalizing.</p>
            </div>

            <div className="rounded-2xl border border-gold-200 bg-cream/30 p-5 divide-y divide-gold-100 text-sm">
              <div className="flex justify-between py-2.5"><span className="text-forest-800/70">Selected Style</span><span className="font-semibold text-forest-950">{category.name} — {service.name}</span></div>
              <div className="flex justify-between py-2.5"><span className="text-forest-800/70">Package</span><span className="font-semibold text-forest-950">{pricing.lengthLabel}</span></div>
              <div className="flex justify-between py-2.5"><span className="text-forest-800/70">Date &amp; Time</span><span className="font-semibold text-forest-950">{date} at {time}</span></div>
              <div className="flex justify-between py-2.5"><span className="text-forest-800/70">Customer Name</span><span className="font-semibold text-forest-950">{customer.fullName}</span></div>
              <div className="flex justify-between py-2.5"><span className="text-forest-800/70">Phone Number</span><span className="font-semibold text-forest-950">{customer.phone}</span></div>
              <div className="flex justify-between py-2.5"><span className="text-forest-800/70">Number of Guests</span><span className="font-semibold text-forest-950">{numberOfPeople}</span></div>
              <div className="flex justify-between py-2.5 text-base border-t border-gold-200 font-bold"><span className="text-forest-950">Total Amount</span><span className="text-forest-950">{formatINR(amounts.totalAmount)}</span></div>
              <div className="flex justify-between py-2.5 bg-gold-100/70 px-3 rounded-xl border border-gold-300 text-gold-800 font-semibold"><span className="text-gold-900">50% Advance Payable to Confirm</span><span className="font-serif text-lg">{formatINR(amounts.advanceAmount)}</span></div>
            </div>

            <div className="p-4 rounded-2xl bg-forest-900 text-ivory text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-gold-300 font-semibold">
                <ShieldCheck className="h-4 w-4" />
                <span>Our Booking Promise</span>
              </div>
              <p>Your appointment slot will be held securely. Dhara will reach out directly on WhatsApp to confirm advance payment details.</p>
            </div>

            <label className="flex items-start gap-3 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded text-gold-600 focus:ring-gold-400"
              />
              <span className="text-xs sm:text-sm text-forest-800/90 leading-relaxed">
                I have read and agree to the{' '}
                <a href="/terms" target="_blank" className="font-semibold text-gold-600 underline">
                  Booking Terms &amp; Policies
                </a>
                .
              </span>
            </label>

            {error && (
              <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-10 pt-6 border-t border-gold-100 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || submitting}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              variant="luxury"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed[step]}
              className="gap-2 px-7"
            >
              <span>Continue</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="luxury"
              onClick={handleSubmit}
              disabled={!canProceed[5] || submitting}
              className="gap-2 px-8 shadow-luxury"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Confirm Booking</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

