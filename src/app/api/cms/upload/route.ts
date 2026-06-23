import {
  cleanStorageSegment,
  deleteCmsAsset,
  uploadCmsAsset,
} from "@/lib/supabase-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function devOnly() {
  return process.env.NODE_ENV === "development";
}

export async function POST(request: Request) {
  if (!devOnly()) {
    return new Response("Not found", { status: 404 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const type = form.get("type") === "articles" ? "articles" : "work";
  const slug = cleanStorageSegment(String(form.get("slug") ?? ""));

  if (!(file instanceof File) || !slug) {
    return Response.json({ error: "Missing file or slug" }, { status: 400 });
  }

  return Response.json({
    src: await uploadCmsAsset({
      body: await file.arrayBuffer(),
      contentType: file.type || undefined,
      fileName: file.name,
      slug,
      type,
    }),
  });
}

export async function DELETE(request: Request) {
  if (!devOnly()) {
    return new Response("Not found", { status: 404 });
  }

  const body = (await request.json()) as { src?: string };
  const deleted = await deleteCmsAsset(String(body.src ?? ""));

  return Response.json({ ok: true, deleted });
}
