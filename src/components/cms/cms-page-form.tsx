import type { CmsPageInput } from "@/lib/supabase-content";
import type { Locale, AboutData, ContactData, HomeData, PrivacyData } from "@/types/content";
import { AboutForm } from "./forms/about-form";
import { ContactForm } from "./forms/contact-form";
import type { GlobalData } from "./forms/global-form";
import { GlobalForm } from "./forms/global-form";
import { HomeForm } from "./forms/home-form";
import { PrivacyForm } from "./forms/privacy-form";

export type Pair<T> = { en: T; id: T };

type CmsPageFormProps = {
  item: Pair<CmsPageInput>;
  onLocaleChange: (locale: Locale, patch: Partial<CmsPageInput>) => void;
  onSave: () => void;
  onUpload?: (file: File) => Promise<string | null>;
  onDeleteAsset?: (src: string) => Promise<void>;
  hasChanges?: boolean;
};

type PageDataDict = Record<string, unknown>;

export function CmsPageForm({
  item,
  onLocaleChange,
  onSave,
  onUpload,
  onDeleteAsset,
  hasChanges,
}: CmsPageFormProps) {
  const data = {
    en: (item.en.data as PageDataDict) || {},
    id: (item.id.data as PageDataDict) || {},
  };

  const handleChange = (locale: Locale, patch: PageDataDict) => {
    onLocaleChange(locale, { data: { ...data[locale], ...patch } });
  };

  const renderForm = () => {
    switch (item.en.slug) {
      case "global":
        return (
          <GlobalForm
            data={data as Record<Locale, GlobalData>}
            onChange={handleChange as (locale: Locale, patch: Partial<GlobalData>) => void}
          />
        );
      case "home":
        return (
          <HomeForm
            data={data as Record<Locale, HomeData>}
            onChange={handleChange as (locale: Locale, patch: Partial<HomeData>) => void}
          />
        );
      case "about":
        return (
          <AboutForm
            data={data as Record<Locale, AboutData>}
            onChange={handleChange as (locale: Locale, patch: Partial<AboutData>) => void}
            onDeleteAsset={onDeleteAsset}
            onUpload={onUpload}
          />
        );
      case "contact":
        return (
          <ContactForm
            data={data as Record<Locale, ContactData>}
            onChange={handleChange as (locale: Locale, patch: Partial<ContactData>) => void}
          />
        );
      case "privacy":
        return (
          <PrivacyForm
            data={data as Record<Locale, PrivacyData>}
            onChange={handleChange as (locale: Locale, patch: Partial<PrivacyData>) => void}
          />
        );
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
      <div className="sticky top-0 z-40 -mx-8 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background px-8 py-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl leading-tight capitalize">
              {item.en.slug.replace("-", " ")} Page
            </h2>
          </div>
        </div>
        <div className="flex gap-2">
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
      {renderForm()}
    </div>
  );
}
