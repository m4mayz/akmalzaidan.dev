# Ulrych Interaction Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the known clone gaps by adding Lenis smooth scrolling, a `data-cursor` driven custom cursor, a React Bits Galaxy WebGL background, and reference-matched lazy image loading while preserving the current visual clone.

**Architecture:** Add small client-only interaction components so the App Router page remains mostly static/server-rendered. Match the reference behavior observed live: `html.lenis custom-cursor-active`, `data-cursor="pointer|link"` on interactive elements, a full-viewport animated scene behind content, and lazy images below the fold. Keep behavior isolated where practical, use CSS variables/classes in `globals.css`, and verify with desktop/mobile browser screenshots plus console/overlay checks.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, `lenis`, `ogl`, `next/image`.

---

## File Structure

- Modify: `package.json`
  - Add Lenis dependency.
- Modify: `package-lock.json`
  - Lockfile update after install.
- Create: `src/components/effects/lenis-provider.tsx`
  - Client component that starts/stops Lenis and wires `requestAnimationFrame`.
- Create: `src/components/effects/custom-cursor.tsx`
  - Client component for pointer tracking, `data-cursor` variants, reduced-motion fallback, and touch-device disable.
- Create: `src/components/galaxy.tsx`
  - Add React Bits Galaxy as a client-only OGL/WebGL background.
- Modify: `src/app/globals.css`
  - Add Lenis classes, custom cursor CSS, and reduced-motion fallbacks.
- Modify: `src/app/page.tsx`
  - Mount `LenisProvider` and `CustomCursor`.
- Modify: `src/components/hero-section.tsx`
  - Replace deprecated `priority` on `next/image` with Next 16-safe above-the-fold loading behavior.
- Modify: `src/components/showcase-strip.tsx`
  - Return below-the-fold media to `loading="lazy"` and set `sizes`.
- Modify: `src/components/selected-work.tsx`
  - Return work images to lazy loading and add stable placeholders/aspect boxes.
- Modify: `src/components/articles-section.tsx`
  - Return article images to lazy loading and keep badge eager only if visually needed.
- Modify: `src/components/site-header.tsx`
  - Add `data-cursor="pointer"` to header links/buttons.
- Modify: `src/components/services-section.tsx`
  - Add `data-cursor="pointer"` to contact CTA.
- Modify: `src/components/contact-section.tsx`
  - Add `data-cursor="link"` to the email CTA.
- Modify: `src/components/site-footer.tsx`
  - Add `data-cursor="pointer"` to footer links.
- Optional create: `src/components/effects/index.ts`
  - Barrel export only if imports become noisy.

---

### Task 1: Install Lenis Dependency

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [x] **Step 1: Check package name compatibility**

Run:

```bash
npm view lenis version
```

Expected: prints a current version number. Use `lenis` unless npm reports it unavailable.

- [x] **Step 2: Install Lenis**

Run:

```bash
npm install lenis
```

Expected: `package.json` and `package-lock.json` update with a new dependency.

- [x] **Step 3: Verify install compiles with current project**

Run:

```bash
npm run typecheck
```

Expected: PASS. If TypeScript cannot resolve Lenis types, inspect `node_modules/lenis/dist` before adding any ambient declaration.

---

### Task 2: Add Lenis Smooth Scrolling Provider

**Files:**
- Create: `src/components/effects/lenis-provider.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

- [x] **Step 1: Create the provider**

Create `src/components/effects/lenis-provider.tsx`:

```tsx
"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export function LenisProvider() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("lenis-disabled");
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (time: number) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.15,
    });

    document.documentElement.classList.add("lenis", "lenis-smooth");

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, []);

  return null;
}
```

- [x] **Step 2: Add Lenis CSS**

Append to `src/app/globals.css` inside `@layer base` or below utilities:

```css
html.lenis,
html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: clip;
}

