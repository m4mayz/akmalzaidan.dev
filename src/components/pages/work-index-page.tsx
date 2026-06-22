import Link from "next/link";
import type { CSSProperties } from "react";

import { ContactSection } from "@/components/contact-section";
import { LazyImage } from "@/components/effects/lazy-image";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteData, getWorkSummaries } from "@/lib/content";
import type { Locale } from "@/types/content";

const spanClasses = [
    "md:col-span-8",
    "md:col-span-4",
    "md:col-span-4",
    "md:col-span-8",
    "md:col-span-8",
    "md:col-span-4",
];

export function WorkIndexPage({ locale }: { locale: Locale }) {
    const site = getSiteData(locale);
    const work = getWorkSummaries(locale);
    const isIndonesian = locale === "id";
    const filters = isIndonesian
        ? ["Semua", "Web", "Backend", "Dashboard"]
        : ["All", "Web", "Backend", "Dashboard"];

    return (
        <>
            <SiteHeader locale={locale} site={site} />
            <main className="relative z-10 px-5 pt-32 md:px-10 md:pt-[8.75rem]">
                <div className="mx-auto max-w-[89.5rem]">
                    <section data-reveal>
                        <h1 className="max-w-[980px] font-heading text-4xl font-light leading-[1.02] tracking-tighter text-foreground md:text-[92px]">
                            {isIndonesian
                                ? "Project software web, sistem fullstack, dan IT support"
                                : "Web software, fullstack systems, and technical support work"}
                        </h1>
                        <p className="mt-8 max-w-[640px] text-[16px] leading-[1.6] text-muted-foreground md:text-[17px]">
                            {isIndonesian
                                ? "Kumpulan project dan konsep yang menunjukkan cara saya membangun, menghubungkan, dan merawat pekerjaan teknis praktis."
                                : "A focused selection of projects and concepts that show how I build, connect, and maintain practical technical work."}
                        </p>
                    </section>

                    {work.length > 0 ? (
                        <>
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
                                {work.map((project, index) => (
                                    <Link
                                        className={`group block ${spanClasses[index]}`}
                                        data-cursor="link"
                                        data-reveal
                                        href={project.href}
                                        key={project.href}
                                        style={
                                            {
                                                "--reveal-delay": `${Math.min(index, 3) * 90}ms`,
                                            } as CSSProperties
                                        }
                                    >
                                        <div className="relative h-[438px] overflow-hidden bg-white/5 md:h-[620px]">
                                            <LazyImage
                                                alt={project.alt}
                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                                fill
                                                sizes="(min-width: 768px) 66vw, 100vw"
                                                src={project.image}
                                            />
                                        </div>
                                        <div className="mt-6 grid gap-2 md:grid-cols-[1fr_auto] md:gap-6">
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <h2 className="text-[20px] leading-[1.25] md:text-[22px]">
                                                        {project.title}
                                                    </h2>
                                                    <p className="text-[15px] leading-[1.45] text-muted-foreground md:text-right">
                                                        {project.year}
                                                    </p>
                                                </div>

                                                <p className="mt-2 text-[14px] leading-[1.5] text-muted-foreground">
                                                    {project.category}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </section>
                        </>
                    ) : null}
                </div>
                <ContactSection locale={locale} site={site} />
            </main>
            <div className="relative z-10">
                <SiteFooter locale={locale} site={site} />
            </div>
        </>
    );
}
