# ArticlesSection Specification

## Overview
- Target file: `src/components/articles-section.tsx`
- Screenshot: `docs/design-references/ulrychkristian.cz/scroll-10-7800.png`
- Interaction model: link hover

## DOM Structure
- Section heading
- Article cards with image, title, description

## Computed Styles
- Heading: `Newsreader`, `64px`
- Card images: `aspect-ratio: 16 / 9`
- Titles: `20px`
- Descriptions: `15px`, muted

## States & Behaviors
- Image hover: clone applies subtle scale.

## Assets
- `/images/ulrychkristian/ferrari1.png`
- `/images/ulrychkristian/best-3d-award-badge.png`
- `/images/ulrychkristian/thumbnail.jpeg`

## Text Content
- Ferrari 499P from scratch: Best 3D Graphics of the Semester
- The school project people wanted to buy

## Responsive Behavior
- Desktop: three-column grid area with two cards.
- Mobile: stacked.
