import type { ArticleContentData, Locale } from "@/types/content";

import { Area, Field, LocaleGrid } from "@/components/cms/cms-field";
import { CoverUpload } from "@/components/cms/cms-image-upload";

type Status = "draft" | "published";
type Pair<T> = Record<Locale, T>;

export type CmsArticle = ArticleContentData & {
  id?: number;
  locale: Locale;
  status: Status;
  sortOrder?: number;
};

const locales: Locale[] = ["en", "id"];

function splitParagraphs(value: string) {
  return value
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function joinParagraphs(value: string[]) {
  return value.join("\n\n");
}

export function CmsArticleForm({
  item,
  slug,
  onSlugChange,
  onLocaleChange,
  onStatusChange,
  onSave,
  onDelete,
  onUpload,
  onDeleteAsset,
  onBack,
  hasChanges,
}: {
  item: Pair<CmsArticle>;
  slug: string;
  onSlugChange: (slug: string) => void;
  onLocaleChange: (locale: Locale, patch: Partial<CmsArticle>) => void;
  onStatusChange: (status: Status) => void;
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
  onUpload: (file: File) => Promise<string | null>;
  onDeleteAsset: (src: string) => Promise<void>;
  onBack: () => void;
  hasChanges?: boolean;
}) {
  const currentTitle = item.en.title || item.id.title || "Untitled";

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-40 -mx-8 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background px-8 py-5">
        <div>
          <div className="flex items-center gap-3">
            <button
              className="text-muted-foreground transition-colors hover:text-foreground"
              onClick={onBack}
              title="Back to list"
              type="button"
            >
              ← Back
            </button>
            <h2 className="text-2xl leading-tight">{currentTitle}</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="h-10 border border-border px-4 text-sm text-muted-foreground transition-colors hover:border-white hover:text-foreground"
            onClick={onDelete}
            type="button"
          >
            Delete
          </button>
          <button
            className="h-10 border border-white bg-white px-5 text-sm text-black transition-colors hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSave}
            type="button"
            disabled={!hasChanges}
          >
            Save EN + ID
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Slug"
          onChange={onSlugChange}
          readOnly={item.en.id !== undefined}
          value={slug}
        />
        <label className="grid gap-2 text-sm text-muted-foreground">
          Status
          <select
            className="h-11 rounded-none border border-border bg-black px-3 text-foreground outline-none focus:border-white"
            onChange={(event) => onStatusChange(event.target.value as Status)}
            value={item.en.status}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </label>
      </div>

      <CoverUpload
        alt={item.en.alt}
        image={item.en.image}
        onDelete={async () => {
          await onDeleteAsset(item.en.image);
          onLocaleChange("en", { image: "" });
          onLocaleChange("id", { image: "" });
        }}
        onUpload={async (file) => {
          const image = await onUpload(file);
          if (image) {
            onLocaleChange("en", { image });
            onLocaleChange("id", { image });
          }
        }}
      />

      <LocaleGrid>
        {locales.map((locale) => (
          <div className="space-y-4 border border-border p-4" key={locale}>
            <h3 className="text-sm uppercase text-muted-foreground">
              {locale}
            </h3>
            <Field
              label="Title"
              onChange={(title) => onLocaleChange(locale, { title })}
              value={item[locale].title}
            />
            <Field
              label="Description"
              onChange={(description) =>
                onLocaleChange(locale, { description })
              }
              value={item[locale].description}
            />
            <Field
              label="Alt"
              onChange={(alt) => onLocaleChange(locale, { alt })}
              value={item[locale].alt}
            />
            <Field
              label="Published at"
              onChange={(publishedAt) =>
                onLocaleChange(locale, { publishedAt })
              }
              value={item[locale].publishedAt}
            />
            <Area
              label="Lead"
              onChange={(lead) => onLocaleChange(locale, { lead })}
              rows={3}
              value={item[locale].lead}
            />
          </div>
        ))}
      </LocaleGrid>

      <LocaleGrid>
        {locales.map((locale) => {
          const block = item[locale].blocks[0] ?? {
            heading: "",
            paragraphs: [""],
          };
          return (
            <div className="grid gap-3 border border-border p-4" key={locale}>
              <Field
                label={`${locale} block heading`}
                onChange={(heading) =>
                  onLocaleChange(locale, { blocks: [{ ...block, heading }] })
                }
                value={block.heading ?? ""}
              />
              <Area
                label={`${locale} article body`}
                onChange={(value) =>
                  onLocaleChange(locale, {
                    blocks: [{ ...block, paragraphs: splitParagraphs(value) }],
                  })
                }
                rows={15}
                value={joinParagraphs(block.paragraphs)}
              />
            </div>
          );
        })}
      </LocaleGrid>
    </div>
  );
}
