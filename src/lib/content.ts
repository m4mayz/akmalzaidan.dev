import enDashboardsArticle from "../../data/en/articles/building-maintainable-dashboards.json";
import enItSupportArticle from "../../data/en/articles/practical-it-support-for-small-teams.json";
import enFullstackArticle from "../../data/en/articles/why-fullstack-context-matters.json";
import enHome from "../../data/en/home.json";
import enSite from "../../data/en/site.json";
import enApiIntegration from "../../data/en/work/api-integration.json";
import enCompanyProfile from "../../data/en/work/company-profile.json";
import enFreelanceWebApp from "../../data/en/work/freelance-web-app.json";
import enMaintenanceSystem from "../../data/en/work/maintenance-system.json";
import enPortfolioDashboard from "../../data/en/work/portfolio-dashboard.json";
import enSupportTools from "../../data/en/work/support-tools.json";
import idDashboardsArticle from "../../data/id/articles/building-maintainable-dashboards.json";
import idItSupportArticle from "../../data/id/articles/practical-it-support-for-small-teams.json";
import idFullstackArticle from "../../data/id/articles/why-fullstack-context-matters.json";
import idHome from "../../data/id/home.json";
import idSite from "../../data/id/site.json";
import idApiIntegration from "../../data/id/work/api-integration.json";
import idCompanyProfile from "../../data/id/work/company-profile.json";
import idFreelanceWebApp from "../../data/id/work/freelance-web-app.json";
import idMaintenanceSystem from "../../data/id/work/maintenance-system.json";
import idPortfolioDashboard from "../../data/id/work/portfolio-dashboard.json";
import idSupportTools from "../../data/id/work/support-tools.json";

import { withLocale } from "@/lib/i18n";
import type {
  ArticleContentData,
  ArticleDetailData,
  ArticleSummaryData,
  HomeData,
  Locale,
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

const workByLocale: Record<Locale, WorkContentData[]> = {
  en: [
    enPortfolioDashboard as WorkContentData,
    enMaintenanceSystem as WorkContentData,
    enCompanyProfile as WorkContentData,
    enSupportTools as WorkContentData,
    enApiIntegration as WorkContentData,
    enFreelanceWebApp as WorkContentData,
  ],
  id: [
    idPortfolioDashboard as WorkContentData,
    idMaintenanceSystem as WorkContentData,
    idCompanyProfile as WorkContentData,
    idSupportTools as WorkContentData,
    idApiIntegration as WorkContentData,
    idFreelanceWebApp as WorkContentData,
  ],
};

const articlesByLocale: Record<Locale, ArticleContentData[]> = {
  en: [
    enDashboardsArticle as ArticleContentData,
    enFullstackArticle as ArticleContentData,
    enItSupportArticle as ArticleContentData,
  ],
  id: [
    idDashboardsArticle as ArticleContentData,
    idFullstackArticle as ArticleContentData,
    idItSupportArticle as ArticleContentData,
  ],
};

export function getSiteData(locale: Locale) {
  return siteByLocale[locale];
}

export function getHomeData(locale: Locale) {
  return homeByLocale[locale];
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
