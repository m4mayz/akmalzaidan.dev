import enSite from "../../data/en/site.json";
import idSite from "../../data/id/site.json";

import {
  getArticleBySlug,
  getArticleSlugsFromDb,
  getWorkBySlug,
  getWorkSlugsFromDb,
  listArticleSummaries,
  listWorkSummaries,
  getPageContent,
} from "@/lib/supabase-content";
import type {
  AboutData,
  ArticleDetailData,
  ArticleSummaryData,
  ContactData,
  HomeData,
  Locale,
  PrivacyData,
  SiteData,
  WorkDetailData,
  WorkSummaryData,
} from "@/types/content";

const siteByLocale: Record<Locale, SiteData> = {
  en: enSite as SiteData,
  id: idSite as SiteData,
};

export async function getSiteData(locale: Locale): Promise<SiteData> {
  const localData = siteByLocale[locale];
  const dynamic = await getPageContent<{
    role: string;
    location: string;
    availability: string;
    metadataDescription: string;
  }>("global", locale);

  return {
    ...localData,
    role: dynamic.role ?? localData.role,
    location: dynamic.location ?? localData.location,
    availability: dynamic.availability ?? localData.availability,
    metadata: {
      ...localData.metadata,
      description: dynamic.metadataDescription ?? localData.metadata.description,
    },
  };
}

export async function getHomeData(locale: Locale): Promise<HomeData> {
  const dynamic = await getPageContent<HomeData>("home", locale);
  return {
    ...dynamic,
    stats: dynamic?.stats || [],
    services: dynamic?.services || [],
    testimonials: dynamic?.testimonials || [],
  } as HomeData;
}

export async function getAboutData(locale: Locale): Promise<AboutData> {
  const dynamic = await getPageContent<AboutData>("about", locale);
  return {
    ...dynamic,
    intro: dynamic?.intro || [],
    philosophy: dynamic?.philosophy || [],
    experiences: dynamic?.experiences || [],
    education: dynamic?.education || [],
    skills: dynamic?.skills || [],
    tools: dynamic?.tools || [],
    beyond: dynamic?.beyond || [],
    images: dynamic?.images || [],
  } as AboutData;
}

export async function getContactData(locale: Locale): Promise<ContactData> {
  const dynamic = await getPageContent<ContactData>("contact", locale);
  return (dynamic || {}) as ContactData;
}

export async function getPrivacyData(locale: Locale): Promise<PrivacyData> {
  const dynamic = await getPageContent<PrivacyData>("privacy", locale);
  return {
    ...dynamic,
    sections: dynamic?.sections || [],
  } as PrivacyData;
}

export function getWorkSummaries(locale: Locale): Promise<WorkSummaryData[]> {
  return listWorkSummaries(locale);
}

export function getWorkDetail(
  locale: Locale,
  slug: string,
): Promise<WorkDetailData | undefined> {
  return getWorkBySlug(locale, slug);
}

export async function getMoreWorkSummaries(
  locale: Locale,
  slug: string,
): Promise<WorkSummaryData[]> {
  const items = await getWorkSummaries(locale);
  const index = items.findIndex((item) => item.slug === slug);
  const orderedItems =
    index === -1
      ? items
      : [...items.slice(index + 1), ...items.slice(0, index)];

  return orderedItems.filter((item) => item.slug !== slug).slice(0, 3);
}

export function getWorkSlugs() {
  return getWorkSlugsFromDb();
}

export function getArticleSummaries(
  locale: Locale,
): Promise<ArticleSummaryData[]> {
  return listArticleSummaries(locale);
}

export function getArticleDetail(
  locale: Locale,
  slug: string,
): Promise<ArticleDetailData | undefined> {
  return getArticleBySlug(locale, slug);
}

export async function getMoreArticleSummaries(
  locale: Locale,
  slug: string,
): Promise<ArticleSummaryData[]> {
  return (await getArticleSummaries(locale))
    .filter((item) => item.slug !== slug)
    .slice(0, 3);
}

export function getArticleSlugs() {
  return getArticleSlugsFromDb();
}
