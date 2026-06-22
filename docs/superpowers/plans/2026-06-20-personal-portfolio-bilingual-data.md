# Personal Portfolio Bilingual Data Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the completed Kristian Ulrych clone into Akmal Zaidan's personal fullstack developer portfolio with file-based bilingual content, English as the default route, Indonesian under `/id`, and all identity/content fully replaced.

**Architecture:** Keep the current visual system and interactions, but replace hardcoded clone data with a typed file-based content layer under `data/`. Route files become thin locale-aware wrappers that render shared page components with `locale="en"` or `locale="id"`, preserving existing English URLs while adding parallel Indonesian `/id/...` routes. Content is stored as editable JSON files, loaded through typed helpers, and rendered by existing components after they receive localized data props.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, file-based JSON content, `next/image`, Lenis, OGL Galaxy, Vercel Analytics, Vercel deployment.

---

## User Requirements Locked In

- Brand/name: Akmal Zaidan.
- Role/positioning: Fullstack Developer.
- Audience: recruiters, freelance clients, and HR reviewers.
- Language strategy:
    - English is the default route with normal URLs: `/`, `/work`, `/articles`, `/about`, `/contact`, `/privacy`.
    - Indonesian is available under `/id`: `/id`, `/id/work`, `/id/articles`, `/id/about`, `/id/contact`, `/id/privacy`, including detail routes.
- Hero tone: personal, not overly corporate.
- Location and availability: Sukabumi, available for internship or freelance.
- Services: web development, frontend, dashboards, tools, API/backend, technical IT help, IT support.
- Work items: six projects.
- Work assets: use generated/static placeholders first, no confidential masking needed.
- Articles: real section stays active; seed with 3 starter articles.
- Visual style: keep current dark clone style for now.
- Galaxy background: keep.
- Contact: keep real email-send behavior.
- Social links: GitHub, LinkedIn, Instagram.
- Route transition strip: keep.
- Privacy/legal: Vercel Analytics plus Indonesia/international privacy framing.
- First priority: full identity replacement across the whole site.
- Additional requirement: all site information/content must live in one file-based folder, recommended as `data/`, with bilingual versions.

---

## Recommended Data Folder

Use JSON for content because `tsconfig.json` already has `resolveJsonModule: true`. Keep rich rendering out of data; store plain strings, arrays, URLs, slugs, and image paths.

```text
data/
  en/
    site.json
    home.json
    about.json
    contact.json
    privacy.json
    work/
      portfolio-dashboard.json
      maintenance-system.json
      company-profile.json
      support-tools.json
      api-integration.json
      freelance-web-app.json
    articles/
      building-maintainable-dashboards.json
      why-fullstack-context-matters.json
      practical-it-support-for-small-teams.json
  id/
    site.json
    home.json
    about.json
    contact.json
    privacy.json
    work/
      portfolio-dashboard.json
      maintenance-system.json
      company-profile.json
      support-tools.json
      api-integration.json
      freelance-web-app.json
    articles/
      building-maintainable-dashboards.json
      why-fullstack-context-matters.json
      practical-it-support-for-small-teams.json
```

Use the same slug filenames in both locales. This lets `/work/portfolio-dashboard` and `/id/work/portfolio-dashboard` resolve the same project in different languages.

---

## File Structure

- Create: `data/en/site.json`
    - English global identity, navigation labels, social links, metadata, footer, email, location.
- Create: `data/id/site.json`
    - Indonesian translation of global identity and labels.
- Create: `data/en/home.json`
    - English homepage hero, stats, services, testimonials/availability copy.
- Create: `data/id/home.json`
    - Indonesian homepage content.
- Create: `data/en/about.json`
    - English about page profile, experience, education, skills/tools.
- Create: `data/id/about.json`
    - Indonesian about page content.
- Create: `data/en/contact.json`
    - English contact page copy and form labels.
- Create: `data/id/contact.json`
    - Indonesian contact copy and form labels.
- Create: `data/en/privacy.json`
    - English privacy policy, including Vercel Analytics and Indonesia PDP law framing.
- Create: `data/id/privacy.json`
    - Indonesian privacy policy.
- Create: `data/en/work/*.json`
    - Six English project files.
- Create: `data/id/work/*.json`
    - Six Indonesian project files.
- Create: `data/en/articles/*.json`
    - Three English article seed files.
- Create: `data/id/articles/*.json`
    - Three Indonesian article seed files.
- Create: `public/images/akmal/placeholders/*.svg`
    - Six project placeholder visuals and three article placeholder visuals.
- Create: `src/types/content.ts`
    - TypeScript types for locale, site data, home data, work detail, articles, privacy sections.
- Create: `src/lib/content.ts`
    - Typed loader/helper functions for reading JSON imports by locale.
- Create: `src/lib/i18n.ts`
    - Locale helpers, localized path helpers, slug validation, and language-switch utilities.
