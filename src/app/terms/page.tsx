import { Card } from '@/components/ui/card';

const TERMS = [
  { title: '1. Travel', body: 'Travel charges are additional. Alternatively, the client may arrange transportation for the artist.' },
  { title: '2. Payment', body: 'Your booking will be confirmed only after receiving a 50% advance payment.' },
  { title: '3. Skincare', body: 'For the best mehndi stain and application, please complete waxing and skincare at least 2 days before your appointment.' },
  { title: '4. Changes After Booking', body: 'Any last-minute changes to the design, hand/feet length, or other requirements after the booking is confirmed may incur additional charges.' },
];

export default function TermsPage() {
  return (
    <div className="container py-16 sm:py-20 max-w-3xl">
      <div className="text-center">
        <span className="text-gold-500 text-sm tracking-widest uppercase font-medium">Please Read</span>
        <h1 className="section-heading mt-3">Booking Terms &amp; Conditions</h1>
      </div>

      <div className="mt-12 space-y-6">
        {TERMS.map((term) => (
          <Card key={term.title} className="p-6">
            <h2 className="font-serif text-lg text-forest-900">{term.title}</h2>
            <p className="mt-2 text-sm text-forest-800/80 leading-relaxed">{term.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
