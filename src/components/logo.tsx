import { cn } from '@/lib/utils';

const PETAL_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export function LogoMark({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Mehndi By Dhara emblem"
    >
      <circle cx="50" cy="50" r="47" fill="none" stroke="#CDA13D" strokeOpacity="0.35" strokeWidth="1" />

      <g stroke="#B6862A" fill="none" strokeWidth="1.4" strokeLinejoin="round">
        {PETAL_ANGLES.map((angle) => (
          <path
            key={angle}
            d="M50 50 C 50 34, 44 22, 50 12 C 56 22, 50 34, 50 50 Z"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
      </g>

      <g stroke="#264F30" fill="none" strokeWidth="1.1" strokeLinejoin="round">
        {PETAL_ANGLES.map((angle) => (
          <path
            key={angle}
            d="M50 50 C 50 40, 47 33, 50 26 C 53 33, 50 40, 50 50 Z"
            transform={`rotate(${angle + 22.5} 50 50)`}
          />
        ))}
      </g>

      <path d="M50 46 C 44 46, 40 41, 42 35 C 48 36, 51 40, 50 46 Z" fill="#D24F66" opacity="0.9" />
      <circle cx="50" cy="50" r="4.5" fill="#0F2A17" />
      <circle cx="50" cy="50" r="2" fill="#FBF8F1" />
    </svg>
  );
}

export function Logo({
  className,
  markSize = 40,
  stacked = false,
  dark = false,
}: {
  className?: string;
  markSize?: number;
  stacked?: boolean;
  dark?: boolean;
}) {
  const primary = dark ? 'text-ivory' : 'text-forest-900';
  const accent = dark ? 'text-gold-300' : 'text-gold-500';

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={markSize} className="shrink-0" />
      {stacked ? (
        <span className="font-serif leading-none tracking-wide">
          <span className={cn('block', primary)}>Mehndi</span>
          <span className={cn('block -mt-0.5', accent)}>By Dhara</span>
        </span>
      ) : (
        <span className="font-serif leading-none tracking-wide whitespace-nowrap">
          <span className={primary}>Mehndi</span> <span className={accent}>By Dhara</span>
        </span>
      )}
    </span>
  );
}
