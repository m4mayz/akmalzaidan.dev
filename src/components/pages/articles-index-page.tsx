import { ArticlesSection } from "@/components/articles-section";
import { ContactSection } from "@/components/contact-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getArticleSummaries, getSiteData } from "@/lib/content";
import type { Locale } from "@/types/content";

export async function ArticlesIndexPage({ locale }: { locale: Locale }) {
    const site = await getSiteData(locale);
    const articles = await getArticleSummaries(locale);
    const isIndonesian = locale === "id";

    return (
        <>
            <SiteHeader locale={locale} site={site} />
            <main className="relative z-10 px-5 pt-32 md:px-10 md:pt-[8.75rem]">
                <section className="mx-auto max-w-[89.5rem]" data-reveal>
                    <h1 className="max-w-[980px] font-heading text-4xl font-light leading-[1.02] tracking-tighter text-foreground md:text-[92px]">
                        {isIndonesian
                            ? "Catatan tentang membangun, memperbaiki, dan belajar lewat kerja teknis"
                            : "Notes on building, fixing, and learning through technical work"}
                    </h1>
                    <p className="mt-8 max-w-[640px] text-[16px] leading-[1.6] text-muted-foreground md:text-[17px]">
                        {isIndonesian
                            ? "Tulisan tentang software web, dashboard, fullstack context, AI-assisted development, dan masalah IT yang sering muncul di pekerjaan nyata."
                            : "Writing about web software, dashboards, fullstack context, AI-assisted development, and the IT problems that show up in real work."}
                    </p>
                </section>

                <div className="mx-auto max-w-[89.5rem]">
                    <ArticlesSection
                        items={articles}
                        title={isIndonesian ? "Artikel" : "Articles"}
                    />
                </div>
                <ContactSection locale={locale} site={site} />
            </main>
            <div className="relative z-10">
                <SiteFooter locale={locale} site={site} />
            </div>
        </>
    );
}
