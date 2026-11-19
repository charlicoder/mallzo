import Image from "next/image";

// Mallzo brand mark (the red shopping-bag tile) from public/logo-mark.png. The artwork has square white
// corners, so it is clipped to the tile's rounded shape.
export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <Image src="/logo-mark.png" alt="" width={size} height={size} unoptimized aria-hidden="true" className={`rounded-[22%] ${className}`} />
  );
}

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={36} />
      <span className="text-[22px] font-bold leading-none tracking-tight text-slate-900" dir="ltr">
        mall<span className="text-brand">zo</span>
      </span>
    </span>
  );
}
