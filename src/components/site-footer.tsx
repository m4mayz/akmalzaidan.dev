import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { socialLinks } from "@/lib/ulrych-data";

export function SiteFooter() {
    return (
        <footer className="px-5 pb-10 md:px-10" data-reveal>
            <div className="mx-auto flex max-w-[89.5rem] flex-col-reverse gap-6 text-[15px] leading-[1.5] text-muted-foreground md:flex-row md:items-center md:justify-between md:gap-4">
                <div className="flex flex-col-reverse gap-2 md:flex-row md:items-center md:gap-16">
                    <span>Designed and built by Kristian Ulrych</span>
                    <span>Prague, 04:03</span>
                    <Link
                        className="group relative inline-block self-start py-1 transition-colors hover:text-foreground"
                        data-cursor="pointer"
                        href="/privacy"
                    >
                        Privacy
                        <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    </Link>
                </div>

                <div className="flex flex-wrap gap-2">
                    {socialLinks.map((link) => (
                        <a
                            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[13px] leading-[1.5] transition-all duration-200 hover:border-muted-foreground hover:text-foreground active:scale-[0.96] active:bg-white/[0.06] active:text-foreground"
                            data-cursor="pointer"
                            href={link.href}
                            key={link.href}
                            rel="noreferrer"
                            target="_blank"
                        >
                            <span className="inline-flex h-4 w-4 items-center justify-center">
                                <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.75} />
                            </span>
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
