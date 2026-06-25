import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPrivacyData, getSiteData } from "@/lib/content";
import { withLocale } from "@/lib/i18n";
import type { Locale } from "@/types/content";

function PolicyParagraph({ children }: { children: string }) {
    return (
        <p className="text-[16px] leading-[1.65] text-foreground/80 md:text-[18px]">
            {children}
        </p>
    );
}

export async function PrivacyPage({ locale }: { locale: Locale }) {
    const site = await getSiteData(locale);
    const privacy = await getPrivacyData(locale);

    return (
        <>
            <SiteHeader locale={locale} site={site} />
            <main className="relative z-10 px-5 pb-20 pt-32 md:px-10 md:pb-32 md:pt-35">
                <article className="mx-auto max-w-208">
                    <div data-reveal>
                        <p className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                            {privacy.eyebrow}
                        </p>
                        <h1 className="mt-6 font-heading text-4xl font-light leading-[1.05] tracking-normal text-foreground md:text-[80px]">
                            {privacy.title}
                        </h1>
                        <p className="mt-8 text-[15px] leading-normal text-muted-foreground md:text-[16px]">
                            {privacy.lastUpdated}
                        </p>
                        <p className="mt-10 text-[17px] leading-[1.6] text-foreground/85 md:text-[20px]">
                            {privacy.intro}
                        </p>
                        <a
                            className="gradient-text group relative mt-8 inline-block text-[18px] leading-normal text-foreground"
                            data-cursor="link"
                            href={`mailto:${site.email}`}
                        >
                            {site.email}
                            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,#ebe1b0_-86.53%,#aea8fe_100%)] transition-transform duration-500 ease-out group-hover:scale-x-100" />
                        </a>
                    </div>

                    <div className="mt-14 space-y-14 md:mt-20 md:space-y-20">
                        {privacy.sections.map((section) => (
                            <section
                                className="border-t border-border pt-8 md:pt-10"
                                data-reveal
                                key={section.heading}
                            >
                                <h2 className="font-heading text-2xl font-light leading-[1.12] tracking-normal text-foreground md:text-[42px]">
                                    {section.heading}
                                </h2>

                                {section.paragraphs ? (
                                    <div className="mt-6 space-y-5">
                                        {section.paragraphs.map(
                                            (paragraph) => (
                                                <PolicyParagraph
                                                    key={paragraph}
                                                >
                                                    {paragraph}
                                                </PolicyParagraph>
                                            ),
                                        )}
                                    </div>
                                ) : null}

                                {section.groups ? (
                                    <div className="mt-8 space-y-9">
                                        {section.groups.map((group) => (
                                            <div key={group.subheading}>
                                                <h3 className="text-[18px] leading-[1.35] text-foreground md:text-[22px]">
                                                    {group.subheading}
                                                </h3>
                                                <div className="mt-4 space-y-5">
                                                    {group.paragraphs.map(
                                                        (paragraph) => (
                                                            <PolicyParagraph
                                                                key={paragraph}
                                                            >
                                                                {paragraph}
                                                            </PolicyParagraph>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}

                                {section.list ? (
                                    <ul className="mt-5 list-disc space-y-2 pl-5 text-[16px] leading-[1.65] text-foreground/80 md:text-[18px]">
                                        {section.list.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                ) : null}
                            </section>
                        ))}
                    </div>

                    <div className="mt-14 border-t border-border pt-8 md:mt-20 md:pt-10">
                        <Link
                            className="group relative inline-block text-[16px] leading-none text-foreground"
                            data-cursor="link"
                            href={withLocale("/contact", locale)}
                        >
                            {locale === "id"
                                ? "Hubungi saya tentang privasi"
                                : "Contact me about privacy"}
                            <span className="pointer-events-none absolute inset-x-0 -bottom-1 h-px origin-left scale-x-100 bg-current transition-transform duration-300 group-hover:scale-x-0" />
                        </Link>
                    </div>
                </article>
            </main>
            <div className="relative z-10">
                <SiteFooter locale={locale} site={site} />
            </div>
        </>
    );
}
