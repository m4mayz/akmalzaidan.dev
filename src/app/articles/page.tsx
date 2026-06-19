import { ArticlesSection } from "@/components/articles-section";
import { ContactSection } from "@/components/contact-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ArticlesPage() {
    return (
        <>
            <SiteHeader />
            <main className="relative z-10 pt-16 md:pt-8">
                <ArticlesSection />
                <ContactSection />
            </main>
            <div className="relative z-10">
                <SiteFooter />
            </div>
        </>
    );
}
