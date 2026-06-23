import { ContactSection } from "@/components/contact-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WorkFilteredGrid } from "@/components/work-filtered-grid";
import { getSiteData, getWorkSummaries } from "@/lib/content";
import type { Locale } from "@/types/content";

export async function WorkIndexPage({ locale }: { locale: Locale }) {
    const site = getSiteData(locale);
    const work = await getWorkSummaries(locale);
    const isIndonesian = locale === "id";

    return (
        <>
            <SiteHeader locale={locale} site={site} />
            <main className="relative z-10 px-5 pt-32 md:px-10 md:pt-[8.75rem]">
                <div className="mx-auto max-w-[89.5rem]">
                    <section data-reveal>
                        <h1 className="max-w-[980px] font-heading text-4xl font-light leading-[1.02] tracking-tighter text-foreground md:text-[92px]">
                            {isIndonesian
                                ? "Project software web, sistem fullstack, dan IT support"
                                : "Web software, fullstack systems, and technical support work"}
                        </h1>
                        <p className="mt-8 max-w-[640px] text-[16px] leading-[1.6] text-muted-foreground md:text-[17px]">
                            {isIndonesian
                                ? "Kumpulan project dan konsep yang menunjukkan cara saya membangun, menghubungkan, dan merawat pekerjaan teknis praktis."
                                : "A focused selection of projects and concepts that show how I build, connect, and maintain practical technical work."}
                        </p>
                    </section>

                    {work.length > 0 ? (
                        <WorkFilteredGrid
                            allLabel={isIndonesian ? "Semua" : "All"}
                            items={work}
                        />
                    ) : null}
                </div>
                <ContactSection locale={locale} site={site} />
            </main>
            <div className="relative z-10">
                <SiteFooter locale={locale} site={site} />
            </div>
        </>
    );
}
