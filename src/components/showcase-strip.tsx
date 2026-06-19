import { ShowcaseSlideshow } from "@/components/showcase-slideshow";
import type { WorkSummaryData } from "@/types/content";

type ShowcaseStripProps = {
    items: WorkSummaryData[];
};

export function ShowcaseStrip({ items }: ShowcaseStripProps) {
    const showcaseImages = items.map((work) => ({
        src: work.image,
        alt: work.alt,
        href: work.href,
        title: work.title,
    }));

    return (
        <section className="px-5 py-16 md:px-10 md:py-32" data-reveal>
            <ShowcaseSlideshow images={showcaseImages} />
        </section>
    );
}
