"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { Locale, WorkSectionSlot } from "@/types/content";

import { CmsArticleForm, type CmsArticle } from "@/components/cms/cms-article-form";
import { CmsLayout } from "@/components/cms/cms-layout";
import { CmsListView, type ListItem } from "@/components/cms/cms-list-view";
import { CmsPageForm, type Pair } from "@/components/cms/cms-page-form";
import { CmsWorkForm, type CmsWork } from "@/components/cms/cms-work-form";
import type { CmsPageInput } from "@/lib/supabase-content";

type ContentType = "work" | "articles" | "pages";
type CmsItem = CmsWork | CmsArticle | CmsPageInput;
type CmsPair = Pair<CmsItem>;

const locales: Locale[] = ["en", "id"];
const slots: WorkSectionSlot[] = ["overview", "challenge", "approach", "outcome"];

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
  category: "",
  publishedAt: "",
  lead: "",
  blocks: [{ heading: "", paragraphs: [""] }],
  gallery: [],
};

function cloneWork(locale: Locale): CmsWork {
  return structuredClone({ ...emptyWork, locale });
}

function cloneArticle(locale: Locale): CmsArticle {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return structuredClone({ 
    ...emptyArticle, 
    locale,
    publishedAt: `${yyyy}-${mm}-${dd}`
  });
}

function makePair(type: ContentType): CmsPair {
  // `pages` can't be created via `makePair` because they are fixed. This is just for TypeScript.
  if (type === "pages") {
    return {
      en: { locale: "en", slug: "global", status: "published", data: {} } as CmsPageInput,
      id: { locale: "id", slug: "global", status: "published", data: {} } as CmsPageInput,
    };
  }
  return {
    en: type === "work" ? cloneWork("en") : cloneArticle("en"),
    id: type === "work" ? cloneWork("id") : cloneArticle("id"),
  };
}

function isWorkItem(item: CmsItem): item is CmsWork {
  return "sections" in item && "year" in item;
}

function isWorkPair(pair: CmsPair): pair is Pair<CmsWork> {
  return isWorkItem(pair.en) && isWorkItem(pair.id);
}

function isPageItem(item: CmsItem): item is CmsPageInput {
  return "data" in item;
}

function isPagePair(pair: CmsPair): pair is Pair<CmsPageInput> {
  return isPageItem(pair.en) && isPageItem(pair.id);
}

