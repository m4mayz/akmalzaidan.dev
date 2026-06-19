import Link from "next/link";
import type { CSSProperties } from "react";

import { ContactSection } from "@/components/contact-section";
import { LazyImage } from "@/components/effects/lazy-image";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const workProjects = [
    {
        title: "Eqvista",
        discipline: "Mobile app design",
        year: "2025-2026",
        href: "/work/eqvista",
        image: "/images/ulrychkristian/eqvista_thumbnail.jpg",
        alt: "Eqvista cap-table interface",
        className: "md:col-span-8",
    },
    {
        title: "Veevoy web",
        discipline: "Website, Branding",
        year: "2025-2026",
        href: "/work/veevoy",
        image: "/images/ulrychkristian/veevoy_thumbnail.png",
        alt: "Veevoy marketing site on a desktop monitor",
        className: "md:col-span-4",
    },
    {
        title: "Telemedicine portal",
        discipline: "Web portal, design system",
        year: "2025-2026",
        href: "/work/telemedicine-portal",
        image: "/images/ulrychkristian/telemedicine-thumbnail.png",
        alt: "Telemedicine portal interface overview",
        className: "md:col-span-4",
        imageClassName: "object-[25%_center] md:object-[center_25%]",
    },
    {
        title: "Mapwhizz",
        discipline: "UX/UI",
        year: "2026",
        href: "/work/mapwhizz",
        image: "/images/ulrychkristian/mapwhizz-thumbnail.png",
        alt: "Mapwhizz travel-time analysis report on a MacBook",
        className: "md:col-span-8",
    },
    {
        title: "Sportelo",
        discipline: "UX/UI, Branding",
        year: "2025-2026",
        href: "/work/sportelo",
        image: "/images/ulrychkristian/sportelo_thumbnail.png",
        alt: "Sportelo athlete platform app and brand identity overview",
        className: "md:col-span-8",
    },
];

const filters = ["All", "UX/UI", "Branding"];

export default function WorkPage() {
    return (
        <>
            <SiteHeader />
            <main className="relative z-10 px-5 pt-32 md:px-10 md:pt-[8.75rem]">
                <div className="mx-auto max-w-[89.5rem]">
                    <section data-reveal>
                        <h1 className="max-w-[980px] font-heading text-[54px] font-light leading-[1.02] tracking-normal text-foreground md:text-[92px]">
                            A closer look at the work I&apos;ve helped shape
                        </h1>
                        <p className="mt-8 max-w-[640px] text-[16px] leading-[1.6] text-muted-foreground md:text-[17px]">
                            Selected projects across product design, websites,
                            systems and brand-led experiences - independently
                            and as part of agency teams.
                        </p>
                    </section>

                    <div className="mt-14 flex flex-wrap gap-2" data-reveal>
                        {filters.map((filter, index) => (
                            <button
                                className={`h-9 rounded-full border px-4 text-[14px] transition-colors ${
                                    index === 0
                                        ? "border-white bg-white text-black"
                                        : "border-border text-muted-foreground hover:border-white hover:text-foreground"
                                }`}
                                data-cursor="pointer"
                                key={filter}
                                type="button"
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <section className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-12 md:gap-y-24">
                        {workProjects.map((project, index) => (
                            <Link
                                className={`group block ${project.className}`}
                                data-cursor="link"
                                data-reveal
                                href={project.href}
                                key={project.href}
                                style={{ "--reveal-delay": `${Math.min(index, 3) * 90}ms` } as CSSProperties}
                            >
                                <div className="relative h-[438px] overflow-hidden bg-white/5 md:h-[620px]">
                                    <LazyImage
                                        alt={project.alt}
                                        className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
                                            project.imageClassName ?? ""
                                        }`}
                                        fill
                                        sizes="(min-width: 768px) 66vw, 100vw"
                                        src={project.image}
                                    />
                                </div>
                                <div className="mt-6 grid gap-2 md:grid-cols-[1fr_auto] md:gap-6">
                                    <div>
                                        <h2 className="text-[20px] leading-[1.25] md:text-[22px]">
                                            {project.title}
                                        </h2>
                                        <p className="mt-2 text-[14px] leading-[1.5] text-muted-foreground">
                                            {project.discipline}
                                        </p>
                                    </div>
                                    <p className="text-[15px] leading-[1.45] text-muted-foreground md:text-right">
                                        {project.year}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </section>
                </div>
                <ContactSection />
            </main>
            <div className="relative z-10">
                <SiteFooter />
            </div>
        </>
    );
}
