import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type Variant = 'primary' | 'secondary' | 'luxury' | 'outline' | 'outline-gold' | 'ghost' | 'whatsapp';
export type Size = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary: 'bg-forest-900 text-ivory hover:bg-forest-800 shadow-soft hover:shadow-forest-glow active:scale-[0.98]',
  secondary: 'bg-gold-400 text-forest-950 hover:bg-gold-300 font-semibold shadow-soft hover:shadow-gold active:scale-[0.98]',
  luxury: 'gold-shimmer-btn text-forest-950 font-semibold shadow-gold hover:shadow-luxury hover:-translate-y-0.5 active:scale-[0.98]',
  outline: 'border border-forest-800/80 text-forest-900 hover:bg-forest-900 hover:text-ivory active:scale-[0.98]',
  'outline-gold': 'border border-gold-400/80 text-gold-700 bg-gold-50/40 hover:bg-gold-400 hover:text-forest-950 font-medium active:scale-[0.98]',
  ghost: 'text-forest-800 hover:bg-gold-100/50 active:scale-[0.98]',
  whatsapp: 'bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-soft hover:shadow-lg active:scale-[0.98]',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs sm:text-sm font-medium tracking-wide',
  md: 'px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium tracking-wide',
  lg: 'px-7 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg font-medium tracking-wide',
  xl: 'px-8 sm:px-10 py-4 sm:py-5 text-lg font-semibold tracking-wide',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

