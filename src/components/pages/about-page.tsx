import type { CSSProperties } from "react";

import { ContactSection } from "@/components/contact-section";
import { LazyImage } from "@/components/effects/lazy-image";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAboutData, getSiteData } from "@/lib/content";
import type { Locale, TimelineItemData } from "@/types/content";

function AboutHeading({
  children,
  size = "large",
}: {
  children: string;
  size?: "large" | "medium";
}) {
  return (
    <h2
      className={
        size === "large"
          ? "max-w-[20ch] font-heading text-[28px] font-light leading-[1.05] tracking-tighter md:text-[48px]"
          : "max-w-[20ch] font-heading text-[26px] font-light leading-[1.05] tracking-tighter md:text-[40px]"
      }
    >
      {children}
    </h2>
  );
}

function TimelineList({ items }: { items: TimelineItemData[] }) {
  return (
    <ul className="mt-8 border-t border-border md:mt-12">
      {items.map((item) => (
        <li
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border py-4 last:border-b-0 md:py-5"
          key={`${item.title}-${item.organization}-${item.period}`}
        >
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <span className="text-[15px] leading-[1.5] text-foreground md:text-[16px]">
              {item.title}
            </span>
            <span className="text-[14px] leading-[1.5] text-muted-foreground md:text-[15px]">
              {item.organization}
            </span>
          </div>
          <span className="shrink-0 text-[13px] leading-[1.5] text-muted-foreground md:text-[14px]">
            {item.period}
          </span>
        </li>
      ))}
    </ul>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <ul className="mt-8 flex flex-wrap gap-2 md:mt-12">
      {items.map((item) => (
        <li
          className="inline-flex h-9 items-center rounded-full border border-border px-4 text-[14px] leading-none text-foreground"
          key={item}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export async function AboutPage({ locale }: { locale: Locale }) {
  const site = await getSiteData(locale);
  const about = await getAboutData(locale);
  const heroImage = about.images[0];
  const sideImage = about.images[1];

  return (
    <>
      <SiteHeader locale={locale} site={site} />
      <main className="relative z-10">
        <section className="relative px-5 pb-16 pt-32 md:px-10 md:pb-24 md:pt-[8.75rem]">
          <div className="mx-auto max-w-[89.5rem]">
            <div data-reveal>
              <h1 className="max-w-[22ch] font-heading text-[36px] font-light leading-[0.95] tracking-tighter text-foreground md:text-[clamp(56px,5.4vw,80px)]">
                {about.headline}
              </h1>
              <div className="mt-10 grid max-w-195 gap-6 text-[17px] leading-[1.55] text-foreground/85 md:mt-14 md:max-w-250 md:text-[18px]">
                <p>{about.subhead}</p>
                {about.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            {heroImage?.src ? (
              <div
                className="relative mt-16 aspect-[16/9] w-full overflow-hidden bg-white/5 md:mt-20"
                data-reveal
                style={{ "--reveal-delay": "120ms" } as CSSProperties}
              >
                <LazyImage
                  alt={heroImage.alt}
                  className="object-cover"
                  fill
                  src={heroImage.src}
                />
              </div>
            ) : null}
          </div>
        </section>

        <section className="relative px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-[89.5rem] gap-12 md:grid-cols-2 md:gap-20">
            <div data-reveal>
              <AboutHeading>{about.philosophyTitle}</AboutHeading>
              <div className="mt-8 flex flex-col gap-6 text-[17px] leading-[1.55] text-foreground/85 md:mt-12 md:max-w-200">
                {about.philosophy.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            {sideImage?.src ? (
              <div
                className="relative min-h-[439px] overflow-hidden bg-white/5 md:min-h-0"
                data-reveal
                style={{ "--reveal-delay": "120ms" } as CSSProperties}
              >
                <LazyImage
                  alt={sideImage.alt}
                  className="object-cover"
                  fill
                  src={sideImage.src}
                />
              </div>
            ) : null}
          </div>
        </section>

        <section className="relative px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-[89.5rem] gap-x-12 gap-y-14 md:grid-cols-2">
            <div data-reveal>
              <AboutHeading size="medium">{about.experienceTitle}</AboutHeading>
              <TimelineList items={about.experiences} />
            </div>
            <div
              data-reveal
              style={{ "--reveal-delay": "90ms" } as CSSProperties}
            >
              <AboutHeading size="medium">{about.educationTitle}</AboutHeading>
              <TimelineList items={about.education} />
            </div>
          </div>
        </section>

        <section className="relative px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-[89.5rem] gap-x-12 gap-y-14 md:grid-cols-2">
            <div data-reveal>
              <AboutHeading size="medium">{about.skillsTitle}</AboutHeading>
              <TagList items={about.skills} />
            </div>
            <div
              data-reveal
              style={{ "--reveal-delay": "90ms" } as CSSProperties}
            >
              <AboutHeading size="medium">{about.toolsTitle}</AboutHeading>
              <TagList items={about.tools} />
            </div>
          </div>
        </section>

        <section className="relative px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[89.5rem]">
            <div className="grid gap-x-12 gap-y-8 md:grid-cols-12" data-reveal>
              <div className="md:col-span-4">
                <AboutHeading>{about.beyondTitle}</AboutHeading>
              </div>
              <div className="md:col-span-8">
                <div className="max-w-[52rem] space-y-5 text-[17px] leading-[1.55] text-foreground/85 md:text-[19px]">
                  {about.beyond.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            {about.images.filter(img => img.src).length > 0 ? (
              <div className="mt-14 grid grid-cols-2 gap-3 md:mt-20 md:grid-cols-4 md:gap-6">
                {about.images.filter(img => img.src).map((image, index) => (
                  <div
                    className="relative aspect-[4/5] w-full overflow-hidden bg-white/5"
                    data-reveal
                    key={image.src}
                    style={
                      {
                        "--reveal-delay": `${Math.min(index, 3) * 70}ms`,
                      } as CSSProperties
                    }
                  >
                    <LazyImage
                      alt={image.alt}
                      className="object-cover"
                      fill
                      src={image.src}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <ContactSection locale={locale} site={site} />
      </main>
      <div className="relative z-10">
        <SiteFooter locale={locale} site={site} />
      </div>
    </>
  );
}
