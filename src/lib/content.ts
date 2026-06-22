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
} from "@/lib/sqlite-content";
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
  return listWorkSummaries(locale);
}

export function getWorkDetail(
  locale: Locale,
  slug: string,
): WorkDetailData | undefined {
  return getWorkBySlug(locale, slug);
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
  return getWorkSlugsFromDb();
}

export function getArticleSummaries(locale: Locale): ArticleSummaryData[] {
  return listArticleSummaries(locale);
}

export function getArticleDetail(
  locale: Locale,
  slug: string,
): ArticleDetailData | undefined {
  return getArticleBySlug(locale, slug);
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
  return getArticleSlugsFromDb();
}
