import type { Metadata, Viewport } from "next";
import { DM_Sans, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { dict, dirOf } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

const dmSans = DM_Sans({ variable: "--font-dm", subsets: ["latin"] });
const notoArabic = Noto_Sans_Arabic({ variable: "--font-ar", subsets: ["arabic"] });

export const viewport: Viewport = { themeColor: "#f7f4f4" };

export async function generateMetadata(): Promise<Metadata> {
  const t = dict[await getLocale()];
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: t.siteTitle, template: "%s | Mallzo" },
    description: t.siteDescription,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const lang = await getLocale();

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
