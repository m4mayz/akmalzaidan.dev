import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { ContactSection } from "@/components/contact-section";
import { LazyImage } from "@/components/effects/lazy-image";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
    getMoreWorkSummaries,
    getSiteData,
    getWorkDetail,
} from "@/lib/content";
import type { Locale, WorkGalleryItemData } from "@/types/content";

function getSpanClass(item: WorkGalleryItemData) {
    return item.span === "half" ? "md:col-span-6" : "md:col-span-12";
}

function getAspectClass(item: WorkGalleryItemData) {
    return item.aspect === "4/3" ? "aspect-[4/3]" : "aspect-[16/9]";
}

function ProjectGalleryItem({
    item,
    index,
}: {
    item: WorkGalleryItemData;
    index: number;
}) {
    return (
        <div
            className={`relative overflow-hidden bg-white/5 ${getAspectClass(item)} ${getSpanClass(item)}`}
            data-reveal
            style={
                {
                    "--reveal-delay": `${Math.min(index, 3) * 70}ms`,
                } as CSSProperties
            }
        >
            <LazyImage
                alt={item.alt}
                className="object-cover"
                fill
                sizes={
                    item.span === "half"
                        ? "(min-width: 768px) 47vw, 100vw"
                        : "94vw"
                }
                src={item.src}
            />
        </div>
    );
}

export function WorkDetailPage({
    locale,
    slug,
}: {
    locale: Locale;
    slug: string;
}) {
    const site = getSiteData(locale);
    const project = getWorkDetail(locale, slug);
    const isIndonesian = locale === "id";

    if (!project) {
        notFound();
    }

    const moreProjects = getMoreWorkSummaries(locale, project.slug);
    const details = [
        ["Scope", project.category],
        ["Role", project.role],
        ["Client", project.client],
        ["Year", project.year],
    ];

    return (
        <>
            <SiteHeader locale={locale} site={site} />
            <main className="relative z-10">
                <section className="px-5 pt-32 md:px-10 md:pt-[8.75rem]">
                    <div className="mx-auto max-w-[89.5rem]">
                        <p
                            className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground"
                            data-reveal
                        >
                            {project.title}
                        </p>
                        <h1
                            className="mt-6 max-w-[16ch] font-heading text-[36px] font-light leading-[1.1] tracking-tighter text-foreground md:max-w-[23ch] md:text-[80px]"
                            data-reveal
                            style={
                                { "--reveal-delay": "70ms" } as CSSProperties
                            }
                        >
                            {project.summary}
                        </h1>
                        <dl
                            className="mt-8 grid grid-cols-2 border-t border-border md:mt-12 md:grid-cols-4"
                            data-reveal
                            style={
                                { "--reveal-delay": "140ms" } as CSSProperties
                            }
                        >
                            {details.map(([label, value], index) => (
                                <div
                                    className={`flex flex-col py-4 md:px-8 md:py-7 ${
                                        index % 2 === 1
                                            ? "border-l border-border pl-5"
                                            : ""
                                    } ${
                                        index > 1
                                            ? "border-t border-border md:border-t-0"
                                            : ""
                                    } ${
                                        index > 0
                                            ? "md:border-l md:border-border md:pl-8"
                                            : ""
                                    }`}
                                    key={label}
                                >
                                    <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                                        {label}
                                    </dt>
                                    <dd className="mt-1.5 text-[15px] leading-[1.45] text-foreground md:mt-3 md:text-[16px]">
                                        {value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div
                        className="relative mt-10 h-[430px] overflow-hidden bg-white/5 md:mt-16 md:h-[780px]"
                        data-reveal
                    >
                        <LazyImage
                            alt={project.alt}
                            className="object-cover"
                            fill
                            rootMargin="400px 0px"
                            sizes="100vw"
                            src={project.image}
                        />
                    </div>
                </section>

                <div className="px-5 py-16 md:px-10 md:py-28">
                    <div className="mx-auto max-w-[89.5rem]">
                        {project.sections.map((section) => {
                            const sectionGallery = project.gallery.filter(
                                (item) => item.slot === section.slot,
                            );

                            return (
                                <section
                                    className="border-t border-border py-16 first:border-t-0 first:pt-0 md:py-28"
                                    key={section.slot}
                                >
                                    <div
                                        className="grid gap-8 md:grid-cols-15 md:gap-0"
                                        data-reveal
                                    >
                                        <h2 className="font-heading text-[28px] font-light leading-[1.1] tracking-normal text-foreground md:col-span-4 md:text-4xl">
                                            {section.heading}
                                        </h2>
                                        <div className="space-y-5 text-[17px] leading-[1.55] text-foreground/85 md:col-span-9 md:col-start-5 md:text-[19px]">
                                            {section.body.map((paragraph) => (
                                                <p key={paragraph}>
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>
                                    </div>

                                    {sectionGallery.length > 0 ? (
                                        <div className="mt-12 grid gap-6 md:mt-20 md:grid-cols-12">
                                            {sectionGallery.map(
                                                (item, index) => (
                                                    <ProjectGalleryItem
                                                        index={index}
                                                        item={item}
                                                        key={`${section.slot}-${item.src}-${index}`}
                                                    />
                                                ),
                                            )}
                                        </div>
                                    ) : null}
                                </section>
                            );
                        })}
                    </div>
                </div>

                <section className="px-5 py-16 md:px-10 md:py-28">
                    <div className="mx-auto max-w-[89.5rem]">
                        <p className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                            {isIndonesian ? "Project lainnya" : "More projects"}
                        </p>
                        <div className="mt-8 grid gap-8 md:grid-cols-3">
                            {moreProjects.map((item, index) => (
                                <Link
                                    className="group block"
                                    data-cursor="link"
                                    data-reveal
                                    href={item.href}
                                    key={item.slug}
                                    style={
                                        {
                                            "--reveal-delay": `${index * 80}ms`,
                                        } as CSSProperties
                                    }
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                                        <LazyImage
                                            alt={item.alt}
                                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                            fill
                                            sizes="(min-width: 768px) 31vw, 100vw"
                                            src={item.image}
                                        />
                                    </div>
                                    <div className="mt-5 flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-[20px] leading-[1.25] text-foreground md:text-[22px]">
                                                {item.title}
                                            </h2>
                                            <p className="mt-2 text-[14px] leading-[1.5] text-muted-foreground">
                                                {item.category}
                                            </p>
                                        </div>
                                        <p className="text-[15px] leading-[1.45] text-muted-foreground">
                                            {item.year}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <ContactSection locale={locale} site={site} />
            </main>
            <div className="relative z-10">
                <SiteFooter locale={locale} site={site} />
            </div>
        </>
    );
}
