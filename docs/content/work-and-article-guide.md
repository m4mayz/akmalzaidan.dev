# Work and Article CMS Guide

## Local editing flow

1. Run `npm run dev`.
2. Open `http://localhost:3000/cms`.
3. Create or edit Work / Articles.
4. Upload images from the CMS. Files go to Supabase Storage.
5. Publish the item.
6. Check `/work`, `/work/<slug>`, `/articles`, or `/articles/<slug>`.
7. Push to GitHub.
8. Vercel rebuilds and reads the updated Supabase content during build.

## Supabase setup

Run this after pulling Vercel env vars locally:

```bash
npm run db:migrate-content
npm run db:migrate-assets
```

The first command creates/imports content tables. The second uploads legacy
`public/images/work` and `public/images/articles` assets to Supabase Storage and
updates stored asset URLs.

## Production behavior

`/cms` and `/api/cms/*` are only available in `NODE_ENV=development`.
Production returns 404. There is no login because the CMS is local-only.

## Image locations

- Bucket: `portfolio-assets`
- Work object path: `work/<slug>/<file>`
- Article object path: `articles/<slug>/<file>`

## Important

Content now lives in Supabase. The local CMS writes to the Supabase project from
`.env.local`; production still does not expose CMS routes.
