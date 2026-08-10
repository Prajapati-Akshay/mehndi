import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-forest-100 text-forest-800',
  REJECTED: 'bg-rose-100 text-rose-700',
  CANCELLED: 'bg-neutral-200 text-neutral-700',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
};

export function Badge({ status, className, ...props }: HTMLAttributes<HTMLSpanElement> & { status?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide',
        status ? statusStyles[status] ?? 'bg-gold-100 text-gold-700' : 'bg-gold-100 text-gold-700',
        className,
      )}
      {...props}
    />
  );
}
