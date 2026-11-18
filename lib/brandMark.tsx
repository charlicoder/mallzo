// The logo mark as an image-renderer element (next/og), shared by the favicon and apple icon.
export function brandMark(px: number) {
  return (
    <svg width={px} height={px} viewBox="0 0 64 64">
      <defs>
        <linearGradient id="g" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ff8a4c" />
          <stop offset="1" stopColor="#f2481b" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#g)" />
      <path d="M23 25v-3.5a9 9 0 0 1 18 0V25" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M16.5 24.5h31l2.6 27a2 2 0 0 1-2 2.2H15.9a2 2 0 0 1-2-2.2z" fill="#fff" />
      <path d="M24 46.5V34.5l8 8.5 8-8.5v12" fill="none" stroke="#f2481b" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
