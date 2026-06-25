"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { LazyImage } from "@/components/effects/lazy-image";
import type { ArticleSummaryData } from "@/types/content";
import { cn } from "@/lib/utils";

function splitCategories(value: string) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ArticlesFilteredGrid({
  allLabel,
  items,
  className,
}: {
  allLabel: string;
  items: ArticleSummaryData[];
  className?: string;
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

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={cn("px-5 py-16 md:px-10 md:py-32", className)}>
      {categories.length > 1 && (
        <div className="mb-14 flex flex-wrap gap-2" data-reveal>
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
      )}

      <div className="grid gap-8 md:grid-cols-3">
        {filteredItems.map((article) => (
          <Link
            className="group block"
            data-cursor="link"
            data-reveal
            href={article.href}
            key={article.href}
          >
            <div className="relative aspect-video overflow-hidden bg-white/5">
              <LazyImage
                alt={article.alt}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                fill
                src={article.image}
              />
            </div>
            <h3 className="mt-7 text-[20px] leading-[1.35]">{article.title}</h3>
            <p className="mt-3 max-w-107.5 text-[15px] leading-[1.55] text-muted-foreground">
              {article.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
