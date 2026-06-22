"use client";

import { useEffect, useState } from "react";

import type {
  ArticleContentData,
  Locale,
  WorkContentData,
  WorkGalleryItemData,
  WorkSectionSlot,
} from "@/types/content";

type ContentType = "work" | "articles";
type Status = "draft" | "published";
type Pair<T> = Record<Locale, T>;

type CmsWork = WorkContentData & {
  id?: number;
  locale: Locale;
  status: Status;
  sortOrder?: number;
};

type CmsArticle = ArticleContentData & {
  id?: number;
  locale: Locale;
  status: Status;
  sortOrder?: number;
};

type CmsItem = CmsWork | CmsArticle;
type CmsPair = Pair<CmsItem>;

type GalleryDraft = {
  src: string;
  alt: Pair<string>;
  aspect: WorkGalleryItemData["aspect"];
  span: WorkGalleryItemData["span"];
  slot: WorkSectionSlot;
};

const locales: Locale[] = ["en", "id"];
const slots: WorkSectionSlot[] = ["overview", "challenge", "approach", "outcome"];
const aspectOptions: WorkGalleryItemData["aspect"][] = ["16/9", "4/3"];

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
  sections: slots.map((slot) => ({
    slot,
    heading: slot[0].toUpperCase() + slot.slice(1),
    body: [""],
  })),
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

function cloneWork(locale: Locale): CmsWork {
  return structuredClone({ ...emptyWork, locale });
}

function cloneArticle(locale: Locale): CmsArticle {
  return structuredClone({ ...emptyArticle, locale });
}

function makePair(type: ContentType): CmsPair {
  return {
    en: type === "work" ? cloneWork("en") : cloneArticle("en"),
    id: type === "work" ? cloneWork("id") : cloneArticle("id"),
  };
}

function isWorkItem(item: CmsItem): item is CmsWork {
  return "sections" in item;
}

function isWorkPair(pair: CmsPair): pair is Pair<CmsWork> {
  return isWorkItem(pair.en) && isWorkItem(pair.id);
}

function spanForAspect(
  aspect: WorkGalleryItemData["aspect"],
): WorkGalleryItemData["span"] {
  return aspect === "4/3" ? "half" : "full";
}

