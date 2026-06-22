# SQLite Content CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace work/article JSON management with a local SQLite content database and a dev-only CMS page.

**Architecture:** SQLite is treated as a committed content file, not a production write database. Local dev writes to `data/content.sqlite`; Vercel reads that file during build and statically generates public pages. The CMS is guarded by `process.env.NODE_ENV === "development"` and returns 404 outside dev.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Node `node:sqlite`, native form controls, existing Tailwind styles.

---

## File Structure

- Create `data/content.sqlite`  
  The committed SQLite content file for work and article records.

- Create `scripts/init-content-db.mjs`  
  Creates `data/content.sqlite` and the two content tables. This is the only script needed to bootstrap the DB.

- Create `src/lib/sqlite-content.ts`  
  Server-side SQLite read/write helper. Owns schema assumptions, row mapping, slug lookup, and CMS mutations.

- Modify `src/lib/content.ts`  
  Keep site/about/home/contact/privacy JSON imports. Replace work/article in-memory arrays with calls into `sqlite-content.ts`.

- Modify `src/app/page.tsx`, `src/app/id/page.tsx`, `src/app/work/page.tsx`, `src/app/id/work/page.tsx`, `src/app/articles/page.tsx`, `src/app/id/articles/page.tsx`  
  Export `dynamic = "force-static"` so public listing pages are generated at build.

- Modify `src/app/work/[slug]/page.tsx`, `src/app/id/work/[slug]/page.tsx`, `src/app/articles/[slug]/page.tsx`, `src/app/id/articles/[slug]/page.tsx`  
  Export `dynamic = "force-static"` and `dynamicParams = false`; keep `generateStaticParams()` from SQLite slugs.

- Create `src/app/cms/page.tsx`  
  Dev-only CMS route. Calls `notFound()` outside `NODE_ENV=development`.

- Create `src/components/cms/content-cms.tsx`  
  Client CMS UI for listing, creating, editing, deleting, draft/publish toggles, and simple asset upload.

- Create `src/app/api/cms/content/route.ts`  
  Dev-only API for list/upsert/delete for both work and article.

- Create `src/app/api/cms/upload/route.ts`  
  Dev-only API for writing uploaded images into `public/images/work/<slug>/` or `public/images/articles/<slug>/`.

- Modify `docs/content/work-and-article-guide.md`  
  Replace JSON-template instructions with SQLite CMS workflow.

- Delete `data/templates/article.en.json`, `data/templates/article.id.json`, `data/templates/work.en.json`, `data/templates/work.id.json`  
  Templates are no longer needed after CMS exists.

---

### Task 1: Bootstrap SQLite Content Database

**Files:**
- Create: `scripts/init-content-db.mjs`
- Generate: `data/content.sqlite`

- [ ] **Step 1: Create the init script**

Create `scripts/init-content-db.mjs`:

```js
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dbPath = join(root, "data", "content.sqlite");

mkdirSync(dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS works (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    locale TEXT NOT NULL CHECK (locale IN ('en', 'id')),
    slug TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    title TEXT NOT NULL DEFAULT '',
    year TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    alt TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT '',
    client TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    sections_json TEXT NOT NULL DEFAULT '[]',
    gallery_json TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(locale, slug)
  ) STRICT;

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    locale TEXT NOT NULL CHECK (locale IN ('en', 'id')),
    slug TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    title TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    alt TEXT NOT NULL DEFAULT '',
    published_at TEXT NOT NULL DEFAULT '',
    lead TEXT NOT NULL DEFAULT '',
    blocks_json TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(locale, slug)
  ) STRICT;
`);

db.close();
console.log(`SQLite content DB ready: ${dbPath}`);
```

- [ ] **Step 2: Run the script**

Run:

```bash
node scripts/init-content-db.mjs
```

Expected:

```text
SQLite content DB ready: E:\APROJECT\akmalzaidan.dev\data\content.sqlite
```

- [ ] **Step 3: Commit**

```bash
git add scripts/init-content-db.mjs data/content.sqlite
git commit -m "feat: add sqlite content database"
```

---

### Task 2: Add SQLite Content Helper

**Files:**
- Create: `src/lib/sqlite-content.ts`
- Modify: `src/lib/content.ts`

- [ ] **Step 1: Create `src/lib/sqlite-content.ts`**

Create the helper with this shape:

```ts
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
    throw new Error("Missing data/content.sqlite. Run node scripts/init-content-db.mjs");
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

