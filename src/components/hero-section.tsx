import type { CSSProperties } from "react";

import { HeroFloatingPortrait } from "@/components/hero-floating-portrait";
import type { HomeData, StatItemData } from "@/types/content";

type HeroSectionProps = {
    data: HomeData["hero"];
    stats: StatItemData[];
};

export function HeroSection({ data, stats }: HeroSectionProps) {
    const [beforeHighlight, afterHighlight] = data.headline.split(
        data.highlightedWord,
    );
    const body = data.body.trim();

    return (
        <section className="relative flex min-h-[920px] flex-col px-5 pb-12 pt-32 md:min-h-[1200px] md:px-10 md:pt-[140px]">
            <div className="max-w-[1010px]" data-reveal>
                <h1 className="font-heading text-[40px] font-light leading-[1.02] tracking-tight text-foreground md:text-[96px]">
                    {beforeHighlight}
                    <span className="gradient-text inline-block italic underline decoration-current underline-offset-8">
                        {data.highlightedWord}
                    </span>
                    <br />
                    {afterHighlight.trim()}
                </h1>
                {body ? (
                    <p className="mt-8 max-w-[640px] text-[15px] leading-[1.55] text-muted-foreground md:text-[17px]">
                        {body}
                    </p>
                ) : null}
            </div>

            <div
                className="z-20 order-3 mt-10 md:absolute md:right-10 md:top-[555px] md:order-none md:mt-0 md:w-[41%]"
                data-reveal
                style={{ "--reveal-delay": "120ms" } as CSSProperties}
            >
                <HeroFloatingPortrait />
            </div>

            <dl
                className="order-2 grid max-w-[700px] grid-cols-2 gap-x-10 gap-y-7 pt-16 md:absolute md:left-10 md:top-[555px] md:order-none md:pt-8"
                data-reveal
                style={{ "--reveal-delay": "220ms" } as CSSProperties}
            >
                {stats.map((item) => (
                    <div key={item.label}>
                        <dt className="mb-3 text-[11px] uppercase leading-none text-muted-foreground">
                            {item.label}
                        </dt>
                        <dd className="text-[15px] leading-[1.45] text-foreground">
                            {item.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
