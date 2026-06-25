import type { CmsPageInput } from "@/lib/supabase-content";
import type { Locale } from "@/types/content";
import { AboutForm } from "./forms/about-form";
import { ContactForm } from "./forms/contact-form";
import { GlobalForm } from "./forms/global-form";
import { HomeForm } from "./forms/home-form";
import { PrivacyForm } from "./forms/privacy-form";

export type Pair<T> = { en: T; id: T };

type CmsPageFormProps = {
  item: Pair<CmsPageInput>;
  onLocaleChange: (locale: Locale, patch: Partial<CmsPageInput>) => void;
  onBack: () => void;
  onSave: () => void;
  onUpload?: (file: File) => Promise<string | null>;
  onDeleteAsset?: (src: string) => Promise<void>;
};

export function CmsPageForm({
  item,
  onLocaleChange,
  onBack,
  onSave,
  onUpload,
  onDeleteAsset,
}: CmsPageFormProps) {
  const data = {
    en: item.en.data,
    id: item.id.data,
  } as any;

  const handleChange = (locale: Locale, patch: any) => {
    onLocaleChange(locale, { data: { ...(data[locale] as any), ...patch } });
  };

  const renderForm = () => {
    switch (item.en.slug) {
      case "global":
        return <GlobalForm data={data} onChange={handleChange} />;
      case "home":
        return <HomeForm data={data} onChange={handleChange} />;
      case "about":
        return (
          <AboutForm
            data={data}
            onChange={handleChange}
            onDeleteAsset={onDeleteAsset}
            onUpload={onUpload}
          />
        );
      case "contact":
        return <ContactForm data={data} onChange={handleChange} />;
      case "privacy":
        return <PrivacyForm data={data} onChange={handleChange} />;
      default:
        return (
          <div className="p-12 text-center text-sm text-muted-foreground">
            Unknown page type: {item.en.slug}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="sticky top-0 z-40 -mx-8 mb-8 flex items-center justify-between border-b border-border bg-background px-8 py-6">
        <button
          className="text-sm text-muted-foreground transition-colors hover:text-white"
          onClick={onBack}
          type="button"
        >
          ← Back to list
        </button>
        <div className="flex items-center gap-3">
          <button
            className="h-9 rounded-lg bg-white px-4 text-sm text-black hover:bg-white/90"
            onClick={onSave}
            type="button"
          >
            Save Changes
          </button>
        </div>
      </div>
      {renderForm()}
    </div>
  );
}
