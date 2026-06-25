import Image from "next/image";

export function ImageCard({
  alt,
  meta,
  onDelete,
  onEdit,
  onFile,
  src,
}: {
  alt: string;
  meta: string;
  onDelete: () => void;
  onEdit?: () => void;
  onFile?: (file: File) => void;
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
          className="h-9 border border-border px-3 text-xs text-muted-foreground"
          onClick={onDelete}
          type="button"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export function CoverUpload({
  image,
  alt,
  onUpload,
  onDelete,
}: {
  image: string;
  alt: string;
  onUpload: (file: File) => void;
  onDelete: () => void;
}) {
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
    <label className="grid max-w-xs gap-2 text-sm text-muted-foreground">
      Upload cover
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
  );
}
