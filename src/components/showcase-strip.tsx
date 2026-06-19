import { ShowcaseSlideshow } from "@/components/showcase-slideshow";

const showcaseImages = [
    {
        src: "/images/ulrychkristian/Hanging-Vertical-Banner-Mockup.png",
        alt: "Veevoy hanging vertical banner mockup",
    },
    {
        src: "/images/ulrychkristian/eqvista_1.jpg",
        alt: "Eqvista mobile interface presentation",
    },
];

export function ShowcaseStrip() {
    return (
        <section className="px-5 py-16 md:px-10 md:py-32" data-reveal>
            <ShowcaseSlideshow images={showcaseImages} />
        </section>
    );
}
