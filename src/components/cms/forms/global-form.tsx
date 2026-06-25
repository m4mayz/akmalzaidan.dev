import { Area, Field, LocaleGrid } from "@/components/cms/cms-field";
import type { Locale } from "@/types/content";

export type GlobalData = {
  role: string;
  location: string;
  availability: string;
  metadataDescription: string;
};

export function GlobalForm({
  data,
  onChange,
}: {
  data: Record<Locale, GlobalData>;
  onChange: (locale: Locale, patch: Partial<GlobalData>) => void;
}) {
  return (
    <div className="space-y-8">
      <LocaleGrid>
        <Field label="EN Role" value={data.en.role ?? ""} onChange={(v) => onChange("en", { role: v })} />
        <Field label="ID Role" value={data.id.role ?? ""} onChange={(v) => onChange("id", { role: v })} />
      </LocaleGrid>
      <LocaleGrid>
        <Field label="EN Location" value={data.en.location ?? ""} onChange={(v) => onChange("en", { location: v })} />
        <Field label="ID Location" value={data.id.location ?? ""} onChange={(v) => onChange("id", { location: v })} />
      </LocaleGrid>
      <LocaleGrid>
        <Field label="EN Availability" value={data.en.availability ?? ""} onChange={(v) => onChange("en", { availability: v })} />
        <Field label="ID Availability" value={data.id.availability ?? ""} onChange={(v) => onChange("id", { availability: v })} />
      </LocaleGrid>
      <LocaleGrid>
        <Area label="EN Meta Description" value={data.en.metadataDescription ?? ""} onChange={(v) => onChange("en", { metadataDescription: v })} />
        <Area label="ID Meta Description" value={data.id.metadataDescription ?? ""} onChange={(v) => onChange("id", { metadataDescription: v })} />
      </LocaleGrid>
    </div>
  );
}
