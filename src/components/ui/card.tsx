import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gold-200/60 bg-white shadow-card transition-shadow hover:shadow-soft',
        className,
      )}
      {...props}
    />
  );
}
