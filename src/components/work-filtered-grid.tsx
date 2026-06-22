"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";

import { LazyImage } from "@/components/effects/lazy-image";
import type { WorkSummaryData } from "@/types/content";

const spanClasses = [
    "md:col-span-8",
    "md:col-span-4",
    "md:col-span-4",
    "md:col-span-8",
    "md:col-span-8",
    "md:col-span-4",
];

function splitCategories(value: string) {
    return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

export function WorkFilteredGrid({
    allLabel,
    items,
}: {
    allLabel: string;
    items: WorkSummaryData[];
}) {
    const [activeCategory, setActiveCategory] = useState(allLabel);
    const categories = useMemo(
        () => [
            allLabel,
            ...Array.from(
                new Set(items.flatMap((item) => splitCategories(item.category))),
            ),
        ],
        [allLabel, items],
    );
    const filteredItems =
        activeCategory === allLabel
            ? items
            : items.filter((item) =>
                  splitCategories(item.category).includes(activeCategory),
              );

    return (
        <>
            <div className="mt-14 flex flex-wrap gap-2" data-reveal>
                {categories.map((category) => {
                    const isActive = activeCategory === category;

                    return (
                        <button
                            className={`h-9 rounded-full border px-4 text-[14px] transition-colors ${
                                isActive
                                    ? "border-white bg-white text-black"
                                    : "border-border text-muted-foreground hover:border-white hover:text-foreground"
                            }`}
                            data-cursor="pointer"
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            type="button"
                        >
                            {category}
                        </button>
                    );
                })}
            </div>

            <section className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-12 md:gap-y-24">
                {filteredItems.map((project, index) => (
                    <Link
                        className={`group block ${spanClasses[index % spanClasses.length]}`}
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
    );
}
