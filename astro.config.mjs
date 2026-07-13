// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

const isRealms = process.env.SITE_MODE === 'realms';

export default defineConfig({
  site: isRealms ? 'https://realms-58q.pages.dev' : 'https://githubbermoon.github.io',
  base: isRealms ? '/' : '/ml-portfolio/',
  integrations: [react(), mdx(), tailwind()],
  // We use the include/exclude pattern for directories
  build: {
    format: 'directory',
  },
  vite: {
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
  },
});
