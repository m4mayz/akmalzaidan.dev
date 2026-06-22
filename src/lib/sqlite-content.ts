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

export type CmsWorkInput = WorkContentData & {
  id?: number;
  locale: Locale;
  status: "draft" | "published";
  sortOrder?: number;
};

export type CmsArticleInput = ArticleContentData & {
  id?: number;
  locale: Locale;
  status: "draft" | "published";
  sortOrder?: number;
};

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

function mapCmsWork(row: WorkRow): CmsWorkInput {
  return {
    ...mapWork(row),
    id: row.id,
    locale: row.locale,
    status: row.status,
    sortOrder: row.sort_order,
  };
}

function mapCmsArticle(row: ArticleRow): CmsArticleInput {
  return {
    ...mapArticle(row),
    id: row.id,
    locale: row.locale,
    status: row.status,
    sortOrder: row.sort_order,
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

export function listCmsContent(type: CmsContentType, locale: Locale) {
  const db = getDb();

  if (type === "work") {
    const rows = db
      .prepare(`
        SELECT * FROM works
        WHERE locale = ?
        ORDER BY sort_order ASC, id DESC
      `)
      .all(locale) as WorkRow[];
    db.close();
    return rows.map(mapCmsWork);
  }

  const rows = db
    .prepare(`
      SELECT * FROM articles
      WHERE locale = ?
      ORDER BY sort_order ASC, published_at DESC, id DESC
    `)
    .all(locale) as ArticleRow[];
  db.close();
  return rows.map(mapCmsArticle);
}

export function upsertWork(input: CmsWorkInput) {
  const db = getDb();
  db.prepare(`
    INSERT INTO works (
      locale, slug, status, sort_order, title, year, description, image, alt,
      category, role, client, summary, sections_json, gallery_json, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(locale, slug) DO UPDATE SET
      status = excluded.status,
      sort_order = excluded.sort_order,
      title = excluded.title,
      year = excluded.year,
      description = excluded.description,
      image = excluded.image,
      alt = excluded.alt,
      category = excluded.category,
      role = excluded.role,
      client = excluded.client,
      summary = excluded.summary,
      sections_json = excluded.sections_json,
      gallery_json = excluded.gallery_json,
      updated_at = CURRENT_TIMESTAMP
  `).run(
    input.locale,
    input.slug,
    input.status,
    input.sortOrder ?? 0,
    input.title,
    input.year,
    input.description,
    input.image,
    input.alt,
    input.category,
    input.role,
    input.client,
    input.summary,
    JSON.stringify(input.sections),
    JSON.stringify(input.gallery),
  );
  db.close();
}

export function upsertArticle(input: CmsArticleInput) {
  const db = getDb();
  db.prepare(`
    INSERT INTO articles (
      locale, slug, status, sort_order, title, description, image, alt,
      published_at, lead, blocks_json, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(locale, slug) DO UPDATE SET
      status = excluded.status,
      sort_order = excluded.sort_order,
      title = excluded.title,
      description = excluded.description,
      image = excluded.image,
      alt = excluded.alt,
      published_at = excluded.published_at,
      lead = excluded.lead,
      blocks_json = excluded.blocks_json,
      updated_at = CURRENT_TIMESTAMP
  `).run(
    input.locale,
    input.slug,
    input.status,
    input.sortOrder ?? 0,
    input.title,
    input.description,
    input.image,
    input.alt,
    input.publishedAt,
    input.lead,
    JSON.stringify(input.blocks),
  );
  db.close();
}

export function deleteCmsContent(
  type: CmsContentType,
  locale: Locale,
  slug: string,
) {
  const db = getDb();
  db.prepare(
    type === "work"
      ? "DELETE FROM works WHERE locale = ? AND slug = ?"
      : "DELETE FROM articles WHERE locale = ? AND slug = ?",
  ).run(locale, slug);
  db.close();
}
