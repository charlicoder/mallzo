import "server-only";
import { cookies, headers } from "next/headers";
import { defaultLocale, hasLocale, type Locale } from "./i18n";

/** Visitor language: saved choice (cookie) → Accept-Language header → default. URLs stay clean. */
export async function getLocale(): Promise<Locale> {
  const saved = (await cookies()).get("NEXT_LOCALE")?.value;
  if (saved && hasLocale(saved)) return saved;
  const header = (await headers()).get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const code = part.trim().split(";")[0].toLowerCase().split("-")[0];
    if (hasLocale(code)) return code;
  }
  return defaultLocale;
}
