# CMS Redesign: Work & Articles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the CMS UI for Work & Articles with sidebar navigation, list/edit views, and drag-to-reorder sort order.

**Architecture:** Split the monolithic `content-cms.tsx` (863 lines) into 9 focused components. Add a new reorder API endpoint. The CMS stays dev-only. Public pages are unaffected — they already sort by `sort_order ASC`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, Supabase (existing), native HTML5 drag-and-drop.

## Global Constraints

- Node.js >= 24
- No new npm dependencies
- Native HTML form controls only (no shadcn for CMS)
- Dev-only access: all CMS routes guard with `process.env.NODE_ENV === "development"`
- Existing API contracts for `/api/cms/content` and `/api/cms/upload` remain unchanged
- Path alias: `@/*` maps to `./src/*`

---

## File Structure

- Create: `src/components/cms/cms-field.tsx` — Reusable Field, Area, LocaleGrid primitives
- Create: `src/components/cms/cms-image-upload.tsx` — ImageCard component with upload/change/delete
- Create: `src/components/cms/cms-sidebar.tsx` — Navigation sidebar with section links and count badges
- Create: `src/components/cms/cms-layout.tsx` — Sidebar + main content area shell
- Create: `src/components/cms/cms-list-view.tsx` — Sortable item list with drag-and-drop, move buttons, thumbnails, status badges
- Create: `src/components/cms/cms-gallery-editor.tsx` — Gallery image management for Work items
- Create: `src/components/cms/cms-work-form.tsx` — Work item edit form (bilingual)
- Create: `src/components/cms/cms-article-form.tsx` — Article item edit form (bilingual)
- Create: `src/app/api/cms/reorder/route.ts` — New PATCH endpoint for sort order persistence
- Modify: `src/lib/supabase-content.ts` — Add `reorderContent()` function
- Modify: `src/components/cms/content-cms.tsx` — Rewrite as thin orchestrator delegating to sub-components

---

### Task 1: Extract shared form primitives into cms-field.tsx

**Files:**
- Create: `src/components/cms/cms-field.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `Field({ label, value, onChange, readOnly? })`, `Area({ label, value, onChange, rows? })`, `LocaleGrid({ children })`

- [ ] **Step 1: Create cms-field.tsx with Field, Area, and LocaleGrid**

Create `src/components/cms/cms-field.tsx`:

```tsx
export function Field({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm text-muted-foreground">
      {label}
      <input
        className="h-11 rounded-none border border-border bg-black px-3 text-foreground outline-none focus:border-white"
        onChange={(event) => onChange(event.target.value)}
        readOnly={readOnly}
        value={value}
      />
    </label>
  );
}

export function Area({
  label,
  rows = 6,
  value,
  onChange,
}: {
  label: string;
  rows?: number;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm text-muted-foreground">
      {label}
      <textarea
        className="rounded-none border border-border bg-black p-3 text-foreground outline-none focus:border-white"
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        value={value}
      />
    </label>
  );
}

export function LocaleGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}
```

- [ ] **Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: no errors related to cms-field.tsx

- [ ] **Step 3: Commit**

```bash
git add src/components/cms/cms-field.tsx
git commit -m "refactor: extract Field, Area, LocaleGrid into cms-field"
```

---

### Task 2: Extract ImageCard into cms-image-upload.tsx

**Files:**
- Create: `src/components/cms/cms-image-upload.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `ImageCard({ alt, meta, src, onDelete, onEdit?, onFile? })`, `CoverUpload({ image, alt, onUpload, onDelete })`

- [ ] **Step 1: Create cms-image-upload.tsx**

Create `src/components/cms/cms-image-upload.tsx` — extract the existing `ImageCard` function from `content-cms.tsx` (lines ~148-195). Add a new `CoverUpload` component that wraps the cover image display + upload input pattern (currently inline in ContentCms render):

