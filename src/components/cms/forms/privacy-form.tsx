import { Area, Field, LocaleGrid } from "@/components/cms/cms-field";
import type { Locale, PrivacyData } from "@/types/content";

export function PrivacyForm({
  data,
  onChange,
}: {
  data: Record<Locale, PrivacyData>;
  onChange: (locale: Locale, patch: Partial<PrivacyData>) => void;
}) {
  const updateEn = (patch: Partial<PrivacyData>) => onChange("en", patch);
  const updateId = (patch: Partial<PrivacyData>) => onChange("id", patch);

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <h3 className="border-b border-border pb-2 text-lg font-medium text-foreground">Header</h3>
        <LocaleGrid>
          <Field label="EN Eyebrow" value={data.en.eyebrow ?? ""} onChange={(v) => updateEn({ eyebrow: v })} />
          <Field label="ID Eyebrow" value={data.id.eyebrow ?? ""} onChange={(v) => updateId({ eyebrow: v })} />
        </LocaleGrid>
        <LocaleGrid>
          <Field label="EN Title" value={data.en.title ?? ""} onChange={(v) => updateEn({ title: v })} />
          <Field label="ID Title" value={data.id.title ?? ""} onChange={(v) => updateId({ title: v })} />
        </LocaleGrid>
        <LocaleGrid>
          <Field label="EN Last Updated" value={data.en.lastUpdated ?? ""} onChange={(v) => updateEn({ lastUpdated: v })} />
          <Field label="ID Last Updated" value={data.id.lastUpdated ?? ""} onChange={(v) => updateId({ lastUpdated: v })} />
        </LocaleGrid>
        <LocaleGrid>
          <Area label="EN Intro" value={data.en.intro ?? ""} onChange={(v) => updateEn({ intro: v })} />
          <Area label="ID Intro" value={data.id.intro ?? ""} onChange={(v) => updateId({ intro: v })} />
        </LocaleGrid>
      </section>

      <section className="space-y-6">
        <h3 className="border-b border-border pb-2 text-lg font-medium text-foreground">Sections</h3>
        {(data.en.sections ?? []).map((_, i) => (
          <div className="space-y-4 rounded-lg border border-border p-4" key={i}>
            <h4 className="text-sm font-medium text-muted-foreground">Section {i + 1}</h4>
            <LocaleGrid>
              <Field label="EN Heading" value={data.en.sections[i]?.heading ?? ""} onChange={(v) => {
                const arr = [...data.en.sections]; arr[i] = { ...arr[i], heading: v }; updateEn({ sections: arr });
              }} />
              <Field label="ID Heading" value={data.id.sections[i]?.heading ?? ""} onChange={(v) => {
                const arr = [...data.id.sections]; arr[i] = { ...arr[i], heading: v }; updateId({ sections: arr });
              }} />
            </LocaleGrid>

            {data.en.sections[i]?.paragraphs !== undefined && (
              <LocaleGrid>
                <Area label="EN Paragraphs (Separated by double newlines)" rows={6} value={(data.en.sections[i]?.paragraphs ?? []).join("\n\n")} onChange={(v) => {
                  const arr = [...data.en.sections]; arr[i] = { ...arr[i], paragraphs: v.split("\n\n").map(s => s.trim()).filter(Boolean) }; updateEn({ sections: arr });
                }} />
                <Area label="ID Paragraphs (Separated by double newlines)" rows={6} value={(data.id.sections[i]?.paragraphs ?? []).join("\n\n")} onChange={(v) => {
                  const arr = [...data.id.sections]; arr[i] = { ...arr[i], paragraphs: v.split("\n\n").map(s => s.trim()).filter(Boolean) }; updateId({ sections: arr });
                }} />
              </LocaleGrid>
            )}

            {data.en.sections[i]?.list !== undefined && (
              <LocaleGrid>
                <Area label="EN List (Separated by newlines)" rows={6} value={(data.en.sections[i]?.list ?? []).join("\n")} onChange={(v) => {
                  const arr = [...data.en.sections]; arr[i] = { ...arr[i], list: v.split("\n").map(s => s.trim()).filter(Boolean) }; updateEn({ sections: arr });
                }} />
                <Area label="ID List (Separated by newlines)" rows={6} value={(data.id.sections[i]?.list ?? []).join("\n")} onChange={(v) => {
                  const arr = [...data.id.sections]; arr[i] = { ...arr[i], list: v.split("\n").map(s => s.trim()).filter(Boolean) }; updateId({ sections: arr });
                }} />
              </LocaleGrid>
            )}

            {data.en.sections[i]?.groups !== undefined && (data.en.sections[i]?.groups ?? []).map((_, j) => (
              <div className="mt-4 space-y-4 rounded-lg bg-white/5 p-4" key={j}>
                <h5 className="text-xs font-medium text-muted-foreground">Group {j + 1}</h5>
                <LocaleGrid>
                  <Field label="EN Subheading" value={data.en.sections[i]?.groups![j]?.subheading ?? ""} onChange={(v) => {
                    const arr = [...data.en.sections]; const groups = [...arr[i].groups!]; groups[j] = { ...groups[j], subheading: v }; arr[i] = { ...arr[i], groups }; updateEn({ sections: arr });
                  }} />
                  <Field label="ID Subheading" value={data.id.sections[i]?.groups![j]?.subheading ?? ""} onChange={(v) => {
                    const arr = [...data.id.sections]; const groups = [...arr[i].groups!]; groups[j] = { ...groups[j], subheading: v }; arr[i] = { ...arr[i], groups }; updateId({ sections: arr });
                  }} />
                </LocaleGrid>
                <LocaleGrid>
                  <Area label="EN Paragraphs" rows={4} value={(data.en.sections[i]?.groups![j]?.paragraphs ?? []).join("\n\n")} onChange={(v) => {
                    const arr = [...data.en.sections]; const groups = [...arr[i].groups!]; groups[j] = { ...groups[j], paragraphs: v.split("\n\n").map(s => s.trim()).filter(Boolean) }; arr[i] = { ...arr[i], groups }; updateEn({ sections: arr });
                  }} />
                  <Area label="ID Paragraphs" rows={4} value={(data.id.sections[i]?.groups![j]?.paragraphs ?? []).join("\n\n")} onChange={(v) => {
                    const arr = [...data.id.sections]; const groups = [...arr[i].groups!]; groups[j] = { ...groups[j], paragraphs: v.split("\n\n").map(s => s.trim()).filter(Boolean) }; arr[i] = { ...arr[i], groups }; updateId({ sections: arr });
                  }} />
                </LocaleGrid>
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
