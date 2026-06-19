import { ArticlesSection } from "@/components/articles-section";
import { ContactSection } from "@/components/contact-section";
import { HeroSection } from "@/components/hero-section";
import { SelectedWork } from "@/components/selected-work";
import { ServicesSection } from "@/components/services-section";
import { ShowcaseStrip } from "@/components/showcase-strip";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TestimonialSection } from "@/components/testimonial-section";

export default function Home() {
    return (
        <>
            <SiteHeader />
            <main className="relative z-10">
                <HeroSection />
                <ShowcaseStrip />
                <SelectedWork />
                <ServicesSection />
                <TestimonialSection />
                <ArticlesSection />
                <ContactSection />
            </main>
            <div className="relative z-10">
                <SiteFooter />
            </div>
        </>
    );
}
