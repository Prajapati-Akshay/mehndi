'use client';

import { useState } from 'react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createContactMessage } from '@/services/contact.repo';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    const form = new FormData(e.currentTarget);
    try {
      await createContactMessage({
        name: String(form.get('name') || ''),
        email: (form.get('email') as string) || undefined,
        phone: (form.get('phone') as string) || undefined,
        message: String(form.get('message') || ''),
      });
      setStatus('success');
      e.currentTarget.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-forest-300 bg-forest-50 p-8 text-center space-y-3">
        <CheckCircle2 className="h-10 w-10 text-forest-700 mx-auto" />
        <p className="font-serif text-2xl font-bold text-forest-950">Thank You for Reaching Out!</p>
        <p className="text-sm text-forest-800/80 max-w-md mx-auto">
          Your message has been received. Dhara will review your requirements and respond via WhatsApp / Phone shortly.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-xs font-semibold text-gold-700 hover:underline"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-forest-900">Your Name *</label>
        <input
          name="name"
          required
          placeholder="e.g. Priya Sharma"
          className="mt-1.5 w-full rounded-2xl border border-gold-300 bg-white px-4 py-3 text-sm text-forest-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-forest-900">Email (Optional)</label>
          <input
            name="email"
            type="email"
            placeholder="priya@example.com"
            className="mt-1.5 w-full rounded-2xl border border-gold-300 bg-white px-4 py-3 text-sm text-forest-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-forest-900">Phone / WhatsApp</label>
          <input
            name="phone"
            placeholder="10-digit mobile"
            className="mt-1.5 w-full rounded-2xl border border-gold-300 bg-white px-4 py-3 text-sm text-forest-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-forest-900">How Can We Help You? *</label>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Tell us about your event date, location, number of people, or preferred designs…"
          className="mt-1.5 w-full rounded-2xl border border-gold-300 bg-white px-4 py-3 text-sm text-forest-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
        />
      </div>

      {error && <p className="text-sm text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">{error}</p>}

      <Button type="submit" variant="luxury" disabled={status === 'loading'} className="w-full sm:w-auto gap-2 px-8">
        {status === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Sending…</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Send Inquiry</span>
          </>
        )}
      </Button>
    </form>
  );
}

