---
name: case-study-writing
description: Write or refine portfolio case studies with a consistent structure, voice, and credible outcomes. Use when the user asks to write/edit a case study, work post, project writeup, or to align multiple case studies for consistency.
---

# Case Study Writing

Write clear, credible case studies that show problem → approach → results, matching the structure and tone used in this portfolio’s existing work pages.

## Quick workflow

### 1) Gather inputs (ask for missing)

- Project name + type (client/personal)
- Role + responsibilities
- Focus period
- One-sentence challenge + stakes
- Approach (methods, collaboration, tooling)
- Results (metrics if known; otherwise qualitative outcomes)
- Scope (services/products/teams; any adoption count)
- Proof points (links, quotes, artifacts) and NDA constraints (what to omit/anonymize)

### 2) Pick a pattern

- **System-first**: Use when the core value is a technical/system approach (contracts, infra, tooling, cross-team standards). See `references/contract-first.md`.
- **Narrative**: Use when the core value is a journey over time (role evolution, unification, org change). See `references/narrative.md`.
- **Hybrid**: System-first structure + a short timeline block (2–4 milestones) from the narrative pattern.

### 3) Draft using the portfolio structure

Default section order (matches existing pages):

- Overview
- The Challenge
- The Approach
- Implementation Highlights (2–4 “bold lead-in” subsections)
- Results
- Learnings
- Technical Summary
- Next (CTA)

Metadata block (keep consistent across pages):

- Role
- Outcome
- Focus period

### 4) Style rules (portfolio voice)

- Be specific. Prefer “onboarding dropped from weeks to days” over “improved onboarding.”
- Don’t invent metrics. If unknown, state scope qualitatively (“adopted across 4+ services”).
- Keep tense consistent (past tense for completed work; present for enduring systems).
- Avoid buzzwords and superlatives; let concrete decisions and outcomes carry credibility.
- Use short paragraphs and occasional checklists; optimize for scanning.

### 5) Consistency pass (when writing multiple case studies)

Align:

- Section headings and order
- Metadata block wording and order
- Results format (Checklist vs bold-labeled paragraphs)
- “Next” CTA placement and wording

## Output formats

### A) Text-first draft (default)

Provide a paste-ready draft with headings and bullet lists.

### B) Route-ready draft (only when asked)

If the user asks to implement it as a page, adapt the copy into the existing route/page component style used in `src/routes/work/**`.

## Additional references

- System-first pattern: `references/contract-first.md`
- Narrative pattern: `references/narrative.md`
