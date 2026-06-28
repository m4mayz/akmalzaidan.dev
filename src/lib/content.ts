import enAbout from "../../data/en/about.json";
import enContact from "../../data/en/contact.json";
import enHome from "../../data/en/home.json";
import enPrivacy from "../../data/en/privacy.json";
import enSite from "../../data/en/site.json";
import idAbout from "../../data/id/about.json";
import idContact from "../../data/id/contact.json";
import idHome from "../../data/id/home.json";
import idPrivacy from "../../data/id/privacy.json";
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

const homeByLocale: Record<Locale, HomeData> = {
  en: enHome as HomeData,
  id: idHome as HomeData,
};

const aboutByLocale: Record<Locale, AboutData> = {
  en: enAbout as AboutData,
  id: idAbout as AboutData,
};

const contactByLocale: Record<Locale, ContactData> = {
  en: enContact as ContactData,
  id: idContact as ContactData,
};

const privacyByLocale: Record<Locale, PrivacyData> = {
  en: enPrivacy as PrivacyData,
  id: idPrivacy as PrivacyData,
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
  const localData = homeByLocale[locale];
  const dynamic = await getPageContent<HomeData>("home", locale);
  return {
    ...localData,
    ...dynamic,
    hero: { ...localData.hero, ...dynamic.hero },
    stats: dynamic.stats ?? localData.stats,
    services: dynamic.services ?? localData.services,
    testimonials: dynamic.testimonials ?? localData.testimonials,
  };
}

export async function getAboutData(locale: Locale): Promise<AboutData> {
  const localData = aboutByLocale[locale];
  const dynamic = await getPageContent<AboutData>("about", locale);
  return {
    ...localData,
    ...dynamic,
    intro: dynamic.intro ?? localData.intro,
    philosophy: dynamic.philosophy ?? localData.philosophy,
    experiences: dynamic.experiences ?? localData.experiences,
    education: dynamic.education ?? localData.education,
    skills: dynamic.skills ?? localData.skills,
    tools: dynamic.tools ?? localData.tools,
    beyond: dynamic.beyond ?? localData.beyond,
    images: dynamic.images ?? localData.images,
  };
}

export async function getContactData(locale: Locale): Promise<ContactData> {
  const localData = contactByLocale[locale];
  const dynamic = await getPageContent<ContactData>("contact", locale);
  return {
    ...localData,
    ...dynamic,
    labels: { ...localData.labels, ...dynamic.labels },
    placeholders: { ...localData.placeholders, ...dynamic.placeholders },
  };
}

export async function getPrivacyData(locale: Locale): Promise<PrivacyData> {
  const localData = privacyByLocale[locale];
  const dynamic = await getPageContent<PrivacyData>("privacy", locale);
  return {
    ...localData,
    ...dynamic,
    sections: dynamic.sections ?? localData.sections,
  };
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
