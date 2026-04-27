import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import partytown from '@astrojs/partytown';
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: 'https://hydrafoxdesigns.com',
  integrations: [
    tailwind(),
    react(),
    partytown({
      config: {
        forward: ['dataLayer.push', 'gtag'],
      },
    }),
    sitemap({
      filter: (page) => {
        const excludePaths = ['/admin/', '/404/', '/aboutUs/', '/Team/', '/ProjectPage/', '/product/'];
        return !excludePaths.some(path => page.includes(path));
      }
    }),
  ],
  output: 'static',
  adapter: netlify(),
  devToolbar: {
    enabled: false
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('gsap')) return 'gsap';
            if (id.includes('ogl')) return 'ogl';
          },
        },
      },
    },
  },
});
