import Link from "next/link";
import type { CSSProperties } from "react";

import { LazyImage } from "@/components/effects/lazy-image";
import { workItems } from "@/lib/ulrych-data";

export function SelectedWork() {
  return (
    <section className="px-5 py-16 md:px-10 md:py-32">
      <h2 className="font-heading text-[54px] font-light leading-[1.05] tracking-normal md:text-[64px]">
        Selected work
      </h2>

      <div className="mt-14 grid gap-x-8 gap-y-20 md:grid-cols-2">
        {workItems.map((work, index) => (
          <Link
            className={`group block ${index % 2 === 1 ? "md:mt-60" : ""}`}
            data-cursor="link"
            data-reveal
            href={work.href}
            key={work.href}
            style={{ "--reveal-delay": `${Math.min(index, 3) * 90}ms` } as CSSProperties}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
              <LazyImage
                alt={work.alt}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                fill
                sizes="(min-width: 768px) 48vw, 100vw"
                src={work.image}
              />
            </div>
            <div className="mt-7 grid gap-5 md:grid-cols-[1fr_auto]">
              <div>
                <h3 className="text-[22px] leading-[1.25]">{work.title}</h3>
                <p className="mt-3 max-w-[430px] text-[15px] leading-[1.55] text-muted-foreground">
                  {work.description}
                </p>
              </div>
              <span className="text-[18px] leading-[1.4] text-muted-foreground">
                {work.year}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
