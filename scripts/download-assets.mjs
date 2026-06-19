import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const extractionPath = path.join(
  root,
  "docs/research/ulrychkristian.cz/extraction.json",
);
const publicDir = path.join(root, "public");
const imageDir = path.join(publicDir, "images/ulrychkristian");
const seoDir = path.join(publicDir, "seo");

const extraction = JSON.parse(await readFile(extractionPath, "utf8"));
await mkdir(imageDir, { recursive: true });
await mkdir(seoDir, { recursive: true });

function directAssetUrl(src) {
  const url = new URL(src);
  const optimizedPath = url.searchParams.get("url");

  if (optimizedPath) {
    return new URL(optimizedPath, "https://www.ulrychkristian.cz").toString();
  }

  return url.toString();
}

function filenameFor(url, fallbackPrefix) {
  const parsed = new URL(url);
  const rawBase = decodeURIComponent(path.basename(parsed.pathname));
  const base = rawBase || `${fallbackPrefix}.bin`;

  return base
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const imageUrls = [
  ...new Set(extraction.images.map((image) => directAssetUrl(image.src))),
];

const seoUrls = [
  ...new Set([
    ...extraction.favicons.map((icon) => icon.href),
    ...extraction.meta
      .filter((meta) => meta.property === "og:image" || meta.name === "twitter:image")
      .map((meta) => meta.content),
  ].filter(Boolean)),
];

async function download(url, outputDir, fallbackPrefix) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed ${response.status} ${url}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  const fileName = filenameFor(url, fallbackPrefix);
  const outputPath = path.join(outputDir, fileName);
  await writeFile(outputPath, bytes);

  return {
    url,
    fileName,
    publicPath: `/${path.relative(publicDir, outputPath).replaceAll(path.sep, "/")}`,
    bytes: bytes.length,
  };
}

const manifest = {
  images: [],
  seo: [],
};

for (const [index, url] of imageUrls.entries()) {
  manifest.images.push(await download(url, imageDir, `image-${index}`));
}

for (const [index, url] of seoUrls.entries()) {
  manifest.seo.push(await download(url, seoDir, `seo-${index}`));
}

await writeFile(
  path.join(publicDir, "ulrychkristian-assets.json"),
  JSON.stringify(manifest, null, 2),
);

console.log(
  `Downloaded ${manifest.images.length} images and ${manifest.seo.length} SEO assets.`,
);
