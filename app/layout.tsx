import type { Metadata, Viewport } from "next";
import { DM_Sans, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Analytics, { AnalyticsNoScript } from "@/components/Analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubscribePopup from "@/components/SubscribePopup";
import { dict, dirOf } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { abs, SITE_NAME, SITE_URL } from "@/lib/site";

const dmSans = DM_Sans({ variable: "--font-dm", subsets: ["latin"] });
const notoArabic = Noto_Sans_Arabic({ variable: "--font-ar", subsets: ["arabic"], preload: false });

export const viewport: Viewport = { themeColor: "#f7f4f4" };

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const t = dict[lang];
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title: { default: t.siteTitle, template: "%s | Mallzo" },
    description: t.siteDescription,
    keywords: ["affiliate deals", "women's fashion", "handbags", "shoes", "sweaters", "beauty", "home", "best prices", "Mallzo"],
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: abs("/"),
      title: t.siteTitle,
      description: t.siteDescription,
      locale: lang === "ar" ? "ar_AR" : "en_US",
      images: [{ url: abs("/opengraph-image"), alt: t.siteTitle }],
    },
    twitter: { card: "summary_large_image", title: t.siteTitle, description: t.siteDescription, images: [abs("/opengraph-image")] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const lang = await getLocale();

  return (
    <html lang={lang} dir={dirOf(lang)} className={`${dmSans.variable} ${notoArabic.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AnalyticsNoScript />
        <Header lang={lang} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} />
        <SubscribePopup lang={lang} />
        <Analytics />
      </body>
    </html>
  );
}
