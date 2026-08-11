'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { DBService, DBServiceCategory } from '@/lib/types';
import { listServices, createService, updateService, deleteService } from '@/services/services.repo';
import { listCategories } from '@/services/categories.repo';

interface ServiceRow extends DBService {
  categoryName: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [categories, setCategories] = useState<DBServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ categoryId: '', name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const [svc, cats] = await Promise.all([listServices(), listCategories()]);
      const catMap = new Map(cats.map((c) => [c.id, c.name]));
      setServices(svc.map((s) => ({ ...s, categoryName: catMap.get(s.categoryId) ?? 'Unknown' })));
      setCategories(cats);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleActive(id: string, isActive: boolean) {
    await updateService(id, { isActive: !isActive });
    await load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this service and all of its pricing tiers?')) return;
    await deleteService(id);
    await load();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      await createService({ categoryId: form.categoryId, name: form.name, description: form.description || null });
      setForm({ categoryId: '', name: '', description: '' });
      await load();
    } catch {
      setError('Could not create service. Check the fields and try again.');
    } finally {
      setCreating(false);
    }
  }

  return (
    <AdminShell>
      <h1 className="font-serif text-2xl text-forest-900">Services</h1>
      <p className="text-sm text-forest-800/60 mt-1">Manage the services offered under each category.</p>

      <Card className="mt-6 p-6 overflow-hidden">
        <h2 className="font-medium text-forest-900 mb-4">Add New Service</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full min-w-0 max-w-full rounded-xl border border-gold-200 px-3 py-2 text-sm truncate"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            required
            placeholder="Service name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full min-w-0 max-w-full rounded-xl border border-gold-200 px-3 py-2 text-sm"
          />
          <input
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full min-w-0 max-w-full rounded-xl border border-gold-200 px-3 py-2 text-sm"
          />
          <Button type="submit" disabled={creating} className="col-span-1 sm:col-span-3 justify-self-start">
            {creating ? 'Adding…' : 'Add Service'}
          </Button>
        </form>
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      </Card>

      <Card className="mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-forest-900 text-ivory text-left">
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-100">
              {loading && <tr><td colSpan={4} className="px-5 py-6 text-center text-forest-800/50">Loading…</td></tr>}
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-cream/60">
                  <td className="px-5 py-3 text-forest-800/70">{s.categoryName}</td>
                  <td className="px-5 py-3 font-medium text-forest-900">{s.name}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${s.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'}`}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <Button size="sm" variant="outline" onClick={() => toggleActive(s.id, s.isActive)}>
                      {s.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(s.id)}>Delete</Button>
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
