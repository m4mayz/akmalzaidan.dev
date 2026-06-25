import { CmsSidebar } from "@/components/cms/cms-sidebar";

type ContentType = "work" | "articles" | "pages";

type CmsLayoutProps = {
  activeType: ContentType;
  activeSlug?: string | null;
  onTypeChange: (type: ContentType) => void;
  onPageSelect?: (slug: string) => void;
  counts: { work: number; articles: number; pages: number };
  children: React.ReactNode;
};

export function CmsLayout({
  activeType,
  activeSlug,
  onTypeChange,
  onPageSelect,
  counts,
  children,
}: CmsLayoutProps) {
  return (
    <div className="relative z-10 min-h-screen bg-background text-foreground">
      <CmsSidebar
        activeType={activeType}
        activeSlug={activeSlug}
        counts={counts}
        onTypeChange={onTypeChange}
        onPageSelect={onPageSelect}
      />
      <main className="ml-60 min-h-screen p-8">{children}</main>
    </div>
  );
}
