import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  integrations: [react(), sitemap()],

  server: {
    port: 3000,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  output: 'static',
  site: 'https://status.meet.oshi-katsu.app',
  adapter: cloudflare(),
});