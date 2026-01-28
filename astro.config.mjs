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
    sitemap()
  ],
  output: 'static',
  devToolbar: {
    enabled: false
  }
});