- Create: `src/components/pages/home-page.tsx`
    - Shared locale-aware homepage renderer.
- Create: `src/components/pages/work-index-page.tsx`
    - Shared locale-aware work listing renderer.
- Create: `src/components/pages/work-detail-page.tsx`
    - Shared locale-aware work detail renderer.
- Create: `src/components/pages/articles-index-page.tsx`
    - Shared locale-aware articles listing renderer.
- Create: `src/components/pages/article-detail-page.tsx`
    - Shared locale-aware article detail renderer.
- Create: `src/components/pages/about-page.tsx`
    - Shared locale-aware about renderer.
- Create: `src/components/pages/contact-page.tsx`
    - Shared locale-aware contact renderer.
- Create: `src/components/pages/privacy-page.tsx`
    - Shared locale-aware privacy renderer.
- Modify: `src/app/page.tsx`
    - Render `<HomePage locale="en" />`.
- Create: `src/app/id/page.tsx`
    - Render `<HomePage locale="id" />`.
- Modify: `src/app/work/page.tsx`
    - Render English work index from file data.
- Create: `src/app/id/work/page.tsx`
    - Render Indonesian work index.
- Modify: `src/app/work/[slug]/page.tsx`
    - Render English work detail from file data.
- Create: `src/app/id/work/[slug]/page.tsx`
    - Render Indonesian work detail.
- Modify: `src/app/articles/page.tsx`
    - Render English article index from file data.
- Create: `src/app/id/articles/page.tsx`
    - Render Indonesian article index.
- Modify: `src/app/articles/[slug]/page.tsx`
    - Render English article detail from file data.
- Create: `src/app/id/articles/[slug]/page.tsx`
    - Render Indonesian article detail.
- Modify: `src/app/about/page.tsx`
    - Render English about page from file data.
- Create: `src/app/id/about/page.tsx`
    - Render Indonesian about page.
- Modify: `src/app/contact/page.tsx`
    - Render English contact page from file data.
- Create: `src/app/id/contact/page.tsx`
    - Render Indonesian contact page.
- Modify: `src/app/privacy/page.tsx`
    - Render English privacy page from file data.
- Create: `src/app/id/privacy/page.tsx`
    - Render Indonesian privacy page.
- Modify: `src/app/layout.tsx`
    - Replace Kristian metadata with Akmal default metadata.
- Modify: `src/components/site-header.tsx`
    - Consume localized nav labels and language switch routes.
- Modify: `src/components/site-footer.tsx`
    - Consume localized footer/social data.
- Modify: `src/components/contact-section.tsx`
    - Consume localized email CTA.
- Modify: `src/components/selected-work.tsx`
    - Accept work items as props instead of importing clone data.
- Modify: `src/components/showcase-strip.tsx`
    - Accept localized work items as props.
- Modify: `src/components/services-section.tsx`
    - Accept localized services as props.
- Modify: `src/components/articles-section.tsx`
    - Accept localized article items as props.
- Modify or delete: `src/lib/ulrych-data.ts`
    - Replace with compatibility exports temporarily, then delete once all imports move to `src/lib/content.ts`.

---

## Bilingual Routing Rules

- Default English:
    - `/`
    - `/work`
    - `/work/[slug]`
    - `/articles`
    - `/articles/[slug]`
    - `/about`
    - `/contact`
    - `/privacy`
- Indonesian:
    - `/id`
    - `/id/work`
    - `/id/work/[slug]`
    - `/id/articles`
    - `/id/articles/[slug]`
    - `/id/about`
    - `/id/contact`
    - `/id/privacy`
- Language switcher behavior:
    - From `/work/portfolio-dashboard`, EN active and ID points to `/id/work/portfolio-dashboard`.
    - From `/id/work/portfolio-dashboard`, ID active and EN points to `/work/portfolio-dashboard`.
    - From `/id`, EN points to `/`.
    - From `/`, ID points to `/id`.

---

## Initial Content Direction

### English Positioning

Hero direction:

```text
Fullstack developer based in Sukabumi.
I build web apps, dashboards, internal tools, and backend systems that help teams work faster and ship with confidence.
```

Short bio direction:

```text
I work across frontend, backend, dashboards, APIs, and practical IT support. My focus is turning unclear operational problems into reliable tools that are easy to use, maintain, and improve.
```

Availability:

```text
Available for internships and freelance projects.
```

### Indonesian Positioning

Hero direction:

```text
Fullstack developer berbasis di Sukabumi.
Saya membangun web app, dashboard, internal tools, dan sistem backend yang membantu tim bekerja lebih cepat dan lebih rapi.
```

Availability:

```text
Tersedia untuk magang dan proyek freelance.
```

---

## Placeholder Work Items

Use these six seed projects until real case studies are ready:

