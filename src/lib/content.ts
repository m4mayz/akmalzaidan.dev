import enHome from "../../data/en/home.json";
import enSite from "../../data/en/site.json";
import enApiIntegration from "../../data/en/work/api-integration.json";
import enCompanyProfile from "../../data/en/work/company-profile.json";
import enFreelanceWebApp from "../../data/en/work/freelance-web-app.json";
import enMaintenanceSystem from "../../data/en/work/maintenance-system.json";
import enPortfolioDashboard from "../../data/en/work/portfolio-dashboard.json";
import enSupportTools from "../../data/en/work/support-tools.json";
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

const articleSummariesByLocale: Record<
  Locale,
  Omit<ArticleSummaryData, "href">[]
> = {
  en: [
    {
      slug: "building-maintainable-dashboards",
      title: "Building dashboards that stay maintainable",
      description:
        "Notes on structuring dashboard interfaces so data, filters, and repeated workflows stay understandable over time.",
      image: "/seo/og.png",
      alt: "Maintainable dashboard article placeholder",
      publishedAt: "2026-06-20",
    },
    {
      slug: "why-fullstack-context-matters",
      title: "Why fullstack context matters when building products",
      description:
        "How understanding frontend, backend, and operations helps product decisions stay grounded and practical.",
      image: "/seo/og.png",
      alt: "Fullstack context article placeholder",
      publishedAt: "2026-06-20",
    },
    {
      slug: "practical-it-support-for-small-teams",
      title: "Practical IT support for small teams",
      description:
        "A practical look at troubleshooting, setup, and technical support habits that keep small teams moving.",
      image: "/seo/og.png",
      alt: "Practical IT support article placeholder",
      publishedAt: "2026-06-20",
    },
  ],
  id: [
    {
      slug: "building-maintainable-dashboards",
      title: "Membangun dashboard yang tetap mudah dirawat",
      description:
        "Catatan tentang menyusun interface dashboard agar data, filter, dan workflow harian tetap mudah dipahami.",
      image: "/seo/og.png",
      alt: "Placeholder artikel dashboard yang mudah dirawat",
      publishedAt: "2026-06-20",
    },
    {
      slug: "why-fullstack-context-matters",
      title: "Kenapa konteks fullstack penting saat membangun produk",
      description:
        "Bagaimana pemahaman frontend, backend, dan operasional membantu keputusan produk tetap praktis.",
      image: "/seo/og.png",
      alt: "Placeholder artikel konteks fullstack",
      publishedAt: "2026-06-20",
    },
    {
      slug: "practical-it-support-for-small-teams",
      title: "Bantuan teknis IT yang praktis untuk tim kecil",
      description:
        "Pandangan praktis tentang troubleshooting, setup, dan kebiasaan support teknis untuk tim kecil.",
      image: "/seo/og.png",
      alt: "Placeholder artikel bantuan teknis IT",
      publishedAt: "2026-06-20",
    },
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
  return articleSummariesByLocale[locale].map((item) => ({
    ...item,
    href: withLocale(`/articles/${item.slug}`, locale),
  }));
}