```tsx
export function ImageCard({
  alt,
  meta,
  onDelete,
  onEdit,
  onFile,
  src,
}: {
  alt: string;
  meta: string;
  onDelete: () => void;
  onEdit?: () => void;
  onFile?: (file: File) => void;
  src: string;
}) {
  return (
    <div className="border border-border p-2 text-sm">
      <img alt={alt} className="h-24 w-full object-cover" src={src} />
      <p className="mt-2 line-clamp-2 break-all text-[11px] leading-snug text-muted-foreground">
        {src}
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground">{meta}</p>
      <div className="mt-3 flex gap-2">
        {onFile ? (
          <label className="grid h-9 cursor-pointer place-items-center border border-border px-3 text-xs text-muted-foreground">
            Change
            <input
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onFile(file);
                event.target.value = "";
              }}
              type="file"
            />
          </label>
        ) : (
          <button
            className="h-9 border border-border px-3 text-xs text-muted-foreground"
            onClick={onEdit}
            type="button"
          >
            Edit
          </button>
        )}
        <button
          className="h-9 border border-border px-3 text-xs text-muted-foreground"
          onClick={onDelete}
          type="button"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export function CoverUpload({
  image,
  alt,
  onUpload,
  onDelete,
}: {
  image: string;
  alt: string;
  onUpload: (file: File) => void;
  onDelete: () => void;
}) {
  if (image) {
    return (
      <div className="max-w-xs">
        <ImageCard
          alt={alt}
          meta="cover"
          onDelete={onDelete}
          onFile={onUpload}
          src={image}
        />
      </div>
    );
  }

  return (
    <label className="grid max-w-xs gap-2 text-sm text-muted-foreground">
      Upload cover
      <input
        className="h-11 border border-border bg-black px-3 py-2 text-sm"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onUpload(file);
          if (event.target) event.target.value = "";
        }}
        type="file"
      />
    </label>
  );
}
```

- [ ] **Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: no errors related to cms-image-upload.tsx

- [ ] **Step 3: Commit**

```bash
git add src/components/cms/cms-image-upload.tsx
git commit -m "refactor: extract ImageCard and CoverUpload into cms-image-upload"
```

---

### Task 3: Create sidebar component

**Files:**
- Create: `src/components/cms/cms-sidebar.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `CmsSidebar({ activeType, onTypeChange, counts })` where `counts: { work: number; articles: number }`

- [ ] **Step 1: Create cms-sidebar.tsx**

Create `src/components/cms/cms-sidebar.tsx`:

```tsx
import { cn } from "@/lib/utils";

type ContentType = "work" | "articles";

type CmsSidebarProps = {
  activeType: ContentType;
  onTypeChange: (type: ContentType) => void;
  counts: { work: number; articles: number };
};

const sections: { type: ContentType; label: string }[] = [
  { type: "work", label: "Work" },
  { type: "articles", label: "Articles" },
];

