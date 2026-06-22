import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function devOnly() {
  return process.env.NODE_ENV === "development";
}

function cleanSegment(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
}

export async function POST(request: Request) {
  if (!devOnly()) {
    return new Response("Not found", { status: 404 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const type = form.get("type") === "articles" ? "articles" : "work";
  const slug = cleanSegment(String(form.get("slug") ?? ""));

  if (!(file instanceof File) || !slug) {
    return Response.json({ error: "Missing file or slug" }, { status: 400 });
  }

  const safeName = cleanSegment(file.name.replace(/\.[^.]+$/, ""));
  const ext = path.extname(file.name).toLowerCase() || ".webp";
  const directory = path.join(process.cwd(), "public", "images", type, slug);
  const fileName = `${safeName}${ext}`;
  const outputPath = path.join(directory, fileName);

  await mkdir(directory, { recursive: true });
  await writeFile(outputPath, Buffer.from(await file.arrayBuffer()));

  return Response.json({
    src: `/images/${type}/${slug}/${fileName}`,
  });
}
