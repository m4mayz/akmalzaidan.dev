import type { HomeData } from "@/types/content";

type TestimonialSectionProps = {
    items: HomeData["testimonials"];
    title: string;
};

export function TestimonialSection({ items, title }: TestimonialSectionProps) {
    const [featured] = items;

    return (
        <section className="px-5 py-16 md:px-10 md:py-32" data-reveal>
            <h2 className="font-heading text-3xl font-light leading-[1.05] tracking-normal md:text-[64px]">
                {title}
            </h2>

            <article className="mt-14 grid gap-8 border-y border-border py-12 md:grid-cols-12 md:gap-10 md:py-20">
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
        </section>
    );
}
