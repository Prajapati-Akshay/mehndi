'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { listCustomers } from '@/services/customers.repo';
import { listBookingsForCustomer } from '@/services/bookings.repo';
import { deleteCustomer } from '@/services/customers.repo';
import type { DBCustomer } from '@/lib/types';

interface CustomerRow extends DBCustomer {
  bookingCount: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const base = await listCustomers();
      const withCounts = await Promise.all(
        base.map(async (c) => ({ ...c, bookingCount: (await listBookingsForCustomer(c.id)).length })),
      );
      setCustomers(withCounts);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm('Delete this customer? Only possible if they have no bookings.')) return;
    setError('');
    try {
      await deleteCustomer(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete customer.');
    }
  }

  return (
    <AdminShell>
      <h1 className="font-serif text-2xl text-forest-900">Customers</h1>
      <p className="text-sm text-forest-800/60 mt-1">All customers who have made a booking.</p>
      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

      <Card className="mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-forest-900 text-ivory text-left">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Address</th>
                <th className="px-5 py-3 font-medium">Bookings</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-100">
              {loading && (
                <tr><td colSpan={6} className="px-5 py-6 text-center text-forest-800/50">Loading…</td></tr>
              )}
              {!loading && customers.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-6 text-center text-forest-800/50">No customers yet.</td></tr>
              )}
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-cream/60">
                  <td className="px-5 py-3 font-medium text-forest-900">{c.fullName}</td>
                  <td className="px-5 py-3 text-forest-800/70">{c.phone}</td>
                  <td className="px-5 py-3 text-forest-800/70">{c.email ?? '—'}</td>
                  <td className="px-5 py-3 text-forest-800/70">{c.address ?? '—'}</td>
                  <td className="px-5 py-3 text-forest-800/70">{c.bookingCount}</td>
                  <td className="px-5 py-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => remove(c.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminShell>
  );
}
