import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Providers } from "@/app/components/Providers";
import { AdBanner } from "@/app/components/AdBanner";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://card-alpha.jp";
const siteName = "Card Alpha";
const defaultTitle = "Card Alpha - ポケモンカード投資・分析プラットフォーム";
const defaultDescription =
  "カード市場で、一歩先を読む。初心者でもポケモンカード投資やコレクションの判断ができる分析プラットフォームです。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Card Alpha",
  },
  description: defaultDescription,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Providers>
          <Header />
          <AdBanner placement="banner" />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