1. `portfolio-dashboard`
    - Title EN: Portfolio Dashboard
    - Title ID: Dashboard Portofolio
    - Scope: Dashboard, Frontend, Data UI
    - Role: Fullstack Developer
    - Client: Personal / Internal
    - Year: 2026
2. `maintenance-system`
    - Title EN: Maintenance Operations System
    - Title ID: Sistem Operasional Maintenance
    - Scope: Fullstack Web App, Dashboard, Workflow
    - Role: Fullstack Developer
    - Client: Internal / Operational
    - Year: 2026
3. `company-profile`
    - Title EN: Company Profile Website
    - Title ID: Website Company Profile
    - Scope: Web Development, Frontend
    - Role: Frontend Developer
    - Client: Freelance
    - Year: 2026
4. `support-tools`
    - Title EN: IT Support Toolkit
    - Title ID: Toolkit IT Support
    - Scope: Tools, Automation, Technical Support
    - Role: Developer / IT Support
    - Client: Internal Support
    - Year: 2026
5. `api-integration`
    - Title EN: API Integration Layer
    - Title ID: Lapisan Integrasi API
    - Scope: API, Backend, Integration
    - Role: Backend Developer
    - Client: Product / Internal
    - Year: 2026
6. `freelance-web-app`
    - Title EN: Freelance Web Application
    - Title ID: Aplikasi Web Freelance
    - Scope: Fullstack, Product UI, Backend
    - Role: Fullstack Developer
    - Client: Freelance
    - Year: 2026

---

## Article Seed Items

Use these three starter articles:

1. `building-maintainable-dashboards`
    - EN title: Building dashboards that stay maintainable
    - ID title: Membangun dashboard yang tetap mudah dirawat
2. `why-fullstack-context-matters`
    - EN title: Why fullstack context matters when building products
    - ID title: Kenapa konteks fullstack penting saat membangun produk
3. `practical-it-support-for-small-teams`
    - EN title: Practical IT support for small teams
    - ID title: Bantuan teknis IT yang praktis untuk tim kecil

---

## Privacy Scope

Privacy policy must be rewritten for Akmal Zaidan, not copied from the reference.

Include:

- Controller/contact: Akmal Zaidan, Sukabumi, Indonesia, email address from `data/*/site.json`.
- Contact form data: name, email, subject, message, request metadata.
- Email sending: configured provider once the current form implementation is confirmed.
- Analytics: Vercel Web Analytics, cookie-free anonymized analytics.
- Performance analytics if enabled: Vercel Speed Insights.
- Legal framing:
    - Indonesia: UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.
    - International visitors: GDPR-style rights language for access, correction, deletion, objection, and complaint/contact process.
- Retention: keep messages only as long as needed for recruitment/freelance communication and reasonable follow-up.
- No ad tracking cookies unless added later.

Reference sources to check during implementation:

- Vercel Web Analytics privacy/compliance documentation.
- Vercel Speed Insights privacy/compliance documentation.
- Indonesian official legal database entry for UU No. 27 Tahun 2022.

---

## Task 1: Create File-Based Content Foundation

**Files:**

- Create: `data/en/site.json`
- Create: `data/id/site.json`
- Create: `data/en/home.json`
- Create: `data/id/home.json`
- Create: `src/types/content.ts`
- Create: `src/lib/i18n.ts`
- Create: `src/lib/content.ts`

- [ ] **Step 1: Create the locale/content types**

Create `src/types/content.ts` with:

```ts
export type Locale = "en" | "id";

export type LocalizedPath = {
    en: string;
    id: string;
};

export type NavItemData = {
    label: string;
    href: string;
};

export type SocialLinkData = {
    label: "GitHub" | "LinkedIn" | "Instagram";
    href: string;
};

export type SiteData = {
    name: string;
    role: string;
    email: string;
    location: string;
    availability: string;
    metadata: {
        title: string;
        description: string;
        ogAlt: string;
    };
    nav: NavItemData[];
    socials: SocialLinkData[];
    footer: {
        credit: string;
        privacyLabel: string;
    };
    language: {
        current: string;
        switchTo: string;
    };
};

export type StatItemData = {
    label: string;
    value: string;
};

export type ServiceItemData = {
    number: string;
    title: string;
    description: string;
};

export type HomeData = {
    hero: {
        headline: string;
        highlightedWord: string;
        body: string;
    };
    stats: StatItemData[];
    services: ServiceItemData[];
    testimonials: {
        quote: string;
        author: string;
        role: string;
    }[];
};
```

- [ ] **Step 2: Create locale helpers**

Create `src/lib/i18n.ts` with:

