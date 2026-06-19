import enHome from "../../data/en/home.json";
import enSite from "../../data/en/site.json";
import idHome from "../../data/id/home.json";
import idSite from "../../data/id/site.json";

import type { HomeData, Locale, SiteData } from "@/types/content";

const siteByLocale: Record<Locale, SiteData> = {
  en: enSite as SiteData,
  id: idSite as SiteData,
};

const homeByLocale: Record<Locale, HomeData> = {
  en: enHome as HomeData,
  id: idHome as HomeData,
};

export function getSiteData(locale: Locale) {
  return siteByLocale[locale];
}

export function getHomeData(locale: Locale) {
  return homeByLocale[locale];
}
