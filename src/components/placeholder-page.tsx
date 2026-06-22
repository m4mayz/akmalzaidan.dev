import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteData } from "@/lib/content";

type PlaceholderPageProps = {
    title: string;
    description: string;
    eyebrow?: string;
};

export function PlaceholderPage({
    title,
    description,
    eyebrow = "In progress",
}: PlaceholderPageProps) {
    const site = getSiteData("en");

    return (
        <>
            <SiteHeader locale="en" site={site} />
            <main className="relative z-10 min-h-screen px-5 pb-20 pt-36 md:px-10 md:pt-44">
                <section className="max-w-[980px]" data-reveal>
                    <p className="mb-8 text-[11px] uppercase leading-none text-muted-foreground">
                        {eyebrow}
                    </p>
                    <h1 className="font-heading text-[56px] font-light leading-[1.02] tracking-normal text-foreground md:text-[96px]">
                        {title}
                    </h1>
                    <p className="mt-8 max-w-[620px] text-[17px] leading-[1.65] text-muted-foreground">
                        {description}
                    </p>
                    <Link
                        className="mt-12 inline-flex h-12 items-center rounded-full border border-white bg-white px-6 text-[15px] leading-none text-black transition-colors hover:bg-transparent hover:text-white"
                        data-cursor="pointer"
                        href="/"
                    >
                        Back to home
                    </Link>
                </section>
            </main>
            <div className="relative z-10">
                <SiteFooter site={site} />
            </div>
        </>
    );
}
