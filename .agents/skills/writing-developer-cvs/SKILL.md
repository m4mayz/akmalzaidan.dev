---
name: writing-developer-cvs
description: Use when creating, rewriting, reviewing, or tailoring a software developer CV, resume, profile summary, skills section, work experience bullets, project entries, GitHub/portfolio section, or ATS-friendly developer application materials for UK-style or international tech roles.
---

# Writing Developer CVs

## Overview

Write developer CVs that are easy to scan, honest about skills, and grounded in evidence. The CV should show what the candidate built, how they built it, and what changed because of their work.

Use `references/software-developer-cv-uk.md` when the user wants UK-style guidance, ATS alignment, software developer examples, or a full CV structure.

## Workflow

1. Ask for the target role or job advert if it is missing. If the user only wants a general CV, build a master CV first.
2. Extract role signals: job title, seniority, stack, domain, must-have skills, nice-to-have skills, working style, and measurable outcomes.
3. Build or revise the CV in this order: header, profile, technical skills, experience, projects, education/certifications, extra hiring details.
4. Keep the wording specific. Prefer action + system/tech + outcome over duties.
5. Tailor the first screen of the CV hardest: profile, top skills, and first 3-5 bullets should mirror the role truthfully.
6. Finish with a quick ATS/readability pass.

## Output Contract

When writing a full CV, use this structure unless the user requests another format:

```markdown
# Name
Location | Phone | Email | LinkedIn | GitHub | Portfolio

## Profile
[3-5 focused lines: level, stack, domain, outcomes]

## Technical Skills
- Languages:
- Frontend:
- Backend:
- Data:
- Cloud/DevOps:
- Testing/Quality:

## Experience
### Role, Company | Mon YYYY - Present
[one-line product/team context]
- [action + tech/method + measurable or credible outcome]

## Selected Projects
### Project Name | Stack | Link
- [problem, contribution, quality signal, result]

## Education & Certifications
- Qualification, Institution, Year

## Additional Details
- Right to work / availability / notice period, only when useful
```

## Writing Rules

- Keep software developer CVs to 1-2 pages for most candidates. Junior/graduate can be 1 page; senior can be 2 pages. Only go longer if every line carries high-value evidence.
- Use clean headings and bullet points. Avoid dense paragraphs, tiny fonts, tables that may break ATS parsing, and decorative formatting.
- For UK-style CVs, do not include photo, full address, date of birth, marital status, or unrelated personal details.
- Group skills by category. Avoid long keyword dumps. Only include tools the candidate can explain in an interview.
- Each recent role should include 3-6 bullets. Put the most relevant and strongest bullets first.
- Add scale where exact metrics are unavailable: users, services, team size, release cadence, data volume, incident count, test coverage, latency, cost, or manual time saved.
- Make GitHub/portfolio links worth clicking: explain what the repo or case study demonstrates.
- If the user is junior, self-taught, or changing careers, make projects behave like mini roles: problem, stack, contribution, tests/deployment, trade-offs, and result.

## Bullet Formula

Prefer:

```text
[Strong verb] + [system/product/scope] + [tech or method] + [result/evidence]
```

Examples:

```text
Reduced API p95 latency by 35% by adding Redis caching and rewriting slow PostgreSQL queries.
Built a role-based dashboard in Next.js and Supabase, giving staff one place to review live operational data.
Added CI checks, unit tests, and linting to catch regressions before deployment and reduce manual review time.
```

Avoid:

```text
Responsible for developing APIs.
Worked with React and Node.js.
Good team player with excellent communication skills.
```

## Tailoring Pass

For a specific job advert:

- Mirror the employer's terms only when the candidate has actually used them.
- Reorder skills so the role's required stack appears first.
- Rewrite the profile for the role's level and domain.
- Move the most relevant project or experience bullets upward.
- Remove low-signal tools, old coursework, and unrelated duties that compete with stronger evidence.

## Review Checklist

- Can a recruiter identify level, stack, and recent outcomes in under 30 seconds?
- Does every listed core skill have proof in experience or projects?
- Are dates consistent, preferably month + year?
- Are links present, professional, and context-rich?
- Are there any unsupported buzzwords or vague responsibility bullets?
- Is the CV truthful enough that the candidate can defend every line in interview?

