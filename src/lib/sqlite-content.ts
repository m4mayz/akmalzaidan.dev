import { existsSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

import { withLocale } from "@/lib/i18n";
import type {
  ArticleContentData,
  ArticleDetailData,
  ArticleSummaryData,
  Locale,
  WorkContentData,
  WorkDetailData,
  WorkSummaryData,
} from "@/types/content";

const dbPath = path.join(process.cwd(), "data", "content.sqlite");

type WorkRow = {
  id: number;
  locale: Locale;
  slug: string;
  status: "draft" | "published";
  sort_order: number;
  title: string;
  year: string;
  description: string;
  image: string;
  alt: string;
  category: string;
  role: string;
  client: string;
  summary: string;
  sections_json: string;
  gallery_json: string;
};

type ArticleRow = {
  id: number;
  locale: Locale;
  slug: string;
  status: "draft" | "published";
  sort_order: number;
  title: string;
  description: string;
  image: string;
  alt: string;
  published_at: string;
  lead: string;
  blocks_json: string;
};

export type CmsContentType = "work" | "articles";

function getDb() {
  if (!existsSync(dbPath)) {
    throw new Error(
      "Missing data/content.sqlite. Run node scripts/init-content-db.mjs",
    );
  }

  return new DatabaseSync(dbPath);
}

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function mapWork(row: WorkRow): WorkContentData {
  return {
    slug: row.slug,
    title: row.title,
    year: row.year,
    description: row.description,
    image: row.image,
    alt: row.alt,
    category: row.category,
    role: row.role,
    client: row.client,
    summary: row.summary,
    sections: parseJson(row.sections_json, []),
    gallery: parseJson(row.gallery_json, []),
  };
}

function mapArticle(row: ArticleRow): ArticleContentData {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    image: row.image,
    alt: row.alt,
    publishedAt: row.published_at,
    lead: row.lead,
    blocks: parseJson(row.blocks_json, []),
  };
}

export function listWork(
  locale: Locale,
  includeDrafts = false,
): WorkContentData[] {
  const db = getDb();
  const rows = db
    .prepare(`
      SELECT * FROM works
      WHERE locale = ? AND (? = 1 OR status = 'published')
      ORDER BY sort_order ASC, id DESC
    `)
    .all(locale, includeDrafts ? 1 : 0) as WorkRow[];
  db.close();
  return rows.map(mapWork);
}

export function listArticles(
  locale: Locale,
  includeDrafts = false,
): ArticleContentData[] {
  const db = getDb();
  const rows = db
    .prepare(`
      SELECT * FROM articles
      WHERE locale = ? AND (? = 1 OR status = 'published')
      ORDER BY sort_order ASC, published_at DESC, id DESC
    `)
    .all(locale, includeDrafts ? 1 : 0) as ArticleRow[];
  db.close();
  return rows.map(mapArticle);
}

export function getWorkBySlug(
  locale: Locale,
  slug: string,
): WorkDetailData | undefined {
  const item = listWork(locale).find((work) => work.slug === slug);
  return item
    ? { ...item, href: withLocale(`/work/${item.slug}`, locale) }
    : undefined;
}

export function getArticleBySlug(
  locale: Locale,
  slug: string,
): ArticleDetailData | undefined {
  const item = listArticles(locale).find((article) => article.slug === slug);
  return item
    ? { ...item, href: withLocale(`/articles/${item.slug}`, locale) }
    : undefined;
}

export function listWorkSummaries(locale: Locale): WorkSummaryData[] {
  return listWork(locale).map((item) => ({
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

export function listArticleSummaries(locale: Locale): ArticleSummaryData[] {
  return listArticles(locale).map((item) => ({
    slug: item.slug,
    title: item.title,
    description: item.description,
    href: withLocale(`/articles/${item.slug}`, locale),
    image: item.image,
    alt: item.alt,
    publishedAt: item.publishedAt,
  }));
}

export function getWorkSlugsFromDb() {
  return listWork("en").map((item) => item.slug);
}

export function getArticleSlugsFromDb() {
  return listArticles("en").map((item) => item.slug);
}
