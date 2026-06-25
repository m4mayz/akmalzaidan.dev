import Link from "next/link";

import { getSiteData } from "@/lib/content";
import type { Locale, SiteData } from "@/types/content";

type ContactSectionProps = {
    locale?: Locale;
    site?: SiteData;
};

export async function ContactSection({ locale = "en", site }: ContactSectionProps) {
    const siteData = site ?? await getSiteData(locale);

    return (
        <section
            className="px-5 pb-12 pt-16 md:px-10 md:pb-16 md:pt-32"
            data-reveal
        >
            <p className="mb-8 text-xs leading-none uppercase tracking-widest text-muted-foreground">
                LET&apos;S WORK TOGETHER
            </p>
            <Link
                className="gradient-text group relative inline-block max-w-[60vw] wrap-break-word font-heading text-[min(40px,calc(50vw/11.5))] font-light leading-[1.05] tracking-normal md:max-w-[80vw] md:text-[min(112px,calc(70vw/11.5))]"
                data-cursor="link"
                href={`mailto:${siteData.email}`}
            >
                {siteData.email}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[linear-gradient(90deg,#ebe1b0_-86.53%,#aea8fe_100%)] transition-transform duration-500 ease-out group-hover:scale-x-100 md:h-1" />
            </Link>
        </section>
    );
}
