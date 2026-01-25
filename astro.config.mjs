import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://hydrafoxdesigns.com',
  integrations: [
    tailwind(),
    react(),
    sitemap()
  ],
  output: 'server',
  devToolbar: {
    enabled: false
  }
});