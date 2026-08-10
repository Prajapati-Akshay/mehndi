export function MehndiMotif({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 600" className={className} aria-hidden="true">
      <g fill="none" stroke="#B6862A" strokeWidth="1.2">
        <path d="M300 60 C 420 60, 520 160, 520 280 C 520 380, 440 460, 340 460 C 300 460, 270 430, 270 395 C 270 365, 295 345, 320 345 C 340 345, 355 360, 355 378" strokeLinecap="round" />
        <path d="M300 60 C 180 60, 80 160, 80 280 C 80 380, 160 460, 260 460 C 300 460, 330 430, 330 395" strokeLinecap="round" />
        <circle cx="300" cy="60" r="6" />
        <circle cx="355" cy="378" r="5" />
        <circle cx="330" cy="395" r="5" />
      </g>
      <g fill="none" stroke="#264F30" strokeWidth="1" opacity="0.5">
        <path d="M300 100 C 250 140, 230 200, 260 250" strokeLinecap="round" />
        <path d="M300 100 C 350 140, 370 200, 340 250" strokeLinecap="round" />
      </g>
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const cx = 300 + Math.cos(angle) * 230;
        const cy = 280 + Math.sin(angle) * 230;
        return <circle key={i} cx={cx} cy={cy} r="2.5" fill="#D24F66" opacity="0.4" />;
      })}
    </svg>
  );
}
