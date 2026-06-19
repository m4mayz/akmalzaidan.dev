# Design Tokens

## Source
- Target: `https://www.ulrychkristian.cz/`
- Extraction: `docs/research/ulrychkristian.cz/extraction.json`
- Reference screenshots: `docs/design-references/ulrychkristian.cz/`

## Colors
- Page background: `rgb(18, 20, 23)` / `#121417`
- Text: `rgb(253, 253, 253)` / `#fdfdfd`
- Muted text: `rgba(253, 253, 253, 0.65)`
- Border: `rgba(253, 253, 253, 0.14)`
- Button background: `rgb(255, 255, 255)`
- Button text: `rgb(0, 0, 0)`
- Orange glow: `rgb(255, 99, 34)`
- Gradient accent: `#ebe1b0` to `#aea8fe`

## Typography
- Body: `Instrument Sans`
- Heading: `Newsreader`
- Header links: `15px`, `400`, `15px-22.5px` line height
- Hero heading: `Newsreader`, `300`, about `92px` desktop, `48px` mobile
- Section heading: `Newsreader`, `300`, about `64px` desktop, `54px` mobile
- Body copy: `15px`, `400`, `23.25px` line height

## Layout
- Desktop page padding: `40px`
- Mobile page padding: `20px`
- Header: fixed, `76px` high desktop, translucent background with backdrop blur
- Sections: large vertical rhythm, generally `128px` desktop vertical padding
- Work grid: two columns desktop with staggered offsets, single column mobile

## Motion And Interaction
- Header opacity/background transition: `0.5s`
- Links: color/opacity transition around `0.15s-0.2s`
- Media hover: subtle image zoom in clone, original uses hover transitions
- Page uses Lenis classes on `html`; clone uses native smooth scrolling
