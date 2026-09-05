import { cn } from '@/lib/utils';

const PETAL_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const DOT_ANGLES = Array.from({ length: 16 }, (_, i) => i * 22.5);

export function LogoMark({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn('shrink-0', className)}
      role="img"
      aria-label="Mehndi By Dhara emblem"
    >
      <defs>
        <linearGradient id="mbdPetalGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D9A94A" />
          <stop offset="100%" stopColor="#9C6B1F" />
        </linearGradient>
      </defs>

      <circle cx="50" cy="50" r="47" fill="none" stroke="#CDA13D" strokeOpacity="0.4" strokeWidth="1" />

      {DOT_ANGLES.map((angle) => (
        <circle
          key={angle}
          cx={50 + 41 * Math.cos((angle * Math.PI) / 180)}
          cy={50 + 41 * Math.sin((angle * Math.PI) / 180)}
          r="1"
          fill="#CDA13D"
          fillOpacity="0.55"
        />
      ))}

      <g stroke="url(#mbdPetalGradient)" fill="none" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
        {PETAL_ANGLES.map((angle) => (
          <path
            key={angle}
            d="M50 50 C 50 33, 43 21, 50 10 C 57 21, 50 33, 50 50 Z"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
      </g>

      <g stroke="#264F30" fill="none" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round">
        {PETAL_ANGLES.map((angle) => (
          <path
            key={angle}
            d="M50 50 C 50 39, 46 32, 50 24 C 54 32, 50 39, 50 50 Z"
            transform={`rotate(${angle + 22.5} 50 50)`}
          />
        ))}
      </g>

      <path d="M50 45 C 43 45, 39 40, 41 33 C 48 34, 51 39, 50 45 Z" fill="#D24F66" opacity="0.9" />
      <circle cx="50" cy="50" r="5" fill="#0F2A17" />
      <circle cx="50" cy="50" r="2.1" fill="#FBF8F1" />
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
      <LogoMark size={markSize} />
      {stacked ? (
        <span className="font-serif italic leading-none tracking-wide">
          <span className={cn('block', primary)}>Mehndi</span>
          <span className={cn('block -mt-0.5', accent)}>By Dhara</span>
        </span>
      ) : (
        <span className="font-serif italic leading-none tracking-wide whitespace-nowrap">
          <span className={primary}>Mehndi</span> <span className={accent}>By Dhara</span>
        </span>
      )}
    </span>
  );
}
