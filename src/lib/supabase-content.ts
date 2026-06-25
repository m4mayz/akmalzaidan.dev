import { withLocale } from "@/lib/i18n";
import { getSupabaseServiceClient } from "@/lib/supabase";
import type {
  ArticleContentData,
  ArticleDetailData,
  ArticleSummaryData,
  Locale,
  WorkContentData,
  WorkDetailData,
  WorkSummaryData,
} from "@/types/content";

export type PageId = "global" | "home" | "about" | "contact" | "privacy";

export type PageContentRow = {
  id: PageId;
  locale: Locale;
  data: unknown;
};

type Status = "draft" | "published";

type WorkRow = {
  id: number;
  locale: Locale;
  slug: string;
  status: Status;
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
  sections_json: unknown;
  gallery_json: unknown;
};

type ArticleRow = {
  id: number;
  locale: Locale;
  slug: string;
  status: Status;
  sort_order: number;
  title: string;
  description: string;
  image: string;
  alt: string;
  published_at: string;
  lead: string;
  blocks_json: unknown;
};

export type CmsContentType = "work" | "articles" | "pages";

export type CmsWorkInput = WorkContentData & {
  id?: number;
  locale: Locale;
  status: Status;
  sortOrder?: number;
};

export type CmsArticleInput = ArticleContentData & {
  id?: number;
  locale: Locale;
  status: Status;
  sortOrder?: number;
};

export type CmsPageInput = {
  locale: Locale;
  slug: string; // equals to PageId
  status: Status; // always 'published'
  data: unknown;
};

function parseJson<T>(value: unknown, fallback: T): T {
  if (Array.isArray(value) || (value && typeof value === "object")) {
    return value as T;
  }

  if (typeof value !== "string") return fallback;

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

function requireRows<T>(data: T[] | null, error: { message: string } | null) {
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listWork(
  locale: Locale,
  includeDrafts = false,
): Promise<WorkContentData[]> {
  let query = getSupabaseServiceClient()
    .from("works")
    .select("*")
    .eq("locale", locale)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: false });

  if (!includeDrafts) query = query.eq("status", "published");

  const { data, error } = await query;
  return requireRows(data as WorkRow[] | null, error).map(mapWork);
}

export async function listArticles(
  locale: Locale,
  includeDrafts = false,
): Promise<ArticleContentData[]> {
  let query = getSupabaseServiceClient()
    .from("articles")
    .select("*")
    .eq("locale", locale)
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false })
    .order("id", { ascending: false });

  if (!includeDrafts) query = query.eq("status", "published");

  const { data, error } = await query;
  return requireRows(data as ArticleRow[] | null, error).map(mapArticle);
}

export async function getWorkBySlug(
  locale: Locale,
  slug: string,
): Promise<WorkDetailData | undefined> {
  const item = (await listWork(locale)).find((work) => work.slug === slug);
  return item
    ? { ...item, href: withLocale(`/work/${item.slug}`, locale) }
    : undefined;
}

export async function getArticleBySlug(
  locale: Locale,
  slug: string,
): Promise<ArticleDetailData | undefined> {
  const item = (await listArticles(locale)).find((article) => article.slug === slug);
  return item
    ? { ...item, href: withLocale(`/articles/${item.slug}`, locale) }
    : undefined;
}

export async function listWorkSummaries(
  locale: Locale,
): Promise<WorkSummaryData[]> {
  return (await listWork(locale)).map((item) => ({
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

export async function listArticleSummaries(
  locale: Locale,
): Promise<ArticleSummaryData[]> {
  return (await listArticles(locale)).map((item) => ({
    slug: item.slug,
    title: item.title,
    description: item.description,
    href: withLocale(`/articles/${item.slug}`, locale),
    image: item.image,
    alt: item.alt,
    publishedAt: item.publishedAt,
  }));
}

export async function getWorkSlugsFromDb() {
  return (await listWork("en")).map((item) => item.slug);
}

export async function getArticleSlugsFromDb() {
  return (await listArticles("en")).map((item) => item.slug);
}

export async function listCmsContent(type: CmsContentType, locale: Locale) {
  if (type === "work") {
    const { data, error } = await getSupabaseServiceClient()
      .from("works")
      .select("*")
      .eq("locale", locale)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: false });

    return requireRows(data as WorkRow[] | null, error).map(mapCmsWork);
  }

  if (type === "pages") {
    const { data, error } = await getSupabaseServiceClient()
      .from("page_content")
      .select("*")
      .eq("locale", locale);

    return requireRows(data as PageContentRow[] | null, error).map((row) => ({
      locale: row.locale,
      slug: row.id,
      status: "published" as Status,
      data: row.data,
    } satisfies CmsPageInput));
  }

  const { data, error } = await getSupabaseServiceClient()
    .from("articles")
    .select("*")
    .eq("locale", locale)
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false })
    .order("id", { ascending: false });

  return requireRows(data as ArticleRow[] | null, error).map(mapCmsArticle);
}

export async function upsertWork(input: CmsWorkInput) {
  const { error } = await getSupabaseServiceClient().from("works").upsert(
    {
      locale: input.locale,
      slug: input.slug,
      status: input.status,
      sort_order: input.sortOrder ?? 0,
      title: input.title,
      year: input.year,
      description: input.description,
      image: input.image,
      alt: input.alt,
      category: input.category,
      role: input.role,
      client: input.client,
      summary: input.summary,
      sections_json: input.sections,
      gallery_json: input.gallery,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "locale,slug" },
  );

  if (error) throw new Error(error.message);
}

export async function upsertArticle(input: CmsArticleInput) {
  const { error } = await getSupabaseServiceClient().from("articles").upsert(
    {
      locale: input.locale,
      slug: input.slug,
      status: input.status,
      sort_order: input.sortOrder ?? 0,
      title: input.title,
      description: input.description,
      image: input.image,
      alt: input.alt,
      published_at: input.publishedAt,
      lead: input.lead,
      blocks_json: input.blocks,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "locale,slug" },
  );

  if (error) throw new Error(error.message);
}

export async function deleteCmsContent(
  type: CmsContentType,
  locale: Locale,
  slug: string,
) {
  const { error } = await getSupabaseServiceClient()
    .from(type === "work" ? "works" : "articles")
    .delete()
    .eq("locale", locale)
    .eq("slug", slug);

  if (error) throw new Error(error.message);
}

export async function reorderContent(
  type: CmsContentType,
  slugs: string[],
) {
  const table = type === "work" ? "works" : "articles";
  const supabase = getSupabaseServiceClient();

  for (let i = 0; i < slugs.length; i++) {
    const { error } = await supabase
      .from(table)
      .update({ sort_order: i, updated_at: new Date().toISOString() })
      .eq("slug", slugs[i]);

    if (error) throw new Error(error.message);
  }
}

export async function getPageContent<T>(
  id: PageId,
  locale: Locale,
): Promise<Partial<T>> {
  const { data, error } = await getSupabaseServiceClient()
    .from("page_content")
    .select("data")
    .eq("id", id)
    .eq("locale", locale)
    .single();

  if (error || !data) {
    return {} as Partial<T>;
  }

  return parseJson<Partial<T>>(data.data, {});
}

export async function upsertPageContent(input: CmsPageInput) {
  const { error } = await getSupabaseServiceClient().from("page_content").upsert(
    {
      id: input.slug,
      locale: input.locale,
      data: input.data,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id,locale" },
  );

  if (error) throw new Error(error.message);
}
