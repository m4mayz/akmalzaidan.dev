import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { ContactSection } from "@/components/contact-section";
import { LazyImage } from "@/components/effects/lazy-image";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type ArticleBlock =
    | {
          type: "text";
          heading?: string;
          paragraphs: string[];
      }
    | {
          type: "stats";
          heading: string;
          stats: { value: string; label: string }[];
      };

type GalleryImage = {
    src: string;
    alt: string;
    className?: string;
    imageClassName?: string;
};

type ArticleDetail = {
    slug: string;
    title: string;
    lead: string;
    heroImage: string;
    heroAlt: string;
    badge?: string;
    badgeAlt?: string;
    blocks: ArticleBlock[];
    gallery: GalleryImage[];
};

const articles: ArticleDetail[] = [
    {
        slug: "ferrari-499p",
        title: "Ferrari 499P from scratch: Best 3D Graphics of the Semester",
        lead: "I created a full 3D model of the Ferrari 499P in Blender using a blueprint and photo references, built the textures in Substance Painter, and produced a series of renders from different angles. The project won Best 3D Graphics of the Semester at Multifest.",
        heroImage: "/images/ulrychkristian/ferrari1.png",
        heroAlt: "Ferrari 499P 3D render — front three-quarter view",
        badge: "/images/ulrychkristian/best-3d-award-badge.png",
        badgeAlt: "Best 3D Award — semester winner",
        blocks: [
            {
                type: "text",
                paragraphs: [
                    "As part of a 3D graphics course during my multimedia studies at VŠE, I created a custom 3D model of the Ferrari 499P and a series of around six renders from different angles.",
                    "I chose the Ferrari 499P mainly because I loved its design. I had already worked on a Formula-style car before, but this time I wanted to try something different — a car with a more challenging shape, a distinctive silhouette and a motorsport aesthetic that personally interests me.",
                    "The entire model was built from scratch. I worked with a purchased blueprint and a large number of photo references. The most challenging part was the modelling itself, especially the body shape, because the Ferrari 499P has a complex form with many specific aerodynamic details. In addition to the model, I also created the textures, materials, scene setup, lighting and final post-production.",
                    "The project was made using Blender, Substance Painter and Photoshop. Blender was used for modelling, scene setup and rendering, Substance Painter for texturing, and Photoshop for final adjustments.",
                    "The final output was a series of renders designed to present not only the car model itself, but also its visual character. I wanted the images to feel like finished compositions with their own environment, lighting and atmosphere — not just a technical modelling exercise.",
                    "The project was later nominated at Multifest, a semester event organized as part of the multimedia programme at VŠE, where selected student works are presented and awarded. In the public voting among nominated 3D renders, the project won Best 3D Graphics of the Semester.",
                    "The feedback was very positive. The project received recognition through the voting, but also from classmates and teachers. I was also told that the work is shown to following students as an example in 3D graphics classes.",
                    "Although 3D graphics is not my main professional focus today, I still see it as a visual hobby I would like to return to — especially through motorsport-related projects, which continue to inspire me.",
                ],
            },
        ],
        gallery: [
            {
                src: "/images/ulrychkristian/ferrari2.png",
                alt: "Ferrari 499P render — side profile",
                className: "md:col-span-12",
            },
            {
                src: "/images/ulrychkristian/ferrari3.png",
                alt: "Ferrari 499P render — rear three-quarter",
                className: "md:col-span-6",
            },
            {
                src: "/images/ulrychkristian/ferrari4.png",
                alt: "Ferrari 499P render — front detail",
                className: "md:col-span-6",
            },
            {
                src: "/images/ulrychkristian/ferrari5.png",
                alt: "Ferrari 499P render — atmospheric composition",
                className: "md:col-span-12",
            },
            {
                src: "/images/ulrychkristian/ferrari6.png",
                alt: "Ferrari 499P render — close-up detail",
                className: "md:col-span-12",
            },
        ],
    },
    {
        slug: "rb18-3d-printed-model",
        title: "The school project people wanted to buy",
        lead: "A fan-made 3D printed F1 model that took over 200 hours to build and reached more than 30,000 views online.",
        heroImage: "/images/ulrychkristian/thumbnail.jpeg",
        heroAlt: "Fan-made 3D printed RB18 Formula 1 model",
        blocks: [
            {
                type: "text",
                heading: "About the project",
                paragraphs: [
                    "This project started as my final school assignment. I wanted to create something that would not feel like just another school project, but a piece of work I genuinely cared about — something that would challenge my design thinking, technical skills, and attention to detail.",
                    "I decided to model and 3D print a fan-made RB18 Formula 1 car inspired by Red Bull Racing. The project was created mainly in Blender, and the final physical model was approximately 40 cm long.",
                    "From the first modelling steps to the final result, the project took around 200 hours of work, not including the actual printing time.",
                ],
            },
            {
                type: "stats",
                heading: "Project in numbers",
                stats: [
                    { value: "200+", label: "hours of work" },
                    { value: "40 cm", label: "model length" },
                    { value: "99.7%", label: "positive review ratio" },
                    { value: "30,000+", label: "total views" },
                ],
            },
            {
                type: "text",
                heading: "The challenge",
                paragraphs: [
                    "The biggest technical challenge was the modelling itself. A Formula 1 car has a very complex shape, many aerodynamic details, and several parts that are extremely thin in real life.",
                    "To make the model work as a physical 3D print, I had to adjust some elements so they would still look visually accurate, but also be strong enough and printable at this scale. It was not just about creating a model that looked good on screen. Every part had to make sense as a real object.",
                    "A lot of things went wrong along the way. Some prints failed, some parts had to be redesigned, and I had to solve practical issues such as color choices, part connections, and the overall quality of the final finish.",
                    "It was not an easy project, but that was also what made it exciting. It combined motorsport, 3D modelling, technical problem-solving, and a lot of patience.",
                ],
            },
            {
                type: "text",
                heading: "The process",
                paragraphs: [
                    "I built the project step by step, part by part. Throughout the process, I had to constantly balance visual accuracy with the limitations of 3D printing.",
                    "Some details had to be simplified, others had to be strengthened, and some parts required a completely different approach to make them work at this scale. Formula 1 cars are full of thin, sharp, and complex elements that may look good in a digital model, but quickly hit physical limits once they need to be printed.",
                    "The process was not only about modelling. It also involved testing, fixing, reprinting, and gradually refining the final result. It was a project where the digital design constantly had to meet the reality of a physical object.",
                    "In the end, the result turned out exactly the way I hoped. I received the highest grade for the final school defense, but looking back, what happened afterwards became even more interesting to me.",
                ],
            },
            {
                type: "text",
                heading: "Social media response",
                paragraphs: [
                    "After sharing the project online, it received much more attention than I expected. It performed especially well on Reddit in the Red Bull Racing fan community, where it became one of the top posts.",
                    "People in the comments asked whether they could buy the model or get the STL files. At the time, I decided not to sell it because I was not sure about the rights and monetization rules around fan-made work inspired by Formula 1 teams.",
                    "Even without selling it, the response meant a lot. What started as a school assignment and personal hobby suddenly reached a community of people who shared the same passion for motorsport.",
                ],
            },
            {
                type: "text",
                heading: "What I learned",
                paragraphs: [
                    "This project gave me much more than experience with Blender and 3D printing. It taught me patience, attention to detail, and how to solve problems that only appear when a digital design becomes a physical object.",
                    "It also showed me the value of personal projects. Even when they are not made for a client, a deadline, or a commercial outcome, they can often teach you more than a standard assignment.",
                    "I am still proud of this model today. And I have been thinking more and more about returning to this type of project again — this time purely for fun.",
                ],
            },
        ],
        gallery: [
            {
                src: "/images/ulrychkristian/rb18-1.jpeg",
                alt: "RB18 3D printed model — view 1",
                className: "md:col-span-6",
            },
            {
                src: "/images/ulrychkristian/rb18-2.jpeg",
                alt: "RB18 3D printed model — view 2",
                className: "md:col-span-6",
            },
            {
                src: "/images/ulrychkristian/rb18-3.jpeg",
                alt: "RB18 3D printed model — view 3",
                className: "md:col-span-12",
            },
            {
                src: "/images/ulrychkristian/rb18-4.jpeg",
                alt: "RB18 3D printed model — view 4",
                className: "md:col-span-6",
            },
            {
                src: "/images/ulrychkristian/rb18-5.jpeg",
                alt: "RB18 3D printed model — view 5",
                className: "md:col-span-6",
            },
            {
                src: "/images/ulrychkristian/rb18-6.jpeg",
                alt: "RB18 3D printed model — view 6",
                className: "md:col-span-12",
            },
            {
                src: "/images/ulrychkristian/rb18-7.jpeg",
                alt: "RB18 3D printed model — view 7",
                className: "md:col-span-6",
            },
            {
                src: "/images/ulrychkristian/rb18-8.jpeg",
                alt: "RB18 3D printed model — view 8",
                className: "md:col-span-6",
                imageClassName: "object-[center_35%]",
            },
        ],
    },
];

