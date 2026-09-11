'use client';

import { useRef, useState } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Download,
  Upload,
  AlertTriangle,
  Database,
  CheckCircle2,
  AlertCircle,
  FileJson,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

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
      a.download = `mehndi-by-dhara-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage('Studio backup downloaded successfully. Keep this JSON file safe.');
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
      setMessage('Database backup successfully restored. Refreshing studio records…');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed. Make sure the file is a valid JSON export.');
    } finally {
      setBusy(false);
      setSelectedFileName(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function handleReset() {
    if (
      !confirm(
        'WARNING: This will permanently erase ALL current bookings, custom price tiers, customer logs, and reset everything back to the original demo catalog. Do you wish to continue?'
      )
    ) {
      return;
    }
    if (!confirm('Are you ABSOLUTELY certain? This operation CANNOT be undone.')) return;

    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      if (!res.ok) throw new Error('Reset failed.');
      setMessage('Database reset completed. Reloading demo seed…');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-700">Studio Maintenance</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-forest-900 mt-1">Data & System Settings</h1>
          <p className="text-sm text-forest-800/70 mt-0.5">
            Backup your appointment records, migrate data via JSON snapshots, or reset to initial catalog data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-gold-200/80 bg-white/80 px-4 py-2 shadow-sm text-center">
            <p className="text-[11px] uppercase font-semibold text-forest-800/60">Storage Engine</p>
            <p className="font-serif text-base font-bold text-forest-900">Local Prisma / SQLite</p>
          </div>
        </div>
      </div>

      {message && (
        <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 flex items-center gap-2.5 shadow-sm">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of Settings Modules */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Export Data */}
        <Card className="border-gold-200/80 bg-gradient-to-br from-white via-white to-gold-50/20 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-900 text-gold-400">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-forest-900">Export Studio Snapshot</h2>
                <p className="text-xs text-forest-800/60">Download complete database backup in JSON format</p>
              </div>
            </div>

            <p className="text-xs text-forest-800/80 leading-relaxed mt-3">
              Creates a point-in-time backup containing all collections:
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-forest-900">
              <div className="rounded-lg bg-gold-50/60 border border-gold-200/60 p-2 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-gold-700" /> Services & Categories
              </div>
              <div className="rounded-lg bg-gold-50/60 border border-gold-200/60 p-2 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-gold-700" /> Pricing Tiers
              </div>
              <div className="rounded-lg bg-gold-50/60 border border-gold-200/60 p-2 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-gold-700" /> Bookings & Deposits
              </div>
              <div className="rounded-lg bg-gold-50/60 border border-gold-200/60 p-2 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-gold-700" /> Customer Profiles
              </div>
              <div className="rounded-lg bg-gold-50/60 border border-gold-200/60 p-2 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-gold-700" /> Availability & Slots
              </div>
              <div className="rounded-lg bg-gold-50/60 border border-gold-200/60 p-2 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-gold-700" /> Gallery & Reviews
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gold-100 flex items-center justify-between">
            <span className="text-[11px] text-forest-800/60 flex items-center gap-1">
              <FileJson className="h-3.5 w-3.5 text-gold-700" /> JSON Format (.json)
            </span>
            <Button
              onClick={handleExport}
              disabled={busy}
              className="bg-forest-900 text-ivory hover:bg-forest-800 border border-gold-500/30 px-5 py-2 rounded-xl text-xs font-semibold shadow-sm gap-2"
            >
              <Download className="h-3.5 w-3.5 text-gold-400" />
              {busy ? 'Preparing Export…' : 'Download Backup'}
            </Button>
          </div>
        </Card>

        {/* Module 2: Import Data */}
        <Card className="border-gold-200/80 bg-gradient-to-br from-white via-white to-gold-50/20 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-900 text-gold-400">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-forest-900">Import Studio Snapshot</h2>
                <p className="text-xs text-forest-800/60">Restore records from a previous JSON backup file</p>
              </div>
            </div>

            <p className="text-xs text-forest-800/80 leading-relaxed mt-3">
              Select a previously exported JSON backup file. This will update the corresponding database tables with
              the contents of the file.
            </p>

            <div className="mt-4 rounded-xl border border-dashed border-gold-300 bg-white/70 p-6 text-center">
              <FileJson className="mx-auto h-8 w-8 text-gold-600 mb-2" />
              <p className="text-xs font-medium text-forest-900">
                {selectedFileName ? selectedFileName : 'Click to select JSON backup file'}
              </p>
              <p className="text-[11px] text-forest-800/50 mt-1">Accepts .json exported from this portal</p>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                disabled={busy}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFileName(file.name);
                    handleImportFile(file);
                  }
                }}
                className="hidden"
                id="json-file-input"
              />
              <label
                htmlFor="json-file-input"
                className="mt-3 inline-flex items-center gap-1.5 cursor-pointer rounded-lg bg-forest-900 text-ivory hover:bg-forest-800 px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all"
              >
                <Upload className="h-3 w-3 text-gold-400" />
                Browse File
              </label>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gold-100 flex items-center justify-between">
            <span className="text-[11px] text-forest-800/60">Status: Ready to restore</span>
            {busy && <span className="text-xs font-semibold text-gold-700 animate-pulse">Processing…</span>}
          </div>
        </Card>
      </div>

      {/* Module 3: Danger Zone */}
      <Card className="mt-8 border-rose-200/80 bg-gradient-to-br from-white via-rose-50/30 to-rose-100/20 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700 border border-rose-200">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-rose-900">Danger Zone: Database Reset</h2>
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-800 border border-rose-200">
                  Irreversible
                </span>
              </div>
              <p className="text-xs text-rose-800/80 mt-1 max-w-2xl leading-relaxed">
                Permanently wipes all current appointment bookings, customer histories, and custom price tiers. The
                database will be reseeded with the initial demo catalog and sample appointments.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleReset}
            disabled={busy}
            className="border-rose-400 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-semibold shadow-sm shrink-0 gap-1.5 transition-all"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {busy ? 'Resetting…' : 'Reset All Database Data'}
          </Button>
        </div>
      </Card>
    </AdminShell>
  );
}
