# Work and Article CMS Guide

## Local editing flow

1. Run `npm run dev`.
2. Open `http://localhost:3000/cms`.
3. Create or edit Work / Articles.
4. Upload images from the CMS.
5. Publish the item.
6. Check `/work`, `/work/<slug>`, `/articles`, or `/articles/<slug>`.
7. Commit `data/content.sqlite` and any files under `public/images/...`.
8. Push to GitHub.
9. Vercel rebuilds and reads the updated SQLite file during build.

## Production behavior

`/cms` and `/api/cms/*` are only available in `NODE_ENV=development`.
Production returns 404. There is no login because the CMS is local-only.

## Image locations

- Work: `public/images/work/<slug>/`
- Articles: `public/images/articles/<slug>/`

## Important

SQLite is committed as a file. Do not edit content directly on Vercel.
Always edit locally, commit, and push.
