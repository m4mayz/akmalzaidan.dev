# SiteHeader Specification

## Overview
- Target file: `src/components/site-header.tsx`
- Screenshot: `docs/design-references/ulrychkristian.cz/scroll-00-0.png`
- Interaction model: hover, mobile menu affordance

## DOM Structure
- `header` fixed top overlay
- `nav` flex row
- left brand and role text
- desktop nav links, language button, contact button
- mobile two-line menu icon

## Computed Styles
- Header: `position: fixed`, `z-index: 50`, `padding: 20px 40px`, `height: 76px`, `backdrop-blur-xl`
- Links: `font-size: 15px`, `font-family: Instrument Sans`, muted links at `rgba(253,253,253,0.65)`
- Contact button: `height: 36px`, white background, black text, rounded full

## States & Behaviors
- Link hover: muted text becomes foreground.
- Contact hover: white fill becomes transparent and text becomes white.

## Assets
- N/A

## Text Content
- Kristian Ulrych
- Digital Product Designer
- Work
- About
- EN
- Get in touch

## Responsive Behavior
- Desktop: full nav.
- Mobile: brand and menu icon only.
