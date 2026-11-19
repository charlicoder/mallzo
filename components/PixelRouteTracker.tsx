"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// The pixel counts the first page load itself; this reports later in-app navigations as PageViews.
export default function PixelRouteTracker() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.("track", "PageView");
  }, [pathname]);
  return null;
}
