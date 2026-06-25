import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { ContactSection } from "@/components/contact-section";
import { LazyImage } from "@/components/effects/lazy-image";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getArticleDetail,
  getMoreArticleSummaries,
  getSiteData,
} from "@/lib/content";
import type { ArticleDetailData, Locale } from "@/types/content";

function ArticleContent({
  block,
}: {
  block: ArticleDetailData["blocks"][number];
}) {
  return (
    <section className="mx-auto max-w-[52rem]" data-reveal>
      {block.heading ? (
        <h2 className="font-heading text-[24px] font-light leading-[1.1] tracking-[-0.02em] md:text-[32px]">
          {block.heading}
        </h2>
      ) : null}
      <div
        className={`${block.heading ? "mt-8" : ""} space-y-5 text-[17px] leading-[1.55] text-foreground/85 md:text-[19px]`}
      >
        {block.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export async function ArticleDetailPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const site = await getSiteData(locale);
  const article = await getArticleDetail(locale, slug);
  const isIndonesian = locale === "id";

  if (!article) {
    notFound();
  }

  const moreArticles = await getMoreArticleSummaries(locale, article.slug);

  return (
    <>
      <SiteHeader locale={locale} site={site} />
      <main className="relative z-10">
        <section className="relative px-5 pt-32 md:px-10 md:pt-[8.75rem]">
          <div className="mx-auto max-w-90 md:max-w-208" data-reveal>
            <p className="mb-6 text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
              {article.publishedAt}
            </p>
            <h1 className="font-heading text-[30px] font-light leading-[1.1] tracking-[-0.02em] md:text-[52px]">
              {article.title}
            </h1>
            <p className="mt-8 text-[17px] leading-[1.55] text-foreground/85 md:text-[19px]">
              {article.lead}
            </p>
          </div>

          <div
            className="relative mx-auto mt-16 aspect-[16/10] max-w-[52rem] overflow-hidden bg-white/5"
            data-reveal
            style={{ "--reveal-delay": "120ms" } as CSSProperties}
          >
            <LazyImage
              alt={article.alt}
              className="object-cover"
              fill
              src={article.image}
            />
          </div>
        </section>

        <section className="px-5 py-16 md:px-10 md:py-32">
          <div className="mx-auto flex max-w-[89.5rem] flex-col gap-16 md:gap-24">
            {article.blocks.map((block, index) => (
              <ArticleContent
                block={block}
                key={`${block.heading ?? "block"}-${index}`}
              />
            ))}
          </div>
        </section>

        <section className="px-5 py-16 md:px-10 md:py-32">
          <div className="mx-auto max-w-[89.5rem]">
            <h2 className="font-heading text-[32px] font-light leading-[1.05] tracking-[-0.03em] md:text-[56px]">
              {isIndonesian ? "Artikel lainnya" : "More articles"}
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {moreArticles.map((item) => (
                <Link
                  className="group block"
                  data-cursor="link"
                  data-reveal
                  href={item.href}
                  key={item.slug}
                >
                  <div className="relative aspect-[5/4] overflow-hidden bg-white/5">
                    <LazyImage
                      alt={item.alt}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      fill
                      src={item.image}
                    />
                  </div>
                  <h3 className="mt-7 text-[20px] leading-[1.35]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[430px] text-[15px] leading-[1.55] text-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
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
