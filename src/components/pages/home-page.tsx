import { ArticlesSection } from "@/components/articles-section";
import { ContactSection } from "@/components/contact-section";
import { HeroSection } from "@/components/hero-section";
import { SelectedWork } from "@/components/selected-work";
import { ServicesSection } from "@/components/services-section";
import { ShowcaseStrip } from "@/components/showcase-strip";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TestimonialSection } from "@/components/testimonial-section";
import {
    getArticleSummaries,
    getHomeData,
    getSiteData,
    getWorkSummaries,
} from "@/lib/content";
import { withLocale } from "@/lib/i18n";
import type { Locale } from "@/types/content";

export function HomePage({ locale }: { locale: Locale }) {
    const site = getSiteData(locale);
    const home = getHomeData(locale);
    const work = getWorkSummaries(locale);
    const articles = getArticleSummaries(locale);
    const isIndonesian = locale === "id";

    return (
        <>
            <SiteHeader locale={locale} site={site} />
            <main className="relative z-10">
                <HeroSection data={home.hero} stats={home.stats} />
                <ShowcaseStrip items={work} />
                <SelectedWork
                    items={work}
                    title={isIndonesian ? "Work pilihan" : "Selected work"}
                />
                <ServicesSection
                    ctaHref={withLocale("/contact", locale)}
                    ctaLabel={isIndonesian ? "Hubungi saya" : "Get in touch"}
                    ctaText={
                        isIndonesian
                            ? "Punya proyek atau kebutuhan teknis? Mari bicara."
                            : "Have a project or technical need in mind? Let's talk."
                    }
                    items={home.services}
                    title={isIndonesian ? "Yang saya kerjakan" : "What I do"}
                />
                <TestimonialSection
                    items={home.testimonials}
                    title={isIndonesian ? "Kata Mereka" : "Kind Words"}
                />
                <ArticlesSection
                    items={articles}
                    title={isIndonesian ? "Artikel" : "Things worth sharing"}
                />
                <ContactSection locale={locale} site={site} />
            </main>
            <div className="relative z-10">
                <SiteFooter locale={locale} site={site} />
            </div>
        </>
    );
}
