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
  metadataBase: new URL("https://www.ulrychkristian.cz"),
  title: "Kristián Ulrych - UX/UI & Digital Product Designer",
  description:
    "UX/UI designer based in Prague, creating websites, apps, design systems and visual directions with clarity, character and practical execution.",
  authors: [{ name: "Kristian Ulrych" }],
  creator: "Kristian Ulrych",
  openGraph: {
    title: "Kristián Ulrych - UX/UI & Digital Product Designer",
    description:
      "UX/UI designer based in Prague, creating websites, apps, design systems and visual directions with clarity, character and practical execution.",
    images: [
      {
        url: "/seo/og.png",
        width: 1200,
        height: 630,
        alt: "Kristian Ulrych",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kristián Ulrych - UX/UI & Digital Product Designer",
    description:
      "UX/UI designer based in Prague, creating websites, apps, design systems and visual directions with clarity, character and practical execution.",
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
