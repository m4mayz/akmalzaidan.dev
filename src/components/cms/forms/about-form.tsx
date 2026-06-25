import { Area, Field, LocaleGrid } from "@/components/cms/cms-field";
import { ImageCard } from "@/components/cms/cms-image-upload";
import type { Locale, AboutData } from "@/types/content";

export function AboutForm({
  data,
  onChange,
  onUpload,
  onDeleteAsset,
}: {
  data: Record<Locale, AboutData>;
  onChange: (locale: Locale, patch: Partial<AboutData>) => void;
  onUpload?: (file: File) => Promise<string | null>;
  onDeleteAsset?: (src: string) => Promise<void>;
}) {
  const updateEn = (patch: Partial<AboutData>) => onChange("en", patch);
  const updateId = (patch: Partial<AboutData>) => onChange("id", patch);

  const updateImageSrc = async (index: number, file: File) => {
    if (!onUpload) return;
    const src = await onUpload(file);
    if (!src) return;

    for (const locale of ["en", "id"] as const) {
      const arr = [...(data[locale].images ?? [])];
      while (arr.length <= index) arr.push({ src: "", alt: "" });
      arr[index] = { ...arr[index], src };
      onChange(locale, { images: arr });
    }
  };

  const updateImageAlt = (index: number, locale: Locale, alt: string) => {
    const arr = [...(data[locale].images ?? [])];
    if (arr[index]) {
      arr[index] = { ...arr[index], alt };
      onChange(locale, { images: arr });
    }
  };

  const removeImage = async (index: number) => {
    if (!onDeleteAsset) return;
    const src = data.en.images?.[index]?.src;
    if (src) await onDeleteAsset(src);

    for (const locale of ["en", "id"] as const) {
      const arr = [...(data[locale].images ?? [])];
      // Keep the slot, just empty it out, to preserve indices for Hero and Philosophy
      if (index === 0 || index === 1) {
        arr[index] = { src: "", alt: "" };
      } else {
        arr.splice(index, 1);
      }
      onChange(locale, { images: arr });
    }
  };

  const renderImageSlot = (index: number, label: string) => {
    const image = data.en.images?.[index];
    return (
      <div className="space-y-3 pt-6 border-t border-border mt-6">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {image?.src ? (
          <div className="grid gap-2 max-w-xs">
            <ImageCard
              alt={image.alt}
              meta={label}
              onDelete={() => void removeImage(index)}
              src={image.src}
            />
            <LocaleGrid>
              {["en", "id"].map((loc) => (
                <Field
                  key={loc}
                  label={`Alt ${loc}`}
                  onChange={(val) => updateImageAlt(index, loc as Locale, val)}
                  value={data[loc as Locale].images?.[index]?.alt ?? ""}
                />
              ))}
            </LocaleGrid>
          </div>
        ) : (
          <input
            className="h-11 border border-border bg-black px-3 py-2 text-sm w-full max-w-xs"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void updateImageSrc(index, file);
              if (event.target) event.target.value = "";
            }}
            type="file"
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <h3 className="border-b border-border pb-2 text-lg font-medium text-foreground">Header</h3>
        <LocaleGrid>
          <Field label="EN Headline" value={data.en.headline ?? ""} onChange={(v) => updateEn({ headline: v })} />
          <Field label="ID Headline" value={data.id.headline ?? ""} onChange={(v) => updateId({ headline: v })} />
        </LocaleGrid>
        <LocaleGrid>
          <Field label="EN Subhead" value={data.en.subhead ?? ""} onChange={(v) => updateEn({ subhead: v })} />
          <Field label="ID Subhead" value={data.id.subhead ?? ""} onChange={(v) => updateId({ subhead: v })} />
        </LocaleGrid>
        <LocaleGrid>
          <Area label="EN Intro (Separate paragraphs by double newlines)" rows={8} value={(data.en.intro ?? []).join("\n\n")} onChange={(v) => updateEn({ intro: v.split("\n\n").map((s) => s.trim()).filter(Boolean) })} />
          <Area label="ID Intro (Separate paragraphs by double newlines)" rows={8} value={(data.id.intro ?? []).join("\n\n")} onChange={(v) => updateId({ intro: v.split("\n\n").map((s) => s.trim()).filter(Boolean) })} />
        </LocaleGrid>
        {renderImageSlot(0, "Hero Image")}
      </section>

      <section className="space-y-6">
        <h3 className="border-b border-border pb-2 text-lg font-medium text-foreground">Philosophy</h3>
        <LocaleGrid>
          <Field label="EN Philosophy Title" value={data.en.philosophyTitle ?? ""} onChange={(v) => updateEn({ philosophyTitle: v })} />
          <Field label="ID Philosophy Title" value={data.id.philosophyTitle ?? ""} onChange={(v) => updateId({ philosophyTitle: v })} />
        </LocaleGrid>
        <LocaleGrid>
          <Area label="EN Philosophy (Separate paragraphs by double newlines)" rows={8} value={(data.en.philosophy ?? []).join("\n\n")} onChange={(v) => updateEn({ philosophy: v.split("\n\n").map((s) => s.trim()).filter(Boolean) })} />
          <Area label="ID Philosophy (Separate paragraphs by double newlines)" rows={8} value={(data.id.philosophy ?? []).join("\n\n")} onChange={(v) => updateId({ philosophy: v.split("\n\n").map((s) => s.trim()).filter(Boolean) })} />
        </LocaleGrid>
        {renderImageSlot(1, "Philosophy Image")}
      </section>

      <section className="space-y-6">
        <h3 className="border-b border-border pb-2 text-lg font-medium text-foreground">Experiences</h3>
        <LocaleGrid>
          <Field label="EN Experience Title" value={data.en.experienceTitle ?? ""} onChange={(v) => updateEn({ experienceTitle: v })} />
          <Field label="ID Experience Title" value={data.id.experienceTitle ?? ""} onChange={(v) => updateId({ experienceTitle: v })} />
        </LocaleGrid>
        {(data.en.experiences ?? []).map((_, i) => (
          <div className="relative space-y-4 rounded-lg border border-border p-4 pt-10" key={i}>
            <div className="absolute right-3 top-3 flex items-center gap-3">
              {i > 0 && (
                <button
                  className="text-xs text-muted-foreground hover:text-white"
                  onClick={() => {
                    const enArr = [...data.en.experiences];
                    [enArr[i - 1], enArr[i]] = [enArr[i], enArr[i - 1]];
                    updateEn({ experiences: enArr });
                    const idArr = [...data.id.experiences];
                    [idArr[i - 1], idArr[i]] = [idArr[i], idArr[i - 1]];
                    updateId({ experiences: idArr });
                  }}
                  type="button"
                >
                  ↑ Up
                </button>
              )}
              {i < (data.en.experiences?.length ?? 0) - 1 && (
                <button
                  className="text-xs text-muted-foreground hover:text-white"
                  onClick={() => {
                    const enArr = [...data.en.experiences];
                    [enArr[i], enArr[i + 1]] = [enArr[i + 1], enArr[i]];
                    updateEn({ experiences: enArr });
                    const idArr = [...data.id.experiences];
                    [idArr[i], idArr[i + 1]] = [idArr[i + 1], idArr[i]];
                    updateId({ experiences: idArr });
                  }}
                  type="button"
                >
                  ↓ Down
                </button>
              )}
              <button
                className="text-xs text-red-500 hover:text-red-400"
                onClick={() => {
                  const enArr = [...data.en.experiences]; enArr.splice(i, 1); updateEn({ experiences: enArr });
                  const idArr = [...data.id.experiences]; idArr.splice(i, 1); updateId({ experiences: idArr });
                }}
                type="button"
              >
                Remove
              </button>
            </div>
            <h4 className="absolute left-4 top-4 text-sm font-medium text-muted-foreground">Experience {i + 1}</h4>
            <LocaleGrid>
              <Field label="EN Title" value={data.en.experiences[i]?.title ?? ""} onChange={(v) => {
                const arr = [...data.en.experiences]; arr[i] = { ...arr[i], title: v }; updateEn({ experiences: arr });
              }} />
              <Field label="ID Title" value={data.id.experiences[i]?.title ?? ""} onChange={(v) => {
                const arr = [...data.id.experiences]; arr[i] = { ...arr[i], title: v }; updateId({ experiences: arr });
              }} />
            </LocaleGrid>
            <LocaleGrid>
              <Field label="EN Organization" value={data.en.experiences[i]?.organization ?? ""} onChange={(v) => {
                const arr = [...data.en.experiences]; arr[i] = { ...arr[i], organization: v }; updateEn({ experiences: arr });
              }} />
              <Field label="ID Organization" value={data.id.experiences[i]?.organization ?? ""} onChange={(v) => {
                const arr = [...data.id.experiences]; arr[i] = { ...arr[i], organization: v }; updateId({ experiences: arr });
              }} />
            </LocaleGrid>
            <LocaleGrid>
              <Field label="EN Period" value={data.en.experiences[i]?.period ?? ""} onChange={(v) => {
                const arr = [...data.en.experiences]; arr[i] = { ...arr[i], period: v }; updateEn({ experiences: arr });
              }} />
              <Field label="ID Period" value={data.id.experiences[i]?.period ?? ""} onChange={(v) => {
                const arr = [...data.id.experiences]; arr[i] = { ...arr[i], period: v }; updateId({ experiences: arr });
              }} />
            </LocaleGrid>
          </div>
        ))}
        <button
          className="h-10 border border-border px-4 text-sm hover:bg-white/5"
          onClick={() => {
            const newItem = { title: "", organization: "", period: "" };
            updateEn({ experiences: [...(data.en.experiences ?? []), newItem] });
            updateId({ experiences: [...(data.id.experiences ?? []), newItem] });
          }}
          type="button"
        >
          + Add Experience
        </button>
      </section>

      <section className="space-y-6">
        <h3 className="border-b border-border pb-2 text-lg font-medium text-foreground">Education</h3>
        <LocaleGrid>
          <Field label="EN Education Title" value={data.en.educationTitle ?? ""} onChange={(v) => updateEn({ educationTitle: v })} />
          <Field label="ID Education Title" value={data.id.educationTitle ?? ""} onChange={(v) => updateId({ educationTitle: v })} />
        </LocaleGrid>
        {(data.en.education ?? []).map((_, i) => (
          <div className="relative space-y-4 rounded-lg border border-border p-4 pt-10" key={i}>
            <div className="absolute right-3 top-3 flex items-center gap-3">
              {i > 0 && (
                <button
                  className="text-xs text-muted-foreground hover:text-white"
                  onClick={() => {
                    const enArr = [...data.en.education];
                    [enArr[i - 1], enArr[i]] = [enArr[i], enArr[i - 1]];
                    updateEn({ education: enArr });
                    const idArr = [...data.id.education];
                    [idArr[i - 1], idArr[i]] = [idArr[i], idArr[i - 1]];
                    updateId({ education: idArr });
                  }}
                  type="button"
                >
                  ↑ Up
                </button>
              )}
              {i < (data.en.education?.length ?? 0) - 1 && (
                <button
                  className="text-xs text-muted-foreground hover:text-white"
                  onClick={() => {
                    const enArr = [...data.en.education];
                    [enArr[i], enArr[i + 1]] = [enArr[i + 1], enArr[i]];
                    updateEn({ education: enArr });
                    const idArr = [...data.id.education];
                    [idArr[i], idArr[i + 1]] = [idArr[i + 1], idArr[i]];
                    updateId({ education: idArr });
                  }}
                  type="button"
                >
                  ↓ Down
                </button>
              )}
              <button
                className="text-xs text-red-500 hover:text-red-400"
                onClick={() => {
                  const enArr = [...data.en.education]; enArr.splice(i, 1); updateEn({ education: enArr });
                  const idArr = [...data.id.education]; idArr.splice(i, 1); updateId({ education: idArr });
                }}
                type="button"
              >
                Remove
              </button>
            </div>
            <h4 className="absolute left-4 top-4 text-sm font-medium text-muted-foreground">Education {i + 1}</h4>
            <LocaleGrid>
              <Field label="EN Title" value={data.en.education[i]?.title ?? ""} onChange={(v) => {
                const arr = [...data.en.education]; arr[i] = { ...arr[i], title: v }; updateEn({ education: arr });
              }} />
              <Field label="ID Title" value={data.id.education[i]?.title ?? ""} onChange={(v) => {
                const arr = [...data.id.education]; arr[i] = { ...arr[i], title: v }; updateId({ education: arr });
              }} />
            </LocaleGrid>
            <LocaleGrid>
              <Field label="EN Organization" value={data.en.education[i]?.organization ?? ""} onChange={(v) => {
                const arr = [...data.en.education]; arr[i] = { ...arr[i], organization: v }; updateEn({ education: arr });
              }} />
              <Field label="ID Organization" value={data.id.education[i]?.organization ?? ""} onChange={(v) => {
                const arr = [...data.id.education]; arr[i] = { ...arr[i], organization: v }; updateId({ education: arr });
              }} />
            </LocaleGrid>
            <LocaleGrid>
              <Field label="EN Period" value={data.en.education[i]?.period ?? ""} onChange={(v) => {
                const arr = [...data.en.education]; arr[i] = { ...arr[i], period: v }; updateEn({ education: arr });
              }} />
              <Field label="ID Period" value={data.id.education[i]?.period ?? ""} onChange={(v) => {
                const arr = [...data.id.education]; arr[i] = { ...arr[i], period: v }; updateId({ education: arr });
              }} />
            </LocaleGrid>
          </div>
        ))}
        <button
          className="h-10 border border-border px-4 text-sm hover:bg-white/5"
          onClick={() => {
            const newItem = { title: "", organization: "", period: "" };
            updateEn({ education: [...(data.en.education ?? []), newItem] });
            updateId({ education: [...(data.id.education ?? []), newItem] });
          }}
          type="button"
        >
          + Add Education
        </button>
      </section>

      <section className="space-y-6">
        <h3 className="border-b border-border pb-2 text-lg font-medium text-foreground">Skills</h3>
        <LocaleGrid>
          <Field label="EN Skills Title" value={data.en.skillsTitle ?? ""} onChange={(v) => updateEn({ skillsTitle: v })} />
          <Field label="ID Skills Title" value={data.id.skillsTitle ?? ""} onChange={(v) => updateId({ skillsTitle: v })} />
        </LocaleGrid>
        <LocaleGrid>
          <Area label="EN Skills (Separate by newlines)" rows={6} value={(data.en.skills ?? []).join("\n")} onChange={(v) => updateEn({ skills: v.split("\n").map((s) => s.trim()).filter(Boolean) })} />
          <Area label="ID Skills (Separate by newlines)" rows={6} value={(data.id.skills ?? []).join("\n")} onChange={(v) => updateId({ skills: v.split("\n").map((s) => s.trim()).filter(Boolean) })} />
        </LocaleGrid>
      </section>

      <section className="space-y-6">
        <h3 className="border-b border-border pb-2 text-lg font-medium text-foreground">Tools</h3>
        <LocaleGrid>
          <Field label="EN Tools Title" value={data.en.toolsTitle ?? ""} onChange={(v) => updateEn({ toolsTitle: v })} />
          <Field label="ID Tools Title" value={data.id.toolsTitle ?? ""} onChange={(v) => updateId({ toolsTitle: v })} />
        </LocaleGrid>
        <LocaleGrid>
          <Area label="EN Tools (Separate by newlines)" rows={6} value={(data.en.tools ?? []).join("\n")} onChange={(v) => updateEn({ tools: v.split("\n").map((s) => s.trim()).filter(Boolean) })} />
          <Area label="ID Tools (Separate by newlines)" rows={6} value={(data.id.tools ?? []).join("\n")} onChange={(v) => updateId({ tools: v.split("\n").map((s) => s.trim()).filter(Boolean) })} />
        </LocaleGrid>
      </section>

      <section className="space-y-6">
        <h3 className="border-b border-border pb-2 text-lg font-medium text-foreground">Beyond</h3>
        <LocaleGrid>
          <Field label="EN Beyond Title" value={data.en.beyondTitle ?? ""} onChange={(v) => updateEn({ beyondTitle: v })} />
          <Field label="ID Beyond Title" value={data.id.beyondTitle ?? ""} onChange={(v) => updateId({ beyondTitle: v })} />
        </LocaleGrid>
        <LocaleGrid>
          <Area label="EN Beyond (Separate paragraphs by double newlines)" rows={8} value={(data.en.beyond ?? []).join("\n\n")} onChange={(v) => updateEn({ beyond: v.split("\n\n").map((s) => s.trim()).filter(Boolean) })} />
          <Area label="ID Beyond (Separate paragraphs by double newlines)" rows={8} value={(data.id.beyond ?? []).join("\n\n")} onChange={(v) => updateId({ beyond: v.split("\n\n").map((s) => s.trim()).filter(Boolean) })} />
        </LocaleGrid>
        
        <div className="space-y-3 pt-6 border-t border-border mt-6">
          <label className="text-sm font-medium text-foreground">Gallery Images</label>
          <input
            className="h-11 border border-border bg-black px-3 py-2 text-sm w-full max-w-xs block"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                const nextIndex = Math.max(2, data.en.images?.length ?? 2);
                void updateImageSrc(nextIndex, file);
              }
              if (event.target) event.target.value = "";
            }}
            type="file"
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mt-4">
            {data.en.images?.slice(2).map((image, sliceIndex) => {
              const index = sliceIndex + 2;
              if (!image.src) return null;
              return (
                <div className="grid gap-2" key={`${image.src}-${index}`}>
                  <ImageCard
                    alt={image.alt}
                    meta={`Gallery Image ${sliceIndex + 1}`}
                    onDelete={() => void removeImage(index)}
                    src={image.src}
                  />
                  <LocaleGrid>
                    {["en", "id"].map((loc) => (
                      <Field
                        key={loc}
                        label={`Alt ${loc}`}
                        onChange={(val) => updateImageAlt(index, loc as Locale, val)}
                        value={data[loc as Locale].images?.[index]?.alt ?? ""}
                      />
                    ))}
                  </LocaleGrid>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
