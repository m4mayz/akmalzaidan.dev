# CMS Redesign: Work & Articles Management

## Problem Statement

CMS saat ini (`/cms`) adalah halaman dev-only dengan tampilan minimalis — satu halaman flat dengan toggle Work/Articles dan toggle locale EN/ID. Semua form ditampilkan inline tanpa navigasi yang jelas. Tidak ada cara visual untuk mengatur urutan (sort order) item yang muncul di halaman publik; `sort_order` hanya bisa diisi manual sebagai angka di field input biasa.

Pengguna (pemilik portfolio) membutuhkan CMS yang:
1. Memiliki navigasi yang jelas antar section (Work vs Articles).
2. Bisa mengatur urutan tampil item secara intuitif (drag-and-drop atau move up/down).
3. Memiliki UI yang lebih terstruktur dan mudah digunakan.
4. Tetap bilingual (EN/ID side-by-side).

## Solution

Merombak total tampilan CMS menjadi panel admin dengan sidebar navigation, list view dengan drag-to-reorder untuk sort order, dan form editor yang terpisah per item. Scope dibatasi pada **Work** dan **Articles** saja — data statis lainnya (site settings, home, about, contact, privacy) tetap di JSON file.

## User Stories

1. As a portfolio owner, I want a sidebar navigation in the CMS, so that I can quickly switch between managing Work and Articles.
2. As a portfolio owner, I want to see a list of all Work items sorted by their display order, so that I know which items appear first on the public site.
3. As a portfolio owner, I want to see a list of all Article items sorted by their display order, so that I know which articles appear first.
4. As a portfolio owner, I want to drag-and-drop Work items in the list to change their display order, so that I can control which projects appear at the top of the homepage showcase and `/work` page.
5. As a portfolio owner, I want to drag-and-drop Article items in the list to change their display order, so that I can control which articles appear first on `/articles` and the homepage articles section.
6. As a portfolio owner, I want move-up and move-down buttons as an alternative to drag-and-drop, so that I can reorder items on devices without precise drag support.
7. As a portfolio owner, I want the reordered sort values to persist to Supabase immediately (optimistic update), so that I don't lose my ordering work.
8. As a portfolio owner, I want to click on a Work item in the list to open its full edit form, so that I can update title, description, sections, gallery, and other fields.
9. As a portfolio owner, I want to click on an Article item in the list to open its full edit form, so that I can update title, description, lead, blocks, and other fields.
10. As a portfolio owner, I want the edit form to show EN and ID fields side-by-side, so that I can manage both translations in one view.
11. As a portfolio owner, I want to create a new Work item from the CMS, so that I can add new projects to my portfolio.
12. As a portfolio owner, I want to create a new Article item from the CMS, so that I can publish new articles.
13. As a portfolio owner, I want to toggle an item between draft and published status, so that I can prepare content before making it public.
14. As a portfolio owner, I want to delete a Work or Article item from the CMS, so that I can remove outdated content.
15. As a portfolio owner, I want to upload images for Work cover, gallery, and Article cover directly from the edit form, so that I don't need to manage files manually.
16. As a portfolio owner, I want to see a thumbnail preview of the cover image in the list view, so that I can visually identify items quickly.
17. As a portfolio owner, I want the CMS to show a status badge (draft/published) next to each item in the list, so that I can see at a glance which items are live.
18. As a portfolio owner, I want the list to show both EN and ID titles (or indicate missing translations), so that I know which items need translation work.
19. As a portfolio owner, I want the CMS to remain accessible only in development mode, so that it is not exposed in production.
20. As a portfolio owner, I want the sort order I set in the CMS to be respected on all public pages (homepage selected work, homepage showcase slideshow, /work grid, homepage articles section, /articles list), so that my ordering preference is consistent everywhere.

## Implementation Decisions

### Scope Boundary

- **In scope:** Work and Articles CMS UI redesign, sort order management.
- **Out of scope:** Site settings, home content, about content, contact, privacy — these remain as static JSON files in `data/en/` and `data/id/`.
- **Out of scope:** Production authentication — CMS stays dev-only (`process.env.NODE_ENV === "development"`).

### CMS Layout Architecture

- The CMS page (`/cms`) renders a single client component `ContentCms` that manages all state.
- Layout: fixed sidebar (left, ~240px) + main content area (right).
- Sidebar contains: logo/title, navigation links for "Work" and "Articles", count badges per section.
- Main content area has two modes: **list view** (default) and **edit view** (when an item is selected or "New" is clicked).

### List View

- Shows items for the currently selected content type.
- Each row displays: drag handle, thumbnail (cover image, 48x48), EN title, ID title (or "Untranslated" badge), status badge (draft=gray, published=green), year (Work only) or publishedAt (Articles only).
- Items are sorted by `sort_order ASC, id DESC` — matching the existing Supabase query order.
- **Reorder mechanism:** HTML5 drag-and-drop with `dragstart`/`dragover`/`drop` events. No external library.
  - On drop, compute new `sort_order` values for all items (simple sequential: 0, 1, 2, ...) and PATCH to API.
  - Optimistic UI: reorder visually immediately, revert on API error.
- **Move up/down buttons:** Shown on hover or always visible on mobile. Swap `sort_order` between adjacent items and PATCH.
- **"+ New" button** at the top of the list to create a new item.

### Edit View

