import enHome from "../../data/en/home.json";
import enSite from "../../data/en/site.json";
import idHome from "../../data/id/home.json";
import idSite from "../../data/id/site.json";

import { withLocale } from "@/lib/i18n";
import type {
  ArticleSummaryData,
  HomeData,
  Locale,
  SiteData,
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

const workSummariesByLocale: Record<Locale, Omit<WorkSummaryData, "href">[]> = {
  en: [
    {
      slug: "portfolio-dashboard",
      title: "Portfolio Dashboard",
      year: "2026",
      description:
        "A focused dashboard concept for presenting projects, metrics, and portfolio content in a clear operational view.",
      image: "/seo/og.png",
      alt: "Portfolio dashboard placeholder interface",
      category: "Dashboard, Frontend, Data UI",
    },
    {
      slug: "maintenance-system",
      title: "Maintenance Operations System",
      year: "2026",
      description:
        "A workflow-oriented web application concept for maintenance reporting, review, and operational coordination.",
      image: "/seo/og.png",
      alt: "Maintenance operations system placeholder interface",
      category: "Fullstack Web App, Dashboard, Workflow",
    },
    {
      slug: "company-profile",
      title: "Company Profile Website",
      year: "2026",
      description:
        "A responsive website structure for presenting a business, its services, and key contact paths with strong clarity.",
      image: "/seo/og.png",
      alt: "Company profile website placeholder interface",
      category: "Web Development, Frontend",
    },
  ],
  id: [
    {
      slug: "portfolio-dashboard",
      title: "Dashboard Portofolio",
      year: "2026",
      description:
        "Konsep dashboard untuk menampilkan proyek, metrik, dan konten portofolio dalam tampilan operasional yang jelas.",
      image: "/seo/og.png",
      alt: "Placeholder interface dashboard portofolio",
      category: "Dashboard, Frontend, Data UI",
    },
    {
      slug: "maintenance-system",
      title: "Sistem Operasional Maintenance",
      year: "2026",
      description:
        "Konsep aplikasi web berbasis workflow untuk pelaporan maintenance, review, dan koordinasi operasional.",
      image: "/seo/og.png",
      alt: "Placeholder interface sistem operasional maintenance",
      category: "Fullstack Web App, Dashboard, Workflow",
    },
    {
      slug: "company-profile",
      title: "Website Company Profile",
      year: "2026",
      description:
        "Struktur website responsif untuk menampilkan bisnis, layanan, dan jalur kontak utama dengan jelas.",
      image: "/seo/og.png",
      alt: "Placeholder interface website company profile",
      category: "Web Development, Frontend",
    },
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
  return workSummariesByLocale[locale].map((item) => ({
    ...item,
    href: withLocale(`/work/${item.slug}`, locale),
  }));
}

export function getArticleSummaries(locale: Locale): ArticleSummaryData[] {
  return articleSummariesByLocale[locale].map((item) => ({
    ...item,
    href: withLocale(`/articles/${item.slug}`, locale),
  }));
}
