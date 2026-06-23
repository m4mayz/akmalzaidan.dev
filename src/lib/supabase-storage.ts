import { getSupabaseServiceClient } from "@/lib/supabase";

export const SUPABASE_ASSET_BUCKET = "portfolio-assets";
export type CmsAssetType = "work" | "articles";

export function cleanStorageSegment(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
}

function fileNameParts(fileName: string) {
  const match = fileName.match(/^(.*?)(\.[a-z0-9]+)?$/i);
  const name = cleanStorageSegment(match?.[1] ?? "") || "asset";
  const ext = match?.[2]?.toLowerCase() ?? ".webp";
  return { name, ext };
}

function assetPath(type: CmsAssetType, slug: string, fileName: string) {
  const { name, ext } = fileNameParts(fileName);
  return `${type}/${cleanStorageSegment(slug)}/${name}${ext}`;
}

export async function ensureAssetBucket() {
  const supabase = getSupabaseServiceClient();
  const { data } = await supabase.storage.getBucket(SUPABASE_ASSET_BUCKET);

  if (data) {
    if (!data.public) {
      const { error } = await supabase.storage.updateBucket(SUPABASE_ASSET_BUCKET, {
        public: true,
      });
      if (error) throw new Error(error.message);
    }
    return;
  }

  const { error } = await supabase.storage.createBucket(SUPABASE_ASSET_BUCKET, {
    public: true,
  });

  if (error && !error.message.toLowerCase().includes("already exists")) {
    throw new Error(error.message);
  }
}

export async function uploadCmsAsset({
  body,
  contentType,
  fileName,
  slug,
  type,
}: {
  body: ArrayBuffer;
  contentType?: string;
  fileName: string;
  slug: string;
  type: CmsAssetType;
}) {
  await ensureAssetBucket();

  const objectPath = assetPath(type, slug, fileName);
  const { error } = await getSupabaseServiceClient()
    .storage
    .from(SUPABASE_ASSET_BUCKET)
    .upload(objectPath, body, {
      cacheControl: "31536000",
      contentType,
      upsert: true,
    });

  if (error) throw new Error(error.message);

  return getSupabaseServiceClient()
    .storage
    .from(SUPABASE_ASSET_BUCKET)
    .getPublicUrl(objectPath).data.publicUrl;
}

export function getAssetObjectPath(src: string) {
  try {
    const url = new URL(src);
    const prefix = `/storage/v1/object/public/${SUPABASE_ASSET_BUCKET}/`;
    const index = url.pathname.indexOf(prefix);
    return index === -1
      ? null
      : decodeURIComponent(url.pathname.slice(index + prefix.length));
  } catch {
    return null;
  }
}

export async function deleteCmsAsset(src: string) {
  const objectPath = getAssetObjectPath(src);
  if (!objectPath) return false;

  const { error } = await getSupabaseServiceClient()
    .storage
    .from(SUPABASE_ASSET_BUCKET)
    .remove([objectPath]);

  if (error) throw new Error(error.message);
  return true;
}
