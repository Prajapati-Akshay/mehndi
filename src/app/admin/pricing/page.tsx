'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/lib/utils';
import type { DBServicePricing, DBService, DBServiceCategory } from '@/lib/types';
import { listPricing, createPricing, updatePricing, deletePricing } from '@/services/pricing.repo';
import { listServices } from '@/services/services.repo';
import { listCategories } from '@/services/categories.repo';
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Layers,
  Sparkles,
} from 'lucide-react';

interface PricingRow extends DBServicePricing {
  serviceName: string;
  categoryName: string;
}

interface ServiceOption {
  id: string;
  name: string;
  categoryName: string;
}

const LENGTH_PRESETS = [
  'Wrist Length (Both Sides)',
  'Mid-Arm (Elbow Length)',
  'Full Bridal Arm & Feet',
  'Royal Extended (Elbow to Shoulder)',
  'Feet & Ankles Package',
];

export default function AdminPricingPage() {
  const [rows, setRows] = useState<PricingRow[]>([]);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [editing, setEditing] = useState<Record<string, { price: number; whatsIncluded: string }>>({});
  const [form, setForm] = useState({ serviceId: '', lengthLabel: '', price: '', whatsIncluded: '' });
  const [creating, setCreating] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [pricing, svc, cats] = await Promise.all([listPricing(), listServices(), listCategories()]);
      const catMap = new Map<string, DBServiceCategory>(cats.map((c) => [c.id, c]));
      const svcMap = new Map<string, DBService>(svc.map((s) => [s.id, s]));
      setRows(
        pricing.map((p) => {
          const svcRow = svcMap.get(p.serviceId);
          const catName = svcRow ? catMap.get(svcRow.categoryId)?.name ?? 'Unknown' : 'Unknown';
          return { ...p, serviceName: svcRow?.name ?? 'Unknown', categoryName: catName };
        })
      );
      setServices(
        svc.map((s) => ({ id: s.id, name: s.name, categoryName: catMap.get(s.categoryId)?.name ?? 'Unknown' }))
      );
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

  function startEdit(row: PricingRow) {
    setEditing({ ...editing, [row.id]: { price: row.price, whatsIncluded: row.whatsIncluded } });
  }

  function cancelEdit(id: string) {
    const next = { ...editing };
    delete next[id];
    setEditing(next);
  }

  async function saveEdit(id: string, name: string) {
    if (!editing[id]) return;
    try {
      await updatePricing(id, editing[id]);
      const next = { ...editing };
      delete next[id];
      setEditing(next);
      await load();
      showNotice('success', `Updated pricing tier for "${name}".`);
    } catch {
      showNotice('error', 'Failed to update pricing tier.');
    }
  }

  async function remove(id: string, label: string) {
    if (!confirm(`Delete price tier "${label}"?`)) return;
    try {
      await deletePricing(id);
      await load();
      showNotice('success', `Deleted tier "${label}".`);
    } catch {
      showNotice('error', 'Could not delete price tier.');
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.serviceId || !form.lengthLabel || !form.price) return;
    setCreating(true);
    try {
      await createPricing({
        serviceId: form.serviceId,
        lengthLabel: form.lengthLabel.trim(),
        price: Number(form.price),
        whatsIncluded: form.whatsIncluded.trim() || 'Consultation, organic henna cone & aftercare balm',
      });
      setForm({ serviceId: '', lengthLabel: '', price: '', whatsIncluded: '' });
      await load();
      showNotice('success', 'New pricing tier created successfully.');
    } catch {
      showNotice('error', 'Could not add price tier.');
    } finally {
      setCreating(false);
    }
  }

  const filteredRows = rows.filter((r) => {
    const matchesSearch =
      r.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.lengthLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.whatsIncluded.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesService = serviceFilter === 'all' || r.serviceId === serviceFilter;
    return matchesSearch && matchesService;
  });

  const totalTiers = rows.length;

  return (
    <AdminShell>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-700">Rates & Packages</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-forest-900 mt-1">Pricing Tiers</h1>
          <p className="text-sm text-forest-800/70 mt-0.5">
            Configure rates, design length descriptions, and inclusions shown to customers during booking.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-gold-200/80 bg-white/80 px-4 py-2 shadow-sm text-center">
            <p className="text-[11px] uppercase font-semibold text-forest-800/60">Total Tiers</p>
            <p className="font-serif text-lg font-bold text-forest-900">{totalTiers}</p>
          </div>
          <div className="rounded-xl border border-gold-200/80 bg-white/80 px-4 py-2 shadow-sm text-center">
            <p className="text-[11px] uppercase font-semibold text-forest-800/60">Active Services</p>
            <p className="font-serif text-lg font-bold text-gold-700">{services.length}</p>
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

      {/* Add New Tier Card */}
      <Card className="mt-6 border-gold-200/80 bg-gradient-to-br from-white via-white to-gold-50/20 p-6 shadow-sm overflow-hidden relative">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-900 text-gold-400">
            <Plus className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-forest-900">Add New Price Tier</h2>
            <p className="text-xs text-forest-800/60">Link a design coverage option to a service offering.</p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                Target Service *
              </label>
              <select
                required
                value={form.serviceId}
                onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
                className="w-full rounded-xl border border-gold-200/90 bg-white px-3.5 py-2.5 text-sm text-forest-900 shadow-sm focus:border-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800/10 truncate"
              >
                <option value="">Select Service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.categoryName} — {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                Length / Tier Label *
              </label>
              <input
                required
                placeholder="e.g. Elbow Length (Both Sides)"
                value={form.lengthLabel}
                onChange={(e) => setForm({ ...form, lengthLabel: e.target.value })}
                className="w-full rounded-xl border border-gold-200/90 bg-white px-3.5 py-2.5 text-sm text-forest-900 shadow-sm focus:border-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800/10"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                Price in INR (₹) *
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-700" />
                <input
                  required
                  type="number"
                  placeholder="3500"
                  min="0"
                  step="50"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full rounded-xl border border-gold-200/90 bg-white pl-9 pr-3.5 py-2.5 text-sm text-forest-900 shadow-sm focus:border-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                What’s Included
              </label>
              <input
                placeholder="e.g. 100% Organic Henna, Clove Oil"
                value={form.whatsIncluded}
                onChange={(e) => setForm({ ...form, whatsIncluded: e.target.value })}
                className="w-full rounded-xl border border-gold-200/90 bg-white px-3.5 py-2.5 text-sm text-forest-900 shadow-sm focus:border-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800/10"
              />
            </div>
          </div>

          {/* Quick length presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-medium text-forest-800/60 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-gold-600" /> Common Lengths:
            </span>
            {LENGTH_PRESETS.map((lp) => (
              <button
                key={lp}
                type="button"
                onClick={() => setForm({ ...form, lengthLabel: lp })}
                className="rounded-lg border border-gold-200 bg-gold-50/60 hover:bg-gold-100/80 px-2.5 py-1 text-xs font-medium text-forest-900 transition-colors"
              >
                {lp}
              </button>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={creating}
              className="bg-forest-900 text-ivory hover:bg-forest-800 border border-gold-500/30 px-6 py-2.5 rounded-xl text-sm font-medium shadow-sm transition-all"
            >
              {creating ? 'Saving Price Tier…' : 'Add Price Tier'}
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
            placeholder="Search price tiers or services…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gold-200/80 bg-white text-sm text-forest-900 shadow-sm focus:border-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800/10"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="rounded-xl border border-gold-200/80 bg-white px-3 py-2 text-xs font-medium text-forest-900 shadow-sm focus:outline-none max-w-xs truncate"
          >
            <option value="all">All Services ({rows.length})</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.categoryName} — {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing Table Card */}
      <Card className="mt-4 border-gold-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-forest-900 text-ivory text-left text-xs uppercase tracking-wider font-sans border-b border-gold-600/30">
                <th className="px-5 py-3.5 font-semibold">Service Offering</th>
                <th className="px-5 py-3.5 font-semibold">Length / Option</th>
                <th className="px-5 py-3.5 font-semibold">Price (INR)</th>
                <th className="px-5 py-3.5 font-semibold">What’s Included</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-100">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-forest-800/50">
                    <Sparkles className="mx-auto h-6 w-6 animate-spin text-gold-600 mb-2" />
                    Loading price tiers…
                  </td>
                </tr>
              )}
              {!loading && filteredRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-forest-800/60">
                    <Tag className="mx-auto h-8 w-8 text-gold-400 mb-2 opacity-70" />
                    <p className="font-serif text-base font-bold text-forest-900">No price tiers match</p>
                    <p className="text-xs text-forest-800/60 mt-0.5">Use the form above to configure new rates.</p>
                  </td>
                </tr>
              )}
              {filteredRows.map((row) => {
                const edit = editing[row.id];
                return (
                  <tr key={row.id} className="hover:bg-cream/40 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col">
                        <span className="font-medium text-forest-900 font-serif text-base">
                          {row.serviceName}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-forest-800/60 mt-0.5">
                          <Layers className="h-3 w-3 text-gold-700" />
                          {row.categoryName}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 font-medium text-forest-900">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-gold-50/80 border border-gold-200/80 px-2.5 py-1 text-xs font-medium text-forest-900">
                        {row.lengthLabel}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {edit ? (
                        <div className="relative w-32">
                          <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-forest-700" />
                          <input
                            type="number"
                            value={edit.price}
                            onChange={(e) =>
                              setEditing({ ...editing, [row.id]: { ...edit, price: Number(e.target.value) } })
                            }
                            className="w-full rounded-lg border border-gold-300 bg-white pl-7 pr-2 py-1 text-sm font-semibold text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-800/20"
                          />
                        </div>
                      ) : (
                        <span className="font-serif text-base font-bold text-gold-800">
                          {formatINR(row.price)}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-xs text-forest-800/80 max-w-sm">
                      {edit ? (
                        <input
                          value={edit.whatsIncluded}
                          onChange={(e) =>
                            setEditing({ ...editing, [row.id]: { ...edit, whatsIncluded: e.target.value } })
                          }
                          className="w-full rounded-lg border border-gold-300 bg-white px-2.5 py-1 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-800/20"
                        />
                      ) : (
                        row.whatsIncluded
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {edit ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => saveEdit(row.id, row.lengthLabel)}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl h-8 px-3 gap-1 text-xs"
                            >
                              <Check className="h-3.5 w-3.5" /> Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => cancelEdit(row.id)}
                              className="text-neutral-600 hover:bg-neutral-100 rounded-xl h-8 px-2 text-xs"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(row)}
                            className="border-gold-300 text-forest-900 hover:bg-gold-50 rounded-xl h-8 px-3 gap-1.5 text-xs"
                          >
                            <Edit2 className="h-3 w-3 text-gold-700" /> Edit
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => remove(row.id, row.lengthLabel)}
                          className="text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl h-8 w-8 p-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminShell>
  );
}
