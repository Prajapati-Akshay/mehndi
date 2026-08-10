// Ported from apps/api/src/bookings/booking-pricing.util.ts (kept pure/testable there too).
export interface BookingAmounts {
  pricePerPerson: number;
  numberOfPeople: number;
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
}

export function calculateBookingAmounts(pricePerPerson: number, numberOfPeople: number): BookingAmounts {
  const totalAmount = pricePerPerson * numberOfPeople;
  const advanceAmount = Math.ceil(totalAmount * 0.5);
  const remainingAmount = totalAmount - advanceAmount;
  return { pricePerPerson, numberOfPeople, totalAmount, advanceAmount, remainingAmount };
}
