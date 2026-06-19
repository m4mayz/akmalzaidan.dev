import { ShowcaseSlideshow } from "@/components/showcase-slideshow";
import { workItems } from "@/lib/ulrych-data";

const showcaseImages = workItems.map((work) => ({
    src: work.image,
    alt: work.alt,
    href: work.href,
    title: work.title,
}));

export function ShowcaseStrip() {
    return (
        <section className="px-5 py-16 md:px-10 md:py-32" data-reveal>
            <ShowcaseSlideshow images={showcaseImages} />
        </section>
    );
}