export function listWork(locale: Locale, includeDrafts = false): WorkContentData[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT * FROM works
    WHERE locale = ? AND (? = 1 OR status = 'published')
    ORDER BY sort_order ASC, id DESC
  `).all(locale, includeDrafts ? 1 : 0) as WorkRow[];
  db.close();
  return rows.map(mapWork);
}

export function listArticles(locale: Locale, includeDrafts = false): ArticleContentData[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT * FROM articles
    WHERE locale = ? AND (? = 1 OR status = 'published')
    ORDER BY sort_order ASC, published_at DESC, id DESC
  `).all(locale, includeDrafts ? 1 : 0) as ArticleRow[];
  db.close();
  return rows.map(mapArticle);
}

export function getWorkBySlug(locale: Locale, slug: string): WorkDetailData | undefined {
  const item = listWork(locale).find((work) => work.slug === slug);
  return item ? { ...item, href: withLocale(`/work/${item.slug}`, locale) } : undefined;
}

export function getArticleBySlug(locale: Locale, slug: string): ArticleDetailData | undefined {
  const item = listArticles(locale).find((article) => article.slug === slug);
  return item ? { ...item, href: withLocale(`/articles/${item.slug}`, locale) } : undefined;
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
```

- [ ] **Step 2: Wire `src/lib/content.ts` into the helper**

Change only the work/article functions in `src/lib/content.ts`:

```ts
import {
  getArticleBySlug,
  getArticleSlugsFromDb,
  getWorkBySlug,
  getWorkSlugsFromDb,
  listArticleSummaries,
  listWorkSummaries,
} from "@/lib/sqlite-content";
```

Then replace the current work/article functions with:

```ts
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
```

- [ ] **Step 3: Run typecheck**

Run:

```bash
npm run typecheck
```

Expected:

```text
tsc --noEmit
```

No TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/sqlite-content.ts src/lib/content.ts
git commit -m "feat: read portfolio content from sqlite"
```

---

### Task 3: Force Public Content Pages to Static Build

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/id/page.tsx`
- Modify: `src/app/work/page.tsx`
- Modify: `src/app/id/work/page.tsx`
- Modify: `src/app/articles/page.tsx`
- Modify: `src/app/id/articles/page.tsx`
- Modify: `src/app/work/[slug]/page.tsx`
- Modify: `src/app/id/work/[slug]/page.tsx`
- Modify: `src/app/articles/[slug]/page.tsx`
- Modify: `src/app/id/articles/[slug]/page.tsx`

- [ ] **Step 1: Add static export to listing pages**

At the top level of each listing page file, add:

```ts
export const dynamic = "force-static";
```

- [ ] **Step 2: Add static exports to dynamic slug pages**

At the top level of each `[slug]/page.tsx`, add:

```ts
export const dynamic = "force-static";
export const dynamicParams = false;
```

- [ ] **Step 3: Run build**

Run:

```bash
npm run build
```

Expected: build finishes. With an empty DB, `/work/[slug]` and `/articles/[slug]` generate no slug pages.

- [ ] **Step 4: Commit**

```bash
git add src/app
git commit -m "feat: statically build sqlite content pages"
```

---

### Task 4: Add Dev-Only CMS Data API

**Files:**
- Modify: `src/lib/sqlite-content.ts`
- Create: `src/app/api/cms/content/route.ts`

- [ ] **Step 1: Add CMS mutation helpers to `src/lib/sqlite-content.ts`**

Append these exports:

```ts
export type CmsWorkInput = Omit<WorkContentData, "href"> & {
  id?: number;
  locale: Locale;
  status: "draft" | "published";
  sortOrder?: number;
};

export type CmsArticleInput = Omit<ArticleContentData, "href"> & {
  id?: number;
  locale: Locale;
  status: "draft" | "published";
  sortOrder?: number;
};

export function listCmsContent(type: CmsContentType, locale: Locale) {
  if (type === "work") {
    return listWork(locale, true);
  }

  return listArticles(locale, true);
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

export function deleteCmsContent(type: CmsContentType, locale: Locale, slug: string) {
  const db = getDb();
  db.prepare(
    type === "work"
      ? "DELETE FROM works WHERE locale = ? AND slug = ?"
      : "DELETE FROM articles WHERE locale = ? AND slug = ?",
  ).run(locale, slug);
  db.close();
}
```

- [ ] **Step 2: Create `src/app/api/cms/content/route.ts`**

```ts
import {
  deleteCmsContent,
  listCmsContent,
  type CmsContentType,
  upsertArticle,
  upsertWork,
} from "@/lib/sqlite-content";
import type { Locale } from "@/types/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function devOnly() {
  return process.env.NODE_ENV === "development";
}

function notFoundResponse() {
  return new Response("Not found", { status: 404 });
}

function parseType(value: string | null): CmsContentType {
  return value === "articles" ? "articles" : "work";
}

function parseLocale(value: string | null): Locale {
  return value === "id" ? "id" : "en";
}

export function GET(request: Request) {
  if (!devOnly()) return notFoundResponse();

  const url = new URL(request.url);
  const type = parseType(url.searchParams.get("type"));
  const locale = parseLocale(url.searchParams.get("locale"));

  return Response.json({ items: listCmsContent(type, locale) });
}

export async function POST(request: Request) {
  if (!devOnly()) return notFoundResponse();

  const body = await request.json();
  if (body.type === "articles") {
    upsertArticle(body.item);
  } else {
    upsertWork(body.item);
  }

  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!devOnly()) return notFoundResponse();

  const body = await request.json();
  deleteCmsContent(parseType(body.type), parseLocale(body.locale), body.slug);

  return Response.json({ ok: true });
}
```

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

Expected: no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/sqlite-content.ts src/app/api/cms/content/route.ts
git commit -m "feat: add dev cms content api"
```

