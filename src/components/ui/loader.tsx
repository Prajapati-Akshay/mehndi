export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-24">
      <span className="h-10 w-10 animate-spin rounded-full border-2 border-gold-200 border-t-gold-500" />
      <p className="text-sm text-forest-700/60">Loading...</p>
    </div>
  );
}
