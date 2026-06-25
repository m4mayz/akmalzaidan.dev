import { Area, Field, LocaleGrid } from "@/components/cms/cms-field";
import type { Locale, HomeData } from "@/types/content";

export function HomeForm({
  data,
  onChange,
}: {
  data: Record<Locale, HomeData>;
  onChange: (locale: Locale, patch: Partial<HomeData>) => void;
}) {
  const updateEn = (patch: Partial<HomeData>) => onChange("en", patch);
  const updateId = (patch: Partial<HomeData>) => onChange("id", patch);

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <h3 className="border-b border-border pb-2 text-lg font-medium text-foreground">Hero</h3>
        <LocaleGrid>
          <Field label="EN Headline" value={data.en.hero?.headline ?? ""} onChange={(v) => updateEn({ hero: { ...data.en.hero, headline: v } })} />
          <Field label="ID Headline" value={data.id.hero?.headline ?? ""} onChange={(v) => updateId({ hero: { ...data.id.hero, headline: v } })} />
        </LocaleGrid>
        <LocaleGrid>
          <Field label="EN Highlighted Word" value={data.en.hero?.highlightedWord ?? ""} onChange={(v) => updateEn({ hero: { ...data.en.hero, highlightedWord: v } })} />
          <Field label="ID Highlighted Word" value={data.id.hero?.highlightedWord ?? ""} onChange={(v) => updateId({ hero: { ...data.id.hero, highlightedWord: v } })} />
        </LocaleGrid>
      </section>

      <section className="space-y-6">
        <h3 className="border-b border-border pb-2 text-lg font-medium text-foreground">Stats</h3>
        {(data.en.stats ?? []).map((_, i) => (
          <div className="space-y-4 rounded-lg border border-border p-4" key={i}>
            <h4 className="text-sm font-medium text-muted-foreground">Stat {i + 1}</h4>
            <LocaleGrid>
              <Field label="EN Value" value={data.en.stats[i]?.value ?? ""} onChange={(v) => {
                const arr = [...data.en.stats]; arr[i] = { ...arr[i], value: v }; updateEn({ stats: arr });
              }} />
              <Field label="ID Value" value={data.id.stats[i]?.value ?? ""} onChange={(v) => {
                const arr = [...data.id.stats]; arr[i] = { ...arr[i], value: v }; updateId({ stats: arr });
              }} />
            </LocaleGrid>
            <LocaleGrid>
              <Field label="EN Label" value={data.en.stats[i]?.label ?? ""} onChange={(v) => {
                const arr = [...data.en.stats]; arr[i] = { ...arr[i], label: v }; updateEn({ stats: arr });
              }} />
              <Field label="ID Label" value={data.id.stats[i]?.label ?? ""} onChange={(v) => {
                const arr = [...data.id.stats]; arr[i] = { ...arr[i], label: v }; updateId({ stats: arr });
              }} />
            </LocaleGrid>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <h3 className="border-b border-border pb-2 text-lg font-medium text-foreground">Services</h3>
        {(data.en.services ?? []).map((_, i) => (
          <div className="space-y-4 rounded-lg border border-border p-4" key={i}>
            <h4 className="text-sm font-medium text-muted-foreground">Service {data.en.services[i]?.number}</h4>
            <LocaleGrid>
              <Field label="EN Title" value={data.en.services[i]?.title ?? ""} onChange={(v) => {
                const arr = [...data.en.services]; arr[i] = { ...arr[i], title: v }; updateEn({ services: arr });
              }} />
              <Field label="ID Title" value={data.id.services[i]?.title ?? ""} onChange={(v) => {
                const arr = [...data.id.services]; arr[i] = { ...arr[i], title: v }; updateId({ services: arr });
              }} />
            </LocaleGrid>
            <LocaleGrid>
              <Area label="EN Description" value={data.en.services[i]?.description ?? ""} onChange={(v) => {
                const arr = [...data.en.services]; arr[i] = { ...arr[i], description: v }; updateEn({ services: arr });
              }} />
              <Area label="ID Description" value={data.id.services[i]?.description ?? ""} onChange={(v) => {
                const arr = [...data.id.services]; arr[i] = { ...arr[i], description: v }; updateId({ services: arr });
              }} />
            </LocaleGrid>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <h3 className="border-b border-border pb-2 text-lg font-medium text-foreground">Testimonials</h3>
        {(data.en.testimonials ?? []).map((_, i) => (
          <div className="relative space-y-4 rounded-lg border border-border p-4 pt-10" key={i}>
            <div className="absolute right-3 top-3 flex items-center gap-3">
              {i > 0 && (
                <button
                  className="text-xs text-muted-foreground hover:text-white"
                  onClick={() => {
                    const enArr = [...data.en.testimonials];
                    [enArr[i - 1], enArr[i]] = [enArr[i], enArr[i - 1]];
                    updateEn({ testimonials: enArr });
                    const idArr = [...data.id.testimonials];
                    [idArr[i - 1], idArr[i]] = [idArr[i], idArr[i - 1]];
                    updateId({ testimonials: idArr });
                  }}
                  type="button"
                >
                  ↑ Up
                </button>
              )}
              {i < (data.en.testimonials?.length ?? 0) - 1 && (
                <button
                  className="text-xs text-muted-foreground hover:text-white"
                  onClick={() => {
                    const enArr = [...data.en.testimonials];
                    [enArr[i], enArr[i + 1]] = [enArr[i + 1], enArr[i]];
                    updateEn({ testimonials: enArr });
                    const idArr = [...data.id.testimonials];
                    [idArr[i], idArr[i + 1]] = [idArr[i + 1], idArr[i]];
                    updateId({ testimonials: idArr });
                  }}
                  type="button"
                >
                  ↓ Down
                </button>
              )}
              <button
                className="text-xs text-red-500 hover:text-red-400"
                onClick={() => {
                  const enArr = [...data.en.testimonials]; enArr.splice(i, 1); updateEn({ testimonials: enArr });
                  const idArr = [...data.id.testimonials]; idArr.splice(i, 1); updateId({ testimonials: idArr });
                }}
                type="button"
              >
                Remove
              </button>
            </div>
            <h4 className="absolute left-4 top-4 text-sm font-medium text-muted-foreground">Testimonial {i + 1}</h4>
            <LocaleGrid>
              <Field label="EN Author" value={data.en.testimonials[i]?.author ?? ""} onChange={(v) => {
                const arr = [...data.en.testimonials]; arr[i] = { ...arr[i], author: v }; updateEn({ testimonials: arr });
              }} />
              <Field label="ID Author" value={data.id.testimonials[i]?.author ?? ""} onChange={(v) => {
                const arr = [...data.id.testimonials]; arr[i] = { ...arr[i], author: v }; updateId({ testimonials: arr });
              }} />
            </LocaleGrid>
            <LocaleGrid>
              <Field label="EN Role" value={data.en.testimonials[i]?.role ?? ""} onChange={(v) => {
                const arr = [...data.en.testimonials]; arr[i] = { ...arr[i], role: v }; updateEn({ testimonials: arr });
              }} />
              <Field label="ID Role" value={data.id.testimonials[i]?.role ?? ""} onChange={(v) => {
                const arr = [...data.id.testimonials]; arr[i] = { ...arr[i], role: v }; updateId({ testimonials: arr });
              }} />
            </LocaleGrid>
            <LocaleGrid>
              <Area label="EN Quote" value={data.en.testimonials[i]?.quote ?? ""} onChange={(v) => {
                const arr = [...data.en.testimonials]; arr[i] = { ...arr[i], quote: v }; updateEn({ testimonials: arr });
              }} />
              <Area label="ID Quote" value={data.id.testimonials[i]?.quote ?? ""} onChange={(v) => {
                const arr = [...data.id.testimonials]; arr[i] = { ...arr[i], quote: v }; updateId({ testimonials: arr });
              }} />
            </LocaleGrid>
          </div>
        ))}
        <button
          className="h-10 border border-border px-4 text-sm hover:bg-white/5"
          onClick={() => {
            const newItem = { author: "", role: "", quote: "" };
            updateEn({ testimonials: [...(data.en.testimonials ?? []), newItem] });
            updateId({ testimonials: [...(data.id.testimonials ?? []), newItem] });
          }}
          type="button"
        >
          + Add Testimonial
        </button>
      </section>
    </div>
  );
}
