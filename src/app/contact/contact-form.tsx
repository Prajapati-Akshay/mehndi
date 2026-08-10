'use client';

import { useState } from 'react';
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
      <div className="rounded-2xl border border-forest-200 bg-forest-50 p-8 text-center">
        <p className="font-serif text-xl text-forest-900">Thank you for reaching out!</p>
        <p className="mt-2 text-sm text-forest-800/70">Your message has been saved locally. We&rsquo;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-forest-900">Name</label>
        <input name="name" required className="mt-1 w-full rounded-xl border border-gold-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-300" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-forest-900">Email (optional)</label>
          <input name="email" type="email" className="mt-1 w-full rounded-xl border border-gold-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-300" />
        </div>
        <div>
          <label className="text-sm font-medium text-forest-900">Phone (optional)</label>
          <input name="phone" className="mt-1 w-full rounded-xl border border-gold-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-300" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-forest-900">Message</label>
        <textarea name="message" required rows={5} className="mt-1 w-full rounded-xl border border-gold-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-300" />
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <Button type="submit" disabled={status === 'loading'} className="w-full sm:w-auto">
        {status === 'loading' ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  );
}
