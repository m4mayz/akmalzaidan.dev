import type { Metadata } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";

import { SiteEffects } from "@/components/effects/site-effects";

import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://akmalzaidan.dev"),
  title: "Akmal Zaidan - Fullstack Developer",
  description:
    "Fullstack developer based in Sukabumi, building web apps, dashboards, tools, APIs, and practical IT solutions.",
  authors: [{ name: "Akmal Zaidan" }],
  creator: "Akmal Zaidan",
  openGraph: {
    title: "Akmal Zaidan - Fullstack Developer",
    description:
      "Fullstack developer based in Sukabumi, building web apps, dashboards, tools, APIs, and practical IT solutions.",
    images: [
      {
        url: "/seo/og.png",
        width: 1200,
        height: 630,
        alt: "Akmal Zaidan - Fullstack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akmal Zaidan - Fullstack Developer",
    description:
      "Fullstack developer based in Sukabumi, building web apps, dashboards, tools, APIs, and practical IT solutions.",
    images: ["/seo/og.png"],
  },
  icons: {
    icon: "/seo/icon.png",
    apple: "/seo/apple-icon.png",
  },
};

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
      </body>
    </html>
  );
}
