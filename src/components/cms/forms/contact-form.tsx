import { Area, Field, LocaleGrid } from "@/components/cms/cms-field";
import type { Locale, ContactData } from "@/types/content";

export function ContactForm({
  data,
  onChange,
}: {
  data: Record<Locale, ContactData>;
  onChange: (locale: Locale, patch: Partial<ContactData>) => void;
}) {
  return (
    <div className="space-y-8">
      <LocaleGrid>
        <Field label="EN Headline" value={data.en.headline ?? ""} onChange={(v) => onChange("en", { headline: v })} />
        <Field label="ID Headline" value={data.id.headline ?? ""} onChange={(v) => onChange("id", { headline: v })} />
      </LocaleGrid>
      <LocaleGrid>
        <Area label="EN Body" value={data.en.body ?? ""} onChange={(v) => onChange("en", { body: v })} />
        <Area label="ID Body" value={data.id.body ?? ""} onChange={(v) => onChange("id", { body: v })} />
      </LocaleGrid>
    </div>
  );
}
