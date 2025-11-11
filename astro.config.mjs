// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://hydrafoxdesigns.com',
  integrations: [tailwind(), react(), sitemap()],
  output: 'server', // Changed from 'hybrid' to 'server' for dynamic routes
  devToolbar: {
    enabled: false
  }
});