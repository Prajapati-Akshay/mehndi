import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-gold-200/80 bg-white/80 backdrop-blur-md shadow-card transition-all duration-300',
        className,
      )}
      {...props}
    />
  );
}
