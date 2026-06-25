import Image from "next/image";
import { useState } from "react";

import type { Locale, WorkGalleryItemData, WorkSectionSlot } from "@/types/content";

import { Field, LocaleGrid } from "@/components/cms/cms-field";
import { ImageCard } from "@/components/cms/cms-image-upload";

type Pair<T> = Record<Locale, T>;

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

function spanForAspect(
  aspect: WorkGalleryItemData["aspect"],
): WorkGalleryItemData["span"] {
  return aspect === "4/3" ? "half" : "full";
}

export function CmsGalleryEditor({
  gallery,
  onGalleryChange,
  onUpload,
  onDeleteAsset,
}: {
  gallery: Pair<WorkGalleryItemData[]>;
  onGalleryChange: (locale: Locale, gallery: WorkGalleryItemData[]) => void;
  onUpload: (file: File) => Promise<string | null>;
  onDeleteAsset: (src: string) => Promise<void>;
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
    const en = gallery.en[index];
    const id = gallery.id[index];
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
      const localeGallery = [...gallery[locale]];
      if (editIndex === null) localeGallery.push(nextFor(locale));
      else localeGallery[editIndex] = nextFor(locale);
      onGalleryChange(locale, localeGallery);
    }

    setDraft(null);
    setEditIndex(null);
  };

  const removeGallery = async (index: number) => {
    const src = gallery.en[index]?.src;
    if (src) await onDeleteAsset(src);

    for (const locale of locales) {
      onGalleryChange(
        locale,
        gallery[locale].filter((_, itemIndex) => itemIndex !== index),
      );
    }
  };

  return (
    <div className="space-y-3">
      <label className="grid gap-2 text-sm text-muted-foreground">
        Upload gallery image
        <input
          className="h-11 border border-border bg-black px-3 py-2 text-sm"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void openGalleryUpload(file);
            if (event.target) event.target.value = "";
          }}
          type="file"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {gallery.en.map((image, index) => (
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
              <div className="relative aspect-video w-full overflow-hidden">
                <Image alt={draft.alt.en} className="object-cover" fill src={draft.src} />
              </div>
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
