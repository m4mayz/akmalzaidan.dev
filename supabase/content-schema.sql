-- Portfolio content schema
-- sort_order: lower values appear first. The CMS reorder endpoint
-- updates sort_order for both locale rows of a slug atomically so
-- ordering stays consistent across EN and ID.

CREATE TABLE IF NOT EXISTS public.works (
  id BIGSERIAL PRIMARY KEY,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'id')),
  slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  alt TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  client TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  sections_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  gallery_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (locale, slug)
);

CREATE TABLE IF NOT EXISTS public.articles (
  id BIGSERIAL PRIMARY KEY,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'id')),
  slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  alt TEXT NOT NULL DEFAULT '',
  published_at TEXT NOT NULL DEFAULT '',
  lead TEXT NOT NULL DEFAULT '',
  blocks_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (locale, slug)
);

CREATE TABLE IF NOT EXISTS public.page_content (
  id TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'id')),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id, locale)
);

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON public.works, public.articles, public.page_content TO anon, authenticated;
GRANT ALL ON public.works, public.articles, public.page_content TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.works_id_seq, public.articles_id_seq TO service_role;

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

NOTIFY pgrst, 'reload schema';
