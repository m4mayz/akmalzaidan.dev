import Image from "next/image";

export function ImageCard({
  alt,
  meta,
  onDelete,
  onEdit,
  onFile,
  onMoveLeft,
  onMoveRight,
  src,
}: {
  alt: string;
  meta: string;
  onDelete: () => void;
  onEdit?: () => void;
  onFile?: (file: File) => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  src: string;
}) {
  return (
    <div className="border border-border p-2 text-sm">
      <div className="relative h-24 w-full">
        <Image alt={alt} className="object-cover" fill src={src} />
      </div>
      <p className="mt-2 line-clamp-2 break-all text-[11px] leading-snug text-muted-foreground">
        {src}
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground">{meta}</p>
      <div className="mt-3 flex gap-2">
        {onFile ? (
          <label className="grid h-9 cursor-pointer place-items-center border border-border px-3 text-xs text-muted-foreground">
            Change
            <input
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onFile(file);
                event.target.value = "";
              }}
              type="file"
            />
          </label>
        ) : (
          <button
            className="h-9 border border-border px-3 text-xs text-muted-foreground"
            onClick={onEdit}
            type="button"
          >
            Edit
          </button>
        )}
        <button
          className="h-9 border border-border px-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
          onClick={onDelete}
          type="button"
        >
          Delete
        </button>
        {onMoveLeft && (
          <button
            className="h-9 border border-border px-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
            onClick={onMoveLeft}
            type="button"
          >
            &lt;
          </button>
        )}
        {onMoveRight && (
          <button
            className="h-9 border border-border px-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
            onClick={onMoveRight}
            type="button"
          >
            &gt;
          </button>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";

export function CoverUpload({
  image,
  alt,
  onUpload,
  onUrl,
  onDelete,
}: {
  image: string;
  alt: string;
  onUpload: (file: File) => void;
  onUrl: (url: string) => void;
  onDelete: () => void;
}) {
  const [urlInput, setUrlInput] = useState("");

  if (image) {
    return (
      <div className="max-w-xs">
        <ImageCard
          alt={alt}
          meta="cover"
          onDelete={onDelete}
          onFile={onUpload}
          src={image}
        />
      </div>
    );
  }

  return (
    <div className="flex max-w-sm flex-col gap-4">
      <label className="grid gap-2 text-sm text-muted-foreground">
        Upload cover file
        <input
          className="h-11 border border-border bg-black px-3 py-2 text-sm"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onUpload(file);
            if (event.target) event.target.value = "";
          }}
          type="file"
        />
      </label>
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <label className="grid gap-2 text-sm text-muted-foreground">
        Use image URL
        <div className="flex gap-2">
          <input
            className="h-11 flex-1 border border-border bg-black px-3 py-2 text-sm text-foreground outline-none focus:border-white"
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && urlInput) {
                e.preventDefault();
                onUrl(urlInput);
                setUrlInput("");
              }
            }}
            placeholder="https://..."
            value={urlInput}
          />
          <button
            className="h-11 border border-border px-4 text-sm transition-colors hover:border-white hover:text-foreground"
            onClick={() => {
              if (urlInput) {
                onUrl(urlInput);
                setUrlInput("");
              }
            }}
            type="button"
          >
            Set
          </button>
        </div>
      </label>
    </div>
  );
}