```ts
import type { Locale } from "@/types/content";

export const defaultLocale: Locale = "en";
export const locales = ["en", "id"] as const;

export function isLocale(value: string): value is Locale {
    return locales.includes(value as Locale);
}

export function withLocale(path: string, locale: Locale) {
    if (locale === defaultLocale) {
        return path;
    }

    if (path === "/") {
        return "/id";
    }

    return `/id${path}`;
}

export function withoutLocale(path: string) {
    if (path === "/id") {
        return "/";
    }

    if (path.startsWith("/id/")) {
        return path.slice(3) || "/";
    }

    return path;
}

export function getAlternateLocalePath(path: string, targetLocale: Locale) {
    return withLocale(withoutLocale(path), targetLocale);
}
```

- [ ] **Step 3: Create English site data**

Create `data/en/site.json` with:

```json
{
    "name": "Akmal Zaidan",
    "role": "Fullstack Developer",
    "email": "hello@akmalzaidan.dev",
    "location": "Sukabumi, Indonesia",
    "availability": "Available for internships and freelance projects",
    "metadata": {
        "title": "Akmal Zaidan - Fullstack Developer",
        "description": "Fullstack developer based in Sukabumi, building web apps, dashboards, tools, APIs, and practical IT solutions.",
        "ogAlt": "Akmal Zaidan - Fullstack Developer"
    },
    "nav": [
        { "label": "Work", "href": "/work" },
        { "label": "Articles", "href": "/articles" },
        { "label": "About", "href": "/about" }
    ],
    "socials": [
        { "label": "GitHub", "href": "https://github.com/akmalzaidan" },
        {
            "label": "LinkedIn",
            "href": "https://www.linkedin.com/in/akmalzaidan"
        },
        {
            "label": "Instagram",
            "href": "https://www.instagram.com/akmalzaidan"
        }
    ],
    "footer": {
        "credit": "Designed and built by Akmal Zaidan",
        "privacyLabel": "Privacy"
    },
    "language": {
        "current": "EN",
        "switchTo": "ID"
    }
}
```

- [ ] **Step 4: Create Indonesian site data**

Create `data/id/site.json` with:

```json
{
    "name": "Akmal Zaidan",
    "role": "Fullstack Developer",
    "email": "hello@akmalzaidan.dev",
    "location": "Sukabumi, Indonesia",
    "availability": "Tersedia untuk magang dan proyek freelance",
    "metadata": {
        "title": "Akmal Zaidan - Fullstack Developer",
        "description": "Fullstack developer berbasis di Sukabumi yang membangun web app, dashboard, tools, API, dan solusi IT praktis.",
        "ogAlt": "Akmal Zaidan - Fullstack Developer"
    },
    "nav": [
        { "label": "Work", "href": "/work" },
        { "label": "Artikel", "href": "/articles" },
        { "label": "Tentang", "href": "/about" }
    ],
    "socials": [
        { "label": "GitHub", "href": "https://github.com/akmalzaidan" },
        {
            "label": "LinkedIn",
            "href": "https://www.linkedin.com/in/akmalzaidan"
        },
        {
            "label": "Instagram",
            "href": "https://www.instagram.com/akmalzaidan"
        }
    ],
    "footer": {
        "credit": "Didesain dan dibuat oleh Akmal Zaidan",
        "privacyLabel": "Privasi"
    },
    "language": {
        "current": "ID",
        "switchTo": "EN"
    }
}
```

- [ ] **Step 5: Create homepage data**

Create `data/en/home.json` and `data/id/home.json` using the locked positioning above. Include six services exactly matching the user's service list.

- [ ] **Step 6: Create content loader**

Create `src/lib/content.ts` with static JSON imports:

```ts
import enHome from "../../data/en/home.json";
import enSite from "../../data/en/site.json";
import idHome from "../../data/id/home.json";
import idSite from "../../data/id/site.json";

import type { HomeData, Locale, SiteData } from "@/types/content";

const siteByLocale: Record<Locale, SiteData> = {
    en: enSite,
    id: idSite,
};

const homeByLocale: Record<Locale, HomeData> = {
    en: enHome,
    id: idHome,
};

export function getSiteData(locale: Locale) {
    return siteByLocale[locale];
}

export function getHomeData(locale: Locale) {
    return homeByLocale[locale];
}
```

- [ ] **Step 7: Verify TypeScript can import JSON**

Run:

```bash
npm run typecheck
```

Expected: no JSON import errors. If unrelated existing errors appear, record them before changing implementation scope.

- [ ] **Step 8: Commit Task 1**

Run:

```bash
git add data src/types/content.ts src/lib/i18n.ts src/lib/content.ts
git commit -m "Add bilingual file-based content foundation"
```

Expected: a focused commit containing the new data layer.

---

## Task 2: Localize Shell, Header, Footer, and Root Metadata

**Files:**

- Modify: `src/app/layout.tsx`
- Modify: `src/components/site-header.tsx`
- Modify: `src/components/site-footer.tsx`
- Modify: `src/components/contact-section.tsx`
- Modify: `src/lib/content.ts`
- Modify: `src/types/content.ts`

