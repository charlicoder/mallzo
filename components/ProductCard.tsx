"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ProductCardData } from "@/lib/api";
import type { Locale } from "@/lib/i18n";

export default function ProductCard({ product, lang, index = 0 }: { product: ProductCardData; lang: Locale; index?: number }) {
  const { images } = product;
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!hovering || images.length < 2) return;
    const t = setInterval(() => setActive((i) => (i + 1) % images.length), 1000);
    return () => clearInterval(t);
  }, [hovering, images.length]);

  const stop = () => {
    setHovering(false);
    setActive(0);
  };

  return (
    <Link
      href={`/${lang}/products/${product.slug}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={stop}
      onFocus={() => setHovering(true)}
      onBlur={stop}
      className="group block focus-visible:outline-none"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-slate-200/60 transition group-focus-visible:ring-2 group-focus-visible:ring-brand">
        {images.map((src, i) => {
          // First image loads immediately; the rest only after the first hover.
          if (i > 0 && !hovering && active === 0) return null;
          return (
            <Image
              key={src}
              src={src}
              alt={i === 0 ? product.title : ""}
              fill
              sizes="(min-width:1280px) 24vw, (min-width:1024px) 30vw, (min-width:640px) 33vw, 50vw"
              priority={index < 4 && i === 0}
              loading={index < 8 && i === 0 ? "eager" : undefined}
              className={`object-cover transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}
            />
          );
        })}
      </div>
      <h3 className="line-clamp-2 px-1 pt-3.5 text-[15px] font-medium leading-snug text-slate-900 transition-colors group-hover:text-brand sm:text-lg sm:leading-snug">
        {product.title}
      </h3>
    </Link>
  );
}
