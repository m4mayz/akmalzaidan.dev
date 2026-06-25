import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv(filePath) {
  try {
    const content = readFileSync(filePath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!match || process.env[match[1]]) continue;
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  } catch (e) {
    // Ignore missing .env.local
  }
}

loadEnv(join(root, ".env.local"));

const databaseUrl =
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_PRISMA_URL;

if (!databaseUrl) {
  throw new Error("Missing POSTGRES_URL");
}

const sql = postgres(databaseUrl, { max: 1, ssl: "require" });

try {
  // 1. Run Schema
  await sql.unsafe(readFileSync(join(root, "supabase", "content-schema.sql"), "utf8"));
  console.log("Schema applied.");

  // 2. Read Local JSONs
  const locales = ["en", "id"];
  const pagesData = [];

  for (const locale of locales) {
    const sitePath = join(root, "data", locale, "site.json");
    const aboutPath = join(root, "data", locale, "about.json");
    const homePath = join(root, "data", locale, "home.json");
    const contactPath = join(root, "data", locale, "contact.json");
    const privacyPath = join(root, "data", locale, "privacy.json");

    const site = JSON.parse(readFileSync(sitePath, "utf8"));
    const about = JSON.parse(readFileSync(aboutPath, "utf8"));
    const home = JSON.parse(readFileSync(homePath, "utf8"));
    const contact = JSON.parse(readFileSync(contactPath, "utf8"));
    const privacy = JSON.parse(readFileSync(privacyPath, "utf8"));

    pagesData.push({
      id: "global",
      locale,
      data: {
        role: site.role,
        location: site.location,
        availability: site.availability,
        metadataDescription: site.metadata?.description
      }
    });

    pagesData.push({
      id: "about",
      locale,
      data: {
        headline: about.headline,
        subhead: about.subhead,
        intro: about.intro,
        philosophy: about.philosophy,
        experiences: about.experiences,
        education: about.education,
        skills: about.skills,
        tools: about.tools,
        beyond: about.beyond
      }
    });

    pagesData.push({
      id: "home",
      locale,
      data: {
        hero: home.hero,
        stats: home.stats,
        services: home.services,
        testimonials: home.testimonials
      }
    });

    pagesData.push({
      id: "contact",
      locale,
      data: {
        headline: contact.headline,
        body: contact.body
      }
    });

    pagesData.push({
      id: "privacy",
      locale,
      data: {
        lastUpdated: privacy.lastUpdated,
        intro: privacy.intro,
        sections: privacy.sections
      }
    });
  }

  // 3. Upsert into Supabase
  await sql.begin(async (tx) => {
    for (const page of pagesData) {
      await tx`
        INSERT INTO public.page_content (id, locale, data)
        VALUES (${page.id}, ${page.locale}, ${tx.json(page.data)})
        ON CONFLICT (id, locale) DO UPDATE SET
          data = EXCLUDED.data,
          updated_at = NOW()
      `;
    }
  });

  await sql`NOTIFY pgrst, 'reload schema'`;
  console.log(`Migrated ${pagesData.length} page content records to Supabase.`);

} finally {
  await sql.end({ timeout: 5 });
}
