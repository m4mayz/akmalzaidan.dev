import type { Metadata } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { SiteEffects } from "@/components/effects/site-effects";
import { Toaster } from "@/components/ui/sonner";
import { getSiteData } from "@/lib/content";

import "./globals.css";

const siteUrl = "https://akmalzaidan.dev";
const ogImageUrl = `${siteUrl}/seo/og.png`;

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteData("en");

  return {
    metadataBase: new URL(siteUrl),
    title: site.metadata.title,
    description: site.metadata.description,
    authors: [{ name: site.name }],
    creator: site.name,
    openGraph: {
      title: site.metadata.title,
      description: site.metadata.description,
      url: siteUrl,
      siteName: site.name,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: site.metadata.ogAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.metadata.title,
      description: site.metadata.description,
      images: [ogImageUrl],
    },
    icons: {
      icon: "/seo/icon.png",
      apple: "/seo/apple-icon.png",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteEffects />
        {children}
        <Toaster position="bottom-right" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
