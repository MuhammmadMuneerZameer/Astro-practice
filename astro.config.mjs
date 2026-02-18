import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://hydrafoxdesigns.com',
  integrations: [
    tailwind(),
    react(),
    sitemap({
      filter: (page) => {
        const excludePaths = ['/admin/', '/404/', '/aboutUs/', '/Team/', '/ProjectPage/', '/product/'];
        return !excludePaths.some(path => page.includes(path));
      }
    })
  ],
  output: 'static',
  devToolbar: {
    enabled: false
  },
  // Prefetch links for faster navigation
  prefetch: {
    prefetchAll: true,  // Prefetch all links when they enter viewport
    defaultStrategy: 'viewport'  // Start loading when link becomes visible
  }
});