- [ ] **Step 1: Replace root metadata**

Update `src/app/layout.tsx` to use Akmal's metadata:

```ts
export const metadata: Metadata = {
    metadataBase: new URL("https://akmalzaidan.dev"),
    title: "Akmal Zaidan - Fullstack Developer",
    description:
        "Fullstack developer based in Sukabumi, building web apps, dashboards, tools, APIs, and practical IT solutions.",
    authors: [{ name: "Akmal Zaidan" }],
    creator: "Akmal Zaidan",
    openGraph: {
        title: "Akmal Zaidan - Fullstack Developer",
        description:
            "Fullstack developer based in Sukabumi, building web apps, dashboards, tools, APIs, and practical IT solutions.",
        images: [
            {
                url: "/seo/og.png",
                width: 1200,
                height: 630,
                alt: "Akmal Zaidan - Fullstack Developer",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Akmal Zaidan - Fullstack Developer",
        description:
            "Fullstack developer based in Sukabumi, building web apps, dashboards, tools, APIs, and practical IT solutions.",
        images: ["/seo/og.png"],
    },
    icons: {
        icon: "/seo/icon.png",
        apple: "/seo/apple-icon.png",
    },
};
```

- [ ] **Step 2: Add locale props to shell components**

Update `SiteHeader`, `SiteFooter`, and `ContactSection` to accept:

```ts
import type { Locale } from "@/types/content";

type LocalizedComponentProps = {
    locale: Locale;
};
```

Each component should call `getSiteData(locale)` internally or receive `site` as a prop. Prefer passing `site` from page components if it avoids duplicate imports in client components.

- [ ] **Step 3: Make header language switch real**

In `site-header.tsx`, use `usePathname()` and `getAlternateLocalePath()`:

```ts
const pathname = usePathname();
const targetLocale = locale === "en" ? "id" : "en";
const switchHref = getAlternateLocalePath(pathname, targetLocale);
```

Use `switchHref` for the language button/link.

- [ ] **Step 4: Keep mobile burger behavior**

Do not rewrite the mobile menu animation. Only replace labels and hrefs from localized data.

- [ ] **Step 5: Verify localized shell routes manually by static render**

Run:

```bash
npm run typecheck
```

Expected: shell prop types compile.

- [ ] **Step 6: Commit Task 2**

Run:

```bash
git add src/app/layout.tsx src/components/site-header.tsx src/components/site-footer.tsx src/components/contact-section.tsx src/lib/content.ts src/types/content.ts
git commit -m "Localize site shell and metadata"
```

---

## Task 3: Convert Homepage to Akmal Data

**Files:**

- Create: `src/components/pages/home-page.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/app/id/page.tsx`
- Modify: `src/components/hero-section.tsx`
- Modify: `src/components/services-section.tsx`
- Modify: `src/components/testimonial-section.tsx`
- Modify: `src/components/selected-work.tsx`
- Modify: `src/components/showcase-strip.tsx`
- Modify: `src/components/articles-section.tsx`
- Modify: `src/lib/content.ts`
- Modify: `src/types/content.ts`

- [ ] **Step 1: Create shared home page renderer**

Create `src/components/pages/home-page.tsx`:

```tsx
import type { Locale } from "@/types/content";
import { ArticlesSection } from "@/components/articles-section";
import { ContactSection } from "@/components/contact-section";
import { HeroSection } from "@/components/hero-section";
import { SelectedWork } from "@/components/selected-work";
import { ServicesSection } from "@/components/services-section";
import { ShowcaseStrip } from "@/components/showcase-strip";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TestimonialSection } from "@/components/testimonial-section";
import {
    getArticleSummaries,
    getHomeData,
    getSiteData,
    getWorkSummaries,
} from "@/lib/content";

export function HomePage({ locale }: { locale: Locale }) {
    const site = getSiteData(locale);
    const home = getHomeData(locale);
    const work = getWorkSummaries(locale);
    const articles = getArticleSummaries(locale);

    return (
        <>
            <SiteHeader locale={locale} site={site} />
            <main className="relative z-10">
                <HeroSection data={home.hero} stats={home.stats} />
                <ShowcaseStrip items={work} />
                <SelectedWork
                    items={work}
                    title={locale === "id" ? "Work pilihan" : "Selected work"}
                />
                <ServicesSection items={home.services} />
                <TestimonialSection items={home.testimonials} />
                <ArticlesSection
                    items={articles}
                    title={locale === "id" ? "Artikel" : "Articles"}
                />
                <ContactSection locale={locale} site={site} />
            </main>
            <div className="relative z-10">
                <SiteFooter locale={locale} site={site} />
            </div>
        </>
    );
}
```

- [ ] **Step 2: Replace English home route**

Update `src/app/page.tsx`:

```tsx
import { HomePage } from "@/components/pages/home-page";

export default function Page() {
    return <HomePage locale="en" />;
}
```

- [ ] **Step 3: Add Indonesian home route**

Create `src/app/id/page.tsx`:

```tsx
import { HomePage } from "@/components/pages/home-page";

export default function Page() {
    return <HomePage locale="id" />;
}
```

- [ ] **Step 4: Refactor homepage sections to props**

Remove imports from `src/lib/ulrych-data.ts` inside homepage section components. Each section should receive data through props.

- [ ] **Step 5: Keep reveal and motion behavior**

Every existing `data-reveal`, lazy image behavior, Galaxy background, route transition, and cursor marker must remain in place.

- [ ] **Step 6: Verify homepage typecheck**

Run:

```bash
npm run typecheck
```

Expected: no prop/type errors.

- [ ] **Step 7: Commit Task 3**

Run:

```bash
git add src/app/page.tsx src/app/id/page.tsx src/components/pages/home-page.tsx src/components/hero-section.tsx src/components/services-section.tsx src/components/testimonial-section.tsx src/components/selected-work.tsx src/components/showcase-strip.tsx src/components/articles-section.tsx src/lib/content.ts src/types/content.ts
git commit -m "Replace homepage with Akmal bilingual content"
```

---

## Task 4: Build File-Based Work Pages

**Files:**

- Create: `data/en/work/*.json`
- Create: `data/id/work/*.json`
- Create: `public/images/akmal/placeholders/project-*.svg`
- Create: `src/components/pages/work-index-page.tsx`
- Create: `src/components/pages/work-detail-page.tsx`
- Modify: `src/app/work/page.tsx`
- Create: `src/app/id/work/page.tsx`
- Modify: `src/app/work/[slug]/page.tsx`
- Create: `src/app/id/work/[slug]/page.tsx`
- Modify: `src/lib/content.ts`
- Modify: `src/types/content.ts`

- [ ] **Step 1: Add work content types**

Add to `src/types/content.ts`:

```ts
export type WorkSummaryData = {
    slug: string;
    title: string;
    year: string;
    description: string;
    href: string;
    image: string;
    alt: string;
    category: string;
};

export type WorkDetailData = WorkSummaryData & {
    role: string;
    client: string;
    summary: string;
    sections: {
        slot: "overview" | "challenge" | "approach" | "outcome";
        heading: string;
        body: string[];
    }[];
    gallery: {
        src: string;
        alt: string;
        aspect: "16/9" | "4/3";
        span?: "half" | "full";
        slot: "overview" | "challenge" | "approach" | "outcome";
    }[];
};
```

- [ ] **Step 2: Create six placeholder SVGs**

Create six files in `public/images/akmal/placeholders/`, named:

```text
presensi.webp
project-maintenance-system.svg
project-company-profile.svg
project-support-tools.svg
project-api-integration.svg
project-freelance-web-app.svg
```

Each SVG should use the current dark style and a simple abstract dashboard/window composition. Keep text minimal and generic.

- [ ] **Step 3: Create bilingual work JSON**

Create one file per slug in both locales using the six placeholder work items listed above. Each file must include `sections` and `gallery`, even if the text is seeded.

- [ ] **Step 4: Add work loaders**

Extend `src/lib/content.ts` with:

```ts
export function getWorkSummaries(locale: Locale): WorkSummaryData[] {
    return workByLocale[locale].map((item) => ({
        slug: item.slug,
        title: item.title,
        year: item.year,
        description: item.description,
        href: withLocale(`/work/${item.slug}`, locale),
        image: item.image,
        alt: item.alt,
        category: item.category,
    }));
}

export function getWorkDetail(locale: Locale, slug: string) {
    return workByLocale[locale].find((item) => item.slug === slug);
}

export function getWorkSlugs() {
    return workByLocale.en.map((item) => item.slug);
}
```

- [ ] **Step 5: Create shared work pages**

Move existing work index/detail rendering into shared page components accepting `locale`.

- [ ] **Step 6: Wire English and Indonesian routes**

English routes use `locale="en"`, Indonesian routes use `locale="id"`. Both detail pages must implement `generateStaticParams()` from `getWorkSlugs()`.

- [ ] **Step 7: Verify route types**

Run:

```bash
npm run typecheck
```

Expected: no route param or notFound typing errors.

- [ ] **Step 8: Commit Task 4**

Run:

```bash
git add data/en/work data/id/work public/images/akmal/placeholders src/components/pages/work-index-page.tsx src/components/pages/work-detail-page.tsx src/app/work src/app/id/work src/lib/content.ts src/types/content.ts
git commit -m "Add bilingual file-based work pages"
```

---

## Task 5: Build File-Based Articles

**Files:**

