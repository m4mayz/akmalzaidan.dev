---
name: create-article
description: Use when the user types the slash command `/artikel` (with or without arguments) to generate a complete bilingual article draft for the CMS.
---

# Create Article

## Overview
Generates a complete, bilingual (English and Indonesian) article draft ready for the CMS when the user invokes the `/artikel` slash command. 

## When to Use
- The user types `/artikel` with no arguments.
- The user types `/artikel [topic]`.

## Core Requirements
1. **Topic Handling:**
   - If a topic is provided (e.g., `/artikel React Server Components`), write about that topic.
   - If NO topic is provided (`/artikel`), proactively invent an interesting, relevant software engineering, design, or tech topic. Do not ask for permission; just write.
2. **Content Volume:** 
   - You MUST generate at least 3 distinct Content Blocks (sections) per language. 
   - Paragraph count per block is unrestricted.
3. **Bilingual:** Provide content for both English and Indonesian.
4. **Visual Direction:**
   - Provide a specific search keyword for the Hero Cover Image.
   - Provide keywords and layout suggestions (e.g., aspect ratio, column span) for Gallery images.

## Output Format
Generate your response as a markdown artifact (e.g., `article_draft.md`) using a table format that EXACTLY matches the fields in the CMS. Use `<br><br>` if you need paragraphs inside the table cells.

```markdown
### 1. General & Content Fields

| Form Field | English (EN) | Indonesian (ID) |
| --- | --- | --- |
| **Slug** | [generated-slug] | [generated-slug] |
| **Title** | [Title EN] | [Title ID] |
| **Cover** | [Keyword for Unsplash] | [Keyword for Unsplash] |
| **Description** | [Short SEO description, max 160 chars] | [Short SEO description in ID, max 160 chars] |
| **Alt** | [Alt text EN] | [Alt text ID] |
| **Lead / Excerpt** | [1-2 paragraphs EN] | [1-2 paragraphs ID] |
| **Category** | [Category] | [Category] |
| **Published at** | [YYYY-MM-DD] | [YYYY-MM-DD] |
| **Lead** | [1-2 paragraphs EN, same as above] | [1-2 paragraphs ID, same as above] |
| **Blocks (Block 1 Heading)** | [Heading 1 EN] | [Heading 1 ID] |
| **Blocks (Block 1 Article Body)** | [Content 1 EN. Use `<br><br>` for new paragraphs.] | [Content 1 ID. Use `<br><br>` for new paragraphs.] |
| **Blocks (Block 2 Heading)** | [Heading 2 EN] | [Heading 2 ID] |
| **Blocks (Block 2 Article Body)** | [Content 2 EN. Use `<br><br>` for new paragraphs.] | [Content 2 ID. Use `<br><br>` for new paragraphs.] |
| **Blocks (Block 3 Heading)** | [Heading 3 EN] | [Heading 3 ID] |
| **Blocks (Block 3 Article Body)** | [Content 3 EN. Use `<br><br>` for new paragraphs.] | [Content 3 ID. Use `<br><br>` for new paragraphs.] |

### 2. Gallery
*Recommend 2-4 images for the article's gallery section.*

| Gallery Item | Image Keyword | Alt Text | Span | Aspect |
| --- | --- | --- | --- | --- |
| **Image 1** | [Keyword] | [Alt text] | 1 | 16/9 |
| **Image 2** | [Keyword] | [Alt text] | 2 | 16/9 |
| **Image 3** | [Keyword] | [Alt text] | 1 | 4/3 |
```

## Common Mistakes
- *Mistake:* Generating fewer than 3 blocks. *Fix:* Always ensure the content has at least 3 distinct sections.
- *Mistake:* Forgetting the gallery layout. *Fix:* Always include layout hints (aspect ratio or grid span).
- *Mistake:* Stalling if no topic is given. *Fix:* Just pick a topic and write; do not ask the user what topic they want if they just type `/artikel`.
