import type { Locale } from "@/types/content";

export const defaultLocale: Locale = "en";
export const locales = ["en", "id"] as const;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function withLocale(path: string, locale: Locale) {
  if (locale === defaultLocale) {
    return path;
  }

  if (path === "/") {
    return "/id";
  }

  return `/id${path}`;
}

export function withoutLocale(path: string) {
  if (path === "/id") {
    return "/";
  }

  if (path.startsWith("/id/")) {
    return path.slice(3) || "/";
  }

  return path;
}

export function getAlternateLocalePath(path: string, targetLocale: Locale) {
  return withLocale(withoutLocale(path), targetLocale);
}
