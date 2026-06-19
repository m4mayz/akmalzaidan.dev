export function TestimonialSection() {
    return (
        <section className="px-5 py-16 md:px-10 md:py-32" data-reveal>
            <h2 className="font-heading text-3xl font-light leading-[1.05] tracking-normal md:text-[64px]">
                Kind words
            </h2>

            <article className="mt-14 grid gap-8 border-y border-border py-12 md:grid-cols-12 md:gap-10 md:py-20">
                <blockquote className="font-heading text-base font-light leading-[1.3] tracking-normal md:col-span-8 md:text-2xl">
                    &ldquo;I&apos;ve been working with Kristián for over two
                    years, and he always delivers top-notch work. He has
                    contributed to the creation of the visual identity, graphic
                    materials, animations, and 3D designs for our virtual F1
                    league, and his work has had a significant impact on the
                    growth and perception of the entire community. I appreciate
                    his prompt communication, creativity, technical precision,
                    and ability to deliver high-quality results even under tight
                    deadlines. I can wholeheartedly recommend working with
                    him.&rdquo;
                </blockquote>
                <div className="text-[14px] leading-normal md:col-span-4 md:text-right">
                    <p>Tomáš Šmaha</p>
                    <p className="mt-1 text-muted-foreground">
                        IT Specialist, Škoda Auto a.s.
                    </p>
                    <p className="text-muted-foreground">
                        Owner, ForteXxGaming League
                    </p>
                </div>
            </article>
        </section>
    );
}
