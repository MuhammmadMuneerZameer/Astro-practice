#!/usr/bin/env bash
# HFD SEO remediation — post-deploy verification
# Run from the repo root in Git Bash or WSL:  bash verify-seo.sh
# Checks the LIVE site, not the local build.

SITE="https://hydrafoxdesigns.com"
PASS=0
FAIL=0

green() { printf "\033[32m%s\033[0m" "$1"; }
red()   { printf "\033[31m%s\033[0m" "$1"; }

echo ""
echo "=============================================="
echo " 1. REDIRECTS — must return 301"
echo "=============================================="
echo "(A 200 here means Astro emitted a meta-refresh page instead of a real"
echo " redirect. That silently voids the whole consolidation.)"
echo ""

REDIRECTS=(
  "/services/store-design-build/"
  "/services/store-design-build/shopify-development/"
  "/services/store-design-build/shopify-plus/"
  "/services/store-design-build/ux-ui-design/"
  "/services/store-design-build/product-photography/"
  "/services/growth-tools-automation/"
  "/services/marketing/digital-marketing/home-decor-brands/"
  "/services/video-production/brand-films/startups/"
)

for u in "${REDIRECTS[@]}"; do
  read -r code loc < <(curl -s -o /dev/null -w "%{http_code} %{redirect_url}" "$SITE$u")
  if [ "$code" = "301" ] || [ "$code" = "308" ] || [ "$code" = "410" ]; then
    printf "  %s %-58s -> %s\n" "$(green PASS)" "$u" "$code ${loc:-}"
    PASS=$((PASS+1))
  else
    printf "  %s %-58s -> %s\n" "$(red FAIL)" "$u" "$code ${loc:-}"
    FAIL=$((FAIL+1))
  fi
done

echo ""
echo "=============================================="
echo " 2. MONEY PAGES — must return 200"
echo "=============================================="
echo ""

LIVE=(
  "/"
  "/services/"
  "/services/shopify/"
  "/services/ecommerce-growth/"
  "/services/growth-tools/"
  "/services/brand-content/"
  "/industries/home-decor-brands/"
  "/ecommerce/"
  "/contact/"
)

for u in "${LIVE[@]}"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$SITE$u")
  if [ "$code" = "200" ]; then
    printf "  %s %-58s -> %s\n" "$(green PASS)" "$u" "$code"
    PASS=$((PASS+1))
  else
    printf "  %s %-58s -> %s\n" "$(red FAIL)" "$u" "$code"
    FAIL=$((FAIL+1))
  fi
done

echo ""
echo "=============================================="
echo " 3. SITEMAP — expect under 50 entries"
echo "=============================================="
echo ""

SM_COUNT=0
for sm in "/sitemap-0.xml" "/sitemap.xml" "/sitemap-index.xml"; do
  body=$(curl -s "$SITE$sm")
  if echo "$body" | grep -q "<loc>"; then
    n=$(echo "$body" | grep -c "<loc>")
    echo "  $sm  ->  $n <loc> entries"
    SM_COUNT=$((SM_COUNT+n))
  fi
done

if [ "$SM_COUNT" -eq 0 ]; then
  echo "  $(red FAIL) no sitemap found — check the sitemap integration"
  FAIL=$((FAIL+1))
elif [ "$SM_COUNT" -lt 50 ]; then
  echo "  $(green PASS) total $SM_COUNT entries"
  PASS=$((PASS+1))
else
  echo "  $(red FAIL) total $SM_COUNT entries — consolidation incomplete"
  FAIL=$((FAIL+1))
fi

echo ""
echo "=============================================="
echo " 4. NOINDEX — must be absent on money pages"
echo "=============================================="
echo ""

for u in "/" "/services/shopify/" "/industries/home-decor-brands/"; do
  if curl -s "$SITE$u" | grep -qi 'name="robots"[^>]*noindex'; then
    printf "  %s %-58s noindex present\n" "$(red FAIL)" "$u"
    FAIL=$((FAIL+1))
  else
    printf "  %s %-58s clean\n" "$(green PASS)" "$u"
    PASS=$((PASS+1))
  fi
done

echo ""
echo "=============================================="
echo " 5. INTERNAL LINKS — deprecated paths in source"
echo "=============================================="
echo "(Hits are only acceptable inside the redirect config file.)"
echo ""

if [ -d "src" ]; then
  HITS=$(grep -rn \
    -e "store-design-build" \
    -e "growth-tools-automation" \
    -e "services/marketing/" \
    -e "masterclass-growth-engineering" \
    --include="*.astro" --include="*.ts" --include="*.tsx" \
    --include="*.js" --include="*.jsx" --include="*.md" \
    --include="*.mdx" --include="*.json" \
    src/ 2>/dev/null)

  if [ -z "$HITS" ]; then
    echo "  $(green PASS) no deprecated paths in src/"
    PASS=$((PASS+1))
  else
    echo "  $(red FAIL) deprecated paths still linked:"
    echo "$HITS" | sed 's/^/      /'
    FAIL=$((FAIL+1))
  fi
else
  echo "  SKIP — not in the repo root (no src/ directory here)"
fi

echo ""
echo "=============================================="
printf " RESULT: %s passed, %s failed\n" "$(green $PASS)" "$(red $FAIL)"
echo "=============================================="
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo "Do NOT resubmit the sitemap to Search Console until all checks pass."
  echo ""
  exit 1
fi

echo "All checks passed. Next:"
echo "  1. Search Console -> Sitemaps: remove old entry, add rebuilt sitemap"
echo "  2. URL Inspection -> Request Indexing on these two URLs only:"
echo "       /industries/home-decor-brands/"
echo "       /services/shopify/"
echo "  3. Export and archive today's Performance + Pages reports as baseline"
echo "  4. Stop. Check again in 6 weeks."
echo ""