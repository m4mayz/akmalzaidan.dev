import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

type ContentType = "work" | "articles" | "pages";

export type ListItem = {
  slug: string;
  enTitle: string;
  idTitle: string;
  image: string;
  status: "draft" | "published";
  meta: string;
};

type CmsListViewProps = {
  items: ListItem[];
  type: ContentType;
  onSelect: (slug: string) => void;
  onNew: () => void;
  onReorder: (slugs: string[]) => void;
};

export function CmsListView({
  items,
  type,
  onSelect,
  onNew,
  onReorder,
}: CmsListViewProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (event: React.DragEvent, index: number) => {
    event.preventDefault();
    setOverIndex(index);
  };

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }

    const reordered = [...items];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    onReorder(reordered.map((item) => item.slug));

    setDragIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const moveItem = (fromIndex: number, direction: -1 | 1) => {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= items.length) return;

    const reordered = [...items];
    [reordered[fromIndex], reordered[toIndex]] = [reordered[toIndex], reordered[fromIndex]];
    onReorder(reordered.map((item) => item.slug));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-light">
          {type === "work" ? "Work" : type === "articles" ? "Articles" : "Pages"}
        </h2>
        {type !== "pages" && (
          <button
            className="h-9 rounded-lg border border-white bg-white px-4 text-sm text-black transition-colors hover:bg-white/90"
            onClick={onNew}
            type="button"
          >
            + New {type === "work" ? "work" : "article"}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No items yet. Click &quot;+ New&quot; to create one.
        </p>
      ) : (
        <div className="space-y-px">
          {items.map((item, index) => (
            <div
              className={cn(
                "group flex items-center gap-3 border-b border-border px-3 py-3 transition-colors",
                dragIndex === index && "opacity-50",
                overIndex === index && dragIndex !== index && "border-t-2 border-t-primary",
                "hover:bg-white/5",
              )}
              draggable
              key={item.slug}
              onDragEnd={handleDragEnd}
              onDragOver={(event) => handleDragOver(event, index)}
              onDragStart={() => handleDragStart(index)}
              onDrop={() => handleDrop(index)}
            >
              {type === "pages" ? (
                <span className="w-4" />
              ) : (
                <span
                  className="cursor-grab select-none text-muted-foreground active:cursor-grabbing"
                  title="Drag to reorder"
                >
                  ⠿
                </span>
              )}

              <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-white/5">
                {item.image ? (
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    src={item.image}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    —
                  </div>
                )}
              </div>

              <button
                className="flex min-w-0 flex-1 flex-col gap-0.5 text-left"
                onClick={() => onSelect(item.slug)}
                type="button"
              >
                <span className="truncate text-sm text-foreground">
                  {item.enTitle || item.slug}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {item.idTitle || (
                    <span className="italic text-yellow-500/70">Untranslated</span>
                  )}
                </span>
              </button>

              {type !== "pages" && (
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[11px]",
                    item.status === "published"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-white/10 text-muted-foreground",
                  )}
                >
                  {item.status}
                </span>
              )}

              {type !== "pages" && (
                <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">
                  {item.meta}
                </span>
              )}

              {type !== "pages" && (
                <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    className="h-7 w-7 rounded border border-border text-xs text-muted-foreground transition-colors hover:border-white hover:text-foreground disabled:opacity-30"
                    disabled={index === 0}
                    onClick={() => moveItem(index, -1)}
                    title="Move up"
                    type="button"
                  >
                    ↑
                  </button>
                  <button
                    className="h-7 w-7 rounded border border-border text-xs text-muted-foreground transition-colors hover:border-white hover:text-foreground disabled:opacity-30"
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(index, 1)}
                    title="Move down"
                    type="button"
                  >
                    ↓
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