function getArticle(slug: string) {
    return articles.find((article) => article.slug === slug);
}

export function generateStaticParams() {
    return articles.map((article) => ({ slug: article.slug }));
}

function ArticleContent({ block }: { block: ArticleBlock }) {
    if (block.type === "stats") {
        return (
            <div
                className="grid gap-8 border-y border-border py-10 md:grid-cols-4"
                data-reveal
            >
                <h2 className="font-heading text-[24px] font-light leading-[1.1] tracking-[-0.02em] md:col-span-4 md:text-[32px]">
                    {block.heading}
                </h2>
                {block.stats.map((stat) => (
                    <div key={stat.label}>
                        <p className="font-heading text-[42px] font-light leading-none tracking-[-0.03em] md:text-[56px]">
                            {stat.value}
                        </p>
                        <p className="mt-3 text-[14px] leading-[1.5] text-muted-foreground md:text-[15px]">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <section className="mx-auto max-w-[52rem]" data-reveal>
            <div>
                {block.heading ? (
                    <h2 className="font-heading text-[24px] font-light leading-[1.1] tracking-[-0.02em] md:text-[32px]">
                        {block.heading}
                    </h2>
                ) : null}
            </div>
            <div
                className={`${block.heading ? "mt-8" : ""} space-y-5 text-[17px] leading-[1.55] text-foreground/85 md:text-[19px]`}
            >
                {block.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                ))}
            </div>
        </section>
    );
}

export default async function ArticleDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const article = getArticle(slug);

    if (!article) {
        notFound();
    }

    const moreArticles = articles.filter((item) => item.slug !== article.slug);

    return (
        <>
            <SiteHeader />
            <main className="relative z-10">
                <section className="relative px-5 pt-32 md:px-10 md:pt-[8.75rem]">
                    <div className="mx-auto max-w-90 md:max-w-208" data-reveal>
                        <h1 className="font-heading text-[30px] font-light leading-[1.1] tracking-[-0.02em] md:text-[52px]">
                            {article.title}
                        </h1>
                        <p className="mt-8 text-[17px] leading-[1.55] text-foreground/85 md:text-[19px]">
                            {article.lead}
                        </p>
                    </div>

                    <div
                        className="relative mx-auto mt-16 aspect-[16/10] max-w-[52rem] overflow-hidden bg-white/5"
                        data-reveal
                        style={{ "--reveal-delay": "120ms" } as CSSProperties}
                    >
                        <LazyImage
                            alt={article.heroAlt}
                            className="object-cover"
                            fill
                            sizes="(min-width: 768px) 58vw, 100vw"
                            src={article.heroImage}
                        />
                        {article.badge ? (
                            <Image
                                alt={article.badgeAlt ?? ""}
                                className="absolute right-8 top-8 h-24 w-24 object-contain md:h-40 md:w-40"
                                height={160}
                                src={article.badge}
                                width={160}
                            />
                        ) : null}
                    </div>
                </section>

                <section className="px-5 py-16 md:px-10 md:py-32">
                    <div className="mx-auto flex max-w-[89.5rem] flex-col gap-16 md:gap-24">
                        {article.blocks.map((block, index) => (
                            <ArticleContent
                                block={block}
                                key={`${block.type}-${"heading" in block ? block.heading : index}`}
                            />
                        ))}
                    </div>
                </section>

                <section className="px-5 py-16 md:px-10 md:py-32">
                    <div className="mx-auto grid max-w-[89.5rem] gap-6 md:grid-cols-12">
                        {article.gallery.map((image, index) => (
                            <div
                                className={`relative aspect-[16/10] overflow-hidden bg-white/5 ${image.className ?? "md:col-span-12"}`}
                                data-reveal
                                key={image.src}
                                style={
                                    {
                                        "--reveal-delay": `${Math.min(index, 3) * 70}ms`,
                                    } as CSSProperties
                                }
                            >
                                <LazyImage
                                    alt={image.alt}
                                    className={`object-cover ${image.imageClassName ?? ""}`}
                                    fill
                                    sizes="(min-width: 768px) 94vw, 100vw"
                                    src={image.src}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="px-5 py-16 md:px-10 md:py-32">
                    <div className="mx-auto max-w-[89.5rem]">
                        <h2 className="font-heading text-[32px] font-light leading-[1.05] tracking-[-0.03em] md:text-[56px]">
                            More articles
                        </h2>
                        <div className="mt-12 grid gap-8 md:grid-cols-3">
                            {moreArticles.map((item) => (
                                <Link
                                    className="group block"
                                    data-cursor="link"
                                    data-reveal
                                    href={`/articles/${item.slug}`}
                                    key={item.slug}
                                >
                                    <div className="relative aspect-[5/4] overflow-hidden bg-white/5">
                                        <LazyImage
                                            alt={item.heroAlt}
                                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                            fill
                                            sizes="(min-width: 768px) 31vw, 100vw"
                                            src={item.heroImage}
                                        />
                                    </div>
                                    <h3 className="mt-7 text-[20px] leading-[1.35]">
                                        {item.title}
                                    </h3>
                                    <p className="mt-3 max-w-[430px] text-[15px] leading-[1.55] text-muted-foreground">
                                        {item.lead}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <ContactSection />
            </main>
            <div className="relative z-10">
                <SiteFooter />
            </div>
        </>
    );
}
