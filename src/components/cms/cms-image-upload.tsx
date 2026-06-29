import Image from "next/image";
import { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type PercentCrop,
  type PixelCrop,
} from "react-image-crop";

type CropAspect = "16/9" | "4/3" | "4/5";

const cropSizes: Record<CropAspect, { width: number; height: number }> = {
  "16/9": { width: 1600, height: 900 },
  "4/3": { width: 1600, height: 1200 },
  "4/5": { width: 1200, height: 1500 },
};

function aspectValue(aspect: CropAspect) {
  const [w, h] = aspect.split("/").map(Number);
  return w / h;
}

function centeredCrop(width: number, height: number, aspect: number) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, width, height),
    width,
    height,
  );
}

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

export function ImageCropModal({
  alt,
  aspect,
  onClose,
  onSave,
  src,
}: {
  alt: string;
  aspect: CropAspect;
  onClose: () => void;
  onSave: (file: File) => Promise<void>;
  src: string;
}) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<PercentCrop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const ratio = aspectValue(aspect);

  const saveCrop = async () => {
    const image = imageRef.current;
    if (!image || !completedCrop?.width || !completedCrop?.height) return;

    setSaving(true);
    setError("");

    try {
      const size = cropSizes[aspect];
      const canvas = document.createElement("canvas");
      canvas.width = size.width;
      canvas.height = size.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not available.");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        size.width,
        size.height,
      );

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.92),
      );
      if (!blob) throw new Error("Could not create cropped image.");

      await onSave(new File([blob], `crop-${Date.now()}.jpg`, { type: "image/jpeg" }));
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Crop failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-5">
      <div className="w-full max-w-4xl border border-border bg-background p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl">Crop image</h3>
            <p className="mt-1 text-xs text-muted-foreground">Locked ratio: {aspect}</p>
          </div>
          <button className="text-sm text-muted-foreground" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
          <div
            className="relative w-full overflow-hidden bg-white/5"
            style={{ aspectRatio: ratio }}
          >
            <ReactCrop
              aspect={ratio}
              crop={crop}
              keepSelection
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
              ruleOfThirds
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={alt}
                className="max-h-[65vh] w-full object-contain"
                crossOrigin="anonymous"
                onLoad={(event) => {
                  const image = event.currentTarget;
                  const nextCrop = centeredCrop(image.width, image.height, ratio);
                  setCrop(nextCrop);
                  setCompletedCrop({
                    unit: "px",
                    x: (nextCrop.x / 100) * image.width,
                    y: (nextCrop.y / 100) * image.height,
                    width: (nextCrop.width / 100) * image.width,
                    height: (nextCrop.height / 100) * image.height,
                  });
                }}
                ref={imageRef}
                src={src}
              />
            </ReactCrop>
          </div>

          <div className="grid content-start gap-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Drag or resize the crop area. The ratio is locked.
            </p>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <button
              className="h-10 w-full border border-white bg-white px-5 text-sm text-black disabled:opacity-50"
              disabled={!completedCrop || saving}
              onClick={() => void saveCrop()}
              type="button"
            >
              {saving ? "Saving..." : "Save crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