.lenis-disabled {
  scroll-behavior: auto;
}
```

- [x] **Step 3: Mount provider**

Modify `src/app/page.tsx`:

```tsx
import { LenisProvider } from "@/components/effects/lenis-provider";
```

Render near the top:

```tsx
<LenisProvider />
<Starfield />
```

- [x] **Step 4: Verify**

Run:

```bash
npm run typecheck
npm run build
```

Expected: both PASS.

Browser check:

```js
document.documentElement.classList.contains("lenis")
```

Expected: `true` when reduced motion is not enabled.

---

### Task 3: Add Reference-Matched Custom Cursor

**Files:**
- Create: `src/components/effects/custom-cursor.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/site-header.tsx`
- Modify: `src/components/selected-work.tsx`
- Modify: `src/components/services-section.tsx`
- Modify: `src/components/articles-section.tsx`
- Modify: `src/components/contact-section.tsx`
- Modify: `src/components/site-footer.tsx`

- [x] **Step 1: Create custom cursor client component**

Create `src/components/effects/custom-cursor.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

type CursorState = {
  x: number;
  y: number;
  variant: "default" | "pointer" | "link";
  pressed: boolean;
};

const interactiveSelector =
  "[data-cursor], a, button, [role='button'], input, textarea, select, summary";

function getCursorVariant(target: EventTarget | null): CursorState["variant"] {
  if (!(target instanceof Element)) {
    return "default";
  }

  const interactive = target.closest(interactiveSelector);

  if (!interactive) {
    return "default";
  }

  const explicit = interactive.getAttribute("data-cursor");

  if (explicit === "link" || explicit === "pointer") {
    return explicit;
  }

  return "pointer";
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!finePointer || reducedMotion) {
      return undefined;
    }

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const state: CursorState = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      variant: "default",
      pressed: false,
    };

    const render = () => {
      const cursor = cursorRef.current;
      if (!cursor) return;

      cursor.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
      cursor.dataset.variant = state.variant;
      cursor.dataset.pressed = String(state.pressed);
    };

    const onPointerMove = (event: PointerEvent) => {
      state.x = event.clientX;
      state.y = event.clientY;
      state.variant = getCursorVariant(event.target);
      render();
    };

    const onPointerDown = () => {
      state.pressed = true;
      render();
    };

    const onPointerUp = () => {
      state.pressed = false;
      render();
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <div aria-hidden="true" className="custom-cursor" ref={cursorRef}>
      <span className="custom-cursor-ring" />
      <span className="custom-cursor-dot" />
    </div>
  );
}
```

- [x] **Step 2: Add cursor CSS with pointer/link variants**

Append to `src/app/globals.css`:

```css
@media (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .custom-cursor-active,
  .custom-cursor-active * {
    cursor: none;
  }

  .custom-cursor {
    pointer-events: none;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 80;
    width: 1px;
    height: 1px;
    mix-blend-mode: difference;
  }

  .custom-cursor-ring {
    position: absolute;
    left: -12px;
    top: -12px;
    width: 24px;
    height: 24px;
    border: 1px solid rgb(253 253 253 / 0.85);
    border-radius: 999px;
    background: rgb(253 253 253 / 0.04);
    transition:
      width 160ms ease,
      height 160ms ease,
      left 160ms ease,
      top 160ms ease,
      background-color 160ms ease,
      border-color 160ms ease;
  }

  .custom-cursor-dot {
    position: absolute;
    left: -2px;
    top: -2px;
    width: 4px;
    height: 4px;
    border-radius: 999px;
    background: rgb(253 253 253 / 0.9);
    transition:
      width 160ms ease,
      height 160ms ease,
      left 160ms ease,
      top 160ms ease,
      opacity 160ms ease;
  }

  .custom-cursor[data-variant="pointer"] .custom-cursor-ring {
    left: -21px;
    top: -21px;
    width: 42px;
    height: 42px;
    background: rgb(253 253 253 / 0.12);
  }

  .custom-cursor[data-variant="link"] .custom-cursor-ring {
    left: -30px;
    top: -30px;
    width: 60px;
    height: 60px;
    background: rgb(253 253 253 / 0.16);
    border-color: rgb(174 168 254 / 0.95);
  }

  .custom-cursor[data-variant="link"] .custom-cursor-dot {
    opacity: 0;
  }

  .custom-cursor[data-pressed="true"] .custom-cursor-ring {
    left: -9px;
    top: -9px;
    width: 18px;
    height: 18px;
  }
}
```

- [x] **Step 3: Add reference-style `data-cursor` markers**

In `src/components/site-header.tsx`, add `data-cursor="pointer"` to every `Link` and `button` in the header:

```tsx
<Link data-cursor="pointer" href="/">
  Kristian Ulrych
</Link>
```

```tsx
<button data-cursor="pointer" type="button">
  EN
