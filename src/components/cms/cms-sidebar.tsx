import { cn } from "@/lib/utils";

type ContentType = "work" | "articles" | "pages";

type CmsSidebarProps = {
  activeType: ContentType;
  onTypeChange: (type: ContentType) => void;
  counts: { work: number; articles: number; pages: number };
};

const sections: { type: ContentType; label: string }[] = [
  { type: "work", label: "Work" },
  { type: "articles", label: "Articles" },
  { type: "pages", label: "Pages" },
];

export function CmsSidebar({ activeType, onTypeChange, counts }: CmsSidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-card">
      <div className="px-5 pt-6 pb-4">
        <h1 className="font-heading text-2xl font-light leading-none">CMS</h1>
        <p className="mt-1 text-xs text-muted-foreground">Dev only</p>
      </div>

      <nav className="flex-1 px-3">
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
                "min-w-[1.5rem] rounded-full px-1.5 py-0.5 text-center text-xs",
                activeType === type
                  ? "bg-white/10 text-foreground"
                  : "bg-white/5 text-muted-foreground",
              )}
            >
              {counts[type]}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
