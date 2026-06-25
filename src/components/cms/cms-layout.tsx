import { CmsSidebar } from "@/components/cms/cms-sidebar";

type ContentType = "work" | "articles" | "pages";

type CmsLayoutProps = {
  activeType: ContentType;
  onTypeChange: (type: ContentType) => void;
  counts: { work: number; articles: number; pages: number };
  children: React.ReactNode;
};

export function CmsLayout({
  activeType,
  onTypeChange,
  counts,
  children,
}: CmsLayoutProps) {
  return (
    <div className="relative z-10 min-h-screen bg-background text-foreground">
      <CmsSidebar
        activeType={activeType}
        counts={counts}
        onTypeChange={onTypeChange}
      />
      <main className="ml-60 min-h-screen p-8">{children}</main>
    </div>
  );
}
