/**
 * Build-time internal link checker.
 * Crawls dist/ after `astro build`, extracts all internal href values from HTML,
 * and exits with code 1 if any resolve to a missing file.
 * Add to netlify.toml build command: npm run build && node scripts/check-links.js
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const distDir = resolve('./dist');

function collectAllPaths(dir, paths = new Set()) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = full.replace(distDir, '').replace(/\\/g, '/');
    if (statSync(full).isDirectory()) {
      collectAllPaths(full, paths);
    } else {
      paths.add(rel);
    }
  }
  return paths;
}

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

const allPaths = collectAllPaths(distDir);
const htmlFiles = collectHtmlFiles(distDir);

const SKIP_PREFIXES = [
  '/_astro/', '/images/', '/fonts/', '/manifest', '/sw.js',
  '/robots', '/sitemap', '/favicon', '/admin',
];

const linkRe = /href="(\/[^"#?]*[^"#?/])?\/?(?<!https:\/\/)(?=[^"]*")/g;
const hrefRe = /\shref="(\/[^"#?]*)"/g;

const broken = [];
const checked = new Set();

for (const htmlFile of htmlFiles) {
  const content = readFileSync(htmlFile, 'utf8');
  let m;
  while ((m = hrefRe.exec(content)) !== null) {
    const href = m[1];
    if (checked.has(href)) continue;
    checked.add(href);

    if (SKIP_PREFIXES.some(p => href.startsWith(p))) continue;
    // Skip external-looking paths and non-page paths
    if (href.includes('.') && !href.endsWith('/')) continue;

    // Resolve as directory index or direct file
    const candidates = [
      `${href.replace(/\/$/, '')}/index.html`,
      `${href}.html`,
      href,
    ];

    const exists = candidates.some(c => allPaths.has(c));
    if (!exists) {
      broken.push({
        href,
        foundIn: htmlFile.replace(distDir, '').replace(/\\/g, '/'),
      });
    }
  }
}

if (broken.length > 0) {
  console.error('\n❌ Broken internal links found:\n');
  for (const { href, foundIn } of broken) {
    console.error(`  ${href}  ←  ${foundIn}`);
  }
  console.error(`\n${broken.length} broken link(s). Fix before deploying.\n`);
  process.exit(1);
} else {
  console.log(`✓ ${checked.size} internal links checked — none broken.`);
}
