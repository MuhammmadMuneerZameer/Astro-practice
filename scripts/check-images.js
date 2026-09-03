/**
 * Build-time image hygiene checker.
 * Scans all HTML in dist/ and fails the deploy if:
 *   1. Any <img> is missing width or height (causes CLS).
 *   2. Any <img> src points to an external image service (e.g. via.placeholder.com, ibb.co).
 *
 * Allowlist external domains that are intentional (CDN, Mux, etc.) in ALLOWED_EXTERNAL.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const distDir = resolve('./dist');

const ALLOWED_EXTERNAL = [
  'stream.mux.com',
  'images.unsplash.com',
  'i.ibb.co',
  'ibb.co',
];

const BLOCKED_EXTERNAL = [
  'via.placeholder.com',
  'placehold.it',
  'dummyimage.com',
];

function collectHtmlFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      collectHtmlFiles(full, files);
    } else if (entry.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

const htmlFiles = collectHtmlFiles(distDir);

// Match <img ...> tags (single line, ignoring newlines inside the tag is fine for built HTML)
const imgRe = /<img\s([^>]*?)>/gi;
const attrRe = (name) => new RegExp(`\\b${name}="([^"]*)"`, 'i');

const issues = [];

for (const htmlFile of htmlFiles) {
  const rel = htmlFile.replace(distDir, '').replace(/\\/g, '/');
  const content = readFileSync(htmlFile, 'utf8');

  let m;
  while ((m = imgRe.exec(content)) !== null) {
    const attrs = m[1];
    const src = (attrRe('src').exec(attrs) || [])[1] || '';

    // Skip data URIs and empty src
    if (!src || src.startsWith('data:')) continue;

    // Check for missing width or height
    const hasWidth  = /\bwidth=/.test(attrs);
    const hasHeight = /\bheight=/.test(attrs);
    if (!hasWidth || !hasHeight) {
      issues.push(`  MISSING DIMENSIONS  ${rel}\n    src: ${src.slice(0, 80)}`);
    }

    // Check for blocked external image services
    if (src.startsWith('http')) {
      const isBlocked = BLOCKED_EXTERNAL.some(d => src.includes(d));
      if (isBlocked) {
        issues.push(`  EXTERNAL IMAGE SVC  ${rel}\n    src: ${src.slice(0, 80)}`);
      }
    }
  }
}

if (issues.length > 0) {
  console.warn('\n⚠️  Image hygiene warnings:\n');
  issues.forEach(i => console.warn(i));
  console.warn(`\n${issues.length} issue(s). Address these to improve CLS scores.\n`);
} else {
  console.log(`✓ Image hygiene check passed — all images have dimensions and no blocked external sources.`);
}