- Replaces the list view in the main content area (not a modal).
- Back button/breadcrumb to return to list.
- Top bar: item slug (editable for new items, read-only for existing), status toggle, save button, delete button.
- Form body: two columns (EN left, ID right) for all localizable fields.
- **Work fields per locale:** title, year, description, image (with upload), alt, category, role, client, summary, sections (4 slots: overview/challenge/approach/outcome each with heading + body textarea), gallery editor.
- **Article fields per locale:** title, description, image (with upload), alt, publishedAt, lead, blocks (heading + paragraphs textarea).
- **Shared field (across locales):** slug, status, sortOrder (auto-managed, not shown in form).
- Gallery editor: grid of uploaded images with add/edit/delete. Each gallery item has src, alt (per locale), aspect ratio select, span select, slot select. Same as current implementation but integrated into the new layout.

### Sort Order Persistence

- New API endpoint: `PATCH /api/cms/reorder` — accepts `{ type: "work" | "articles", order: string[] }` where `order` is an array of slugs in desired display order.
- The API assigns sequential `sort_order` values (0, 1, 2, ...) to each slug for both `en` and `id` locales.
- Existing `GET`/`POST`/`DELETE /api/cms/content` routes remain unchanged.
- Existing `POST`/`DELETE /api/cms/upload` routes remain unchanged.

### Data Flow (unchanged for public pages)

- Public pages continue to read from Supabase via `src/lib/content.ts` -> `src/lib/supabase-content.ts`.
- The `listWork()` and `listArticles()` functions already sort by `sort_order ASC, id DESC` — no changes needed to public page data fetching.
- The `sort_order` values set by the CMS reorder feature directly control the display order on all public pages.

### Component Decomposition

The monolithic `content-cms.tsx` (863 lines) will be split into focused modules:

- `src/components/cms/cms-layout.tsx` — Sidebar + main content shell.
- `src/components/cms/cms-sidebar.tsx` — Navigation sidebar with section links and counts.
- `src/components/cms/cms-list-view.tsx` — Sortable item list with drag-and-drop, move buttons, thumbnails, status badges.
- `src/components/cms/cms-work-form.tsx` — Work item edit form (bilingual).
- `src/components/cms/cms-article-form.tsx` — Article item edit form (bilingual).
- `src/components/cms/cms-gallery-editor.tsx` — Gallery image management (extracted from current WorkForm).
- `src/components/cms/cms-image-upload.tsx` — Reusable image upload with preview.
- `src/components/cms/cms-field.tsx` — Reusable Field and Area form primitives (extracted from current code).
- `src/components/cms/content-cms.tsx` — Root orchestrator (slimmed down, delegates to sub-components).

### API Changes

- **New route:** `src/app/api/cms/reorder/route.ts`
  - `PATCH` — receives `{ type, order }`, updates `sort_order` for all items of that type across both locales.
  - Dev-only guard (same pattern as existing CMS routes).
- **Existing routes untouched** — `content/route.ts` and `upload/route.ts` keep their current contracts.

### Styling

- Use existing Tailwind classes and dark theme tokens (no new design system).
- Native HTML form controls (no shadcn components for CMS, matching current approach).
- Sidebar: `bg-card` background, `border-r border-border`, full viewport height.
- List rows: `hover:bg-white/5` highlight, `border-b border-border` separators.
- Drag state: `opacity-50` on dragged item, `border-2 border-primary` on drop target.
- Status badge: small pill with `bg-green-500/20 text-green-400` for published, `bg-white/10 text-muted-foreground` for draft.

### Data Fetching Strategy in CMS

- On mount: fetch items for current content type from `/api/cms/content?type=<type>&locale=en` and `locale=id` in parallel.
- Pair EN/ID items by slug (current approach, kept).
- On reorder: optimistic UI update + `PATCH /api/cms/reorder`.
- On save: `POST /api/cms/content` (current approach, kept).
- On delete: `DELETE /api/cms/content` (current approach, kept).

## Testing Decisions

- This project does not have an existing test suite. No tests will be added.
- Validation is done via:
  1. `npm run typecheck` — TypeScript strict mode must pass.
  2. `npm run lint` — ESLint must pass.
  3. `npm run build` — Production build must succeed.
  4. Manual verification: CMS loads, items can be created/edited/reordered/deleted, public pages reflect correct order.

## Out of Scope

- **Site settings CMS** — name, role, email, socials remain in `data/en/site.json` and `data/id/site.json`.
- **Home content CMS** — hero, stats, services, testimonials remain in JSON files.
- **About content CMS** — all about data remains in JSON files.
- **Contact / Privacy CMS** — these remain hardcoded JSON.
- **Production authentication** — CMS stays dev-only.
- **Rich text editor** — paragraphs are managed as plain text with blank-line splitting (current approach).
- **Undo/redo** — not needed for this iteration.
- **Bulk operations** — no multi-select delete or bulk status change.

## Further Notes

- The existing `sort_order` column in both `works` and `articles` tables already supports this feature — no schema migration needed.
- The public pages already sort by `sort_order ASC` — the only missing piece is a usable UI to control it.
- HTML5 drag-and-drop is chosen over external libraries (like dnd-kit) to keep the dependency footprint minimal, consistent with the project's approach of using native controls for the CMS.
- The CMS component split improves maintainability — the current 863-line monolith is hard to navigate. Each new file will have a single clear responsibility.