- Create: `data/en/articles/*.json`
- Create: `data/id/articles/*.json`
- Create: `public/images/akmal/placeholders/article-*.svg`
- Create: `src/components/pages/articles-index-page.tsx`
- Create: `src/components/pages/article-detail-page.tsx`
- Modify: `src/app/articles/page.tsx`
- Create: `src/app/id/articles/page.tsx`
- Modify: `src/app/articles/[slug]/page.tsx`
- Create: `src/app/id/articles/[slug]/page.tsx`
- Modify: `src/lib/content.ts`
- Modify: `src/types/content.ts`

- [ ] **Step 1: Add article content types**

Add to `src/types/content.ts`:

```ts
export type ArticleSummaryData = {
    slug: string;
    title: string;
    description: string;
    href: string;
    image: string;
    alt: string;
    publishedAt: string;
};

export type ArticleDetailData = ArticleSummaryData & {
    lead: string;
    blocks: {
        heading?: string;
        paragraphs: string[];
    }[];
};
```

- [ ] **Step 2: Create three placeholder article SVGs**

Create:

```text
public/images/akmal/placeholders/article-dashboards.svg
public/images/akmal/placeholders/article-fullstack-context.svg
public/images/akmal/placeholders/article-it-support.svg
```

- [ ] **Step 3: Create bilingual article JSON files**

Create the three seed articles listed above in both English and Indonesian. Keep paragraphs concise and real enough to publish as seed content.

- [ ] **Step 4: Add article loaders**

Extend `src/lib/content.ts` with summary/detail/slug helpers.

- [ ] **Step 5: Wire article index and detail routes**

Use shared components for English and Indonesian routes. Detail route must use `notFound()` when slug does not exist.

- [ ] **Step 6: Verify article pages**

Run:

```bash
npm run typecheck
```

Expected: no article data/type errors.

- [ ] **Step 7: Commit Task 5**

Run:

```bash
git add data/en/articles data/id/articles public/images/akmal/placeholders src/components/pages/articles-index-page.tsx src/components/pages/article-detail-page.tsx src/app/articles src/app/id/articles src/lib/content.ts src/types/content.ts
git commit -m "Add bilingual file-based articles"
```

---

## Task 6: Replace About, Contact, and Privacy

**Files:**

- Create: `data/en/about.json`
- Create: `data/id/about.json`
- Create: `data/en/contact.json`
- Create: `data/id/contact.json`
- Create: `data/en/privacy.json`
- Create: `data/id/privacy.json`
- Create: `src/components/pages/about-page.tsx`
- Create: `src/components/pages/contact-page.tsx`
- Create: `src/components/pages/privacy-page.tsx`
- Modify: `src/app/about/page.tsx`
- Create: `src/app/id/about/page.tsx`
- Modify: `src/app/contact/page.tsx`
- Create: `src/app/id/contact/page.tsx`
- Modify: `src/app/privacy/page.tsx`
- Create: `src/app/id/privacy/page.tsx`
- Modify: `src/lib/content.ts`
- Modify: `src/types/content.ts`

- [ ] **Step 1: Replace about content**

Create bilingual about data for Akmal:

- Headline: fullstack developer identity.
- Subhead: Sukabumi, fullstack, dashboards, APIs, tools, practical IT support.
- Experience: use seed entries only if real experience is not provided yet.
- Education: use seed structure and leave clear editable values in JSON.
- Skills: frontend, backend, API, dashboard, database, deployment, troubleshooting, IT support.
- Tools: TypeScript, React, Next.js, Node.js, Prisma, PostgreSQL/MySQL, Tailwind, Git, Vercel.

- [ ] **Step 2: Replace contact content**

Contact copy should target recruiters, HR, freelance clients, and collaboration inquiries. Keep real email sending behavior from the existing form.

- [ ] **Step 3: Replace privacy content**

Move privacy sections into JSON. Mention Vercel Analytics and Indonesian/international privacy framing. Keep this practical and non-overclaiming.

- [ ] **Step 4: Wire shared page components**

Each route should become a small locale wrapper around its shared page component.

- [ ] **Step 5: Verify legal routes typecheck**

Run:

```bash
npm run typecheck
```

Expected: no missing imports or data shape errors.

- [ ] **Step 6: Commit Task 6**

Run:

```bash
git add data/en/about.json data/id/about.json data/en/contact.json data/id/contact.json data/en/privacy.json data/id/privacy.json src/components/pages/about-page.tsx src/components/pages/contact-page.tsx src/components/pages/privacy-page.tsx src/app/about src/app/id/about src/app/contact src/app/id/contact src/app/privacy src/app/id/privacy src/lib/content.ts src/types/content.ts
git commit -m "Replace about contact and privacy content"
```

---

## Task 7: Remove Clone Residue

**Files:**