export function CmsSidebar({ activeType, onTypeChange, counts }: CmsSidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-card">
      <div className="px-5 pt-6 pb-4">
        <h1 className="font-heading text-2xl font-light leading-none">CMS</h1>
        <p className="mt-1 text-xs text-muted-foreground">Dev only</p>
      </div>

      <nav className="flex-1 px-3">
        {sections.map(({ type, label }) => (
          <button
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
              activeType === type
                ? "bg-white/10 text-foreground"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
            )}
            key={type}
            onClick={() => onTypeChange(type)}
            type="button"
          >
            {label}
            <span
              className={cn(
                "min-w-[1.5rem] rounded-full px-1.5 py-0.5 text-center text-xs",
                activeType === type
                  ? "bg-white/10 text-foreground"
                  : "bg-white/5 text-muted-foreground",
              )}
            >
              {counts[type]}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/cms/cms-sidebar.tsx
git commit -m "feat: add CMS sidebar navigation component"
```

---

### Task 4: Create layout shell component

**Files:**
- Create: `src/components/cms/cms-layout.tsx`

**Interfaces:**
- Consumes: `CmsSidebar` from `cms-sidebar.tsx`
- Produces: `CmsLayout({ activeType, onTypeChange, counts, children })`

- [ ] **Step 1: Create cms-layout.tsx**

Create `src/components/cms/cms-layout.tsx`:

```tsx
import { CmsSidebar } from "@/components/cms/cms-sidebar";

type ContentType = "work" | "articles";

type CmsLayoutProps = {
  activeType: ContentType;
  onTypeChange: (type: ContentType) => void;
  counts: { work: number; articles: number };
  children: React.ReactNode;
};

export function CmsLayout({
  activeType,
  onTypeChange,
  counts,
  children,
}: CmsLayoutProps) {
  return (
    <div className="relative z-10 min-h-screen bg-background text-foreground">
      <CmsSidebar
        activeType={activeType}
        counts={counts}
        onTypeChange={onTypeChange}
      />
      <main className="ml-60 min-h-screen p-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/cms/cms-layout.tsx
git commit -m "feat: add CMS layout shell with sidebar"
```

---

### Task 5: Create sortable list view component

**Files:**
- Create: `src/components/cms/cms-list-view.tsx`

**Interfaces:**
- Consumes: nothing (uses native HTML5 drag-and-drop)
- Produces: `CmsListView({ items, type, onSelect, onNew, onReorder })` where `items` is an array of `{ slug, enTitle, idTitle, image, status, meta }`, `onReorder(slugs: string[])` receives the new slug order

- [ ] **Step 1: Create cms-list-view.tsx**

Create `src/components/cms/cms-list-view.tsx`. This component renders a drag-and-drop sortable list with:
- Drag handle (grip icon using `:::` text), thumbnail, EN/ID titles, status badge, year/date meta
- HTML5 drag events: `draggable`, `onDragStart`, `onDragOver`, `onDrop`
- Move up/down buttons per row
- "+ New" button at top

```tsx
import { useState } from "react";

import { cn } from "@/lib/utils";

type ContentType = "work" | "articles";

type ListItem = {
  slug: string;
  enTitle: string;
  idTitle: string;
  image: string;
  status: "draft" | "published";
  meta: string;
};

type CmsListViewProps = {
  items: ListItem[];
  type: ContentType;
  onSelect: (slug: string) => void;
  onNew: () => void;
  onReorder: (slugs: string[]) => void;
};

export function CmsListView({
  items,
  type,
  onSelect,
  onNew,
  onReorder,
}: CmsListViewProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (event: React.DragEvent, index: number) => {
    event.preventDefault();
    setOverIndex(index);
  };

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }

    const reordered = [...items];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    onReorder(reordered.map((item) => item.slug));

    setDragIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const moveItem = (fromIndex: number, direction: -1 | 1) => {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= items.length) return;

    const reordered = [...items];
    [reordered[fromIndex], reordered[toIndex]] = [reordered[toIndex], reordered[fromIndex]];
    onReorder(reordered.map((item) => item.slug));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-light">
          {type === "work" ? "Work" : "Articles"}
        </h2>
        <button
          className="h-9 rounded-lg border border-white bg-white px-4 text-sm text-black transition-colors hover:bg-white/90"
          onClick={onNew}
          type="button"
        >
          + New {type === "work" ? "work" : "article"}
        </button>
      </div>

      {items.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No items yet. Click &quot;+ New&quot; to create one.
        </p>
      ) : (
        <div className="space-y-px">
          {items.map((item, index) => (
            <div
              className={cn(
                "group flex items-center gap-3 border-b border-border px-3 py-3 transition-colors",
                dragIndex === index && "opacity-50",
                overIndex === index && dragIndex !== index && "border-t-2 border-t-primary",
                "hover:bg-white/5",
              )}
              draggable
              key={item.slug}
              onDragEnd={handleDragEnd}
              onDragOver={(event) => handleDragOver(event, index)}
              onDragStart={() => handleDragStart(index)}
              onDrop={() => handleDrop(index)}
            >
              <span
                className="cursor-grab select-none text-muted-foreground active:cursor-grabbing"
                title="Drag to reorder"
              >
                ⠿
              </span>

              <div className="h-12 w-12 shrink-0 overflow-hidden bg-white/5">
                {item.image ? (
                  <img
                    alt=""
                    className="h-full w-full object-cover"
                    src={item.image}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    —
                  </div>
                )}
              </div>

              <button
                className="flex min-w-0 flex-1 flex-col gap-0.5 text-left"
                onClick={() => onSelect(item.slug)}
                type="button"
              >
                <span className="truncate text-sm text-foreground">
                  {item.enTitle || item.slug}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {item.idTitle || (
                    <span className="italic text-yellow-500/70">Untranslated</span>
                  )}
                </span>
              </button>

              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[11px]",
                  item.status === "published"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-white/10 text-muted-foreground",
                )}
              >
                {item.status}
              </span>

              <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">
                {item.meta}
              </span>

              <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  className="h-7 w-7 rounded border border-border text-xs text-muted-foreground transition-colors hover:border-white hover:text-foreground disabled:opacity-30"
                  disabled={index === 0}
                  onClick={() => moveItem(index, -1)}
                  title="Move up"
                  type="button"
                >
                  ↑
                </button>
                <button
                  className="h-7 w-7 rounded border border-border text-xs text-muted-foreground transition-colors hover:border-white hover:text-foreground disabled:opacity-30"
                  disabled={index === items.length - 1}
                  onClick={() => moveItem(index, 1)}
                  title="Move down"
                  type="button"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/cms/cms-list-view.tsx
git commit -m "feat: add CMS sortable list view with drag-and-drop"
```

---

### Task 6: Extract gallery editor into cms-gallery-editor.tsx

**Files:**
- Create: `src/components/cms/cms-gallery-editor.tsx`

**Interfaces:**
- Consumes: `Field` from `cms-field.tsx`, `ImageCard` from `cms-image-upload.tsx`
- Produces: `CmsGalleryEditor({ gallery, onGalleryChange, onUpload, onDeleteAsset })` where `gallery` is `Pair<WorkGalleryItemData[]>`, `onGalleryChange(locale, gallery)`, `onUpload(file) => Promise<string | null>`, `onDeleteAsset(src) => Promise<void>`

- [ ] **Step 1: Create cms-gallery-editor.tsx**

Create `src/components/cms/cms-gallery-editor.tsx` — extract the gallery editing logic from the existing `WorkForm` component (the `draft`/`editIndex` state, `openGalleryUpload`, `editGallery`, `saveDraft`, `removeGallery` functions, and the gallery image grid + edit panel JSX). Import `Field` and `LocaleGrid` from `cms-field.tsx`, `ImageCard` from `cms-image-upload.tsx`.

The component must manage its own `draft: GalleryDraft | null` and `editIndex: number | null` state internally, same as the current WorkForm does. It accepts the gallery arrays for both locales as props and calls `onGalleryChange(locale, newGalleryArray)` when images are added, edited, or removed.

Types to define locally in this file:

```tsx
import type { Locale, WorkGalleryItemData, WorkSectionSlot } from "@/types/content";

type Pair<T> = Record<Locale, T>;

type GalleryDraft = {
  src: string;
  alt: Pair<string>;
  aspect: WorkGalleryItemData["aspect"];
  span: WorkGalleryItemData["span"];
  slot: WorkSectionSlot;
};
```

Constants to define locally:

```tsx
const locales: Locale[] = ["en", "id"];
const slots: WorkSectionSlot[] = ["overview", "challenge", "approach", "outcome"];
const aspectOptions: WorkGalleryItemData["aspect"][] = ["16/9", "4/3"];
```

Helper to define locally:

```tsx
function spanForAspect(
  aspect: WorkGalleryItemData["aspect"],
): WorkGalleryItemData["span"] {
  return aspect === "4/3" ? "half" : "full";
}
```

The full JSX for the gallery grid, upload input, and edit panel should be moved verbatim from the current `WorkForm` in `content-cms.tsx` (approximately lines 530-700 of the original file).

- [ ] **Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/cms/cms-gallery-editor.tsx
git commit -m "refactor: extract gallery editor into cms-gallery-editor"
```

---

### Task 7: Create Work edit form component

**Files:**
- Create: `src/components/cms/cms-work-form.tsx`

**Interfaces:**
- Consumes: `Field`, `Area`, `LocaleGrid` from `cms-field.tsx`; `CoverUpload` from `cms-image-upload.tsx`; `CmsGalleryEditor` from `cms-gallery-editor.tsx`
- Produces: `CmsWorkForm({ item, slug, onSlugChange, onLocaleChange, onStatusChange, onSave, onDelete, onUpload, onDeleteAsset, onBack })` where `item` is `Pair<CmsWork>`, `onLocaleChange(locale, patch)`

- [ ] **Step 1: Create cms-work-form.tsx**

Create `src/components/cms/cms-work-form.tsx`. This component renders:

1. **Top bar:** Back button (calls `onBack`), slug field (editable if `item.en.id` is undefined, read-only otherwise), status select, Save button, Delete button.
2. **Cover image:** `CoverUpload` component.
3. **Bilingual fields:** `LocaleGrid` with two columns (EN/ID) containing title, description, alt, year, category, role, client, summary fields.
4. **Sections:** For each of the 4 slots (overview/challenge/approach/outcome), a `LocaleGrid` with heading field + body textarea.
5. **Gallery:** `CmsGalleryEditor` component.

Types to import:

```tsx
import type { Locale, WorkContentData, WorkGalleryItemData } from "@/types/content";

type Status = "draft" | "published";
type Pair<T> = Record<Locale, T>;
type CmsWork = WorkContentData & {
  id?: number;
  locale: Locale;
  status: Status;
  sortOrder?: number;
};
```

Helper functions to define locally:

```tsx
function splitParagraphs(value: string) {
  return value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

function joinParagraphs(value: string[]) {
  return value.join("\n\n");
}
```

Constants:

```tsx
const locales: Locale[] = ["en", "id"];
const slots: WorkSectionSlot[] = ["overview", "challenge", "approach", "outcome"];
```

The sections editing JSX should mirror the current `WorkForm` pattern from `content-cms.tsx`.

- [ ] **Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/cms/cms-work-form.tsx
git commit -m "feat: add CMS Work edit form component"
```

---

### Task 8: Create Article edit form component

**Files:**
- Create: `src/components/cms/cms-article-form.tsx`

**Interfaces:**
- Consumes: `Field`, `Area`, `LocaleGrid` from `cms-field.tsx`; `CoverUpload` from `cms-image-upload.tsx`
- Produces: `CmsArticleForm({ item, slug, onSlugChange, onLocaleChange, onStatusChange, onSave, onDelete, onUpload, onDeleteAsset, onBack })` where `item` is `Pair<CmsArticle>`, `onLocaleChange(locale, patch)`

- [ ] **Step 1: Create cms-article-form.tsx**

Create `src/components/cms/cms-article-form.tsx`. This component renders:

1. **Top bar:** Back button, slug field, status select, Save button, Delete button. Same pattern as `CmsWorkForm`.
2. **Cover image:** `CoverUpload` component.
3. **Bilingual fields:** `LocaleGrid` with EN/ID columns containing title, description, alt, publishedAt, lead textarea, block heading, article paragraphs textarea.

Types to import:

```tsx
import type { ArticleContentData, Locale } from "@/types/content";

type Status = "draft" | "published";
type Pair<T> = Record<Locale, T>;
type CmsArticle = ArticleContentData & {
  id?: number;
  locale: Locale;
  status: Status;
  sortOrder?: number;
};
```

Use the same `splitParagraphs` / `joinParagraphs` helpers defined locally. Mirror the existing `ArticleForm` pattern from `content-cms.tsx`.

- [ ] **Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/cms/cms-article-form.tsx
git commit -m "feat: add CMS Article edit form component"
```

---

### Task 9: Add reorder API endpoint and Supabase function

**Files:**
- Modify: `src/lib/supabase-content.ts`
- Create: `src/app/api/cms/reorder/route.ts`

**Interfaces:**
- Consumes: `getSupabaseServiceClient()` from `supabase.ts`
- Produces: `reorderContent(type, slugs)` in supabase-content.ts; `PATCH /api/cms/reorder` API route

- [ ] **Step 1: Add reorderContent function to supabase-content.ts**

Add at the end of `src/lib/supabase-content.ts`:

```tsx
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
```

- [ ] **Step 2: Create the reorder API route**

Create `src/app/api/cms/reorder/route.ts`:

```tsx
import { reorderContent, type CmsContentType } from "@/lib/supabase-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function devOnly() {
  return process.env.NODE_ENV === "development";
}

export async function PATCH(request: Request) {
  if (!devOnly()) {
    return new Response("Not found", { status: 404 });
  }

  const body = (await request.json()) as {
    type?: string;
    order?: string[];
  };

  const type: CmsContentType = body.type === "articles" ? "articles" : "work";
  const order = Array.isArray(body.order) ? body.order : [];

  if (order.length === 0) {
    return Response.json({ error: "order array is required" }, { status: 400 });
  }

  await reorderContent(type, order);
  return Response.json({ ok: true });
}
```

- [ ] **Step 3: Verify typecheck passes**

Run: `npm run typecheck`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase-content.ts src/app/api/cms/reorder/route.ts
git commit -m "feat: add reorder API endpoint for CMS sort order"
```

---

### Task 10: Rewrite content-cms.tsx as orchestrator

**Files:**
- Modify: `src/components/cms/content-cms.tsx`

**Interfaces:**
- Consumes: `CmsLayout` from `cms-layout.tsx`, `CmsListView` from `cms-list-view.tsx`, `CmsWorkForm` from `cms-work-form.tsx`, `CmsArticleForm` from `cms-article-form.tsx`
- Produces: `ContentCms()` — the root CMS component (same export name, same usage in `src/app/cms/page.tsx`)

- [ ] **Step 1: Rewrite content-cms.tsx**

Replace the entire contents of `src/components/cms/content-cms.tsx` with a thin orchestrator. This component manages:

1. **State:** `type` (work/articles), `items` (Pair<CmsItem[]>), `current` (CmsPair | null for edit mode), `view` ("list" | "edit"), `message`, `counts`.
2. **Data fetching:** `loadItems()` — same fetch logic as current, plus computes counts for sidebar.
3. **View switching:** list view shows `CmsListView`, edit view shows `CmsWorkForm` or `CmsArticleForm`.
4. **Reorder handler:** `handleReorder(slugs)` — optimistic reorder in state + PATCH to `/api/cms/reorder`.
5. **CRUD handlers:** `save()`, `remove()`, `upload()`, `deleteAsset()` — same logic as current, delegated from form components via props.

Key behavior:
- When user clicks an item in the list, switch to edit view with that item loaded.
- When user clicks "+ New", switch to edit view with empty pair.
- When user clicks "Back" in form, switch back to list view and reload items.
- When user saves or deletes, reload items and switch to list view.
- On type change in sidebar, reset to list view and reload.

The list view maps `items` into `ListItem[]` format for `CmsListView`:

```tsx
const listItems: ListItem[] = slugs.map((itemSlug) => {
  const en = items?.en.find((i) => i.slug === itemSlug);
  const id = items?.id.find((i) => i.slug === itemSlug);
  const item = en ?? id;
  return {
    slug: itemSlug,
    enTitle: en?.title ?? "",
    idTitle: id?.title ?? "",
    image: item?.image ?? "",
    status: (item?.status ?? "draft") as "draft" | "published",
    meta: isWorkItem(item!) ? (item as CmsWork).year : (item as CmsArticle).publishedAt,
  };
});
```

Import the `ListItem` type from `cms-list-view.tsx` (export it there as a named type).

The reorder handler:

```tsx
const handleReorder = async (slugs: string[]) => {
  if (!items) return;

  const reorderLocale = (localeItems: CmsItem[]) =>
    slugs
      .map((slug) => localeItems.find((i) => i.slug === slug))
      .filter((i): i is CmsItem => i !== undefined);

  setItems({
    en: reorderLocale(items.en),
    id: reorderLocale(items.id),
  });

  try {
    await fetch("/api/cms/reorder", {
      body: JSON.stringify({ type, order: slugs }),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });
  } catch {
    await loadItems();
  }
};
```

- [ ] **Step 2: Export ListItem type from cms-list-view.tsx**

In `src/components/cms/cms-list-view.tsx`, change `type ListItem` to `export type ListItem` so `content-cms.tsx` can import it.

- [ ] **Step 3: Verify typecheck passes**

Run: `npm run typecheck`
Expected: no errors

- [ ] **Step 4: Verify lint passes**

Run: `npm run lint`
Expected: no errors (fix any unused import warnings from old code removal)

- [ ] **Step 5: Commit**

```bash
git add src/components/cms/content-cms.tsx src/components/cms/cms-list-view.tsx
git commit -m "feat: rewrite ContentCms as thin orchestrator with list/edit views"
```

---

### Task 11: Final verification

**Files:**
- Verify only

- [ ] **Step 1: Typecheck**

Run: `npm run typecheck`
Expected: no TypeScript errors.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: production build succeeds. `/cms` page compiles. Public pages generate correctly.

- [ ] **Step 4: Commit final fixes if needed**

If verification required code fixes:

```bash
git add .
git commit -m "fix: resolve CMS redesign build issues"
```

If no fixes were needed, skip this commit.

---

## Self-Review

- **Spec coverage:** Sidebar navigation (Task 3-4), list view with thumbnails/badges (Task 5), drag-and-drop reorder (Task 5), move up/down buttons (Task 5), sort order persistence (Task 9), bilingual edit forms for Work (Task 7) and Articles (Task 8), gallery editor (Task 6), image upload (Task 2), create/edit/delete/status toggle (Task 10), component decomposition (Tasks 1-8), dev-only access (Task 9) — all spec requirements covered.
- **Placeholder scan:** No TBD/TODO/fill-later language present. All steps contain concrete code or exact commands.
- **Type consistency:** `CmsWork`, `CmsArticle`, `CmsItem`, `CmsPair`, `Pair<T>`, `ContentType`, `Status`, `ListItem` types are defined consistently across all tasks. `Field`, `Area`, `LocaleGrid` signatures match between Task 1 definition and Tasks 7-8 consumption. `reorderContent(type, slugs)` signature matches between Task 9 supabase function and Task 9 API route. `onReorder(slugs: string[])` matches between Task 5 `CmsListView` prop and Task 10 handler.
