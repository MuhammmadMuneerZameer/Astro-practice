import { defineCollection, z } from 'astro:content';

const metric = z.object({
  label: z.string(),
  value: z.string(),
});

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    // ── Meta ────────────────────────────────────────────────────────────────
    title:       z.string(),
    description: z.string(),          // 120-155 chars for meta description
    client:      z.string(),
    industry:    z.string(),
    services:    z.array(z.string()).min(1),
    timeframe:   z.string(),          // e.g. "8 weeks" or "Oct 2024 – Feb 2025"
    featured:    z.boolean().default(false),
    image:       z.string().optional(),
    isOwnBrand:  z.boolean().default(false),
    storeUrl:    z.string().optional(),

    // ── Part 1 — Context ────────────────────────────────────────────────────
    // 1 paragraph: who the client is, what they sell, roughly what size.
    // The buyer uses this to check whether this business resembles theirs.
    context: z.string(),

    // ── Part 2 — Problem ────────────────────────────────────────────────────
    // The specific situation, stated with a number where possible.
    // A problem without a number reads as a story; with one, it reads as a case.
    problem: z.string(),

    // ── Part 3 — Baseline metrics (before) ─────────────────────────────────
    // At least one metric with a value. Label + value pairs, e.g.:
    //   { label: "Blended CAC", value: "$48" }
    //   { label: "Store CVR", value: "0.9%" }
    baseline: z.array(metric).min(1),

    // ── Part 4 — What we did ────────────────────────────────────────────────
    // Written as the markdown body below the frontmatter.
    // Use ## headings for each work-stream. Specific enough to critique.

    // ── Part 5 — Results + caveats ──────────────────────────────────────────
    // Same shape as baseline. Caveats make the number believable.
    results: z.array(metric).min(1),
    caveats: z.string().optional(),

    // ── Part 6 — Client words ───────────────────────────────────────────────
    // Real quote, real name, real company. Corroboration from outside your domain.
    quote: z.object({
      text:   z.string(),
      author: z.string(),
      role:   z.string(),
    }),

    // ── Part 7 — What we would do next ──────────────────────────────────────
    // The unfinished work. Signals you think in loops, not delivered projects.
    // Also sells the retainer.
    nextSteps: z.string(),

    // ── Visual proof ────────────────────────────────────────────────────────
    // Optional screenshots / dashboard images
    galleryImages: z.array(z.string()).optional(),
  }),
});

export const collections = { 'case-studies': caseStudies };
