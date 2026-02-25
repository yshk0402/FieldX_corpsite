import type { Metadata } from "next";
import localFont from "next/font/local";

import { GoogleAnalytics } from "./components/GoogleAnalytics";
import { SiteFooter } from "./components/SiteFooter";
import { getSiteUrl } from "./lib/site";
import "./globals.css";

const fontBody = localFont({
  src: "./fonts/TakaoPGothic.ttf",
  display: "swap",
  variable: "--font-body"
});

const fontHeading = localFont({
  src: "./fonts/TakaoPGothic.ttf",
  display: "swap",
  variable: "--font-heading"
});

export const metadata: Metadata = {
  title: "AImate | AI業務改善パートナー",
  description: "AImateは、AI導入のための業務再設計から実装・定着まで伴走するAI業務改善パートナーです。",
  metadataBase: new URL(getSiteUrl()),
  icons: {
    icon: "/favicon.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="ja">
      <body className={`${fontBody.variable} ${fontHeading.variable}`}>
        {children}
        <SiteFooter />
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
