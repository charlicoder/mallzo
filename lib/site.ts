export const SITE_NAME = "Mallzo";
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.NODE_ENV === "production" ? "https://mallzo.shop" : "http://localhost:3000")
).replace(/\/$/, "");

/** Absolute URL for a site path. */
export const abs = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
