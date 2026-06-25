import Link from "next/link";

import { getSiteData } from "@/lib/content";
import type { Locale } from "@/types/content";

async function NotFoundContent({ locale }: { locale: Locale }) {
  const site = await getSiteData(locale);
  const isIndonesian = locale === "id";

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
        404
      </p>
      <h1 className="mt-6 font-heading text-[36px] font-light leading-[1.1] tracking-tighter text-foreground md:text-[80px]">
        {isIndonesian ? "Tidak ditemukan" : "Not found"}
      </h1>
      <p className="mt-6 max-w-100 text-[16px] leading-[1.55] text-muted-foreground md:text-[17px]">
        {isIndonesian
          ? "Halaman yang kamu cari tidak ada atau sudah dipindahkan."
          : "The page you're looking for doesn't exist or has been moved."}
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          className="inline-flex h-12 items-center rounded-full border border-white bg-white px-6 text-[15px] text-black transition-colors hover:bg-transparent hover:text-white"
          data-cursor="pointer"
          href={isIndonesian ? "/id" : "/"}
        >
          {isIndonesian ? "Beranda" : "Home"}
        </Link>
        <Link
          className="inline-flex h-12 items-center rounded-full border border-border px-6 text-[15px] text-muted-foreground transition-colors hover:border-white hover:text-foreground"
          data-cursor="pointer"
          href={isIndonesian ? "/id/work" : "/work"}
        >
          {isIndonesian ? "Lihat Project" : "View work"}
        </Link>
      </div>
    </div>
  );
}

export default async function NotFound() {
  const locales: Locale[] = ["en", "id"];

  return (
    <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center">
      {locales.map((locale) => (
        <div key={locale} className="hidden">
          <NotFoundContent locale={locale} />
        </div>
      ))}
      <div className="flex flex-col items-center justify-center px-5 text-center">
        <p className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
          404
        </p>
        <h1 className="mt-6 font-heading text-[36px] font-light leading-[1.1] tracking-tighter text-foreground md:text-[80px]">
          Not found
        </h1>
        <p className="mt-6 max-w-100 text-[16px] leading-[1.55] text-muted-foreground md:text-[17px]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            className="inline-flex h-12 items-center rounded-full border border-white bg-white px-6 text-[15px] text-black transition-colors hover:bg-transparent hover:text-white"
            data-cursor="pointer"
            href="/"
          >
            Home
          </Link>
          <Link
            className="inline-flex h-12 items-center rounded-full border border-border px-6 text-[15px] text-muted-foreground transition-colors hover:border-white hover:text-foreground"
            data-cursor="pointer"
            href="/work"
          >
            View work
          </Link>
        </div>
      </div>
    </div>
  );
}
