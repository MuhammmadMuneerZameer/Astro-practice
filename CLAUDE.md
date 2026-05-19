# Hydra Fox Designs — Project Guide

## Project Overview

- **Stack:** Astro 5 · React 19 · Firebase 12 (Firestore) · Tailwind · OGL · Framer Motion · Netlify
- **Site:** hydrafoxdesigns.com
- **Deployment:** Netlify (Git-connected, auto-deploys on push to main)
- **All meta tags** flow through `src/layouts/Layout.astro` — props: `title`, `description`, `image`, `noindex`
- **Image component:** `src/components/OptimizedImage.astro` — accepts `width`, `height`, `loading`, `priority`
- **Firebase singleton:** `src/lib/firebase.js` — always import `db` from here, never call `initializeApp` in components

## Dev Commands

```bash
npm run dev        # local dev server
npm run build      # production build
npm run preview    # preview the production build locally
```

## Dynamic Routes

| Route | File |
|---|---|
| `/services/[service]` | `src/pages/services/[service]/index.astro` |
| `/services/[service]/[subservice]` | `src/pages/services/[service]/[subservice]/index.astro` |
| `/services/[service]/[subservice]/[industry]` | `src/pages/services/[service]/[subservice]/[industry].astro` |
| `/resources/[category]` | `src/pages/resources/[category]/index.astro` |
| `/resources/[category]/[slug]` | `src/pages/resources/[category]/[slug].astro` |
| `/case-studies/[slug]` | `src/pages/case-studies/[slug].astro` |
| `/industries/[industry]` | `src/pages/industries/[industry].astro` |
| `/work/[slug]` | `src/pages/work/[slug].astro` |

---

## SEO Audit Findings (Screaming Frog, May 2026)

Source reports: `issues_overview_report.csv` (site-wide) · `site-report of content.csv` (per-page content)

---

### 🔴 HIGH — Fix First (Core Web Vitals / Rankings)

#### A. Images Missing Width & Height (23 images, 85% of all images)

**Problem:** CLS (Cumulative Layout Shift) — browser cannot reserve space for images before they load, causing the page to jump.

**Fix:** Add explicit `width` and `height` to every `<img>` tag and every `<OptimizedImage>` call site. The component already accepts these props — they are just not being passed consistently.

**Files to audit for missing dimensions:**
- `src/components/BlogCard.astro`
- `src/components/CaseStudyCard.jsx`
- `src/components/TestimonialSection.jsx`
- `src/components/ProjectShowcase.astro`
- `src/components/TeamMemberCard.jsx`
- `src/components/EcommerceProducts.astro`
- Any component using a raw `<img>` tag instead of `OptimizedImage`

**Example fix:**
```astro
<!-- Before -->
<OptimizedImage src={img} alt={alt} />

<!-- After -->
<OptimizedImage src={img} alt={alt} width={800} height={450} />
```

---

#### B. Duplicate Content — /work/ahdeqadeem vs /case-studies/ahdeqadeem (98% match)

**Problem:** Two pages with nearly identical content split Google's ranking signals.

**Recommended fix:** Add a canonical tag in `src/pages/work/[slug].astro` pointing to the case-studies version so the portfolio page remains accessible but SEO equity consolidates on case-studies.

```astro
<!-- In src/pages/work/[slug].astro head slot -->
<link rel="canonical" href={`https://hydrafoxdesigns.com/case-studies/${slug}`} />
```

Or alternatively add `noindex={true}` to the Layout call if the /work/ route should not appear in search at all.

---

#### C. Resource Category Page Titles Are Slug-Formatted

**Problem:** Pages display as "growth-engineering Resources", "conversion-engineering Resources" — Google sees unreadable titles with hyphens.

**File:** `src/pages/resources/[category]/index.astro`

**Fix:** Convert the slug to a readable label before passing to Layout:
```js
const label = category.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
// Pass: title={`${label} Resources | Hydra Fox Designs`}
```

---

#### D. Missing Title on a Blog Post

**Affected URL:** `resources/marketing/the-unorthodox-blueprint-...`

**File:** `src/pages/resources/[category]/[slug].astro`

**Fix:** Add a non-empty fallback so no post can render without a title:
```astro
<Layout title={post.title || post.slug?.replace(/-/g, ' ') || 'Resource'} ...>
```

---

### 🟠 MEDIUM — Fix in Sprint 1

#### E. Meta Description Length Issues

| Issue | Count | Impact |
|---|---|---|
| Too short (< 70 chars) | 33 pages | Google auto-generates its own description |
| Too long (> 155 chars) | 9 pages | Truncated in SERPs |
| Duplicate descriptions | 4 pages | Signals thin/duplicate content |

**Target:** 120–155 characters, unique per page. Primarily affects dynamic route templates: services, industries, case-studies, resources.

**Check all `<Layout description="...">` props** — dynamic routes should build descriptions from page-specific data (e.g. the service name, industry name, case study challenge).

---

#### F. Page Titles Over 60 Characters (24 pages)

**Problem:** Google truncates titles at ~60 chars in search results.

**Pattern to follow:** `"Page Name | Hydra Fox Designs"` — aim for 40–55 chars total.

**Audit:** Search all page files for `title=` prop values that are long strings. Shorten by removing filler words.

---

#### G. Duplicate H2s Across Pages (98 pages, 93%)

**Problem:** Generic H2s like "Our Process", "Why Choose Us", "Our Services" appear on nearly every page. Google treats repeated anchor text as low-signal.

**Fix:** Make H2 content page-specific in dynamic templates. Include the service/industry name:
```astro
<!-- Instead of -->
<h2>Our Process</h2>

