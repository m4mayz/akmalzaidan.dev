import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import { serviceItems } from "@/lib/ulrych-data";

export function ServicesSection() {
    return (
        <section className="px-5 py-16 md:px-10 md:py-32" data-reveal>
            <h2 className="md:text-center font-heading text-3xl font-light leading-[1.05] tracking-normal md:text-[64px]">
                What I do
            </h2>

            <div className="mt-14 grid border-t border-border md:grid-cols-3">
                {serviceItems.map((service, index) => (
                    <article
                        className={`min-h-68.5 border-b border-border py-10 md:px-8 ${
                            index % 3 === 2 ? "" : "md:border-r"
                        }`}
                        data-reveal
                        key={service.number}
                        style={
                            {
                                "--reveal-delay": `${index * 90}ms`,
                            } as CSSProperties
                        }
                    >
                        <span className="text-[12px] text-muted-foreground">
                            {service.number}
                        </span>
                        <h3 className="mt-8 font-heading text-[32px] font-light leading-[1.15] tracking-normal">
                            {service.title}
                        </h3>
                        <p className="mt-8 max-w-97.5 text-[15px] leading-[1.55] text-muted-foreground">
                            {service.description}
                        </p>
                    </article>
                ))}
            </div>

            <div
                className="grid items-center gap-8 md:px-10 border-b border-border py-16 md:grid-cols-[1fr_auto]"
                data-reveal
            >
                <p className="gradient-text font-heading text-xl md:text-[32px] font-light leading-[1.15] tracking-normal">
                    Have a project in mind? Let&apos;s talk.
                </p>
                <Link
                    className="inline-flex h-12 w-fit items-center gap-2 rounded-full border border-white bg-white px-6 text-[15px] leading-none text-black transition-colors hover:bg-transparent hover:text-white"
                    data-cursor="pointer"
                    href="/contact"
                >
                    Get in touch{" "}
                    <ArrowRight
                        aria-hidden="true"
                        size={16}
                        strokeWidth={1.8}
                    />
                </Link>
            </div>
        </section>
    );
}