export function ContentCms() {
  const [type, setType] = useState<ContentType>("work");
  const [items, setItems] = useState<Pair<CmsItem[]> | null>(null);
  const [current, setCurrent] = useState<CmsPair | null>(null);
  const [originalCurrent, setOriginalCurrent] = useState<CmsPair | null>(null);
  const [view, setView] = useState<"list" | "edit">("list");
  const [counts, setCounts] = useState({ work: 0, articles: 0, pages: 0 });
  const [pendingSelect, setPendingSelect] = useState<string | null>(null);

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

    const slugCount = new Set([...enData.items, ...idData.items].map((i) => i.slug)).size;
    
    const types: ContentType[] = ["work", "articles", "pages"];
    const otherTypes = types.filter(t => t !== type);
    
    const [res1, res2] = await Promise.all([
      fetch(`/api/cms/content?type=${otherTypes[0]}&locale=en`),
      fetch(`/api/cms/content?type=${otherTypes[1]}&locale=en`),
    ]);
    const data1 = (await res1.json()) as { items: CmsItem[] };
    const data2 = (await res2.json()) as { items: CmsItem[] };
    
    setCounts({
      [type]: slugCount,
      [otherTypes[0]]: data1.items.length,
      [otherTypes[1]]: data2.items.length,
    } as { work: number; articles: number; pages: number });

    return { en: enData.items, id: idData.items };
  };

  useEffect(() => {
    let ignore = false;
    
    if (!pendingSelect) {
      setView("list");
      setCurrent(null);
      setOriginalCurrent(null);
    }

    loadItems().then((loaded) => {
      if (!ignore) {
        setItems(loaded);
      }
    });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const selectItem = (itemSlug: string, sourceItems = items) => {
    const next = makePair(type);
    for (const locale of locales) {
      next[locale] =
        sourceItems?.[locale].find((item) => item.slug === itemSlug) ?? next[locale];
    }
    next.en.slug = itemSlug;
    next.id.slug = itemSlug;
    const nextClone = structuredClone(next);
    setCurrent(nextClone);
    setOriginalCurrent(structuredClone(nextClone));
    setView("edit");
  };

  useEffect(() => {
    if (pendingSelect && items && type === "pages") {
      selectItem(pendingSelect, items);
      setPendingSelect(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingSelect, items, type]);

  const handlePageSelect = (slug: string) => {
    if (type !== "pages") {
      setType("pages");
      setPendingSelect(slug);
    } else {
      if (items) {
        selectItem(slug, items);
      } else {
        setPendingSelect(slug);
      }
    }
  };

  const save = async () => {
    if (!current) return;
    const slug = current.en.slug;
    
    if (!slug.trim()) {
      toast.error("Slug is required.");
      return;
    }

    try {
      const res = await fetch("/api/cms/content", {
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

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(`Error: ${err.error || res.statusText}`);
        return;
      }
      
      await loadItems();
      toast.success("Saved successfully.");
      if (type !== "pages") {
        setView("list");
      } else {
        setOriginalCurrent(structuredClone(current));
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(`Error saving: ${msg}`);
    }
  };

  const remove = async () => {
    if (!current) return;
    const slug = current.en.slug;
    if (!slug.trim()) return;

    try {
      const res = await fetch("/api/cms/content", {
        body: JSON.stringify({ slug, type }),
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(`Error: ${err.error || res.statusText}`);
        return;
      }
      
      await loadItems();
      setView("list");
      toast.success("Deleted successfully.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(`Error deleting: ${msg}`);
    }
  };

  const upload = async (file: File) => {
    if (!current) return null;
    const slug = current.en.slug;
    
    if (!slug.trim()) {
      toast.error("Set slug before uploading.");
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
      toast.error(data.error ?? "Upload failed.");
      return null;
    }

    return data.src;
  };

  const deleteAsset = async (src: string) => {
    await fetch("/api/cms/upload", {
      body: JSON.stringify({ src }),
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
    });
  };

  const handleNew = () => {
    const next = makePair(type);
    setCurrent(next);
    setOriginalCurrent(structuredClone(next));
    setView("edit");
  };

  const handleReorder = async (slugs: string[]) => {
    if (!items) return;

    const reorderLocale = (localeItems: CmsItem[]) =>
      slugs
        .map((s) => localeItems.find((i) => i.slug === s))
        .filter((i): i is CmsItem => i !== undefined);

    setItems({
      en: reorderLocale(items.en),
      id: reorderLocale(items.id),
    });

    try {
      const response = await fetch("/api/cms/reorder", {
        body: JSON.stringify({ type, order: slugs }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(error.error || response.statusText);
      }
    } catch (error) {
      await loadItems();
      const message = error instanceof Error ? error.message : "Reorder failed.";
      toast.error(`Order update failed: ${message}`);
    }
  };

  const slugs = Array.from(
    new Set([...(items?.en ?? []), ...(items?.id ?? [])].map((item) => item.slug)),
  );

  const listItems: ListItem[] = slugs.map((itemSlug) => {
    const en = items?.en.find((i) => i.slug === itemSlug);
    const id = items?.id.find((i) => i.slug === itemSlug);
    const item = en ?? id;
    return {
      slug: itemSlug,
      enTitle: en ? (!isPageItem(en) ? en.title : en.slug) : "",
      idTitle: id ? (!isPageItem(id) ? id.title : id.slug) : "",
      image: item && !isPageItem(item) ? item.image : "",
      status: (item?.status ?? "draft") as "draft" | "published",
      meta: item ? (isWorkItem(item) ? item.year : isPageItem(item) ? "Page" : (item as CmsArticle).publishedAt) : "",
    };
  });

  const hasChanges = JSON.stringify(current) !== JSON.stringify(originalCurrent);

  return (
    <CmsLayout
      activeType={type}
      activeSlug={current?.en.slug}
      counts={counts}
      onTypeChange={(newType) => {
        setType(newType);
        if (newType !== "pages") setPendingSelect(null);
      }}
      onPageSelect={handlePageSelect}
    >
      {view === "list" && type !== "pages" ? (
        <CmsListView
          items={listItems}
          onNew={handleNew}
          onReorder={handleReorder}
          onSelect={(s) => selectItem(s)}
          type={type}
        />
      ) : current ? (
        isWorkPair(current) ? (
          <CmsWorkForm
            hasChanges={hasChanges}
            item={current}
            onBack={() => setView("list")}
            onDelete={remove}
            onDeleteAsset={deleteAsset}
            onLocaleChange={(locale, patch) => {
              setCurrent((pair) => pair ? { ...pair, [locale]: { ...pair[locale], ...patch } } : pair);
            }}
            onSave={save}
            onSlugChange={(s) => {
              setCurrent((pair) => pair ? { en: { ...pair.en, slug: s }, id: { ...pair.id, slug: s } } : pair);
            }}
            onStatusChange={(s) => {
              setCurrent((pair) => pair ? { en: { ...pair.en, status: s }, id: { ...pair.id, status: s } } : pair);
            }}
            onUpload={upload}
            slug={current.en.slug}
          />
        ) : isPagePair(current) ? (
          <CmsPageForm
            hasChanges={hasChanges}
            item={current}
            onLocaleChange={(locale, patch) => {
              setCurrent((pair) => pair ? { ...pair, [locale]: { ...pair[locale], ...patch } } : pair);
            }}
            onSave={save}
            onUpload={upload}
            onDeleteAsset={deleteAsset}
          />
        ) : (
          <CmsArticleForm
            hasChanges={hasChanges}
            item={current as Pair<CmsArticle>}
            onBack={() => setView("list")}
            onDelete={remove}
            onDeleteAsset={deleteAsset}
            onLocaleChange={(locale, patch) => {
              setCurrent((pair) => pair ? { ...pair, [locale]: { ...pair[locale], ...patch } } : pair);
            }}
            onSave={save}
            onSlugChange={(s) => {
              setCurrent((pair) => pair ? { en: { ...pair.en, slug: s }, id: { ...pair.id, slug: s } } : pair);
            }}
            onStatusChange={(s) => {
              setCurrent((pair) => pair ? { en: { ...pair.en, status: s }, id: { ...pair.id, status: s } } : pair);
            }}
            onUpload={upload}
            slug={current.en.slug}
          />
        )
      ) : type === "pages" ? (
        <div className="flex h-[50vh] items-center justify-center text-sm text-muted-foreground">
          Pilih salah satu halaman dari menu di sebelah kiri untuk mengedit.
        </div>
      ) : null}
    </CmsLayout>
  );
}
