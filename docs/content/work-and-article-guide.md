# Work and Article Content Guide

Semua konten work dan article dibuat dari JSON bilingual.

## Work

1. Copy `data/templates/work.en.json` ke `data/en/work/<slug>.json`.
2. Copy `data/templates/work.id.json` ke `data/id/work/<slug>.json`.
3. Pakai slug yang sama untuk versi English dan Indonesia.
4. Simpan asset di `public/images/work/<slug>/`.
5. Isi `image` untuk cover dan `gallery[].src` untuk gambar detail.
6. Import kedua file baru di `src/lib/content.ts`.
7. Masukkan item English ke `workByLocale.en` dan item Indonesia ke `workByLocale.id`.

Contoh registrasi:

```ts
import enMyProject from "../../data/en/work/my-project.json";
import idMyProject from "../../data/id/work/my-project.json";

const workByLocale: Record<Locale, WorkContentData[]> = {
  en: [enMyProject as WorkContentData],
  id: [idMyProject as WorkContentData],
};
```

## Article

1. Copy `data/templates/article.en.json` ke `data/en/articles/<slug>.json`.
2. Copy `data/templates/article.id.json` ke `data/id/articles/<slug>.json`.
3. Pakai slug yang sama untuk dua bahasa.
4. Simpan cover di `public/images/articles/<slug>/cover.webp`.
5. Import kedua file baru di `src/lib/content.ts`.
6. Masukkan item English ke `articlesByLocale.en` dan item Indonesia ke `articlesByLocale.id`.

Contoh registrasi:

```ts
import enMyArticle from "../../data/en/articles/my-article.json";
import idMyArticle from "../../data/id/articles/my-article.json";

const articlesByLocale: Record<Locale, ArticleContentData[]> = {
  en: [enMyArticle as ArticleContentData],
  id: [idMyArticle as ArticleContentData],
};
```

## Notes

- `slug` harus unik.
- `publishedAt` pakai format `YYYY-MM-DD`.
- `gallery[].slot` hanya boleh `overview`, `challenge`, `approach`, atau `outcome`.
- `gallery[].aspect` hanya boleh `16/9` atau `4/3`.
- `gallery[].span` hanya boleh `full` atau `half`.
- Lazy load dan fade sudah ditangani komponen.
