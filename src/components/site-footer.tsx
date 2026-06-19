import Link from "next/link";

import { socialLinks } from "@/lib/ulrych-data";

export function SiteFooter() {
  return (
    <footer className="px-5 pb-10 md:px-10" data-reveal>
      <div className="flex flex-col gap-8 text-[15px] leading-[1.5] text-muted-foreground md:flex-row md:items-center">
        <span>Designed and built by Kristian Ulrych</span>
        <span>Prague, 04:03</span>
        <Link
          className="transition-colors hover:text-foreground"
          data-cursor="pointer"
          href="/privacy"
        >
          Privacy
        </Link>
        <div className="flex flex-wrap gap-2 md:ml-auto">
          {socialLinks.map((link) => (
            <a
              className="inline-flex h-[37px] items-center rounded-full border border-border px-4 text-[13px] transition-colors hover:border-white hover:text-foreground"
              data-cursor="pointer"
              href={link.href}
              key={link.href}
              rel="noreferrer"
              target="_blank"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