function splitParagraphs(value: string) {
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function joinParagraphs(value: string[]) {
  return value.join("\n\n");
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm text-muted-foreground">
      {label}
      <input
        className="h-11 rounded-none border border-border bg-black px-3 text-foreground outline-none focus:border-white"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function Area({
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

function LocaleGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

function ImageCard({
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

export function ContentCms() {
  const [type, setType] = useState<ContentType>("work");
  const [items, setItems] = useState<Pair<CmsItem[]> | null>(null);
  const [current, setCurrent] = useState<CmsPair>(() => makePair("work"));
  const [message, setMessage] = useState("");

  const slug = current.en.slug;
  const currentTitle = current.en.title || current.id.title || "Untitled";

  const loadItems = async () => {
    const [enResponse, idResponse] = await Promise.all(
      locales.map((locale) =>
        fetch(`/api/cms/content?type=${type}&locale=${locale}`),
      ),
    );
    const [enData, idData] = (await Promise.all([
      enResponse.json(),
      idResponse.json(),
    ])) as [{ items: CmsItem[] }, { items: CmsItem[] }];
    setItems({ en: enData.items, id: idData.items });
    return { en: enData.items, id: idData.items };
  };

  useEffect(() => {
    let ignore = false;

    loadItems().then((loaded) => {
      if (!ignore) setItems(loaded);
    });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const setSlug = (nextSlug: string) => {
    setCurrent((pair) => ({
      en: { ...pair.en, slug: nextSlug },
      id: { ...pair.id, slug: nextSlug },
    }));
  };

  const updateLocale = <T extends CmsItem>(locale: Locale, patch: Partial<T>) => {
    setCurrent((pair) => ({
      ...pair,
      [locale]: { ...pair[locale], ...patch },
    }));
  };

  const updateBoth = (patch: Partial<CmsItem>) => {
    setCurrent((pair) => ({
      en: { ...pair.en, ...patch },
      id: { ...pair.id, ...patch },
    }));
  };

  const save = async () => {
    if (!slug.trim()) {
      setMessage("Slug is required.");
      return;
    }

    await fetch("/api/cms/content", {
      body: JSON.stringify({
        type,
        items: [
          { ...current.en, locale: "en", slug },
          { ...current.id, locale: "id", slug },
        ],
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    setMessage(`Saved ${currentTitle}.`);
    await loadItems();
  };

  const remove = async () => {
    if (!slug.trim()) return;

    await fetch("/api/cms/content", {
      body: JSON.stringify({ slug, type }),
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
    });
    setCurrent(makePair(type));
    setMessage("Deleted.");
    await loadItems();
  };

  const upload = async (file: File) => {
    if (!slug.trim()) {
      setMessage("Set slug before uploading.");
      return null;
    }

    const form = new FormData();
    form.set("file", file);
    form.set("type", type);
    form.set("slug", slug);

    const response = await fetch("/api/cms/upload", {
      body: form,
      method: "POST",
    });
    const data = (await response.json()) as { src?: string; error?: string };

    if (!data.src) {
      setMessage(data.error ?? "Upload failed.");
      return null;
    }

    setMessage(`Uploaded ${data.src}`);
    return data.src;
  };

  const deleteAsset = async (src: string) => {
    await fetch("/api/cms/upload", {
      body: JSON.stringify({ src }),
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
    });
    setMessage(`Deleted ${src}`);
  };

  const selectItem = (itemSlug: string) => {
    const next = makePair(type);
    for (const locale of locales) {
      next[locale] =
        items?.[locale].find((item) => item.slug === itemSlug) ?? next[locale];
    }
    next.en.slug = itemSlug;
    next.id.slug = itemSlug;
    setCurrent(structuredClone(next));
  };

  const slugs = Array.from(
    new Set([...(items?.en ?? []), ...(items?.id ?? [])].map((item) => item.slug)),
  );

  return (
    <main className="relative z-10 min-h-screen bg-background px-5 py-8 text-foreground md:px-10">
      <div className="mx-auto grid max-w-[89.5rem] gap-8 md:grid-cols-[320px_1fr]">
        <aside className="space-y-5">
          <div>
            <h1 className="font-heading text-4xl font-light leading-none">CMS</h1>
            <p className="mt-2 text-sm text-muted-foreground">Local dev only</p>
          </div>

          <div className="flex gap-2">
            {(["work", "articles"] as ContentType[]).map((item) => (
              <button
                className={`h-10 border px-4 text-sm ${
                  type === item
                    ? "border-white bg-white text-black"
                    : "border-border text-muted-foreground"
                }`}
                key={item}
                onClick={() => {
                  setType(item);
                  setCurrent(makePair(item));
                }}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>

          <button
            className="h-10 w-full border border-white bg-white px-4 text-sm text-black"
            onClick={() => setCurrent(makePair(type))}
            type="button"
          >
            New {type === "work" ? "work" : "article"}
          </button>

          <div className="space-y-2">
            {slugs.map((itemSlug) => {
              const en = items?.en.find((item) => item.slug === itemSlug);
              const id = items?.id.find((item) => item.slug === itemSlug);
              const item = en ?? id;
              if (!item) return null;

              return (
                <button
                  className="block w-full border border-border p-3 text-left transition-colors hover:border-white"
                  key={itemSlug}
                  onClick={() => selectItem(itemSlug)}
                  type="button"
                >
                  <span className="block text-sm">{item.title || itemSlug}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {item.status} / {itemSlug} / {en ? "EN" : "-"} {id ? "ID" : "-"}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
            <div>
              <h2 className="text-2xl leading-tight">{currentTitle}</h2>
              <p className="text-sm text-muted-foreground">{type} / bilingual</p>
            </div>
            <div className="flex gap-2">
              <button
                className="h-10 border border-border px-4 text-sm text-muted-foreground"
                onClick={remove}
                type="button"
              >
                Delete
              </button>
              <button
                className="h-10 border border-white bg-white px-5 text-sm text-black"
                onClick={save}
                type="button"
              >
                Save EN + ID
              </button>
            </div>
          </div>

          {message ? (
            <p className="border border-border px-3 py-2 text-sm text-muted-foreground">
              {message}
            </p>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Slug" onChange={setSlug} value={slug} />
            <label className="grid gap-2 text-sm text-muted-foreground">
              Status
              <select
                className="h-11 rounded-none border border-border bg-black px-3 text-foreground outline-none focus:border-white"
                onChange={(event) =>
                  updateBoth({ status: event.target.value as Status })
                }
                value={current.en.status}
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </label>
          </div>

          <div className="max-w-xs">
            {current.en.image ? (
              <ImageCard
                alt={current.en.alt}
                meta="cover"
                onDelete={async () => {
                  await deleteAsset(current.en.image);
                  updateBoth({ image: "" });
                }}
                onFile={async (file) => {
                  const image = await upload(file);
                  if (image) updateBoth({ image });
                }}
                src={current.en.image}
              />
            ) : (
              <label className="grid gap-2 text-sm text-muted-foreground">
                Upload cover
                <input
                  className="h-11 border border-border bg-black px-3 py-2 text-sm"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const image = await upload(file);
                    if (image) updateBoth({ image });
                    event.target.value = "";
                  }}
                  type="file"
                />
              </label>
            )}
          </div>

          {isWorkPair(current) ? (
            <WorkForm
              item={current}
              onChange={(locale, patch) => updateLocale<CmsWork>(locale, patch)}
              onDeleteAsset={deleteAsset}
              onUpload={upload}
            />
          ) : (
            <ArticleForm
              item={current as Pair<CmsArticle>}
              onChange={(locale, patch) => updateLocale<CmsArticle>(locale, patch)}
            />
          )}
        </section>
      </div>
    </main>
  );
}

function WorkForm({
  item,
  onChange,
  onDeleteAsset,
  onUpload,
}: {
  item: Pair<CmsWork>;
  onChange: (locale: Locale, patch: Partial<CmsWork>) => void;
  onDeleteAsset: (src: string) => Promise<void>;
  onUpload: (file: File) => Promise<string | null>;
}) {
  const [draft, setDraft] = useState<GalleryDraft | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const openGalleryUpload = async (file: File) => {
    const src = await onUpload(file);
    if (!src) return;
    setEditIndex(null);
    setDraft({
      src,
      alt: { en: "", id: "" },
      aspect: "16/9",
      span: "full",
      slot: "overview",
    });
  };

  const editGallery = (index: number) => {
    const en = item.en.gallery[index];
    const id = item.id.gallery[index];
    if (!en) return;
    setEditIndex(index);
    setDraft({
      src: en.src,
      alt: { en: en.alt, id: id?.alt ?? "" },
      aspect: en.aspect,
      span: en.span ?? spanForAspect(en.aspect),
      slot: en.slot,
    });
  };

  const saveDraft = () => {
    if (!draft) return;

    const nextFor = (locale: Locale): WorkGalleryItemData => ({
      src: draft.src,
      alt: draft.alt[locale],
      aspect: draft.aspect,
      span: spanForAspect(draft.aspect),
      slot: draft.slot,
    });

    for (const locale of locales) {
      const gallery = [...item[locale].gallery];
      if (editIndex === null) gallery.push(nextFor(locale));
      else gallery[editIndex] = nextFor(locale);
      onChange(locale, { gallery });
    }

    setDraft(null);
    setEditIndex(null);
  };

  const removeGallery = async (index: number) => {
    const src = item.en.gallery[index]?.src;
    if (src) await onDeleteAsset(src);

    for (const locale of locales) {
      onChange(locale, {
        gallery: item[locale].gallery.filter((_, itemIndex) => itemIndex !== index),
      });
    }
  };

  return (
    <div className="space-y-6">
      <LocaleGrid>
        {locales.map((locale) => (
          <div className="space-y-4 border border-border p-4" key={locale}>
            <h3 className="text-sm uppercase text-muted-foreground">{locale}</h3>
            <Field
              label="Title"
              onChange={(title) => onChange(locale, { title })}
              value={item[locale].title}
            />
            <Field
              label="Description"
              onChange={(description) => onChange(locale, { description })}
              value={item[locale].description}
            />
            <Field
              label="Alt"
              onChange={(alt) => onChange(locale, { alt })}
              value={item[locale].alt}
            />
            <Field
              label="Year"
              onChange={(year) => onChange(locale, { year })}
              value={item[locale].year}
            />
            <Field
              label="Category"
              onChange={(category) => onChange(locale, { category })}
              value={item[locale].category}
            />
            <Field
              label="Role"
              onChange={(role) => onChange(locale, { role })}
              value={item[locale].role}
            />
            <Field
              label="Client"
              onChange={(client) => onChange(locale, { client })}
              value={item[locale].client}
            />
            <Area
              label="Summary"
              rows={3}
              onChange={(summary) => onChange(locale, { summary })}
              value={item[locale].summary}
            />
          </div>
        ))}
      </LocaleGrid>

      {slots.map((slot) => (
        <LocaleGrid key={slot}>
          {locales.map((locale) => {
            const index = item[locale].sections.findIndex(
              (section) => section.slot === slot,
            );
            const section =
              item[locale].sections[index] ?? emptyWork.sections[slots.indexOf(slot)];

            return (
              <div className="grid gap-3 border border-border p-4" key={locale}>
                <Field
                  label={`${locale} ${slot} heading`}
                  onChange={(heading) => {
                    const sections = [...item[locale].sections];
                    sections[index] = { ...section, heading };
                    onChange(locale, { sections });
                  }}
                  value={section.heading}
                />
                <Area
                  label={`${locale} ${slot} body`}
                  onChange={(value) => {
                    const sections = [...item[locale].sections];
                    sections[index] = { ...section, body: splitParagraphs(value) };
                    onChange(locale, { sections });
                  }}
                  value={joinParagraphs(section.body)}
                />
              </div>
            );
          })}
        </LocaleGrid>
      ))}

      <div className="space-y-3">
        <label className="grid gap-2 text-sm text-muted-foreground">
          Upload gallery image
          <input
            className="h-11 border border-border bg-black px-3 py-2 text-sm"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void openGalleryUpload(file);
              event.target.value = "";
            }}
            type="file"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {item.en.gallery.map((image, index) => (
            <ImageCard
              alt={image.alt}
              key={`${image.src}-${index}`}
              meta={`${image.slot} / ${image.aspect} / ${image.span ?? spanForAspect(image.aspect)}`}
              onDelete={() => void removeGallery(index)}
              onEdit={() => editGallery(index)}
              src={image.src}
            />
          ))}
        </div>
      </div>

      {draft ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-5">
          <div className="w-full max-w-4xl border border-border bg-background p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl">Gallery image</h3>
                <p className="mt-1 break-all text-xs text-muted-foreground">
                  {draft.src}
                </p>
              </div>
              <button
                className="text-sm text-muted-foreground"
                onClick={() => {
                  setDraft(null);
                  setEditIndex(null);
                }}
                type="button"
              >
                Close
              </button>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
              <img alt={draft.alt.en} className="aspect-video w-full object-cover" src={draft.src} />
              <div className="grid content-start gap-4">
                <LocaleGrid>
                  {locales.map((locale) => (
                    <Field
                      key={locale}
                      label={`Alt ${locale}`}
                      onChange={(alt) =>
                        setDraft({ ...draft, alt: { ...draft.alt, [locale]: alt } })
                      }
                      value={draft.alt[locale]}
                    />
                  ))}
                </LocaleGrid>
                <label className="grid gap-2 text-sm text-muted-foreground">
                  Aspect ratio
                  <select
                    className="h-11 rounded-none border border-border bg-black px-3 text-foreground outline-none focus:border-white"
                    onChange={(event) => {
                      const aspect = event.target.value as WorkGalleryItemData["aspect"];
                      setDraft({ ...draft, aspect, span: spanForAspect(aspect) });
                    }}
                    value={draft.aspect}
                  >
                    {aspectOptions.map((aspect) => (
                      <option key={aspect} value={aspect}>
                        {aspect}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm text-muted-foreground">
                  Slot
                  <select
                    className="h-11 rounded-none border border-border bg-black px-3 text-foreground outline-none focus:border-white"
                    onChange={(event) =>
                      setDraft({ ...draft, slot: event.target.value as WorkSectionSlot })
                    }
                    value={draft.slot}
                  >
                    {slots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="h-10 w-full border border-white bg-white px-5 text-sm text-black"
                  onClick={saveDraft}
                  type="button"
                >
                  Save image
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ArticleForm({
  item,
  onChange,
}: {
  item: Pair<CmsArticle>;
  onChange: (locale: Locale, patch: Partial<CmsArticle>) => void;
}) {
  return (
    <LocaleGrid>
      {locales.map((locale) => {
        const block = item[locale].blocks[0] ?? { heading: "", paragraphs: [""] };

        return (
          <div className="space-y-4 border border-border p-4" key={locale}>
            <h3 className="text-sm uppercase text-muted-foreground">{locale}</h3>
            <Field
              label="Title"
              onChange={(title) => onChange(locale, { title })}
              value={item[locale].title}
            />
            <Field
              label="Description"
              onChange={(description) => onChange(locale, { description })}
              value={item[locale].description}
            />
            <Field
              label="Alt"
              onChange={(alt) => onChange(locale, { alt })}
              value={item[locale].alt}
            />
            <Field
              label="Published at"
              onChange={(publishedAt) => onChange(locale, { publishedAt })}
              value={item[locale].publishedAt}
            />
            <Area
              label="Lead"
              rows={4}
              onChange={(lead) => onChange(locale, { lead })}
              value={item[locale].lead}
            />
            <Field
              label="Block heading"
              onChange={(heading) =>
                onChange(locale, { blocks: [{ ...block, heading }] })
              }
              value={block.heading ?? ""}
            />
            <Area
              label="Article paragraphs"
              rows={12}
              onChange={(value) =>
                onChange(locale, {
                  blocks: [{ ...block, paragraphs: splitParagraphs(value) }],
                })
              }
              value={joinParagraphs(block.paragraphs)}
            />
          </div>
        );
      })}
    </LocaleGrid>
  );
}
