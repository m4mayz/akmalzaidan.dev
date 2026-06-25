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

export async function HomePage({ locale }: { locale: Locale }) {
  const site = await getSiteData(locale);
  const home = await getHomeData(locale);
  const [work, articles] = await Promise.all([
    getWorkSummaries(locale),
    getArticleSummaries(locale),
  ]);
  const isIndonesian = locale === "id";

  return (
    <>
      <SiteHeader locale={locale} site={site} />
      <main className="relative z-10">
        <HeroSection data={home.hero} stats={home.stats} />
        <ShowcaseStrip items={work} />
        <SelectedWork
          items={work}
          title={isIndonesian ? "Project pilihan" : "Selected work"}
        />
        <ServicesSection
          ctaHref={withLocale("/contact", locale)}
          ctaLabel={isIndonesian ? "Hubungi saya" : "Get in touch"}
          ctaText={
            isIndonesian
              ? "Punya project, peluang kerja, atau masalah teknis yang perlu dibahas?"
              : "Have a project, role, or technical problem to talk about?"
          }
          items={home.services}
          title={isIndonesian ? "Yang bisa saya bantu" : "What I can help with"}
        />
        <TestimonialSection
          items={home.testimonials}
          title={isIndonesian ? "Cerita Mereka" : "Kind Words"}
        />
        <ArticlesSection
          items={articles}
          title={isIndonesian ? "Layak untuk dibagikan" : "Worth the Share"}
        />
        <ContactSection locale={locale} site={site} />
      </main>
      <div className="relative z-10">
        <SiteFooter locale={locale} site={site} />
      </div>
    </>
  );
}