<!-- Use -->
<h2>Our {service.name} Process</h2>
```

---

#### H. H2 Non-Sequential (15 pages)

**Problem:** Heading hierarchy skips levels (H1 → H3 with no H2), which breaks screen reader navigation and confuses crawlers.

**Fix:** Audit heading structure in affected dynamic page templates. Every H3 needs a parent H2 on the same page.

---

#### I. Low Content Pages (90 pages, 86%)

**Problem:** Service and industry subpages have only 205–234 words each — Google's threshold for "thin content" is generally 300+ meaningful words.

**Affected routes:**
- `/services/[service]/[subservice]` → `src/pages/services/[service]/[subservice]/index.astro`
- `/services/[service]/[subservice]/[industry]` → `src/pages/services/[service]/[subservice]/[industry].astro`
- `/industries/[industry]` → `src/pages/industries/[industry].astro`

**Fix options:** Add FAQ sections, process steps, relevant case study teasers, or industry-specific benefit lists to these templates. Content should be pulled from Firestore data or hardcoded per template.

---

#### J. Internal Redirects (3 URLs returning 3xx)

**Affected pages:** `/privacy-pages`, `/case-studies` have redirect hops in the chain.

**Fix:** Find all internal `<a href="/privacy-pages">` and `<a href="/case-studies">` links across components and update them to point directly to the canonical final URL, eliminating the redirect hop.

---

### 🟡 LOW — Informational (No Code Change Needed)

#### K. Missing Content-Security-Policy (119 URLs, 97%)

Screaming Frog flags this as a warning, but CSP is already set via the `[[headers]]` block in `netlify.toml`. This is a Screaming Frog limitation — it cannot read response headers from static exports. No action needed.

#### L. Multiple H2s on Pages (104 pages, 99%)

Having multiple H2s is valid HTML and not a ranking problem by itself. Ensure each H2 is meaningful and contextually distinct from the others on the same page.

---

## Key Files for SEO Work

| File | What it controls |
|---|---|
| `src/layouts/Layout.astro` | All meta tags (title, description, canonical, OG, Twitter, robots) |
| `src/pages/resources/[category]/index.astro` | Category index title & description |
| `src/pages/resources/[category]/[slug].astro` | Blog post title & description |
| `src/pages/services/[service]/index.astro` | Service page meta & headings |
| `src/pages/services/[service]/[subservice]/index.astro` | Sub-service thin content |
| `src/pages/services/[service]/[subservice]/[industry].astro` | Industry subpage thin content |
| `src/pages/industries/[industry].astro` | Industry page content & meta |
| `src/pages/work/[slug].astro` | Portfolio — needs canonical or noindex |
| `src/pages/case-studies/[slug].astro` | Case study — canonical target |
| `src/components/OptimizedImage.astro` | Image component (ensure all call sites pass width/height) |

---

## Definition of Done — SEO Sprint

- [ ] All `<img>` and `<OptimizedImage>` call sites have explicit `width` and `height`
- [ ] `/work/ahdeqadeem` has a canonical pointing to `/case-studies/ahdeqadeem`
- [ ] Resource category page titles are human-readable (no hyphen slugs)
- [ ] All blog post pages have a non-empty `title` and `description`
- [ ] Meta descriptions on all pages: 120–155 chars, unique per page
- [ ] Page titles: ≤ 60 chars on all pages
- [ ] H2 text is unique and page-specific in service and industry dynamic templates
- [ ] Internal links to `/privacy-pages` and `/case-studies` updated to final URLs

## Verification

After making SEO changes, run:
```bash
npm run build
```
Check the build output for any pages failing to generate. Then run:
```bash
npm run preview
```
Visit affected routes and inspect `<head>` in DevTools to verify title length, description length, and canonical URL are correct before pushing.
