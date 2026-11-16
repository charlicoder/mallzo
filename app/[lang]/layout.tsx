import type { Metadata, Viewport } from "next";
import { DM_Sans, Noto_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { dict, dirOf, hasLocale, locales } from "@/lib/i18n";

const dmSans = DM_Sans({ variable: "--font-dm", subsets: ["latin"] });
const notoArabic = Noto_Sans_Arabic({ variable: "--font-ar", subsets: ["arabic"] });

export const viewport: Viewport = { themeColor: "#f7f4f4" };

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = dict[lang];
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: t.siteTitle, template: "%s | Mallzo" },
    description: t.siteDescription,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])) },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} dir={dirOf(lang)} className={`${dmSans.variable} ${notoArabic.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Header lang={lang} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