---

### Task 5: Add Dev-Only Asset Upload API

**Files:**
- Create: `src/app/api/cms/upload/route.ts`

- [ ] **Step 1: Create upload route**

```ts
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function devOnly() {
  return process.env.NODE_ENV === "development";
}

function cleanSegment(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
}

export async function POST(request: Request) {
  if (!devOnly()) {
    return new Response("Not found", { status: 404 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const type = form.get("type") === "articles" ? "articles" : "work";
  const slug = cleanSegment(String(form.get("slug") ?? ""));

  if (!(file instanceof File) || !slug) {
    return Response.json({ error: "Missing file or slug" }, { status: 400 });
  }

  const safeName = cleanSegment(file.name.replace(/\.[^.]+$/, ""));
  const ext = path.extname(file.name).toLowerCase() || ".webp";
  const directory = path.join(process.cwd(), "public", "images", type, slug);
  const fileName = `${safeName}${ext}`;
  const outputPath = path.join(directory, fileName);

  await mkdir(directory, { recursive: true });
  await writeFile(outputPath, Buffer.from(await file.arrayBuffer()));

  return Response.json({
    src: `/images/${type}/${slug}/${fileName}`,
  });
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/cms/upload/route.ts
git commit -m "feat: add dev cms asset upload"
```

---

### Task 6: Add CMS UI

**Files:**
- Create: `src/app/cms/page.tsx`
- Create: `src/components/cms/content-cms.tsx`

- [ ] **Step 1: Create `src/app/cms/page.tsx`**

```tsx
import { notFound } from "next/navigation";

import { ContentCms } from "@/components/cms/content-cms";

export const dynamic = "force-dynamic";

export default function CmsPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return <ContentCms />;
}
```

- [ ] **Step 2: Create `src/components/cms/content-cms.tsx`**

The initial UI should be one client component with:

```tsx
"use client";

import { useEffect, useState } from "react";

import type { ArticleContentData, Locale, WorkContentData } from "@/types/content";

type ContentType = "work" | "articles";
type Status = "draft" | "published";

type CmsWork = WorkContentData & {
  locale: Locale;
  status: Status;
  sortOrder?: number;
};

type CmsArticle = ArticleContentData & {
  locale: Locale;
  status: Status;
  sortOrder?: number;
};

const emptyWork: CmsWork = {
  locale: "en",
  status: "draft",
  slug: "",
  title: "",
  year: "",
  description: "",
  image: "",
  alt: "",
  category: "",
  role: "",
  client: "",
  summary: "",
  sections: [
    { slot: "overview", heading: "Overview", body: [""] },
    { slot: "challenge", heading: "Challenge", body: [""] },
    { slot: "approach", heading: "Approach", body: [""] },
    { slot: "outcome", heading: "Outcome", body: [""] },
  ],
  gallery: [],
};

const emptyArticle: CmsArticle = {
  locale: "en",
  status: "draft",
  slug: "",
  title: "",
  description: "",
  image: "",
  alt: "",
  publishedAt: "",
  lead: "",
  blocks: [{ heading: "", paragraphs: [""] }],
};
```