</button>
```

In `src/components/selected-work.tsx`, add `data-cursor="link"` to each project card link:

```tsx
<Link data-cursor="link" className="group block" href={work.href}>
```

In `src/components/services-section.tsx`, add `data-cursor="pointer"` to the contact CTA:

```tsx
<Link data-cursor="pointer" href="/contact">
  Get in touch
</Link>
```

In `src/components/articles-section.tsx`, add `data-cursor="link"` to article links:

```tsx
<Link data-cursor="link" className="group block" href={article.href}>
```

In `src/components/contact-section.tsx`, add `data-cursor="link"` to the email link:

```tsx
<Link data-cursor="link" href="mailto:kristian.ulrych@gmail.com">
```

In `src/components/site-footer.tsx`, add `data-cursor="pointer"` to privacy and social links:

```tsx
<Link data-cursor="pointer" href="/privacy">
  Privacy
</Link>
```

- [x] **Step 4: Mount cursor**

Modify `src/app/page.tsx`:

```tsx
import { CustomCursor } from "@/components/effects/custom-cursor";
```

Render near `LenisProvider`:

```tsx
<LenisProvider />
<CustomCursor />
<Starfield />
```

- [x] **Step 5: Verify hover interaction**

Browser checks:

```js
document.documentElement.classList.contains("custom-cursor-active")
```

Expected desktop fine pointer: `true`.

Move over `Get in touch`; expected `document.querySelector(".custom-cursor")?.getAttribute("data-variant")` becomes `pointer`.

Move over the large email CTA; expected `document.querySelector(".custom-cursor")?.getAttribute("data-variant")` becomes `link`.

---

### Task 4: Replace Static Starfield With React Bits Galaxy

**Files:**
- Create: `src/components/galaxy.tsx`
- Delete: `src/components/starfield.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

- [x] **Step 1: Install OGL**

Run:

```bash
npm install ogl
```

Expected: `package.json` and `package-lock.json` include `ogl`.

- [x] **Step 2: Replace local Starfield with Galaxy component**

Delete `src/components/starfield.tsx`, create `src/components/galaxy.tsx` from the React Bits Galaxy source, and type it for React 19/TypeScript strict.

- [x] **Step 3: Mount Galaxy as the fixed background**

Modify `src/app/page.tsx` so the old `<Starfield />` render becomes:

```tsx
<div aria-hidden="true" className="fixed inset-0 -z-10 bg-background">
  <Galaxy
    density={1.5}
    glowIntensity={0.2}
    hueShift={130}
    mouseInteraction={true}
    mouseRepulsion={true}
    repulsionStrength={1}
    saturation={0.6}
    starSpeed={0.2}
    twinkleIntensity={0.1}
  />
</div>
```

- [x] **Step 4: Remove obsolete starfield CSS**

Remove `.starfield-scene` styles from `src/app/globals.css`.

- [x] **Step 5: Verify TypeScript**

Run:

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 6: Verify Galaxy scene matches reference behavior**

Skipped by user request during Task 4 inline execution; user will verify manually.

Browser check at desktop and mobile:

```js
const canvas = document.querySelector("canvas");
({
  exists: Boolean(canvas),
  width: canvas?.getAttribute("width"),
  height: canvas?.getAttribute("height"),
})
```

Expected:
- `exists: true`
- `width` and `height` are populated after mount

Take screenshots at `1440x1200` and `390x1200`. Expected: background remains dark, star points visible, text readable, no overlap.

---

### Task 5: Match Reference Image Loading

**Files:**
- Modify: `src/components/hero-section.tsx`
- Modify: `src/components/showcase-strip.tsx`
- Modify: `src/components/selected-work.tsx`
- Modify: `src/components/articles-section.tsx`

- [x] **Step 1: Make hero image above-the-fold, not lazy**

Reference observation:
- Hero portrait rendered with `img.loading === "auto"` in the live DOM.
- Below-the-fold media rendered with `img.loading === "lazy"`.

In `src/components/hero-section.tsx`, replace deprecated:

```tsx
priority
```

with Next 16-safe above-fold loading:

```tsx
preload
```

Do not add `loading="lazy"` to the hero portrait. Expected: no deprecation risk for Next 16, and the hero image is available immediately.

- [x] **Step 2: Make showcase images lazy**

In `src/components/showcase-strip.tsx`, set image loading:

