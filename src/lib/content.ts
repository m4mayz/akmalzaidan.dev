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

import { withLocale } from "@/lib/i18n";
import type {
  AboutData,
  ArticleContentData,
  ArticleDetailData,
  ArticleSummaryData,
  ContactData,
  HomeData,
  Locale,
  PrivacyData,
  SiteData,
  WorkContentData,
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

const workByLocale: Record<Locale, WorkContentData[]> = {
  en: [],
  id: [],
};

const articlesByLocale: Record<Locale, ArticleContentData[]> = {
  en: [],
  id: [],
};

export function getSiteData(locale: Locale) {
  return siteByLocale[locale];
}

export function getHomeData(locale: Locale) {
  return homeByLocale[locale];
}

export function getAboutData(locale: Locale) {
  return aboutByLocale[locale];
}

export function getContactData(locale: Locale) {
  return contactByLocale[locale];
}

export function getPrivacyData(locale: Locale) {
  return privacyByLocale[locale];
}

export function getWorkSummaries(locale: Locale): WorkSummaryData[] {
  return workByLocale[locale].map((item) => ({
    slug: item.slug,
    title: item.title,
    year: item.year,
    description: item.description,
    href: withLocale(`/work/${item.slug}`, locale),
    image: item.image,
    alt: item.alt,
    category: item.category,
  }));
}

export function getWorkDetail(
  locale: Locale,
  slug: string,
): WorkDetailData | undefined {
  const item = workByLocale[locale].find((work) => work.slug === slug);

  if (!item) {
    return undefined;
  }

  return {
    ...item,
    href: withLocale(`/work/${item.slug}`, locale),
  };
}

export function getMoreWorkSummaries(
  locale: Locale,
  slug: string,
): WorkSummaryData[] {
  const items = getWorkSummaries(locale);
  const index = items.findIndex((item) => item.slug === slug);
  const orderedItems =
    index === -1
      ? items
      : [...items.slice(index + 1), ...items.slice(0, index)];

  return orderedItems.filter((item) => item.slug !== slug).slice(0, 3);
}

export function getWorkSlugs() {
  return workByLocale.en.map((item) => item.slug);
}

export function getArticleSummaries(locale: Locale): ArticleSummaryData[] {
  return articlesByLocale[locale].map((item) => ({
    slug: item.slug,
    title: item.title,
    description: item.description,
    href: withLocale(`/articles/${item.slug}`, locale),
    image: item.image,
    alt: item.alt,
    publishedAt: item.publishedAt,
  }));
}

export function getArticleDetail(
  locale: Locale,
  slug: string,
): ArticleDetailData | undefined {
  const item = articlesByLocale[locale].find((article) => article.slug === slug);

  if (!item) {
    return undefined;
  }

  return {
    ...item,
    href: withLocale(`/articles/${item.slug}`, locale),
  };
}

export function getMoreArticleSummaries(
  locale: Locale,
  slug: string,
): ArticleSummaryData[] {
  return getArticleSummaries(locale)
    .filter((item) => item.slug !== slug)
    .slice(0, 3);
}

export function getArticleSlugs() {
  return articlesByLocale.en.map((item) => item.slug);
}
