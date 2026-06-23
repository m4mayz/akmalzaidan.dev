import {
  deleteCmsContent,
  listCmsContent,
  type CmsContentType,
  upsertArticle,
  upsertWork,
} from "@/lib/supabase-content";
import type { Locale } from "@/types/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function devOnly() {
  return process.env.NODE_ENV === "development";
}

function notFoundResponse() {
  return new Response("Not found", { status: 404 });
}

function parseType(value: string | null): CmsContentType {
  return value === "articles" ? "articles" : "work";
}

function parseLocale(value: string | null): Locale {
  return value === "id" ? "id" : "en";
}

export async function GET(request: Request) {
  if (!devOnly()) return notFoundResponse();

  const url = new URL(request.url);
  const type = parseType(url.searchParams.get("type"));
  const locale = parseLocale(url.searchParams.get("locale"));

  return Response.json({ items: await listCmsContent(type, locale) });
}

export async function POST(request: Request) {
  if (!devOnly()) return notFoundResponse();

  const body = await request.json();
  const items = Array.isArray(body.items) ? body.items : [body.item];

  if (body.type === "articles") {
    for (const item of items) await upsertArticle(item);
  } else {
    for (const item of items) await upsertWork(item);
  }

  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!devOnly()) return notFoundResponse();

  const body = await request.json();
  const type = parseType(body.type);
  if (body.locale) {
    await deleteCmsContent(type, parseLocale(body.locale), body.slug);
  } else {
    for (const locale of ["en", "id"] as Locale[]) {
      await deleteCmsContent(type, locale, body.slug);
    }
  }

  return Response.json({ ok: true });
}
