'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { DBService, DBServiceCategory } from '@/lib/types';
import { listServices, createService, updateService, deleteService } from '@/services/services.repo';
import { listCategories } from '@/services/categories.repo';
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Layers,
  Power,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface ServiceRow extends DBService {
  categoryName: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [categories, setCategories] = useState<DBServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [form, setForm] = useState({ categoryId: '', name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  function showNotice(type: 'success' | 'error', text: string) {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  }

  async function toggleActive(id: string, isActive: boolean, name: string) {
    try {
      await updateService(id, { isActive: !isActive });
      await load();
      showNotice('success', `"${name}" is now ${!isActive ? 'Active' : 'Inactive'}.`);
    } catch {
      showNotice('error', 'Failed to update service status.');
    }
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Permanently delete "${name}" and all associated pricing tiers?`)) return;
    try {
      await deleteService(id);
      await load();
      showNotice('success', `Deleted service "${name}".`);
    } catch {
      showNotice('error', 'Could not delete service.');
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await createService({
        categoryId: form.categoryId,
        name: form.name.trim(),
        description: form.description.trim() || null,
      });
      setForm({ categoryId: '', name: '', description: '' });
      await load();
      showNotice('success', `Service "${form.name}" added successfully.`);
    } catch {
      showNotice('error', 'Could not create service. Please verify all fields.');
    } finally {
      setCreating(false);
    }
  }

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || s.categoryId === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && s.isActive) ||
      (statusFilter === 'inactive' && !s.isActive);
    return matchesSearch && matchesCat && matchesStatus;
  });

  const totalServices = services.length;
  const activeServices = services.filter((s) => s.isActive).length;
  const inactiveServices = totalServices - activeServices;

  return (
    <AdminShell>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-700">Studio Catalog</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-forest-900 mt-1">Services & Packages</h1>
          <p className="text-sm text-forest-800/70 mt-0.5">
            Manage your mehndi service listings, descriptions, categories, and customer visibility.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xl border border-gold-200/80 bg-white/80 px-3.5 py-2 shadow-sm text-center">
            <p className="text-[11px] uppercase font-semibold text-forest-800/60">Total Services</p>
            <p className="font-serif text-lg font-bold text-forest-900">{totalServices}</p>
          </div>
          <div className="rounded-xl border border-gold-200/80 bg-white/80 px-3.5 py-2 shadow-sm text-center">
            <p className="text-[11px] uppercase font-semibold text-forest-800/60">Active Catalog</p>
            <p className="font-serif text-lg font-bold text-emerald-700">{activeServices}</p>
          </div>
          <div className="rounded-xl border border-gold-200/80 bg-white/80 px-3.5 py-2 shadow-sm text-center">
            <p className="text-[11px] uppercase font-semibold text-forest-800/60">Categories</p>
            <p className="font-serif text-lg font-bold text-gold-700">{categories.length}</p>
          </div>
        </div>
      </div>

      {notification && (
        <div
          className={`mt-4 rounded-xl p-3.5 flex items-center gap-2.5 text-sm transition-all shadow-sm ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Add New Service Card */}
      <Card className="mt-6 border-gold-200/80 bg-gradient-to-br from-white via-white to-gold-50/20 p-6 shadow-sm overflow-hidden relative">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-900 text-gold-400">
            <Plus className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-forest-900">Add New Service Offering</h2>
            <p className="text-xs text-forest-800/60">Define a new mehndi design category or bridal package.</p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                Service Category *
              </label>
              <select
                required
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full rounded-xl border border-gold-200/90 bg-white px-3.5 py-2.5 text-sm text-forest-900 shadow-sm focus:border-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800/10"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                Service Name *
              </label>
              <input
                required
                placeholder="e.g. Royal Bridal Signature Package"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-gold-200/90 bg-white px-3.5 py-2.5 text-sm text-forest-900 shadow-sm focus:border-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800/10"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                Short Description (Optional)
              </label>
              <input
                placeholder="e.g. Intricate elbow-length bridal mehndi with storytelling figures"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-xl border border-gold-200/90 bg-white px-3.5 py-2.5 text-sm text-forest-900 shadow-sm focus:border-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800/10"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={creating}
              className="bg-forest-900 text-ivory hover:bg-forest-800 border border-gold-500/30 px-6 py-2.5 rounded-xl text-sm font-medium shadow-sm transition-all"
            >
              {creating ? 'Saving Service…' : 'Add Service Offering'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Filter and Search Bar */}
      <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-forest-800/40" />
          <input
            type="text"
            placeholder="Search services or categories…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gold-200/80 bg-white text-sm text-forest-900 shadow-sm focus:border-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800/10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-gold-200/80 bg-white px-3 py-2 text-xs font-medium text-forest-900 shadow-sm focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex items-center rounded-xl bg-forest-900/5 p-1 border border-gold-200/50">
            <button
              onClick={() => setStatusFilter('all')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-forest-900 shadow-sm font-semibold'
                  : 'text-forest-800/70 hover:text-forest-900'
              }`}
            >
              All ({totalServices})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                statusFilter === 'active'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-forest-800/70 hover:text-forest-900'
              }`}
            >
              Active ({activeServices})
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                statusFilter === 'inactive'
                  ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                  : 'text-forest-800/70 hover:text-forest-900'
              }`}
            >
              Inactive ({inactiveServices})
            </button>
          </div>
        </div>
      </div>

      {/* Services Table Card */}
      <Card className="mt-4 border-gold-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-forest-900 text-ivory text-left text-xs uppercase tracking-wider font-sans border-b border-gold-600/30">
                <th className="px-5 py-3.5 font-semibold">Category</th>
                <th className="px-5 py-3.5 font-semibold">Service Name</th>
                <th className="px-5 py-3.5 font-semibold">Description</th>
                <th className="px-5 py-3.5 font-semibold">Visibility</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-100">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-forest-800/50">
                    <Sparkles className="mx-auto h-6 w-6 animate-spin text-gold-600 mb-2" />
                    Loading studio catalog…
                  </td>
                </tr>
              )}
              {!loading && filteredServices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-forest-800/60">
                    <FileText className="mx-auto h-8 w-8 text-gold-400 mb-2 opacity-70" />
                    <p className="font-serif text-base font-bold text-forest-900">No services match your filters</p>
                    <p className="text-xs text-forest-800/60 mt-0.5">Try changing your search query or category filter.</p>
                  </td>
                </tr>
              )}
              {filteredServices.map((s) => (
                <tr key={s.id} className="hover:bg-cream/40 transition-colors group">
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-gold-50 border border-gold-200/80 px-2.5 py-1 text-xs font-medium text-forest-900">
                      <Layers className="h-3 w-3 text-gold-700" />
                      {s.categoryName}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-forest-900 font-serif text-base">
                    {s.name}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-forest-800/70 max-w-xs truncate">
                    {s.description || <span className="text-forest-800/30 italic">No description provided</span>}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        s.isActive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-neutral-200 text-neutral-700 border border-neutral-300'
                      }`}
                    >
                      {s.isActive ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Active
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 text-neutral-500" /> Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleActive(s.id, s.isActive, s.name)}
                        className={`text-xs rounded-xl h-8 px-3 gap-1.5 ${
                          s.isActive
                            ? 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                            : 'border-emerald-300 text-emerald-800 hover:bg-emerald-50'
                        }`}
                      >
                        <Power className="h-3 w-3" />
                        {s.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => remove(s.id, s.name)}
                        className="text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
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
