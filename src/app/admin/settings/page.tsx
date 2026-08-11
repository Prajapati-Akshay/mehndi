'use client';

import { useRef, useState } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminSettingsPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleExport() {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/admin/export');
      if (!res.ok) throw new Error('Export failed.');
      const dump = await res.json();
      const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mehndi-by-dhara-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage('Data exported successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed.');
    } finally {
      setBusy(false);
    }
  }

  async function handleImportFile(file: File) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Import failed.');
      }
      setMessage('Data imported successfully. Reload the page to see all changes reflected everywhere.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed. Make sure the file is a valid export.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function handleReset() {
    if (!confirm('This will permanently delete ALL data (bookings, customers, custom pricing, etc.) for every admin/device and reseed the original demo catalog. Continue?')) {
      return;
    }
    if (!confirm('Are you absolutely sure? This cannot be undone.')) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      if (!res.ok) throw new Error('Reset failed.');
      setMessage('Data has been reset to the original seed. Reload the page to see the changes.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell>
      <h1 className="font-serif text-2xl text-forest-900">Settings</h1>
      <p className="text-sm text-forest-800/60 mt-1">
        Export or import your local data, or reset everything back to the original demo seed.
      </p>

      {message && (
        <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800">{message}</div>
      )}
      {error && (
        <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{error}</div>
      )}

      <Card className="mt-6 p-6">
        <h2 className="font-medium text-forest-900">Export Data</h2>
        <p className="mt-1 text-sm text-forest-800/60">
          Download every table (services, pricing, bookings, customers, availability, gallery, testimonials,
          contact messages, admin user) as a single JSON file.
        </p>
        <Button className="mt-4" onClick={handleExport} disabled={busy}>Export Data (JSON)</Button>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="font-medium text-forest-900">Import Data</h2>
        <p className="mt-1 text-sm text-forest-800/60">
          Restore from a previously exported JSON file. This replaces existing data in each table found in the file.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImportFile(file);
          }}
          className="mt-4 text-sm"
        />
      </Card>

      <Card className="mt-6 p-6 border-rose-200">
        <h2 className="font-medium text-rose-700">Reset All Data</h2>
        <p className="mt-1 text-sm text-forest-800/60">
          Permanently wipes the shared database and reseeds the original demo catalog (services, pricing, gallery,
          testimonials, availability, admin login). This affects every admin/device. This cannot be undone.
        </p>
        <Button variant="outline" className="mt-4 border-rose-400 text-rose-700 hover:bg-rose-600 hover:text-white" onClick={handleReset} disabled={busy}>
          Reset All Data
        </Button>
      </Card>
    </AdminShell>
  );
}
