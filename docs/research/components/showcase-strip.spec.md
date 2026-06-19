# ShowcaseStrip Specification

## Overview
- Target file: `src/components/showcase-strip.tsx`
- Screenshot: `docs/design-references/ulrychkristian.cz/scroll-01-600.png`
- Interaction model: static media

## DOM Structure
- Section wrapper
- Two media panels in a 12-column desktop grid

## Computed Styles
- Section: `padding: 128px 40px`
- Grid gap: `24px`
- Media panels: `aspect-ratio: 16 / 9`, overflow hidden

## States & Behaviors
- Static. Target content appears as scroll-revealed media.

## Assets
- `/images/ulrychkristian/Hanging-Vertical-Banner-Mockup.png`
- `/images/ulrychkristian/eqvista_1.jpg`

## Text Content
- N/A

## Responsive Behavior
- Desktop: two columns.
- Mobile: stacked media.