- Modify or delete: `src/lib/ulrych-data.ts`
- Search all `src`, `data`, `public`, `docs` references.
- Modify: `src/app/layout.tsx`
- Modify: any remaining component/page with Kristian, Ulrych, Prague, Czechia, Veevoy, Eqvista, Sportelo, Mapwhizz, Telemedicine content.

- [ ] **Step 1: Search clone identity**

Run:

```bash
rg -n "Kristian|Ulrych|Prague|Czechia|Veevoy|Eqvista|Sportelo|Mapwhizz|Telemedicine|kristian\\.ulrych" src data public
```

Expected: no user-facing runtime references remain. Some docs/research references may stay because they document the clone source.

- [ ] **Step 2: Delete or quarantine old data module**

If `src/lib/ulrych-data.ts` has no imports:

```bash
git rm src/lib/ulrych-data.ts
```

If imports remain, replace those imports first.

- [ ] **Step 3: Replace image references**

Runtime pages must reference `public/images/akmal/...`, not `public/images/ulrychkristian/...`, except if intentionally retained as non-visible historical clone assets. New personal runtime should not depend on reference site images.

- [ ] **Step 4: Verify no clone strings in runtime**

Run:

```bash
rg -n "Kristian|Ulrych|Prague|Czechia|Veevoy|Eqvista|Sportelo|Mapwhizz|Telemedicine|kristian\\.ulrych" src data public
```

Expected: no matches in `src` or `data`.

- [ ] **Step 5: Commit Task 7**

Run:

```bash
git add -A
git commit -m "Remove cloned portfolio identity"
```

---

## Task 8: Verification and Polish

**Files:**

- Modify only files found by verification.

- [ ] **Step 1: Typecheck**

Run:

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 2: Lint**

Run:

```bash
npm run lint
```

Expected: PASS or only pre-existing warnings documented.

- [ ] **Step 3: Build**

Run:

```bash
npm run build
```

Expected: PASS.

- [ ] **Step 4: Run local server**

Run:

```bash
npm run dev
```

Expected: local Next dev server starts.

- [ ] **Step 5: Manual route smoke checklist**

Check these routes:

```text
/
/id
/work
/id/work
/work/portfolio-dashboard
/id/work/portfolio-dashboard
/articles
/id/articles
/articles/building-maintainable-dashboards
/id/articles/building-maintainable-dashboards
/about
/id/about
/contact
/id/contact
/privacy
/id/privacy
```

Expected:

- English routes show English content.
- Indonesian routes show Indonesian content.
- Language switcher maps to equivalent route.
- Header burger still works on mobile.
- Route transition still works on link navigation.
- Lenis smooth scroll still works.
- Galaxy background still renders.
- Contact form UI still appears.
- Lazy reveal still works on new pages.

- [ ] **Step 6: Commit verification fixes**

Run:

```bash
git add -A
git commit -m "Polish bilingual personal portfolio"
```

Only commit if verification caused code changes.

---

## Execution Policy for This Repo

Because the user previously requested gated execution in this project:

- Execute exactly one numbered task at a time.
- Stop after each completed task.
- Wait for explicit instruction such as `lanjut task 2`.
- Do not continue automatically through the whole plan.
- Do not run broad verification/build unless the user asks, except when a task explicitly reaches the verification stage.

---

## Self-Review

- Requirement coverage:
    - Akmal Zaidan identity: Tasks 1, 2, 3, 6, 7.
    - Fullstack developer positioning: Tasks 1, 3, 6.
    - Recruiter/client/HR audience: Tasks 1, 3, 6.
    - English default + Indonesian `/id`: Tasks 1, 2, 3, 4, 5, 6.
    - File-based `data/` content: Tasks 1, 4, 5, 6.
    - Six work items with placeholders: Task 4.
    - Three real seed articles: Task 5.
    - Keep visual style/Galaxy/route transition: Tasks 3 and 8.
    - Contact form still sends email: Task 6 and Task 8.
    - GitHub/LinkedIn/Instagram: Task 1 and Task 2.
    - Privacy with Vercel Analytics and Indonesia/international framing: Task 6.
    - Remove cloned identity: Task 7.
- Placeholder scan:
    - The word placeholder appears only for intentional temporary visual assets requested by the user.
    - No task says "TBD" or "implement later".
- Type consistency:
    - `Locale`, `SiteData`, `HomeData`, `WorkDetailData`, and `ArticleDetailData` are introduced before use.
    - Route helper names are consistent: `withLocale`, `withoutLocale`, `getAlternateLocalePath`.

---

## Execution Options

Plan complete. Two execution options:

1. **Subagent-Driven (recommended)** - Dispatch a fresh subagent per task, review between tasks, faster iteration with the stop-after-each-task rule preserved.
2. **Inline Execution** - Execute tasks in this session using the plan, one task at a time, with checkpoints.

The recommended first command from the user is:

```text
lakukan Inline Execution, task 1 dulu
```

or:

```text
pakai subagent, task 1 dulu
```
