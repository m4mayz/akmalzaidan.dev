"use client";

import { useEffect, useState } from "react";
import type { HomeData } from "@/types/content";
import { ArrowLeft, ArrowRight } from "lucide-react";

type TestimonialSectionProps = {
    items: HomeData["testimonials"];
    title: string;
};

export function TestimonialSection({ items, title }: TestimonialSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const changeTestimonial = (newIndex: number) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex(newIndex);
            setIsAnimating(false);
        }, 300); // fade duration
    };

    const next = () => changeTestimonial((currentIndex + 1) % items.length);
    const prev = () => changeTestimonial((currentIndex - 1 + items.length) % items.length);

    if (!items?.length) return null;

    const featured = items[currentIndex];

    return (
        <section className="px-5 py-16 md:px-10 md:py-32" data-reveal>
            <div>
                <h2 className="font-heading text-3xl font-light leading-[1.05] tracking-normal md:text-[64px]">
                    {title}
                </h2>
            </div>

            <div className="mt-14 border-y border-border py-12 md:py-20 relative min-h-[300px]">
                <article 
                    className={`grid gap-8 transition-opacity duration-300 md:grid-cols-12 md:gap-10 ${
                        isAnimating ? "opacity-0" : "opacity-100"
                    }`}
                >
                    <blockquote className="font-heading text-base font-light leading-[1.3] tracking-normal md:col-span-8 md:text-2xl">
                        &ldquo;{featured.quote}&rdquo;
                    </blockquote>
                    <div className="text-[14px] leading-normal md:col-span-4 md:text-right">
                        <p>{featured.author}</p>
                        <p className="mt-1 text-muted-foreground">
                            {featured.role}
                        </p>
                    </div>
                </article>

                {items.length > 1 && (
                    <div className="mt-12 flex justify-center gap-3 md:mt-16 md:gap-4">
                        <button 
                            onClick={prev}
                            className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full border border-border transition-colors hover:bg-white/5 hover:text-white text-muted-foreground"
                            aria-label="Previous testimonial"
                        >
                            <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
                        </button>
                        <button 
                            onClick={next}
                            className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full border border-border transition-colors hover:bg-white/5 hover:text-white text-muted-foreground"
                            aria-label="Next testimonial"
                        >
                            <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