The component must include:

- Type toggle: Work / Articles
- Locale toggle: EN / ID
- Item list loaded from `/api/cms/content?type=<type>&locale=<locale>`
- Form fields for metadata
- Textarea for work sections where blank lines become paragraph arrays
- Textarea for article blocks where blank lines become paragraph arrays
- Save button using `POST /api/cms/content`
- Delete button using `DELETE /api/cms/content`
- File input using `POST /api/cms/upload`

Use native inputs and existing dark style classes. Do not add shadcn components for this internal page.

- [ ] **Step 3: Manual dev check**

Run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000/cms
```

Expected:

- CMS page loads in dev.
- Create draft work.
- Publish it.
- `/work` shows the item after refresh.
- `/work/<slug>` renders the detail page.

- [ ] **Step 4: Commit**

```bash
git add src/app/cms/page.tsx src/components/cms/content-cms.tsx data/content.sqlite public/images
git commit -m "feat: add local content cms"
```

---

### Task 7: Update Docs and Remove JSON Templates

**Files:**
- Modify: `docs/content/work-and-article-guide.md`
- Delete: `data/templates/work.en.json`
- Delete: `data/templates/work.id.json`
- Delete: `data/templates/article.en.json`
- Delete: `data/templates/article.id.json`

- [ ] **Step 1: Replace guide content**

Update `docs/content/work-and-article-guide.md`:

```md
# Work and Article CMS Guide

## Local editing flow

1. Run `npm run dev`.
2. Open `http://localhost:3000/cms`.
3. Create or edit Work / Articles.
4. Upload images from the CMS.
5. Publish the item.
6. Check `/work`, `/work/<slug>`, `/articles`, or `/articles/<slug>`.
7. Commit `data/content.sqlite` and any files under `public/images/...`.
8. Push to GitHub.
9. Vercel rebuilds and reads the updated SQLite file during build.

## Production behavior

`/cms` and `/api/cms/*` are only available in `NODE_ENV=development`.
Production returns 404. There is no login because the CMS is local-only.

## Image locations

- Work: `public/images/work/<slug>/`
- Articles: `public/images/articles/<slug>/`

## Important

SQLite is committed as a file. Do not edit content directly on Vercel.
Always edit locally, commit, and push.
```

- [ ] **Step 2: Delete old templates**

Delete:

```text
data/templates/work.en.json
data/templates/work.id.json
data/templates/article.en.json
data/templates/article.id.json
```

- [ ] **Step 3: Run scan**

Run:

```bash
rg -n "data/templates|work.en.json|article.en.json" data docs src
```

Expected: no matches.

- [ ] **Step 4: Commit**

```bash
git add docs/content/work-and-article-guide.md data/templates
git commit -m "docs: document sqlite content cms workflow"
```

---

### Task 8: Final Verification

**Files:**
- Verify only

- [ ] **Step 1: Typecheck**

Run:

```bash
npm run typecheck
```

Expected: no TypeScript errors.

- [ ] **Step 2: Lint**

Run:

```bash
npm run lint
```

Expected: no errors. The existing `.remember/tmp/last-ndc.ts` warning can remain if still present.

- [ ] **Step 3: Build**

Run:

```bash
npm run build
```

Expected:

- Build succeeds.
- Public pages are generated from `data/content.sqlite`.
- `/cms` is not a usable production CMS page.

- [ ] **Step 4: Commit final fixes if needed**

If verification required code fixes:

```bash
git add .
git commit -m "fix: verify sqlite content cms"
```

If no fixes were needed, skip this commit.

---

## Self-Review

- Spec coverage: SQLite file workflow, local CMS, no login, dev-only access, work/article management, asset upload, Git/Vercel flow, and static public build are covered.
- Placeholder scan: no TBD/TODO/fill-later language is present.
- Type consistency: content types stay compatible with the existing `WorkContentData`, `ArticleContentData`, summary/detail functions, and current page components.
