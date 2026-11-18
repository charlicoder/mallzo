// Mallzo brand mark: an orange rounded tile holding a shopping bag whose front is an "M".
// Pure SVG so it stays crisp at any size; the same artwork is rendered for the favicon (app/icon.tsx).
export function LogoMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="mz-g" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff8a4c" />
          <stop offset="1" stopColor="#f2481b" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#mz-g)" />
      <path d="M23 25v-3.5a9 9 0 0 1 18 0V25" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M16.5 24.5h31l2.6 27a2 2 0 0 1-2 2.2H15.9a2 2 0 0 1-2-2.2z" fill="#fff" />
      <path d="M24 46.5V34.5l8 8.5 8-8.5v12" fill="none" stroke="#f2481b" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={34} />
      <span className="text-[22px] font-bold leading-none tracking-tight text-slate-900" dir="ltr">
        mall<span className="text-brand">zo</span>
      </span>
    </span>
  );
}
