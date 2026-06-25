import { cn } from "@/lib/utils";

type ContentType = "work" | "articles" | "pages";

type CmsSidebarProps = {
  activeType: ContentType;
  activeSlug?: string | null;
  onTypeChange: (type: ContentType) => void;
  onPageSelect?: (slug: string) => void;
  counts: { work: number; articles: number; pages: number };
};

const sections: { type: ContentType; label: string }[] = [
  { type: "work", label: "Work" },
  { type: "articles", label: "Articles" },
];

const pagesList = [
  { slug: "home", label: "Home" },
  { slug: "about", label: "About" },
  { slug: "contact", label: "Contact" },
  { slug: "privacy", label: "Privacy" },
  { slug: "global", label: "Global Settings" },
];

export function CmsSidebar({
  activeType,
  activeSlug,
  onTypeChange,
  onPageSelect,
  counts,
}: CmsSidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-card">
      <div className="px-5 pt-6 pb-4">
        <h1 className="font-heading text-2xl font-light leading-none">
          CMS Dashboard
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Welcome back, Akmal.
        </p>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        <div className="space-y-1">
          {sections.map(({ type, label }) => (
            <button
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
                activeType === type
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
              key={type}
              onClick={() => onTypeChange(type)}
              type="button"
            >
              {label}
              <span
                className={cn(
                  "min-w-6 rounded-full px-1.5 py-0.5 text-center text-xs",
                  activeType === type
                    ? "bg-white/10 text-foreground"
                    : "bg-white/5 text-muted-foreground",
                )}
              >
                {counts[type]}
              </span>
            </button>
          ))}
        </div>

        <div>
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pages
          </div>
          <div className="space-y-1">
            {pagesList.map((page) => (
              <button
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                  activeType === "pages" && activeSlug === page.slug
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
                key={page.slug}
                onClick={() => onPageSelect?.(page.slug)}
                type="button"
              >
                {page.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}
