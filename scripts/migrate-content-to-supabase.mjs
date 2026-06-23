import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import postgres from "postgres";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv(filePath) {
  if (!existsSync(filePath)) return;

  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]]) continue;

    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

function parseJson(value) {
  try {
    return JSON.parse(value || "[]");
  } catch {
    return [];
  }
}

loadEnv(join(root, ".env.local"));

const databaseUrl =
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_PRISMA_URL;

if (!databaseUrl) {
  throw new Error("Missing POSTGRES_URL_NON_POOLING, POSTGRES_URL, or POSTGRES_PRISMA_URL.");
}

const sql = postgres(databaseUrl, { max: 1, ssl: "require" });

try {
  await sql.unsafe(readFileSync(join(root, "supabase", "content-schema.sql"), "utf8"));

  const sqlitePath = join(root, "data", "content.sqlite");
  if (!existsSync(sqlitePath)) {
    console.log("Supabase schema ready. No data/content.sqlite found to import.");
    process.exit(0);
  }

  const db = new DatabaseSync(sqlitePath);
  const works = db.prepare("SELECT * FROM works").all();
  const articles = db.prepare("SELECT * FROM articles").all();
  db.close();

  await sql.begin(async (tx) => {
    for (const item of works) {
      await tx`
        INSERT INTO public.works (
          locale, slug, status, sort_order, title, year, description, image, alt,
          category, role, client, summary, sections_json, gallery_json, created_at, updated_at
        ) VALUES (
          ${item.locale}, ${item.slug}, ${item.status}, ${item.sort_order}, ${item.title},
          ${item.year}, ${item.description}, ${item.image}, ${item.alt}, ${item.category},
          ${item.role}, ${item.client}, ${item.summary}, ${tx.json(parseJson(item.sections_json))},
          ${tx.json(parseJson(item.gallery_json))}, ${item.created_at}, ${item.updated_at}
        )
        ON CONFLICT (locale, slug) DO UPDATE SET
          status = EXCLUDED.status,
          sort_order = EXCLUDED.sort_order,
          title = EXCLUDED.title,
          year = EXCLUDED.year,
          description = EXCLUDED.description,
          image = EXCLUDED.image,
          alt = EXCLUDED.alt,
          category = EXCLUDED.category,
          role = EXCLUDED.role,
          client = EXCLUDED.client,
          summary = EXCLUDED.summary,
          sections_json = EXCLUDED.sections_json,
          gallery_json = EXCLUDED.gallery_json,
          updated_at = EXCLUDED.updated_at
      `;
    }

    for (const item of articles) {
      await tx`
        INSERT INTO public.articles (
          locale, slug, status, sort_order, title, description, image, alt,
          published_at, lead, blocks_json, created_at, updated_at
        ) VALUES (
          ${item.locale}, ${item.slug}, ${item.status}, ${item.sort_order}, ${item.title},
          ${item.description}, ${item.image}, ${item.alt}, ${item.published_at},
          ${item.lead}, ${tx.json(parseJson(item.blocks_json))}, ${item.created_at}, ${item.updated_at}
        )
        ON CONFLICT (locale, slug) DO UPDATE SET
          status = EXCLUDED.status,
          sort_order = EXCLUDED.sort_order,
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          image = EXCLUDED.image,
          alt = EXCLUDED.alt,
          published_at = EXCLUDED.published_at,
          lead = EXCLUDED.lead,
          blocks_json = EXCLUDED.blocks_json,
          updated_at = EXCLUDED.updated_at
      `;
    }
  });

  await sql`NOTIFY pgrst, 'reload schema'`;
  console.log(`Migrated ${works.length} works and ${articles.length} articles to Supabase.`);
} finally {
  await sql.end({ timeout: 5 });
}
