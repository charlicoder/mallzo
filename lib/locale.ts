import "server-only";
import { cookies, headers } from "next/headers";
import { defaultLocale, hasLocale, type Locale } from "./i18n";

// GCC countries (ISO 3166-1): Bahrain, Kuwait, Oman, Qatar, Saudi Arabia, United Arab Emirates.
const GCC = new Set(["BH", "KW", "OM", "QA", "SA", "AE"]);

// Country headers set by the CDN/host in front of the site (first one present wins).
const GEO_HEADERS = ["cloudfront-viewer-country", "cf-ipcountry", "x-vercel-ip-country", "x-country-code"];

/**
 * Visitor language: saved choice (cookie) → location → default.
 * GCC visitors get Arabic, everyone else English. Location comes from the CDN's country header
 * (CloudFront on Amplify); without one, the region in Accept-Language (e.g. "ar-KW") is used.
 * URLs stay clean.
 */
export async function getLocale(): Promise<Locale> {
  const saved = (await cookies()).get("NEXT_LOCALE")?.value;
  if (saved && hasLocale(saved)) return saved;

  const h = await headers();
  const country = GEO_HEADERS.map((n) => h.get(n)).find(Boolean)?.trim().toUpperCase();
  if (country) return GCC.has(country) ? "ar" : defaultLocale;

  const region = (h.get("accept-language") ?? "")
    .split(",")
    .map((p) => p.trim().split(";")[0].split("-")[1]?.toUpperCase())
    .find((r) => r && GCC.has(r));
  return region ? "ar" : defaultLocale;
}
