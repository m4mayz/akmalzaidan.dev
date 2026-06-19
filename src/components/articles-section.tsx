import Image from "next/image";
import Link from "next/link";

import { LazyImage } from "@/components/effects/lazy-image";
import { articleItems } from "@/lib/ulrych-data";

export function ArticlesSection() {
    return (
        <section className="px-5 py-16 md:px-10 md:py-32">
            <h2 className="font-heading text-3xl font-light leading-[1.05] tracking-normal md:text-[64px]">
                Things worth sharing
            </h2>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
                {articleItems.map((article) => (
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
                                sizes="(min-width: 768px) 31vw, 100vw"
                                src={article.image}
                            />
                            {article.badge ? (
                                <Image
                                    alt={article.badgeAlt ?? ""}
                                    className="absolute right-5 top-5 h-16 w-16 object-contain"
                                    height={64}
                                    src={article.badge}
                                    width={64}
                                />
                            ) : null}
                        </div>
                        <h3 className="mt-7 text-[20px] leading-[1.35]">
                            {article.title}
                        </h3>
                        <p className="mt-3 max-w-107.5 text-[15px] leading-[1.55] text-muted-foreground">
                            {article.description}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
