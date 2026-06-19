# HeroSection Specification

## Overview
- Target file: `src/components/hero-section.tsx`
- Screenshot: `docs/design-references/ulrychkristian.cz/scroll-00-0.png`
- Interaction model: static

## DOM Structure
- Section with large headline
- Portrait image block with orange radial overlay
- Metadata definition grid

## Computed Styles
- Section: `padding: 140px 40px 48px`, desktop min height about `1200px`
- Headline: `Newsreader`, `font-weight: 300`, desktop about `92px`, mobile about `48px`, white text
- Metadata labels: `11px`, uppercase, muted
- Metadata values: `15px`, white

## States & Behaviors
- Static. The source uses scroll reveal; clone renders directly.

## Assets
- `/images/ulrychkristian/hero_portrait.jpeg`

## Text Content
- Designer based in Prague. Shaping digital products, websites and design systems with clarity and character.
- Based: Prague, Czechia
- Focus: Product UX/UI, Design Systems
- Languages: Czech, English
- Open for: Smaller freelance work

## Responsive Behavior
- Desktop: headline left, portrait lower right, stats bottom left.
- Mobile: headline, stats, portrait stack vertically.
