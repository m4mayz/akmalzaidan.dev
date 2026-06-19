# SelectedWork Specification

## Overview
- Target file: `src/components/selected-work.tsx`
- Screenshot: `docs/design-references/ulrychkristian.cz/scroll-03-1800.png`
- Interaction model: link hover

## DOM Structure
- Section heading
- Project card grid
- Each card: image, title, description, year

## Computed Styles
- Section heading: `Newsreader`, `64px`, `font-weight: 300`
- Desktop grid: two columns, staggered right column
- Card copy: title `22px`, description `15px`, muted color

## States & Behaviors
- Image hover: clone applies subtle scale.
- Each card links to the extracted source path.

## Assets
- Eqvista, Telemedicine, Sportelo, Veevoy, Mapwhizz thumbnails in `public/images/ulrychkristian/`

## Text Content
- Eqvista
- Telemedicine portal
- Sportelo
- Veevoy web
- Mapwhizz

## Responsive Behavior
- Desktop: staggered two-column layout.
- Mobile: single column.
