import { existsSync, readFileSync } from "node:fs";
import { resolve, sep } from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = resolve(import.meta.dirname, "..");
const publicRoot = resolve(root, "public");
const bucket = "portfolio-assets";

function loadEnv(filePath) {
  if (!existsSync(filePath)) return;

  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

function contentType(filePath) {
  if (filePath.endsWith(".webp")) return "image/webp";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".gif")) return "image/gif";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

function parseJson(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return value;

  try {
    return JSON.parse(value || "[]");
  } catch {
    return [];
  }
}

function localAssetPath(src) {
  if (
    typeof src !== "string" ||
    (!src.startsWith("/images/work/") && !src.startsWith("/images/articles/"))
  ) {
    return null;
  }

  const filePath = resolve(publicRoot, `.${src}`);
  return filePath.startsWith(`${publicRoot}${sep}`) ? filePath : null;
}

function objectPathFromSrc(src) {
  return src.replace(/^\/images\//, "");
}

loadEnv(resolve(root, ".env.local"));

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const uploaded = new Map();
const missing = [];

async function ensureBucket() {
  const { data } = await supabase.storage.getBucket(bucket);

  if (data) {
    if (!data.public) {
      const { error } = await supabase.storage.updateBucket(bucket, {
        public: true,
      });
      if (error) throw new Error(error.message);
    }
    return;
  }

  const { error } = await supabase.storage.createBucket(bucket, { public: true });
  if (error && !error.message.toLowerCase().includes("already exists")) {
    throw new Error(error.message);
  }
}

async function migrateAsset(src) {
  const filePath = localAssetPath(src);
  if (!filePath) return src;
  if (uploaded.has(src)) return uploaded.get(src);

  if (!existsSync(filePath)) {
    missing.push(src);
    return src;
  }

  const objectPath = objectPathFromSrc(src);
  const { error } = await supabase.storage
    .from(bucket)
    .upload(objectPath, readFileSync(filePath), {
      cacheControl: "31536000",
      contentType: contentType(filePath),
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const publicUrl = supabase.storage.from(bucket).getPublicUrl(objectPath).data.publicUrl;
  uploaded.set(src, publicUrl);
  return publicUrl;
}

async function migrateWorks() {
  const { data, error } = await supabase
    .from("works")
    .select("id,image,gallery_json");

  if (error) throw new Error(error.message);

  let updated = 0;
  for (const row of data ?? []) {
    const image = await migrateAsset(row.image);
    const gallery = parseJson(row.gallery_json);
    const nextGallery = [];
    let changed = image !== row.image;

    for (const item of gallery) {
      const src = await migrateAsset(item.src);
      changed ||= src !== item.src;
      nextGallery.push({ ...item, src });
    }

    if (!changed) continue;

    const { error: updateError } = await supabase
      .from("works")
      .update({
        image,
        gallery_json: nextGallery,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);

    if (updateError) throw new Error(updateError.message);
    updated += 1;
  }

  return updated;
}

async function migrateArticles() {
  const { data, error } = await supabase.from("articles").select("id,image");
  if (error) throw new Error(error.message);

  let updated = 0;
  for (const row of data ?? []) {
    const image = await migrateAsset(row.image);
    if (image === row.image) continue;

    const { error: updateError } = await supabase
      .from("articles")
      .update({ image, updated_at: new Date().toISOString() })
      .eq("id", row.id);

    if (updateError) throw new Error(updateError.message);
    updated += 1;
  }

  return updated;
}

await ensureBucket();
const [workRows, articleRows] = await Promise.all([migrateWorks(), migrateArticles()]);

console.log(
  JSON.stringify(
    {
      bucket,
      uploadedAssets: uploaded.size,
      updatedArticleRows: articleRows,
      updatedWorkRows: workRows,
      missing,
    },
    null,
    2,
  ),
);