```tsx
loading="lazy"
```

Keep stable dimensions through the existing `aspect-[16/9]` wrapper.

- [x] **Step 3: Make selected work images lazy**

In `src/components/selected-work.tsx`, set:

```tsx
loading="lazy"
```

Keep the existing aspect-ratio wrappers so layout does not shift before images decode.

- [x] **Step 4: Make article images lazy**

In `src/components/articles-section.tsx`, set main article images:

```tsx
loading="lazy"
```

Badge image can remain default lazy unless visual QA shows it missing in the first article card.

- [ ] **Step 5: Verify lazy attributes against reference**

Skipped by user instruction: do not run checks unless explicitly requested.

Browser check:

```js
[...document.querySelectorAll("img")].map((img) => ({
  alt: img.alt,
  loading: img.loading,
  fetchPriority: img.fetchPriority,
  complete: img.complete,
})).slice(0, 12)
```

Expected:
- Hero image is not `loading: "lazy"`; acceptable values are `"auto"` or `"eager"` depending on Next's rendered output for `preload`.
- Below-the-fold images report `loading: "lazy"`.
- No layout shift because wrappers reserve space.

---

### Task 6: Rendered QA And Regression Pass

**Files:**
- No production file changes unless QA finds defects.

- [ ] **Step 1: Run static verification**

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Expected:
- `typecheck`: PASS
- `build`: PASS
- `lint`: PASS or only the known unrelated `.remember/tmp/last-ndc.ts` warning if still present.

- [ ] **Step 2: Start dev server**

Run:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Expected: app serves at `http://127.0.0.1:3000`.

- [ ] **Step 3: Browser verification**

Flow under test:

```text
home route loads -> Lenis/custom cursor/canvas scene initialize -> primary links and scrolling remain usable -> desktop/mobile layouts render without runtime errors
```

Run browser checks:

```js
({
  title: document.title,
  hasContent: document.body.innerText.trim().length > 0,
  overlay: document.querySelector("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay") ? "ERROR_OVERLAY" : "OK",
  lenis: document.documentElement.classList.contains("lenis"),
  cursor: document.documentElement.classList.contains("custom-cursor-active"),
  canvasScene: Boolean(document.querySelector("canvas")),
  cursorMarkers: [...document.querySelectorAll("[data-cursor]")].length,
  lazyImages: [...document.querySelectorAll("img")].filter((img) => img.loading === "lazy").length,
  overflowX: document.documentElement.scrollWidth - window.innerWidth,
})
```

Expected:
- Title contains `Kristián Ulrych`
- `hasContent: true`
- `overlay: "OK"`
- `lenis: true` on normal motion desktop
- `cursor: true` on fine pointer desktop
- `canvasScene: true`
- `cursorMarkers > 10`
- `lazyImages > 5`
- `overflowX <= 0`

- [ ] **Step 4: Interaction proof**

In browser:
- Scroll from hero to selected work; expected smooth scroll, no scroll trap.
- Hover `Get in touch`; expected custom cursor variant becomes `pointer` and button hover remains visible.
- Hover a project card; expected custom cursor variant becomes `link` and media scale transition remains visible.
- Open mobile viewport `390x1200`; expected custom cursor not mounted, no horizontal overflow.

- [ ] **Step 5: Screenshot evidence**

Capture:
- Desktop hero at `1440x1200`
- Desktop selected work/services mid-page at `1440x1200`
- Mobile hero at `390x1200`
- Mobile articles/contact at `390x1200`

Expected:
- Canvas star scene visible.
- Cursor does not appear in screenshots unless pointer is inside viewport.
- Lazy-loaded images appear after scrolling.
- Text does not overlap or clip.

---

## Self-Review

- Spec coverage: Lenis, `data-cursor` custom cursor, canvas animated star scene, and lazy loading each have a dedicated task and QA check.
- Placeholder scan: No TBD/TODO/fill-later steps.
- Type consistency: `LenisProvider`, `CustomCursor`, and `Starfield` names match planned imports.
- Reference alignment: plan reflects live DOM observations: `html.lenis custom-cursor-active`, `data-cursor` markers, `<canvas aria-label="Scene" role="img">`, hero image not lazy, and below-fold images lazy.
- Risk: exact Lenis package API can differ by installed version. Task 1 requires checking installed types before implementation.
