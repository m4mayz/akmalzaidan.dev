import { reorderContent, type CmsContentType } from "@/lib/supabase-content";
import { revalidateSite } from "@/lib/revalidate-site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function devOnly() {
  return process.env.NODE_ENV === "development";
}

export async function PATCH(request: Request) {
  if (!devOnly()) {
    return new Response("Not found", { status: 404 });
  }

  const body = (await request.json()) as {
    type?: string;
    order?: string[];
  };

  const type: CmsContentType = body.type === "articles" ? "articles" : "work";
  const order = Array.isArray(body.order) ? body.order : [];

  if (order.length === 0) {
    return Response.json({ error: "order array is required" }, { status: 400 });
  }

  await reorderContent(type, order);
  const revalidation = await revalidateSite();

  return Response.json({ ok: true, revalidation });
}
