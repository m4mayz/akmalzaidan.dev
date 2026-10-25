import type { Metadata } from "next";

import { getArticleDetail, getSiteData, getWorkDetail } from "@/lib/content";
import { withLocale } from "@/lib/i18n";
import type { Locale } from "@/types/content";

type DetailMetadataInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  publishedTime?: string;
};

async function detailMetadata(input: DetailMetadataInput): Promise<Metadata> {
  const site = await getSiteData(input.locale);
  const title = `${input.title} - ${site.name}`;
  const url = withLocale(input.path, input.locale);
  const images = [{ url: input.image, alt: input.alt }];
  const openGraph = {
    title,
    description: input.description,
    url,
    siteName: site.name,
    images,
  };

  return {
    title,
    description: input.description,
    alternates: {
      canonical: url,
      languages: {
        en: withLocale(input.path, "en"),
        id: withLocale(input.path, "id"),
      },
    },
    openGraph: input.publishedTime
      ? { ...openGraph, type: "article", publishedTime: input.publishedTime }
      : { ...openGraph, type: "website" },
    twitter: {
      card: "summary_large_image",
      title,
      description: input.description,
      images,
    },
  };
}

export async function getWorkMetadata(
  locale: Locale,
  slug: string,
): Promise<Metadata> {
  const work = await getWorkDetail(locale, slug);
  if (!work) return {};

  return detailMetadata({
    locale,
    path: `/work/${slug}`,
    title: work.title,
    description: work.description,
    image: work.image,
    alt: work.alt,
  });
}

export async function getArticleMetadata(
  locale: Locale,
  slug: string,
): Promise<Metadata> {
  const article = await getArticleDetail(locale, slug);
  if (!article) return {};

  return detailMetadata({
    locale,
    path: `/articles/${slug}`,
    title: article.title,
    description: article.description,
    image: article.image,
    alt: article.alt,
    publishedTime: article.publishedAt,
  });
}
