// Script to publish the ecommerce branding cluster posts to Firebase Firestore
// Run from the Astro-practice directory with: node scripts/add-cluster-posts.js
// Blog post files must exist at: e:\HFD\blog\

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// Reads a blog file and strips the leading HTML comment metadata block
function loadContent(filename) {
  const filePath = join(__dirname, "../../blog", filename);
  const raw = readFileSync(filePath, "utf8");
  return raw.replace(/^<!--[\s\S]*?-->\n\n?/, "").trim();
}

const clusterPosts = [
  {
    title: "How to Choose an Ecommerce Branding Agency [Complete Guide]",
    slug: "ecommerce-branding-agency",
    description: "Looking for the right ecommerce branding agency? This guide covers what they do, how to evaluate them, what to expect from pricing, and the red flags that should make you walk away.",
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    tag: "Branding",
    category: "branding",
    date: "21 August 2026",
    status: "published",
    file: "ecommerce-branding-agency.md"
  },
  {
    title: "Ecommerce Marketing Strategy: The Complete Playbook for Brand Growth",
    slug: "ecommerce-marketing-strategy",
    description: "Build an ecommerce marketing strategy that drives traffic, converts browsers, and keeps customers coming back. The complete playbook for brand-led growth at every stage.",
    image: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
    tag: "Marketing",
    category: "marketing",
    date: "21 August 2026",
    status: "published",
    file: "ecommerce-marketing-strategy.md"
  },
  {
    title: "Ecommerce Web Design: How to Build a Store That Converts",
    slug: "ecommerce-web-design",
    description: "Great ecommerce web design is conversion architecture, not just aesthetics. Learn the 7 principles that turn browsers into buyers and the product page anatomy that drives sales.",
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
    tag: "Web Design",
    category: "design",
    date: "21 August 2026",
    status: "published",
    file: "ecommerce-web-design.md"
  },
  {
    title: "Ecommerce Email Marketing: How to Build Brand Loyalty Through the Inbox",
    slug: "ecommerce-email-marketing",
    description: "Email delivers $36 for every $1 spent — the highest ROI in ecommerce. Learn the 5 automations that run on autopilot and the brand-led campaigns that turn buyers into loyal customers.",
    image: "https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg",
    tag: "Marketing",
    category: "marketing",
    date: "21 August 2026",
    status: "published",
    file: "ecommerce-email-marketing.md"
  },
  {
    title: "Ecommerce Brand Identity: Build One That Customers Remember",
    slug: "ecommerce-brand-identity",
    description: "Your ecommerce brand identity is more than a logo. Learn the 6 core elements that make online shoppers trust, remember, and choose your brand — and how to document them in a brand style guide.",
    image: "https://images.pexels.com/photos/4195342/pexels-photo-4195342.jpeg",
    tag: "Branding",
    category: "branding",
    date: "21 August 2026",
    status: "published",
    file: "ecommerce-brand-identity.md"
  },
  {
    title: "Ecommerce Brand Strategy: A Step-by-Step Framework for Online Stores",
    slug: "ecommerce-brand-strategy",
    description: "Build a brand strategy that makes your online store the obvious choice. This step-by-step framework covers positioning, voice, story, and the competitive analysis that reveals your white space.",
    image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg",
    tag: "Branding",
    category: "branding",
    date: "21 August 2026",
    status: "published",
    file: "ecommerce-brand-strategy.md"
  },
  {
    title: "Ecommerce UX Design: Best Practices for Product Pages That Sell",
    slug: "ecommerce-ux-design",
    description: "Cart abandonment averages 70%. Most of it is UX-fixable. Learn the 10 ecommerce UX design best practices that reduce friction and convert more visitors into buyers.",
    image: "https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg",
    tag: "Design",
    category: "design",
    date: "21 August 2026",
    status: "published",
    file: "ecommerce-ux-design.md"
  },
  {
    title: "Social Media for Ecommerce Brands: A Practical Guide to Building Community",
    slug: "social-media-ecommerce-brands",
    description: "Social media is where ecommerce brands build community, earn trust, and drive repeat sales. Learn which platforms fit your product, what content works, and how to turn followers into buyers.",
    image: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg",
    tag: "Marketing",
    category: "marketing",
    date: "21 August 2026",
    status: "published",
    file: "social-media-ecommerce-brands.md"
  },
  {
    title: "Ecommerce Brand Positioning: How to Stand Out in a Saturated Market",
    slug: "ecommerce-brand-positioning",
    description: "Ecommerce markets are crowded. Learn how to define a positioning strategy that makes your brand the obvious, memorable choice — with a proven framework and worked examples.",
    image: "https://images.pexels.com/photos/3183165/pexels-photo-3183165.jpeg",
    tag: "Branding",
    category: "branding",
    date: "21 August 2026",
    status: "published",
    file: "ecommerce-brand-positioning.md"
  },
  {
    title: "Ecommerce Logo Design: What Every Online Brand Needs to Know",
    slug: "ecommerce-logo-design",
    description: "Your ecommerce logo lives across 10+ touchpoints — from website header to favicon to packaging. Learn what a complete logo system includes and how to brief a designer to get it right.",
    image: "https://images.pexels.com/photos/6444/pencil-typography-black-design.jpg",
    tag: "Branding",
    category: "branding",
    date: "21 August 2026",
    status: "published",
    file: "ecommerce-logo-design.md"
  },
  {
    title: "Ecommerce Branding Checklist: 15 Must-Haves for Every Online Brand",
    slug: "ecommerce-branding-checklist",
    description: "Use this 15-point ecommerce branding checklist to audit your online brand. From logo to checkout copy — find the gaps before your customers do.",
    image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg",
    tag: "Branding",
    category: "branding",
    date: "21 August 2026",
    status: "published",
    file: "ecommerce-branding-checklist.md"
  }
];

async function addClusterPosts() {
  console.log("Publishing 11 ecommerce cluster posts to Firebase...\n");

  for (const post of clusterPosts) {
    const { file, ...metadata } = post;
    const content = loadContent(file);

    const docRef = await db.collection("post").add({
      ...metadata,
      content,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });

    console.log(`✅ ${post.slug}  →  ${docRef.id}`);
  }

  console.log("\nAll 11 posts published.");
  console.log("They will appear at /resources/[category]/[slug] once the site rebuilds.");
}

addClusterPosts().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
